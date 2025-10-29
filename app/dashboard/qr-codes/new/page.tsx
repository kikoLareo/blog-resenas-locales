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

interface City {
  _id: string;
  title: string;
  slug: { current: string };
}

export default function NewQRCodePage() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showNewVenueModal, setShowNewVenueModal] = useState(false);
  const [creatingVenue, setCreatingVenue] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    venueId: "",
    description: "",
    expiresAt: "",
    maxUses: "",
    isActive: true,
    isOnboarding: false,
  });

  const [newVenueData, setNewVenueData] = useState({
    title: "",
    cityId: "",
    address: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [venuesData, citiesData] = await Promise.all([
          adminSanityClient.fetch<Venue[]>(venuesListQuery),
          adminSanityClient.fetch<City[]>('*[_type == "city"] | order(title asc) { _id, title, slug }'),
        ]);
        setVenues(venuesData);
        setCities(citiesData);
      } catch (error) {
        // Error handling
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateNewVenue = async () => {
    if (!newVenueData.title || !newVenueData.cityId || !newVenueData.address) {
      alert('Por favor completa todos los campos');
      return;
    }

    setCreatingVenue(true);

    try {
      // Generate slug
      const slug = newVenueData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Create venue
      const venue = await adminSanityWriteClient.create({
        _type: 'venue',
        title: newVenueData.title,
        slug: {
          _type: 'slug',
          current: slug,
        },
        address: newVenueData.address,
        city: {
          _type: 'reference',
          _ref: newVenueData.cityId,
        },
        description: '',
        priceRange: '€€',
        categories: [],
        images: [],
      });

      // Add to venues list
      const city = cities.find(c => c._id === newVenueData.cityId);
      if (city) {
        setVenues([...venues, {
          _id: venue._id,
          title: venue.title,
          slug: { current: slug },
          city: city,
        }]);
      }

      // Select the new venue
      setFormData({ ...formData, venueId: venue._id });

      // Close modal
      setShowNewVenueModal(false);
      setNewVenueData({ title: '', cityId: '', address: '' });

      alert(`Local "${venue.title}" creado correctamente`);
    } catch (error) {
      alert('Error al crear el local');
    } finally {
      setCreatingVenue(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Generar código único y verificar que no exista
      let uniqueCode = generateUniqueCode();
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        // Verificar si el código ya existe
        const existingQR = await adminSanityClient.fetch(
          `*[_type == "qrCode" && code == $code][0]`,
          { code: uniqueCode }
        );

        if (!existingQR) {
          break; // Código único encontrado
        }

        // Generar nuevo código
        uniqueCode = generateUniqueCode();
        attempts++;
      }

      if (attempts === maxAttempts) {
        alert('No se pudo generar un código único. Por favor, inténtalo de nuevo.');
        setSaving(false);
        return;
      }
      
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
        isOnboarding: formData.isOnboarding,
        isUsed: false,
        currentUses: 0,
      };

      await adminSanityWriteClient.create(qrCodeData);
      
      router.push('/dashboard/qr-codes');
    } catch (error) {
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
                <div className="flex gap-2">
                  <Select
                    value={formData.venueId}
                    onValueChange={(value) => setFormData({ ...formData, venueId: value })}
                    required
                  >
                    <SelectTrigger className="flex-1">
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewVenueModal(true)}
                    className="whitespace-nowrap"
                  >
                    ➕ Nuevo Local
                  </Button>
                </div>
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

            <div className="space-y-3 border-t pt-4">
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isOnboarding"
                  checked={formData.isOnboarding}
                  onChange={(e) => setFormData({ ...formData, isOnboarding: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <div>
                  <Label htmlFor="isOnboarding">QR de Onboarding (un solo uso)</Label>
                  <p className="text-sm text-gray-500">
                    Para que propietarios registren nuevos locales
                  </p>
                </div>
              </div>
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

      {/* Modal para crear nuevo local */}
      {showNewVenueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Crear Nuevo Local</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="newVenueTitle">Nombre del local *</Label>
                <Input
                  id="newVenueTitle"
                  value={newVenueData.title}
                  onChange={(e) => setNewVenueData({ ...newVenueData, title: e.target.value })}
                  placeholder="Ej: Restaurante La Buena Mesa"
                />
              </div>

              <div>
                <Label htmlFor="newVenueCity">Ciudad *</Label>
                <Select
                  value={newVenueData.cityId}
                  onValueChange={(value) => setNewVenueData({ ...newVenueData, cityId: value })}
                >
                  <SelectTrigger id="newVenueCity">
                    <SelectValue placeholder="Seleccionar ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city._id} value={city._id}>
                        {city.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="newVenueAddress">Dirección *</Label>
                <Input
                  id="newVenueAddress"
                  value={newVenueData.address}
                  onChange={(e) => setNewVenueData({ ...newVenueData, address: e.target.value })}
                  placeholder="Calle, número"
                />
              </div>

              <p className="text-sm text-gray-500">
                Solo se crean los datos básicos. Podrás completar el resto después.
              </p>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowNewVenueModal(false);
                    setNewVenueData({ title: '', cityId: '', address: '' });
                  }}
                  disabled={creatingVenue}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateNewVenue}
                  disabled={creatingVenue}
                >
                  {creatingVenue ? 'Creando...' : 'Crear Local'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

