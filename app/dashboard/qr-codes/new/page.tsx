"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminSanityClient, adminSanityWriteClient } from "@/lib/admin-sanity";
import { venuesListQuery } from "@/lib/admin-queries";
import { generateUniqueCode } from "@/lib/qr-utils";
import { useRouter } from "next/navigation";

interface Venue {
  _id: string;
  title: string;
  slug: { current: string };
  city: { title: string; slug: { current: string } };
}

export default function NewQRCodePage() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    venueId: "",
    description: "",
    expiresAt: "",
    maxUses: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await adminSanityClient.fetch<Venue[]>(venuesListQuery);
        setVenues(data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const uniqueCode = generateUniqueCode();
      
      const qrCodeData = {
        _type: 'qrCode',
        title: formData.title,
        code: uniqueCode,
        venue: {
          _type: 'reference',
          _ref: formData.venueId
        },
        description: formData.description || undefined,
        expiresAt: formData.expiresAt || undefined,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        isActive: formData.isActive,
        currentUses: 0,
      };

      await adminSanityWriteClient.create(qrCodeData);
      
      router.push('/dashboard/qr-codes');
    } catch (error) {
      console.error('Error creating QR code:', error);
      alert('Error al crear el código QR');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Código QR</h1>
          <p className="text-gray-600">Genera un nuevo código QR para un local</p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando locales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Crear Código QR</h1>
        <p className="text-gray-600">Genera un nuevo código QR para un local</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Código QR</CardTitle>
        </CardHeader>
        <CardContent>
          <form role="form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Acceso VIP - Mesa 5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="venue">Local *</Label>
                <Select
                  value={formData.venueId}
                  onValueChange={(value) => setFormData({ ...formData, venueId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar local" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue._id} value={venue._id}>
                        {venue.title} ({venue.city.title})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expiresAt">Fecha de expiración</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Dejar vacío para que no expire
                </p>
              </div>

              <div>
                <Label htmlFor="maxUses">Usos máximos</Label>
                <Input
                  id="maxUses"
                  type="number"
                  min="1"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  placeholder="Ej: 100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Dejar vacío para uso ilimitado
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción opcional del código QR..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isActive">Código QR activo</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/qr-codes')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Creando..." : "Crear Código QR"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

