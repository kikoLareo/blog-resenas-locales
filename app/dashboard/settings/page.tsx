"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, RefreshCw, AlertCircle } from "lucide-react";

interface Settings {
  [key: string]: string | boolean | null;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      
      if (response.ok) {
        const data = await response.json();
        // Convertir el objeto agrupado a un objeto plano
        const flatSettings: Settings = {};
        Object.entries(data.settings).forEach(([category, items]: [string, any]) => {
          items.forEach((item: any) => {
            const value = item.type === 'boolean' 
              ? item.value === 'true' 
              : item.value;
            flatSettings[item.key] = value;
          });
        });
        setSettings(flatSettings);
      } else if (response.status === 401) {
        setMessage({ type: 'error', text: 'No autorizado. Solo administradores pueden acceder.' });
      } else {
        setMessage({ type: 'error', text: 'Error al cargar configuraciones' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de red al cargar configuraciones' });
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    if (!confirm('¿Estás seguro de inicializar las configuraciones por defecto? Esto creará nuevas entradas pero no sobrescribirá las existentes.')) {
      return;
    }

    try {
      setInitializing(true);
      setMessage(null);
      
      const response = await fetch('/api/admin/settings', {
        method: 'POST'
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuraciones inicializadas exitosamente' });
        loadSettings();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Error al inicializar' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de red al inicializar' });
    } finally {
      setInitializing(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuraciones guardadas exitosamente' });
        setHasChanges(false);
        loadSettings();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Error al guardar' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de red al guardar' });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const getSetting = (key: string, defaultValue: any = '') => {
    return settings[key] !== undefined ? settings[key] : defaultValue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Cargando configuraciones...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Gestiona la configuración del sitio</p>
        </div>
        <Button 
          onClick={handleInitialize} 
          variant="outline"
          disabled={initializing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${initializing ? 'animate-spin' : ''}`} />
          {initializing ? 'Inicializando...' : 'Inicializar Defaults'}
        </Button>
      </div>

      {/* Mensaje de feedback */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <AlertCircle className="h-4 w-4" />
          {message.text}
        </div>
      )}

      {/* Indicador de cambios sin guardar */}
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span className="text-yellow-800">Tienes cambios sin guardar</span>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Guardando...' : 'Guardar Ahora'}
          </Button>
        </div>
      )}

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
                value={getSetting('site.name', 'Blog de Reseñas')}
                onChange={(e) => updateSetting('site.name', e.target.value)}
                placeholder="Nombre del sitio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">URL del Sitio</Label>
              <Input
                id="siteUrl"
                value={getSetting('site.url', 'https://example.com')}
                onChange={(e) => updateSetting('site.url', e.target.value)}
                placeholder="https://tu-sitio.com"
                type="url"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={getSetting('site.description', 'Descubre los mejores restaurantes')}
              onChange={(e) => updateSetting('site.description', e.target.value)}
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
                value={getSetting('seo.googleAnalytics', '')}
                onChange={(e) => updateSetting('seo.googleAnalytics', e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleVerification">Google Verification</Label>
              <Input
                id="googleVerification"
                value={getSetting('seo.googleVerification', '')}
                onChange={(e) => updateSetting('seo.googleVerification', e.target.value)}
                placeholder="Código de verificación"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="sitemap" 
              checked={getSetting('seo.sitemap', true) === true}
              onCheckedChange={(checked) => updateSetting('seo.sitemap', checked)}
            />
            <Label htmlFor="sitemap">Generar sitemap automáticamente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="robots" 
              checked={getSetting('seo.robots', true) === true}
              onCheckedChange={(checked) => updateSetting('seo.robots', checked)}
            />
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
            <Switch 
              id="adsEnabled" 
              checked={getSetting('ads.enabled', false) === true}
              onCheckedChange={(checked) => updateSetting('ads.enabled', checked)}
            />
            <Label htmlFor="adsEnabled">Habilitar anuncios</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adsProvider">Proveedor de Anuncios</Label>
              <Input
                id="adsProvider"
                value={getSetting('ads.provider', 'gam')}
                onChange={(e) => updateSetting('ads.provider', e.target.value)}
                placeholder="gam, adsense"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adsScript">Script de Anuncios</Label>
              <Input
                id="adsScript"
                value={getSetting('ads.script', 'https://securepubads.g.doubleclick.net/tag/js/gpt.js')}
                onChange={(e) => updateSetting('ads.script', e.target.value)}
                placeholder="URL del script"
                type="url"
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
                value={getSetting('sanity.projectId', '')}
                onChange={(e) => updateSetting('sanity.projectId', e.target.value)}
                placeholder="Tu project ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sanityDataset">Dataset</Label>
              <Input
                id="sanityDataset"
                value={getSetting('sanity.dataset', 'production')}
                onChange={(e) => updateSetting('sanity.dataset', e.target.value)}
                placeholder="production, development"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sanityApiVersion">API Version</Label>
            <Input
              id="sanityApiVersion"
              value={getSetting('sanity.apiVersion', '2024-01-01')}
              onChange={(e) => updateSetting('sanity.apiVersion', e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4">
        <Button 
          variant="outline" 
          onClick={() => {
            loadSettings();
            setHasChanges(false);
            setMessage(null);
          }}
          disabled={saving || loading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave}
          disabled={saving || !hasChanges}
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  );
}
