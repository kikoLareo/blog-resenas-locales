'use client';

import { useState, useEffect } from 'react';
import { HomepageSection, SectionType, ContentType, SelectedItem } from '@/types/homepage';
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

export default function SectionConfigModal({
  section,
  isOpen,
  onClose,
  onSave,
}: SectionConfigModalProps) {
  const [formData, setFormData] = useState<HomepageSection | null>(null);
  const [activeTab, setActiveTab] = useState('config');

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && section) {
      setFormData(section);
      setActiveTab('config');
    } else if (isOpen && !section) {
      // New section
      setFormData({
        _id: `new-${Date.now()}`,
        _type: 'homepageSection',
        title: 'Nueva Sección',
        sectionType: 'poster',
        enabled: true,
        order: 1,
        config: {
          displayTitle: '',
          subtitle: '',
          contentTypes: [],
          selectedItems: [],
        },
        _createdAt: new Date().toISOString(),
        _updatedAt: new Date().toISOString(),
      });
      setActiveTab('config');
    }
  }, [isOpen, section]);

  if (!formData) return null;

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('El título es requerido');
      return;
    }

    if (!formData.config.contentTypes.length) {
      alert('Selecciona al menos un tipo de contenido');
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {section ? 'Editar Sección' : 'Nueva Sección'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Configuración</TabsTrigger>
            <TabsTrigger value="contenido">Contenido</TabsTrigger>
            <TabsTrigger value="seleccionados">
              Seleccionados ({formData.config.selectedItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la Sección*</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="ej: Mejores Reseñas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sectionType">Tipo de Sección*</Label>
                <Select
                  value={formData.sectionType}
                  onValueChange={(value: SectionType) =>
                    setFormData({ ...formData, sectionType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayTitle">Título Mostrado</Label>
                <Input
                  id="displayTitle"
                  value={formData.config.displayTitle || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      config: { ...formData.config, displayTitle: e.target.value }
                    })
                  }
                  placeholder="Título que verán los usuarios"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Textarea
                  id="subtitle"
                  value={formData.config.subtitle || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      config: { ...formData.config, subtitle: e.target.value }
                    })
                  }
                  placeholder="Descripción opcional"
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipos de Contenido*</Label>
              <ContentTypeSelector
                selectedTypes={formData.config.contentTypes}
                onChange={(contentTypes) =>
                  setFormData({
                    ...formData,
                    config: { ...formData.config, contentTypes }
                  })
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="contenido" className="mt-6">
            {formData.config.contentTypes.length > 0 ? (
              <div className="space-y-4">
                {formData.config.contentTypes.map((type) => (
                  <div key={type}>
                    <ItemPickerList
                      contentType={type}
                      selectedItemIds={formData.config.selectedItems
                        .filter(selected => selected.type === type)
                        .map(selected => selected.id)}
                      onToggleItem={(item) => {
                        const exists = formData.config.selectedItems.find(
                          (selected) => selected.id === item._id && selected.type === type
                        );

                        if (exists) {
                          // Remove item
                          setFormData({
                            ...formData,
                            config: {
                              ...formData.config,
                              selectedItems: formData.config.selectedItems.filter(
                                (selected) =>
                                  !(selected.id === item._id && selected.type === type)
                              ),
                            },
                          });
                        } else {
                          // Add item
                          const newItem: SelectedItem = {
                            id: item._id,
                            type: type,
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
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Primero selecciona los tipos de contenido en la pestaña Configuración</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="seleccionados" className="mt-6">
            <SelectedItemsManager
              items={formData.config.selectedItems}
              onReorder={(newItems) =>
                setFormData({
                  ...formData,
                  config: { ...formData.config, selectedItems: newItems },
                })
              }
              onRemove={(itemId) =>
                setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    selectedItems: formData.config.selectedItems.filter(
                      (item) => item.id !== itemId
                    ),
                  },
                })
              }
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
