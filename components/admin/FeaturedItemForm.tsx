"use client";


import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { X, Save, Eye, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

import { FeaturedItemPreview } from './FeaturedItemPreview';
import { ErrorBoundary } from '@/components/ui/error-boundary';

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

// Minimal inline alert component
function InlineAlert({ message }: { message: string }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm" role="alert">
      {message}
    </div>
  );
}

// API functions para obtener referencias con mejor manejo de errores
async function fetchReferences(type: 'review' | 'venue' | 'category' | 'collection' | 'guide', signal?: AbortSignal) {
  const TIMEOUT_MS = 10000; // 10 second timeout
  
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Tiempo de espera agotado. Verifica tu conexión a internet.'));
      }, TIMEOUT_MS);
      
      // Clear timeout if signal is aborted
      signal?.addEventListener('abort', () => {
        clearTimeout(timeoutId);
      });
    });

    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(`/api/admin/references?type=${type}`, { 
        signal,
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      timeoutPromise
    ]) as Response;

    if (!response.ok) {
      const errorMessage = response.status === 404 
        ? `No se encontraron ${type === 'review' ? 'reseñas' : type === 'venue' ? 'locales' : 'categorías'} disponibles`
        : response.status >= 500 
        ? 'Error del servidor. Inténtalo de nuevo más tarde.'
        : `Error ${response.status}: ${response.statusText}`;
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return { data: Array.isArray(data) ? data : [], error: null };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { data: [], error: null }; // Don't treat aborted requests as errors
    }
    console.error('Error fetching references:', error);
    
    // More specific error messages
    let errorMessage = 'Error desconocido al cargar referencias';
    if (error instanceof Error) {
      if (error.message.includes('Tiempo de espera')) {
        errorMessage = error.message;
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Error de conexión. Verifica tu internet e inténtalo de nuevo.';
      } else if (error.message.includes('No se encontraron')) {
        errorMessage = error.message;
      } else {
        errorMessage = error.message;
      }
    }
    
    return { data: [], error: errorMessage };
  }
}

export function FeaturedItemForm({ item, onClose, onSave }: FeaturedItemFormProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState<FeaturedItem | null>(null);
  const [references, setReferences] = useState<any[]>([]);
  const [loadingReferences, setLoadingReferences] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const typeChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentRequestTypeRef = useRef<string>(''); // Track current request type to prevent race conditions
  const isMountedRef = useRef(true); // Track component mounting state
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

  // Cleanup function para cancelar requests pendientes y timeouts
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Clear any pending timeouts
      if (typeChangeTimeoutRef.current) {
        clearTimeout(typeChangeTimeoutRef.current);
      }
      
      // Clear current request type
      currentRequestTypeRef.current = '';
    };
  }, []);

  const getSelectedReference = useCallback((item: FeaturedItem): string => {
    if (item.reviewRef) return references.find((r: any) => r.title === item.reviewRef?.title)?._id || '';
    if (item.venueRef) return references.find((v: any) => v.title === item.venueRef?.title)?._id || '';
    if (item.categoryRef) return references.find((c: any) => c.title === item.categoryRef?.title)?._id || '';
    return '';
  }, [references]);

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
      // Clear any previous errors when loading a new item
      setApiError(null);
      setValidationErrors({});
    }
  }, [item, getSelectedReference]);

  const loadReferences = useCallback(async (type: 'review' | 'venue' | 'category') => {
    // Don't proceed if component is unmounted
    if (!isMountedRef.current) {
      return;
    }
    
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    // Track this request type to prevent race conditions
    currentRequestTypeRef.current = type;
    
    setLoadingReferences(true);
    setApiError(null);
    
    try {
      const { data, error } = await fetchReferences(type, abortControllerRef.current.signal);
      
      // Only update state if this is still the current request and component is mounted
      if (
        isMountedRef.current && 
        currentRequestTypeRef.current === type && 
        !abortControllerRef.current.signal.aborted
      ) {
        setReferences(data);
        setApiError(error);
        setLoadingReferences(false);
      }
    } catch (error) {
      // Only update error state if this is still the current request and component is mounted
      if (
        isMountedRef.current && 
        currentRequestTypeRef.current === type && 
        !abortControllerRef.current.signal.aborted
      ) {
        console.error('Unexpected error in loadReferences:', error);
        setApiError(error instanceof Error ? error.message : 'Error inesperado al cargar referencias');
        setLoadingReferences(false);
      }
    }
  }, []);

  // Cargar referencias cuando cambia el tipo (with improved debouncing and error handling)
  useEffect(() => {
    if (!isMountedRef.current) {
      return;
    }
    
    if (['review', 'venue', 'category'].includes(formData.type)) {
      // Clear previous timeout
      if (typeChangeTimeoutRef.current) {
        clearTimeout(typeChangeTimeoutRef.current);
      }
      
      // Cancel any ongoing request from previous type
      if (abortControllerRef.current && currentRequestTypeRef.current !== formData.type) {
        abortControllerRef.current.abort();
      }
      
      // Clear previous API error when type changes
      setApiError(null);
      
      // Debounce type changes to prevent rapid API calls
      typeChangeTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          loadReferences(formData.type as 'review' | 'venue' | 'category');
        }
      }, 300);
    } else {
      // Clear references for types that don't need them
      setReferences([]);
      setApiError(null);
      setLoadingReferences(false);
      currentRequestTypeRef.current = '';
      
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, [formData.type, loadReferences]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Validate title
    if (!formData.title.trim()) {
      errors.title = 'El título interno es requerido';
    }
    
    // Validate reference selection for types that require it
    if (['review', 'venue', 'category'].includes(formData.type) && !formData.selectedReference) {
      const typeName = formData.type === 'review' ? 'reseña' : 
                      formData.type === 'venue' ? 'local' : 'categoría';
      errors.selectedReference = `Debe seleccionar una ${typeName}`;
    }
    
    // Validate order
    if (formData.order < 1) {
      errors.order = 'El orden debe ser mayor a 0';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't proceed if component is unmounted or already submitting
    if (!isMountedRef.current || isSubmitting) {
      return;
    }
    
    // Clear previous validation errors
    setValidationErrors({});
    setApiError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Crear el objeto según el tipo
      let reference = {};
      if (formData.type === 'review') {
        const review = references.find((r: any) => r._id === formData.selectedReference);
        if (!review && ['review', 'venue', 'category'].includes(formData.type)) {
          throw new Error('La referencia seleccionada no es válida. Por favor, selecciona otra opción.');
        }
        reference = { reviewRef: review };
      } else if (formData.type === 'venue') {
        const venue = references.find((v: any) => v._id === formData.selectedReference);
        if (!venue && ['review', 'venue', 'category'].includes(formData.type)) {
          throw new Error('La referencia seleccionada no es válida. Por favor, selecciona otra opción.');
        }
        reference = { venueRef: venue };
      } else if (formData.type === 'category') {
        const category = references.find((c: any) => c._id === formData.selectedReference);
        if (!category && ['review', 'venue', 'category'].includes(formData.type)) {
          throw new Error('La referencia seleccionada no es válida. Por favor, selecciona otra opción.');
        }
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

      // Only proceed if component is still mounted
      if (isMountedRef.current) {
        await onSave(savedItem);
      }
    } catch (error) {
      // Only update error state if component is still mounted
      if (isMountedRef.current) {
        console.error('Error saving featured item:', error);
        let errorMessage = 'Error al guardar el elemento destacado';
        
        if (error instanceof Error) {
          if (error.message.includes('referencia seleccionada')) {
            errorMessage = error.message;
          } else if (error.message.includes('Network')) {
            errorMessage = 'Error de conexión. Verifica tu internet e inténtalo de nuevo.';
          } else if (error.message.includes('timeout') || error.message.includes('Tiempo de espera')) {
            errorMessage = 'La operación tardó demasiado. Inténtalo de nuevo.';
          } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            errorMessage = 'No tienes permisos para realizar esta acción. Inicia sesión de nuevo.';
          } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
            errorMessage = 'No tienes permisos suficientes para realizar esta acción.';
          } else if (error.message.includes('500')) {
            errorMessage = 'Error del servidor. Inténtalo de nuevo más tarde.';
          } else {
            errorMessage = error.message;
          }
        }
        
        setApiError(errorMessage);
      }
    } finally {
      // Only update loading state if component is still mounted
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const handleRetryLoadReferences = () => {
    if (!isMountedRef.current) {
      return;
    }
    
    // Clear any existing error state
    setApiError(null);
    
    if (['review', 'venue', 'category'].includes(formData.type)) {
      loadReferences(formData.type as 'review' | 'venue' | 'category');
    }
  };

  const clearFieldError = (fieldName: string) => {
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    
    // Also clear API errors when user starts interacting with the form
    if (apiError && fieldName === 'title') {
      setApiError(null);
    }
  };

  const handlePreview = () => {
    // Validate form before showing preview
    if (!validateForm()) {
      return;
    }

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
    <ErrorBoundary>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>
            {item ? 'Editar Elemento Destacado' : 'Nuevo Elemento Destacado'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="cerrar formulario">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {/* API Error Alert */}
          {apiError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{apiError}</span>
                {!loadingReferences && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetryLoadReferences}
                    className="ml-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Reintentar
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título interno */}
            <div className="space-y-2">
              <Label htmlFor="title">Título Interno</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, title: e.target.value }));
                  clearFieldError('title');
                }}
                placeholder="Nombre para identificar en admin"
                required
                aria-required="true"
                className={validationErrors.title ? 'border-destructive' : ''}
              />
              {validationErrors.title && (
                <p className="text-sm text-destructive">{validationErrors.title}</p>
              )}
              <p className="text-sm text-gray-500">Solo para identificación en el panel admin</p>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Contenido</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'review' | 'venue' | 'category' | 'collection' | 'guide') => {
                  setFormData(prev => ({ 
                    ...prev, 
                    type: value,
                    selectedReference: '' // Reset selection cuando cambia tipo
                  }));
                  clearFieldError('selectedReference');
                  setApiError(null); // Clear any previous API errors
                }}
                disabled={loadingReferences}
              >
                <SelectTrigger id="type" aria-required="true">
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
                <Label>Seleccionar {formData.type === 'review' ? 'Reseña' : formData.type === 'venue' ? 'Local' : 'Categoría'}</Label>
                <Select 
                  value={formData.selectedReference} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, selectedReference: value }));
                    clearFieldError('selectedReference');
                  }}
                  disabled={loadingReferences}
                >
                  <SelectTrigger className={validationErrors.selectedReference ? 'border-destructive' : ''}>
                    <SelectValue placeholder={
                      loadingReferences 
                        ? (
                          <div className="flex items-center">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Cargando...
                          </div>
                        )
                        : `Selecciona una ${formData.type === 'review' ? 'reseña' : formData.type === 'venue' ? 'local' : 'categoría'}`
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {!loadingReferences && getReferenceOptions().length === 0 && !apiError && (
                      <SelectItem value="_empty" disabled>
                        No hay {formData.type === 'review' ? 'reseñas' : formData.type === 'venue' ? 'locales' : 'categorías'} disponibles
                      </SelectItem>
                    )}
                    {getReferenceOptions().map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.selectedReference && (
                  <p className="text-sm text-destructive">{validationErrors.selectedReference}</p>
                )}
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }));
                      clearFieldError('order');
                    }}
                    className={validationErrors.order ? 'border-destructive' : ''}
                  />
                  {validationErrors.order && (
                    <p className="text-sm text-destructive">{validationErrors.order}</p>
                  )}
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
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePreview}
                disabled={isSubmitting || loadingReferences}
              >
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || loadingReferences}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {item ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {item ? 'Actualizar' : 'Crear'}
                  </>
                )}
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
    </ErrorBoundary>
  );
}
