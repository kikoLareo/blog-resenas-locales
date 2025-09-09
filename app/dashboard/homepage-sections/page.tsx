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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

// Configuración por defecto
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
      subtitle: 'Los lugares que más nos han sorprendido',
      itemCount: 6,
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

// Componente individual de sección sortable
interface SortableItemProps {
  section: HomepageSection;
  onToggle: (id: string) => void;
  onEdit: (section: HomepageSection) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
}

function SortableItem({ section, onToggle, onEdit, onDelete, isSelected }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: section.id,
    data: {
      type: 'Section',
      section,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'hero': return '🎯';
      case 'featured': return '⭐';
      case 'trending': return '🔥';
      case 'categories': return '📁';
      case 'newsletter': return '📧';
      default: return '📄';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-30' : 'opacity-100'}`}
    >
      <Card 
        className={`transition-all duration-200 cursor-pointer border-2 ${
          section.enabled 
            ? 'border-green-200 bg-green-50/30 hover:bg-green-50/50' 
            : 'border-gray-200 bg-gray-50/30 hover:bg-gray-50/50'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} ${
          isDragging ? 'shadow-lg' : 'hover:shadow-md'
        }`}
        onClick={() => onEdit(section)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Drag handle */}
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-200 rounded-md transition-colors touch-none"
                onClick={(e) => e.stopPropagation()}
              >
                <GripVertical className="h-5 w-5 text-gray-500" />
              </div>
              
              {/* Section info */}
              <div className="text-3xl">{getSectionIcon(section.type)}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {section.config.title || 'Sin título configurado'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={section.enabled ? 'default' : 'secondary'} className="text-xs">
                    {section.type}
                  </Badge>
                  {section.config.itemCount && (
                    <span className="text-xs text-gray-500">
                      {section.config.itemCount} elementos
                    </span>
                  )}
                  {section.config.layout && (
                    <span className="text-xs text-gray-500">
                      • {section.config.layout}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(section.id);
                }}
                className="h-9 w-9 p-0"
              >
                {section.enabled ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(section);
                }}
                className="h-9 w-9 p-0"
              >
                <Settings className="h-4 w-4 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(section.id);
                }}
                className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente principal
export default function HomepageSectionsPage() {
  const [sections, setSections] = useState<HomepageSection[]>(defaultSections);
  const [selectedSection, setSelectedSection] = useState<HomepageSection | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Cargar configuración desde Sanity al montar el componente
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        const response = await fetch('/api/admin/homepage-config');
        if (response.ok) {
          const config = await response.json();
          if (config && config.sections) {
            setSections(config.sections);
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadConfiguration();
  }, []);

  // Configuración de sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Manejar inicio del drag
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  // Manejar final del drag
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        const newSections = arrayMove(items, oldIndex, newIndex);
        
        // Actualizar el orden
        const updatedSections = newSections.map((section, index) => ({
          ...section,
          order: index + 1
        }));

        setHasChanges(true);
        return updatedSections;
      });
    }
    
    setActiveId(null);
  }

  const updateSection = (id: string, updates: Partial<HomepageSection>) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
    setHasChanges(true);
    
    // Actualizar la sección seleccionada también
    if (selectedSection?.id === id) {
      setSelectedSection(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const toggleSection = (id: string) => {
    updateSection(id, { enabled: !sections.find(s => s.id === id)?.enabled });
  };

  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
    setHasChanges(true);
    if (selectedSection?.id === id) {
      setSelectedSection(null);
    }
  };

  const editSection = (section: HomepageSection) => {
    setSelectedSection(section);
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/homepage-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sections }),
      });

      if (response.ok) {
        setHasChanges(false);
      } else {
      }
    } catch (error) {
    } finally {
      setSaving(false);
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
    setSelectedSection(newSection);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Cargando configuración...</div>
      </div>
    );
  }

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
          <Button onClick={saveChanges} disabled={!hasChanges || saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
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
                Arrastra las secciones para reordenarlas
              </p>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {sections
                      .sort((a, b) => a.order - b.order)
                      .map((section) => (
                        <SortableItem
                          key={section.id}
                          section={section}
                          onToggle={toggleSection}
                          onEdit={editSection}
                          onDelete={deleteSection}
                          isSelected={selectedSection?.id === section.id}
                        />
                      ))}
                  </div>
                </SortableContext>
                
                <DragOverlay>
                  {activeId ? (
                    <Card className="shadow-lg border-2 border-blue-500 opacity-90">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-5 w-5 text-gray-500" />
                          <div className="text-3xl">
                            {getSectionIcon(sections.find(s => s.id === activeId)?.type || 'featured')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {sections.find(s => s.id === activeId)?.title}
                            </h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : null}
                </DragOverlay>
              </DndContext>
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
                      onClick={() => deleteSection(selectedSection.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar Sección
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
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
                        {section.title} ({section.type})
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

// Helper function for drag overlay
function getSectionIcon(type: string) {
  switch (type) {
    case 'hero': return '🎯';
    case 'featured': return '⭐';
    case 'trending': return '🔥';
    case 'categories': return '📁';
    case 'newsletter': return '📧';
    default: return '📄';
  }
}
