"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminSanityClient } from "@/lib/admin-sanity";
import { qrCodeOnboardingQuery } from "@/sanity/lib/queries";
import type { QRCode, City, Category } from "@/types/sanity";

interface OnboardingPageProps {
  params: Promise<{
    code: string;
  }>;
}

interface FormData {
  // Basic info
  title: string;
  description: string;
  address: string;
  postalCode: string;
  cityId: string;
  categoryIds: string[];
  
  // Contact
  phone: string;
  email: string;
  website: string;
  submittedBy: string;
  
  // Additional
  priceRange: string;
  
  // Opening hours
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  
  // Geolocation
  lat: string;
  lng: string;
  
  // Images
  images: File[];
}

export default function OnboardingPage({ params }: OnboardingPageProps) {
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>("");
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    address: "",
    postalCode: "",
    cityId: "",
    categoryIds: [],
    phone: "",
    email: "",
    website: "",
    submittedBy: "",
    priceRange: "€€",
    openingHours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    lat: "",
    lng: "",
    images: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      setCode(resolvedParams.code);
      
      try {
        // Fetch QR code
        const qrData = await adminSanityClient.fetch<QRCode>(qrCodeOnboardingQuery, { code: resolvedParams.code });
        
        if (!qrData) {
          setError("Código QR no encontrado");
          setLoading(false);
          return;
        }

        if (!qrData.isActive) {
          setError("Este código QR está inactivo");
          setLoading(false);
          return;
        }

        if (!qrData.isOnboarding) {
          setError("Este código QR no es para registro de locales");
          setLoading(false);
          return;
        }

        if (qrData.isUsed) {
          setError("Este código QR ya ha sido utilizado");
          setLoading(false);
          return;
        }

        if (qrData.expiresAt && new Date(qrData.expiresAt) < new Date()) {
          setError("Este código QR ha expirado");
          setLoading(false);
          return;
        }

        setQrCode(qrData);

        // Fetch cities and categories
        const [citiesData, categoriesData] = await Promise.all([
          adminSanityClient.fetch<City[]>('*[_type == "city"] | order(title asc) { _id, title, slug }'),
          adminSanityClient.fetch<Category[]>('*[_type == "category"] | order(title asc) { _id, title, slug }'),
        ]);

        setCities(citiesData);
        setCategories(categoriesData);
      } catch (err) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length > 10) {
        alert("Máximo 10 imágenes permitidas");
        return;
      }
      setFormData({ ...formData, images: filesArray });
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    const isSelected = formData.categoryIds.includes(categoryId);
    if (isSelected) {
      setFormData({
        ...formData,
        categoryIds: formData.categoryIds.filter(id => id !== categoryId),
      });
    } else {
      setFormData({
        ...formData,
        categoryIds: [...formData.categoryIds, categoryId],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Validate
      if (formData.categoryIds.length === 0) {
        setError("Debe seleccionar al menos una categoría");
        setSubmitting(false);
        return;
      }

      if (formData.images.length === 0) {
        setError("Debe subir al menos una imagen");
        setSubmitting(false);
        return;
      }

      // Prepare form data
      const submitData = new FormData();
      submitData.append('qrCode', code);
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('address', formData.address);
      submitData.append('postalCode', formData.postalCode);
      submitData.append('cityId', formData.cityId);
      submitData.append('categories', JSON.stringify(formData.categoryIds));
      submitData.append('phone', formData.phone);
      submitData.append('email', formData.email);
      submitData.append('website', formData.website);
      submitData.append('submittedBy', formData.submittedBy);
      submitData.append('priceRange', formData.priceRange);
      submitData.append('openingHours', JSON.stringify(formData.openingHours));
      
      // Add geolocation if provided
      if (formData.lat && formData.lng) {
        submitData.append('geo', JSON.stringify({
          _type: 'geopoint',
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng),
        }));
      }

      // Add images
      formData.images.forEach((image) => {
        submitData.append('images', image);
      });

      // Submit
      const response = await fetch('/api/qr/submit-venue', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar la solicitud');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Validando código QR...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Código QR no válido
            </h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Contacta con el administrador para obtener un código válido.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Solicitud enviada correctamente!
            </h1>
            <p className="text-gray-600 mb-6">
              Hemos recibido la información de tu local. Un administrador la revisará pronto.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <h2 className="font-semibold text-blue-900 mb-2">Próximos pasos:</h2>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>Nuestro equipo revisará toda la información proporcionada</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Verificaremos que los datos sean correctos y completos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Te contactaremos por email una vez que tu local esté publicado</span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Tiempo estimado de revisión: 24-48 horas
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Registra tu Local
              </h1>
              <p className="text-gray-600 mt-1">
                Completa la información para aparecer en nuestro directorio
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Código QR</div>
              <div className="text-xs text-gray-400 font-mono">{code}</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="submittedBy">Tu nombre completo *</Label>
                  <Input
                    id="submittedBy"
                    value={formData.submittedBy}
                    onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
                    required
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div>
                  <Label htmlFor="title">Nombre del local *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Ej: Restaurante La Buena Mesa"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    placeholder="Describe tu local, especialidad, ambiente, etc. (mínimo 50 caracteres)"
                    minLength={50}
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length}/500 caracteres
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cityId">Ciudad *</Label>
                    <Select
                      value={formData.cityId}
                      onValueChange={(value) => setFormData({ ...formData, cityId: value })}
                      required
                    >
                      <SelectTrigger id="cityId">
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
                    <Label htmlFor="priceRange">Rango de precios *</Label>
                    <Select
                      value={formData.priceRange}
                      onValueChange={(value) => setFormData({ ...formData, priceRange: value })}
                      required
                    >
                      <SelectTrigger id="priceRange">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="€">€ - Económico</SelectItem>
                        <SelectItem value="€€">€€ - Moderado</SelectItem>
                        <SelectItem value="€€€">€€€ - Caro</SelectItem>
                        <SelectItem value="€€€€">€€€€ - Muy Caro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Categorías * (selecciona al menos una)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        type="button"
                        onClick={() => handleCategoryToggle(category._id)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          formData.categoryIds.includes(category._id)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {category.title}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Dirección completa *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    placeholder="Calle, número, piso"
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode">Código postal</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="15001"
                    pattern="\d{5}"
                    title="Debe ser un código postal de 5 dígitos"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lat">Latitud (opcional)</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                      placeholder="43.3623"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lng">Longitud (opcional)</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                      placeholder="-8.4115"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Puedes obtener las coordenadas desde Google Maps haciendo clic derecho en tu ubicación
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="+34 981 123 456"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="contacto@tulocal.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Sitio web (opcional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.tulocal.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Horarios de Apertura</CardTitle>
                <p className="text-sm text-gray-600">
                  Indica tus horarios. Puedes escribir &ldquo;Cerrado&rdquo; si no abres ese día.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: 'monday', label: 'Lunes' },
                  { key: 'tuesday', label: 'Martes' },
                  { key: 'wednesday', label: 'Miércoles' },
                  { key: 'thursday', label: 'Jueves' },
                  { key: 'friday', label: 'Viernes' },
                  { key: 'saturday', label: 'Sábado' },
                  { key: 'sunday', label: 'Domingo' },
                ].map(({ key, label }) => (
                  <div key={key} className="grid grid-cols-4 gap-4 items-center">
                    <Label htmlFor={key} className="font-medium">
                      {label}
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id={key}
                        value={formData.openingHours[key as keyof typeof formData.openingHours]}
                        onChange={(e) => setFormData({
                          ...formData,
                          openingHours: {
                            ...formData.openingHours,
                            [key]: e.target.value,
                          },
                        })}
                        placeholder="Ej: 12:00-16:00, 20:00-23:00 o Cerrado"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Imágenes del Local *</CardTitle>
                <p className="text-sm text-gray-600">
                  Sube entre 1 y 10 imágenes de tu local (fachada, interior, platos, etc.)
                </p>
              </CardHeader>
              <CardContent>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  required
                  className="cursor-pointer"
                />
                {formData.images.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    {formData.images.length} imagen(es) seleccionada(s)
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>* Campos obligatorios</p>
                  <p className="text-xs mt-1">
                    Al enviar, aceptas que revisaremos tu información antes de publicarla
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  size="lg"
                  className="min-w-[200px]"
                >
                  {submitting ? "Enviando..." : "Enviar Solicitud"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
