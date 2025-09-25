import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default async function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">Gestiona la configuración del sitio</p>
      </div>

      {/* Configuración del sitio */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Sitio</CardTitle>
          <CardDescription>
            Configuración general del sitio web
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nombre del Sitio</Label>
              <Input
                id="siteName"
                defaultValue="Blog de Reseñas"
                placeholder="Nombre del sitio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">URL del Sitio</Label>
              <Input
                id="siteUrl"
                defaultValue="https://example.com"
                placeholder="https://tu-sitio.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              defaultValue="Descubre los mejores restaurantes y locales con reseñas auténticas"
              placeholder="Descripción del sitio"
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuración de SEO */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración SEO</CardTitle>
          <CardDescription>
            Configuración para optimización en motores de búsqueda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
              <Input
                id="googleAnalytics"
                defaultValue="G-XXXXXXXXXX"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleVerification">Google Verification</Label>
              <Input
                id="googleVerification"
                defaultValue=""
                placeholder="Código de verificación"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="sitemap" defaultChecked />
            <Label htmlFor="sitemap">Generar sitemap automáticamente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="robots" defaultChecked />
            <Label htmlFor="robots">Generar robots.txt automáticamente</Label>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de anuncios */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Anuncios</CardTitle>
          <CardDescription>
            Configuración para la gestión de anuncios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="adsEnabled" />
            <Label htmlFor="adsEnabled">Habilitar anuncios</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adsProvider">Proveedor de Anuncios</Label>
              <Input
                id="adsProvider"
                defaultValue="gam"
                placeholder="gam, adsense"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adsScript">Script de Anuncios</Label>
              <Input
                id="adsScript"
                defaultValue="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
                placeholder="URL del script"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Sanity */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Sanity CMS</CardTitle>
          <CardDescription>
            Configuración para el sistema de gestión de contenido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sanityProjectId">Project ID</Label>
              <Input
                id="sanityProjectId"
                defaultValue="xaenlpyp"
                placeholder="Tu project ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sanityDataset">Dataset</Label>
              <Input
                id="sanityDataset"
                defaultValue="production"
                placeholder="production, development"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sanityApiVersion">API Version</Label>
            <Input
              id="sanityApiVersion"
              defaultValue="2024-01-01"
              placeholder="YYYY-MM-DD"
            />
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancelar</Button>
        <Button>Guardar Cambios</Button>
      </div>
    </div>
  );
}
