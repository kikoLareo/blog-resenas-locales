"use client";

import { useState, useEffect } from 'react';

// Minimal inline alert component
function InlineAlert({ message }: { message: string }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm" role="alert">
      {message}
    </div>
  );
}
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Save, Eye } from 'lucide-react';

import { FeaturedItemPreview } from './FeaturedItemPreview';

interface FeaturedItem {
  _id: string;
  title: string;
  type: 'review' | 'venue' | 'category' | 'collection' | 'guide';
  customTitle?: string;
  customDescription?: string;
  isActive: boolean;
  order: number;
  reviewRef?: { title: string; venue?: { title: string; slug: { current: string } } };
  venueRef?: { title: string; slug: { current: string } };
  categoryRef?: { title: string; slug: { current: string } };
  _createdAt: string;
  _updatedAt: string;
}

interface FeaturedItemFormProps {
  item?: FeaturedItem | null;
  onClose: () => void;
  onSave: (item: FeaturedItem) => void;
}

// API functions para obtener referencias
async function fetchReferences(type: 'review' | 'venue' | 'category' | 'collection' | 'guide') {
  try {
    const response = await fetch(`/api/admin/references?type=${type}`);
    if (response.ok) {
      return await response.json();
    }
    console.error('Error fetching references:', response.statusText);
    return [];
  } catch (error) {
    console.error('Error fetching references:', error);
    return [];
  }
}

export function FeaturedItemForm({ item, onClose, onSave }: FeaturedItemFormProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState<FeaturedItem | null>(null);
  const [references, setReferences] = useState<any[]>([]);
  const [loadingReferences, setLoadingReferences] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    type: 'review' | 'venue' | 'category' | 'collection' | 'guide';
    customTitle: string;
    customDescription: string;
    customCTA: string;
    isActive: boolean;
    order: number;
    selectedReference: string;
  }>({
    title: '',
    type: 'review',
    customTitle: '',
    customDescription: '',
    customCTA: '',
    isActive: true,
    order: 1,
    selectedReference: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        type: item.type,
        customTitle: item.customTitle || '',
        customDescription: item.customDescription || '',
        customCTA: '',
        isActive: item.isActive,
        order: item.order,
        selectedReference: getSelectedReference(item)
      });
    }
  }, [item]);

  // Cargar referencias cuando cambia el tipo
  useEffect(() => {
    if (['review', 'venue', 'category'].includes(formData.type)) {
      loadReferences(formData.type as 'review' | 'venue' | 'category');
    }
  }, [formData.type]);

  const loadReferences = async (type: 'review' | 'venue' | 'category') => {
    setLoadingReferences(true);
    setError(null);
    try {
      const data = await fetchReferences(type);
      setReferences(data);
    } catch (err) {
      setError('Error al cargar las referencias. Intenta de nuevo.');
      setReferences([]);
    } finally {
      setLoadingReferences(false);
    }
  };

  const getSelectedReference = (item: FeaturedItem): string => {
    if (item.reviewRef) return references.find((r: any) => r.title === item.reviewRef?.title)?._id || '';
    if (item.venueRef) return references.find((v: any) => v.title === item.venueRef?.title)?._id || '';
    if (item.categoryRef) return references.find((c: any) => c.title === item.categoryRef?.title)?._id || '';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Crear el objeto según el tipo
      let reference = {};
      if (formData.type === 'review') {
        const review = references.find((r: any) => r._id === formData.selectedReference);
        if (!review) throw new Error('Debes seleccionar una reseña válida.');
        reference = { reviewRef: review };
      } else if (formData.type === 'venue') {
        const venue = references.find((v: any) => v._id === formData.selectedReference);
        if (!venue) throw new Error('Debes seleccionar un local válido.');
        reference = { venueRef: venue };
      } else if (formData.type === 'category') {
        const category = references.find((c: any) => c._id === formData.selectedReference);
        if (!category) throw new Error('Debes seleccionar una categoría válida.');
        reference = { categoryRef: category };
      }

      const savedItem: FeaturedItem = {
        _id: item?._id || Date.now().toString(),
        title: formData.title,
        type: formData.type,
        customTitle: formData.customTitle,
        customDescription: formData.customDescription,
        isActive: formData.isActive,
        order: formData.order,
        _createdAt: item?._createdAt || new Date().toISOString(),
        _updatedAt: new Date().toISOString(),
        ...reference
      };

      onSave(savedItem);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el elemento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreview = () => {
    // Crear un item temporal para la vista previa
    let reference = {};
    if (formData.type === 'review') {
      const review = references.find((r: any) => r._id === formData.selectedReference);
      reference = { reviewRef: review };
    } else if (formData.type === 'venue') {
      const venue = references.find((v: any) => v._id === formData.selectedReference);
      reference = { venueRef: venue };
    } else if (formData.type === 'category') {
      const category = references.find((c: any) => c._id === formData.selectedReference);
      reference = { categoryRef: category };
    }

    const previewItem: FeaturedItem = {
      _id: 'preview',
      title: formData.title,
      type: formData.type,
      customTitle: formData.customTitle,
      customDescription: formData.customDescription,
      isActive: formData.isActive,
      order: formData.order,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      ...reference
    };

    setPreviewItem(previewItem);
    setShowPreview(true);
  };

  // If preview is open, keep the preview item in sync with form data so tests and UI update
  useEffect(() => {
    if (showPreview) {
      const previewItem: FeaturedItem = {
        _id: 'preview',
        title: formData.title,
        type: formData.type,
        customTitle: formData.customTitle,
        customDescription: formData.customDescription,
        isActive: formData.isActive,
        order: formData.order,
        _createdAt: new Date().toISOString(),
        _updatedAt: new Date().toISOString(),
      };
      setPreviewItem(previewItem);
    }
  }, [formData, showPreview]);

  const getReferenceOptions = () => {
    switch (formData.type) {
      case 'review':
        return references.map((review: any) => ({
          value: review._id,
          label: `${review.title} (${review.venue?.title || 'Sin local'})`
        }));
      case 'venue':
        return references.map((venue: any) => ({
          value: venue._id,
          label: venue.title
        }));
      case 'category':
        return references.map((category: any) => ({
          value: category._id,
          label: category.title
        }));
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>
            {item ? 'Editar Elemento Destacado' : 'Nuevo Elemento Destacado'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {error && <InlineAlert message={error} />}
          <form role="form" onSubmit={handleSubmit} className="space-y-6">
            {/* Título interno */}
            <div className="space-y-2">
              <Label htmlFor="title">Título Interno</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nombre para identificar en admin"
                required
              />
              <p className="text-sm text-gray-500">Solo para identificación en el panel admin</p>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type-trigger">Tipo de Contenido</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'review' | 'venue' | 'category' | 'collection' | 'guide') => setFormData(prev => ({ 
                  ...prev, 
                  type: value,
                  selectedReference: '' // Reset selection cuando cambia tipo
                }))}
              >
                <SelectTrigger id="type-trigger" aria-label="Tipo de Contenido">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="review">⭐ Reseña</SelectItem>
                  <SelectItem value="venue">🏪 Local/Restaurante</SelectItem>
                  <SelectItem value="category">🏷️ Categoría</SelectItem>
                  <SelectItem value="collection">📚 Colección</SelectItem>
                  <SelectItem value="guide">🗺️ Guía</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Referencia */}
            {['review', 'venue', 'category'].includes(formData.type) && (
              <div className="space-y-2">
                <Label htmlFor="reference-select">Seleccionar {formData.type === 'review' ? 'Reseña' : formData.type === 'venue' ? 'Local' : 'Categoría'}</Label>
                <Select
                  value={formData.selectedReference}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, selectedReference: value }))}
                  disabled={loadingReferences || submitting}
                >
                  <SelectTrigger
                    id="reference-select"
                    aria-label={
                      loadingReferences
                        ? 'Cargando referencias'
                        : `Seleccionar ${formData.type === 'review' ? 'Reseña' : formData.type === 'venue' ? 'Local' : 'Categoría'}`
                    }
                  >
                    <SelectValue placeholder={
                      loadingReferences
                        ? 'Cargando...'
                        : `Selecciona una ${formData.type === 'review' ? 'reseña' : formData.type === 'venue' ? 'local' : 'categoría'}`
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingReferences ? (
                      <div className="px-4 py-2 text-gray-500">Cargando...</div>
                    ) : getReferenceOptions().length === 0 ? (
                      <div className="px-4 py-2 text-gray-500">No hay opciones disponibles</div>
                    ) : (
                      getReferenceOptions().map((option: any) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Personalización */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Personalización del Carrusel</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customTitle">Título Personalizado (Opcional)</Label>
                  <Input
                    id="customTitle"
                    value={formData.customTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, customTitle: e.target.value }))}
                    placeholder="Título que aparecerá en el carrusel"
                  />
                  <p className="text-sm text-gray-500">Si se deja vacío, se usará el título original</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customDescription">Descripción Personalizada (Opcional)</Label>
                  <Textarea
                    id="customDescription"
                    value={formData.customDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, customDescription: e.target.value }))}
                    placeholder="Descripción que aparecerá en el carrusel"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">Máximo 200 caracteres. Si se deja vacía, se usará la descripción original</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customCTA">Texto del Botón (Opcional)</Label>
                  <Input
                    id="customCTA"
                    value={formData.customCTA}
                    onChange={(e) => setFormData(prev => ({ ...prev, customCTA: e.target.value }))}
                    placeholder="Ej: Ver reseña completa, Explorar categoría..."
                  />
                  <p className="text-sm text-gray-500">Si se deja vacío, se usará el texto por defecto según el tipo</p>
                </div>
              </div>
            </div>

            {/* Configuración */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Configuración</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Orden de Aparición</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                  />
                  <p className="text-sm text-gray-500">Número menor aparece primero</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Activo en carrusel</Label>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                Cancelar
              </Button>
              <Button type="button" variant="outline" onClick={handlePreview} disabled={submitting}>
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </Button>
              <Button type="submit" disabled={submitting}>
                <Save className="h-4 w-4 mr-2" />
                {submitting ? 'Guardando...' : item ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de vista previa */}
      {showPreview && previewItem && (
        <FeaturedItemPreview
          item={previewItem}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
