"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    region: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.title.toString().trim()) {
        setLoading(false);
        window.alert('Título es un campo requerido');
        return;
      }

      if (!formData.slug || !formData.slug.toString().trim()) {
        setLoading(false);
        window.alert('Slug es un campo requerido');
        return;
      }

      // Transform data for API
      const apiData = {
        title: formData.title,
        slug: formData.slug,
        region: formData.region,
        description: formData.description
      };

      console.log('Creando nueva ciudad con datos:', apiData);

      // Call API to create city
      const res = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const data = await res.json();
      console.log('Respuesta del servidor:', data);

      if (!res.ok) {
        const errorMsg = data?.details || data?.error || 'Error al crear';
        console.error('Error al crear:', errorMsg);
        window.alert(`Error: ${errorMsg}`);
        return;
      }

      // Success - redirect to cities list
      window.alert('Ciudad creada exitosamente');
      router.push('/dashboard/cities');
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      window.alert((error as any)?.message || 'Error al crear ciudad');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    setFormData({
      ...formData,
      title,
      slug
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/cities">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Ciudades
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Nueva Ciudad</h1>
          <p className="text-gray-600">Crea una nueva ciudad para organizar locales y reseñas</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Ciudad</CardTitle>
          </CardHeader>
          <CardContent>
            <form role="form" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Nombre de la Ciudad *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Ej: Madrid, Barcelona, Valencia..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="madrid, barcelona, valencia..."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL amigable para la ciudad. Se genera automáticamente desde el nombre.
                </p>
              </div>

              <div>
                <Label htmlFor="region">Región</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  placeholder="Ej: Comunidad de Madrid, Cataluña..."
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Breve descripción de la ciudad y su gastronomía..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Link href="/dashboard/cities">
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Creando..." : "Crear Ciudad"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
