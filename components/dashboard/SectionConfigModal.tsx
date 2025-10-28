/**
 * SectionConfigModal Component
 * Modal completo para configurar secciones de homepage
 */

'use client';

import { useState, useEffect } from 'react';
import { HomepageSection, SectionType, ContentType, SelectedItem, AvailableItem, SectionLayout, GridColumns } from '@/types/homepage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, X } from 'lucide-react';
import ContentTypeSelector from './ContentTypeSelector';
import ItemPickerList from './ItemPickerList';
import SelectedItemsManager from './SelectedItemsManager';

interface SectionConfigModalProps {
  section: HomepageSection | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (section: HomepageSection) => void;
}

const SECTION_TYPES: { value: SectionType; label: string; description: string }[] = [
  { value: 'hero', label: 'Hero', description: 'Banner principal con carrusel' },
  { value: 'poster', label: 'Poster', description: 'Card horizontal alargado' },
  { value: 'poster-v2', label: 'Poster V2', description: 'Poster menos alto' },
  { value: 'banner', label: 'Banner', description: 'Formato 16:9 panorámico' },
  { value: 'card-square', label: 'Card Cuadrado', description: 'Formato cuadrado 1:1' },
];

const LAYOUTS: { value: SectionLayout; label: string; availableFor: SectionType[] }[] = [
  { value: 'grid', label: 'Cuadrícula', availableFor: ['hero', 'poster', 'poster-v2', 'banner', 'card-square'] },
  { value: 'list', label: 'Lista', availableFor: ['poster', 'poster-v2', 'banner', 'card-square'] },
  { value: 'carousel', label: 'Carrusel', availableFor: ['hero'] },
];

export default function SectionConfigModal({
  section,
  isOpen,
  onClose,
  onSave,
}: SectionConfigModalProps) {
  const [formData, setFormData] = useState<HomepageSection | null>(null);
  const [activeTab, setActiveTab] = useState('config');

  // Inicializar form data cuando se abre el modal
  useEffect(() => {
    if (isOpen && section) {
      setFormData(section);
      setActiveTab('config');
    } else if (isOpen && !section) {
      // Nueva sección
      setFormData({
        id: `new-${Date.now()}`,
        title: 'Nueva Sección',
        sectionType: 'poster',
        enabled: true,
        order: 1,
        config: {
          title: '',
          subtitle: '',
          layout: 'grid',
          gridColumns: 3,
          showImages: true,
          contentTypes: [],
          selectedItems: [],
        },
      });
      setActiveTab('config');
    }
  }, [isOpen, section]);

  // Si el layout actual no está disponible para el nuevo tipo, seleccionar el primero disponible
  useEffect(() => {
    if (formData) {
      const availableLayouts = LAYOUTS.filter(layout => 
        layout.availableFor.includes(formData.sectionType)
      );

      if (!availableLayouts.find(l => l.value === formData.config.layout)) {
        setFormData({
          ...formData,
          config: {
            ...formData.config,
            layout: availableLayouts[0]?.value || 'grid',
          },
        });
      }
    }
  }, [formData?.sectionType]);

  if (!formData) return null;

  const availableLayouts = LAYOUTS.filter(layout => 
    layout.availableFor.includes(formData.sectionType)
  );

  const handleSave = () => {
    if (!formData) return;

    // Validaciones
    if (formData.config.contentTypes.length === 0) {
      alert('Selecciona al menos un tipo de contenido');
      return;
    }

    if (formData.config.selectedItems.length === 0) {
      alert('Selecciona al menos un elemento');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleToggleItem = (contentType: ContentType) => (item: AvailableItem) => {
    const existingIndex = formData.config.selectedItems.findIndex(i => i.id === item._id);

    if (existingIndex >= 0) {
      // Remover item
      const newItems = formData.config.selectedItems.filter(i => i.id !== item._id);
      setFormData({
        ...formData,
        config: {
          ...formData.config,
          selectedItems: newItems.map((item, index) => ({ ...item, order: index + 1 })),
        },
      });
    } else {
      // Añadir item
      const newItem: SelectedItem = {
        id: item._id,
        type: contentType,
        order: formData.config.selectedItems.length + 1,
        title: item.title,
        slug: item.slug,
        imageUrl: item.imageUrl,
        city: item.city,
        venue: item.venue,
      };

      setFormData({
        ...formData,
        config: {
          ...formData.config,
          selectedItems: [...formData.config.selectedItems, newItem],
        },
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const newItems = formData.config.selectedItems
      .filter(i => i.id !== itemId)
      .map((item, index) => ({ ...item, order: index + 1 }));

    setFormData({
      ...formData,
      config: {
        ...formData.config,
        selectedItems: newItems,
      },
    });
  };

  const handleReorder = (items: SelectedItem[]) => {
    setFormData({
      ...formData,
      config: {
        ...formData.config,
        selectedItems: items,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {section ? 'Editar Sección' : 'Nueva Sección'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Configuración</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="selected">Seleccionados ({formData.config.selectedItems.length})</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-6">
            {/* TAB: Configuración */}
            <TabsContent value="config" className="space-y-6 mt-0">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="section-title">Título de la sección</Label>
                  <Input
                    id="section-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Reseñas destacadas"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Para uso interno del dashboard
                  </p>
                </div>

                <div>
                  <Label htmlFor="display-title">Título visible</Label>
                  <Input
                    id="display-title"
                    value={formData.config.title || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      config: { ...formData.config, title: e.target.value }
                    })}
                    placeholder="Ej: Descubre los mejores lugares"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Se mostrará en la página principal
                  </p>
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtítulo</Label>
                  <Textarea
                    id="subtitle"
                    value={formData.config.subtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      config: { ...formData.config, subtitle: e.target.value }
                    })}
                    placeholder="Descripción breve de la sección"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="section-type">Tipo de sección</Label>
                  <Select
                    value={formData.sectionType}
                    onValueChange={(value: SectionType) => setFormData({
                      ...formData,
                      sectionType: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="layout">Distribución</Label>
                  <Select
                    value={formData.config.layout}
                    onValueChange={(value: SectionLayout) => setFormData({
                      ...formData,
                      config: { ...formData.config, layout: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLayouts.map((layout) => (
                        <SelectItem key={layout.value} value={layout.value}>
                          {layout.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.config.layout === 'grid' && (
                  <div>
                    <Label htmlFor="grid-columns">Columnas (Grid)</Label>
                    <Select
                      value={formData.config.gridColumns?.toString() || '3'}
                      onValueChange={(value) => setFormData({
                        ...formData,
                        config: { ...formData.config, gridColumns: parseInt(value) as GridColumns }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 columnas</SelectItem>
                        <SelectItem value="3">3 columnas</SelectItem>
                        <SelectItem value="4">4 columnas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="show-images" className="cursor-pointer">
                    Mostrar imágenes
                  </Label>
                  <Switch
                    id="show-images"
                    checked={formData.config.showImages ?? true}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      config: { ...formData.config, showImages: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="enabled" className="cursor-pointer">
                    Sección habilitada
                  </Label>
                  <Switch
                    id="enabled"
                    checked={formData.enabled}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      enabled: checked
                    })}
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB: Contenido */}
            <TabsContent value="content" className="space-y-6 mt-0">
              <ContentTypeSelector
                selectedTypes={formData.config.contentTypes}
                onChange={(types) => setFormData({
                  ...formData,
                  config: { ...formData.config, contentTypes: types }
                })}
              />

              {formData.config.contentTypes.length > 0 && (
                <div className="space-y-6 pt-4 border-t">
                  <Label className="text-base font-semibold">
                    Selecciona elementos
                  </Label>
                  
                  {formData.config.contentTypes.map((type) => (
                    <ItemPickerList
                      key={type}
                      contentType={type}
                      selectedItemIds={formData.config.selectedItems
                        .filter(item => item.type === type)
                        .map(item => item.id)
                      }
                      onToggleItem={handleToggleItem(type)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* TAB: Seleccionados */}
            <TabsContent value="selected" className="mt-0">
              <SelectedItemsManager
                items={formData.config.selectedItems}
                onReorder={handleReorder}
                onRemove={handleRemoveItem}
              />
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Sección
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
