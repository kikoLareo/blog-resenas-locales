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
import { useRouter } from "next/navigation";
import QRCodeSVG from "react-qr-code";
import { generateQRAccessURL } from "@/lib/qr-utils";

interface Venue {
  _id: string;
  title: string;
  slug: { current: string };
  city: { title: string; slug: { current: string } };
}

interface QRCodeData {
  _id: string;
  title: string;
  code: string;
  venue: {
    _id: string;
    title: string;
  };
  description?: string;
  expiresAt?: string;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
  lastUsedAt?: string;
}

export default function EditQRCodePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [qrCodeId, setQrCodeId] = useState<string>("");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [qrCode, setQrCode] = useState<QRCodeData | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    venueId: "",
    description: "",
    expiresAt: "",
    maxUses: "",
    isActive: true,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedParams = await params;
        setQrCodeId(resolvedParams.id);

        // Cargar QR code existente
        const qrData = await adminSanityClient.fetch<QRCodeData>(
          `*[_type == "qrCode" && _id == $id][0] {
            _id,
            title,
            code,
            venue->{_id, title},
            description,
            expiresAt,
            maxUses,
            currentUses,
            isActive,
            lastUsedAt
          }`,
          { id: resolvedParams.id }
        );

        if (!qrData) {
          alert("Código QR no encontrado");
          router.push("/dashboard/qr-codes");
          return;
        }

        setQrCode(qrData);

        // Cargar locales
        const venuesData = await adminSanityClient.fetch<Venue[]>(venuesListQuery);
        setVenues(venuesData);

        // Formatear fecha para input datetime-local
        let formattedExpiresAt = "";
        if (qrData.expiresAt) {
          const date = new Date(qrData.expiresAt);
          formattedExpiresAt = date.toISOString().slice(0, 16);
        }

        // Llenar formulario
        setFormData({
          title: qrData.title,
          venueId: qrData.venue._id,
          description: qrData.description || "",
          expiresAt: formattedExpiresAt,
          maxUses: qrData.maxUses?.toString() || "",
          isActive: qrData.isActive,
        });
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        title: formData.title,
        venue: {
          _type: 'reference',
          _ref: formData.venueId
        },
        description: formData.description || undefined,
        expiresAt: formData.expiresAt || undefined,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        isActive: formData.isActive,
      };

      await adminSanityWriteClient
        .patch(qrCodeId)
        .set(updateData)
        .commit();

      alert("Código QR actualizado correctamente");
      router.push('/dashboard/qr-codes');
    } catch (error) {
      console.error("Error updating QR code:", error);
      alert('Error al actualizar el código QR');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await adminSanityWriteClient.delete(qrCodeId);
      alert("Código QR eliminado correctamente");
      router.push('/dashboard/qr-codes');
    } catch (error) {
      console.error("Error deleting QR code:", error);
      alert('Error al eliminar el código QR');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Código QR</h1>
          <p className="text-gray-600">Actualiza la información del código QR</p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Código QR</h1>
          <p className="text-gray-600">Actualiza la información del código QR</p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteModal(true)}
        >
          Eliminar QR
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-2">
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
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Vista previa del QR */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {qrCode && (
                <>
                  <div className="flex justify-center p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <QRCodeSVG
                      value={generateQRAccessURL(qrCode.code)}
                      size={200}
                      level="H"
                    />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Código:</span>
                      <div className="text-gray-600 font-mono text-xs break-all">
                        {qrCode.code}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">URL:</span>
                      <div className="text-gray-600 text-xs break-all">
                        {generateQRAccessURL(qrCode.code)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Usos:</span>
                      <div className="text-gray-600">
                        {qrCode.currentUses}
                        {qrCode.maxUses && ` / ${qrCode.maxUses}`}
                      </div>
                    </div>
                    
                    {qrCode.lastUsedAt && (
                      <div>
                        <span className="font-medium text-gray-700">Último uso:</span>
                        <div className="text-gray-600">
                          {new Date(qrCode.lastUsedAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium text-gray-700">Estado:</span>
                      <div className="text-gray-600">
                        {qrCode.isActive ? '✅ Activo' : '❌ Inactivo'}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `/api/qr/download/${qrCode.code}`;
                      link.download = `qr-${qrCode.code}.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Descargar QR
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Eliminar código QR?
            </h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. El código QR y todos sus datos asociados serán eliminados permanentemente.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
