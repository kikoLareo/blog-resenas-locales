"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { createSwapy } from 'swapy';
import { 
  GripVertical, 
  Plus, 
  Eye, 
  EyeOff, 
  Save, 
  Trash2, 
  Settings
} from 'lucide-react';

// Tipos para las secciones
interface HomepageSection {
  id: string;
  title: string;
  type: 'hero' | 'featured' | 'trending' | 'categories' | 'newsletter';
  enabled: boolean;
  order: number;
  config: {
    title?: string;
    subtitle?: string;
    itemCount?: number;
    showImages?: boolean;
    layout?: 'grid' | 'carousel' | 'list';
  };
}

const defaultSections: HomepageSection[] = [
  {
    id: '1',
    title: 'Hero Principal',
    type: 'hero',
    enabled: true,
    order: 1,
    config: {
      title: 'Descubre los mejores sabores',
      subtitle: 'Reseñas auténticas de restaurantes locales',
      itemCount: 3,
      layout: 'carousel'
    }
  },
  {
    id: '2',
    title: 'Reseñas Destacadas',
    type: 'featured',
    enabled: true,
    order: 2,
    config: {
      title: 'Destacados de la semana',
      subtitle: 'Los locales más recomendados',
      itemCount: 6,
      showImages: true,
      layout: 'grid'
    }
  },
  {
    id: '3',
    title: 'Tendencias',
    type: 'trending',
    enabled: true,
    order: 3,
    config: {
      title: 'Lo más popular',
      subtitle: 'Reseñas que están en tendencia',
      itemCount: 4,
      layout: 'grid'
    }
  },
  {
    id: '4',
    title: 'Categorías',
    type: 'categories',
    enabled: false,
    order: 4,
    config: {
      title: 'Explora por categorías',
      subtitle: 'Encuentra exactamente lo que buscas',
      itemCount: 8,
      layout: 'grid'
    }
  },
  {
    id: '5',
    title: 'Newsletter',
    type: 'newsletter',
    enabled: true,
    order: 5,
    config: {
      title: 'No te pierdas nada',
      subtitle: 'Recibe las mejores reseñas en tu email'
    }
  }
];

export default function HomepageSectionsPage() {
  const [sections, setSections] = useState<HomepageSection[]>(defaultSections);
  const [selectedSection, setSelectedSection] = useState<HomepageSection | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Inicializar Swapy cuando el componente se monte
  useEffect(() => {
    const container = document.querySelector('.sections-container') as HTMLElement;
    if (container) {
      const swapy = createSwapy(container, {
        animation: 'dynamic',
        autoScrollOnDrag: true,
        dragOnHold: false
      });

      swapy.onSwap((event: any) => {
        const { object } = event.detail;
        const newSections = [...sections];
        
        // Actualizar el orden basado en los cambios de Swapy
        Object.entries(object).forEach(([slotId, data]: [string, any]) => {
          const sectionIndex = newSections.findIndex(s => s.id === data.itemId);
          if (sectionIndex !== -1) {
            newSections[sectionIndex].order = parseInt(slotId.replace('slot-', ''));
          }
        });

        // Ordenar las secciones por el nuevo orden
        newSections.sort((a, b) => a.order - b.order);
        setSections(newSections);
        setHasChanges(true);
      });

      return () => swapy.destroy();
    }
  }, [sections]);

  const updateSection = (id: string, updates: Partial<HomepageSection>) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
    setHasChanges(true);
  };

  const toggleSection = (id: string) => {
    updateSection(id, { enabled: !sections.find(s => s.id === id)?.enabled });
  };

  const saveChanges = async () => {
    try {
      // Aquí enviarías los cambios a Sanity
      console.log('Guardando secciones:', sections);
      setHasChanges(false);
      // TODO: Implementar guardado en Sanity
    } catch (error) {
      console.error('Error guardando:', error);
    }
  };

  const addNewSection = () => {
    const newSection: HomepageSection = {
      id: Date.now().toString(),
      title: 'Nueva Sección',
      type: 'featured',
      enabled: false,
      order: sections.length + 1,
      config: {
        title: 'Título de la sección',
        subtitle: 'Subtítulo descriptivo',
        itemCount: 4,
        layout: 'grid'
      }
    };
    setSections(prev => [...prev, newSection]);
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Secciones</h1>
          <p className="text-gray-600 mt-1">
            Configura el contenido y orden de la página principal
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="secondary">Cambios sin guardar</Badge>
          )}
          <Button onClick={addNewSection} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Sección
          </Button>
          <Button onClick={saveChanges} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de secciones con drag and drop */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GripVertical className="h-5 w-5" />
                Secciones del Homepage
              </CardTitle>
              <p className="text-sm text-gray-500">
                Arrastra para reordenar las secciones
              </p>
            </CardHeader>
            <CardContent>
              <div className="sections-container space-y-3">
                {sections
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <div 
                      key={section.id} 
                      data-swapy-slot={`slot-${section.order}`}
                      className="transition-all duration-200"
                    >
                      <div 
                        data-swapy-item={section.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedSection?.id === section.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        } ${!section.enabled ? 'opacity-60' : ''}`}
                        onClick={() => setSelectedSection(section)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {section.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {section.config.title || 'Sin título configurado'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={section.enabled ? 'default' : 'secondary'}>
                              {section.type}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSection(section.id);
                              }}
                            >
                              {section.enabled ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de configuración */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSection ? (
                <>
                  <div>
                    <Label htmlFor="section-title">Título de la sección</Label>
                    <Input
                      id="section-title"
                      value={selectedSection.title}
                      onChange={(e) => updateSection(selectedSection.id, { title: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="display-title">Título visible</Label>
                    <Input
                      id="display-title"
                      value={selectedSection.config.title || ''}
                      onChange={(e) => updateSection(selectedSection.id, { 
                        config: { ...selectedSection.config, title: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subtitle">Subtítulo</Label>
                    <Textarea
                      id="subtitle"
                      value={selectedSection.config.subtitle || ''}
                      onChange={(e) => updateSection(selectedSection.id, { 
                        config: { ...selectedSection.config, subtitle: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="item-count">Número de elementos</Label>
                    <Input
                      id="item-count"
                      type="number"
                      min="1"
                      max="12"
                      value={selectedSection.config.itemCount || 4}
                      onChange={(e) => updateSection(selectedSection.id, { 
                        config: { ...selectedSection.config, itemCount: parseInt(e.target.value) }
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="layout">Diseño</Label>
                    <Select
                      value={selectedSection.config.layout || 'grid'}
                      onValueChange={(value) => updateSection(selectedSection.id, { 
                        config: { ...selectedSection.config, layout: value as 'grid' | 'carousel' | 'list' }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Cuadrícula</SelectItem>
                        <SelectItem value="carousel">Carrusel</SelectItem>
                        <SelectItem value="list">Lista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-images"
                      checked={selectedSection.config.showImages ?? true}
                      onCheckedChange={(checked) => updateSection(selectedSection.id, { 
                        config: { ...selectedSection.config, showImages: checked }
                      })}
                    />
                    <Label htmlFor="show-images">Mostrar imágenes</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="section-enabled"
                      checked={selectedSection.enabled}
                      onCheckedChange={(checked) => updateSection(selectedSection.id, { enabled: checked })}
                    />
                    <Label htmlFor="section-enabled">Sección habilitada</Label>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        setSections(prev => prev.filter(s => s.id !== selectedSection.id));
                        setSelectedSection(null);
                        setHasChanges(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar Sección
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    Selecciona una sección para configurarla
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 space-y-2">
                <p><strong>Secciones activas:</strong> {sections.filter(s => s.enabled).length}</p>
                <p><strong>Orden actual:</strong></p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  {sections
                    .filter(s => s.enabled)
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                      <li key={section.id}>
                        {section.title}
                      </li>
                    ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
