"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ExternalLink, Star, MapPin, Tag } from 'lucide-react';
import Image from 'next/image';

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
}

interface PreviewData {
  id: string;
  isActive: boolean;
  order: number;
  title: string;
  description: string;
  location: string;
  score: number | null;
  reviewCount: number | null;
  category: string;
  url: string;
  image: string;
  badge: string;
}

interface FeaturedItemPreviewProps {
  item: FeaturedItem;
  onClose: () => void;
}

export function FeaturedItemPreview({ item, onClose }: FeaturedItemPreviewProps) {
  // Simular datos como aparecerían en el HeroSection
  const getPreviewData = (): PreviewData => {
    const baseData = {
      id: item._id,
      isActive: item.isActive,
      order: item.order
    };

    switch (item.type) {
      case 'review':
        return {
          ...baseData,
          title: item.customTitle || item.reviewRef?.title || 'Título de Reseña',
          description: item.customDescription || 'Descripción de la reseña...',
          location: item.reviewRef?.venue?.title || 'Local',
          score: 4.5,
          reviewCount: 24,
          category: 'Restaurante',
          url: `/blog/${item.reviewRef?.venue?.slug?.current || 'ejemplo'}`,
          image: '/placeholder-restaurant.jpg',
          badge: 'Reseña Destacada'
        };
      case 'venue':
        return {
          ...baseData,
          title: item.customTitle || item.venueRef?.title || 'Nombre del Local',
          description: item.customDescription || 'Descripción del local...',
          location: 'Ubicación del local',
          score: 4.2,
          reviewCount: 18,
          category: 'Local',
          url: `/locales/${item.venueRef?.slug?.current || 'ejemplo'}`,
          image: '/placeholder-venue.jpg',
          badge: 'Local Destacado'
        };
      case 'category':
        return {
          ...baseData,
          title: item.customTitle || item.categoryRef?.title || 'Nombre de Categoría',
          description: item.customDescription || 'Explora los mejores lugares de esta categoría...',
          location: 'Varios locales',
          score: null,
          reviewCount: 45,
          category: 'Categoría',
          url: `/categorias/${item.categoryRef?.slug?.current || 'ejemplo'}`,
          image: '/placeholder-category.jpg',
          badge: 'Categoría'
        };
      case 'collection':
        return {
          ...baseData,
          title: item.customTitle || 'Colección Especial',
          description: item.customDescription || 'Una selección curada de los mejores lugares...',
          location: 'Varios locales',
          score: null,
          reviewCount: 12,
          category: 'Colección',
          url: '/colecciones/ejemplo',
          image: '/placeholder-collection.jpg',
          badge: 'Colección'
        };
      case 'guide':
        return {
          ...baseData,
          title: item.customTitle || 'Guía Gastronómica',
          description: item.customDescription || 'Todo lo que necesitas saber sobre...',
          location: 'Guía completa',
          score: null,
          reviewCount: null,
          category: 'Guía',
          url: '/guias/ejemplo',
          image: '/placeholder-guide.jpg',
          badge: 'Guía'
        };
      default:
        return {
          ...baseData,
          title: item.customTitle || 'Elemento Destacado',
          description: item.customDescription || 'Descripción del elemento destacado...',
          location: 'Ubicación',
          score: null,
          reviewCount: null,
          category: 'Elemento',
          url: '#',
          image: '/placeholder-default.jpg',
          badge: 'Destacado'
        };
    }
  };

  const previewData = getPreviewData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-testid="featured-item-preview">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Vista Previa - Como aparecerá en el carrusel</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="cerrar vista previa">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {/* Info del item */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Información del Item</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {item.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Título interno:</span> {item.title}
              </div>
              <div>
                <span className="font-medium">Orden:</span> {item.order}
              </div>
              <div>
                <span className="font-medium">Tipo:</span> {item.type}
              </div>
              <div>
                <span className="font-medium">ID:</span> {item._id}
              </div>
            </div>
          </div>

          {/* Vista previa del carousel */}
          <div className="mb-4">
            <h3 className="font-semibold mb-3">Vista en Carrusel Hero:</h3>
            
            {/* Simulación del hero carousel */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden">
              {/* Imagen de fondo simulada */}
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative z-10 p-8 md:p-12 text-white">
                <div className="max-w-4xl mx-auto">
                  {/* Badge */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm mb-4">
                    {item.type === 'review' && <Star className="h-3 w-3 mr-1" />}
                    {item.type === 'venue' && <MapPin className="h-3 w-3 mr-1" />}
                    {item.type === 'category' && <Tag className="h-3 w-3 mr-1" />}
                    {previewData.badge}
                  </div>

                  {/* Título */}
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                    {previewData.title}
                  </h1>

                  {/* Descripción */}
                  <p className="text-lg md:text-xl mb-6 text-gray-100 max-w-2xl">
                    {previewData.description}
                  </p>

                  {/* Info adicional */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{previewData.location}</span>
                    </div>
                    
                    {previewData.score && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        <span className="text-sm font-medium">{previewData.score}</span>
                      </div>
                    )}
                    
                    {previewData.reviewCount && (
                      <div className="text-sm">
                        {previewData.reviewCount} {item.type === 'review' ? 'valoraciones' : item.type === 'category' ? 'lugares' : 'elementos'}
                      </div>
                    )}
                  </div>

                  {/* Botón CTA */}
                  <div className="flex flex-wrap gap-3">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      {item.type === 'review' && 'Ver Reseña Completa'}
                      {item.type === 'venue' && 'Explorar Local'}
                      {item.type === 'category' && 'Ver Categoría'}
                      {item.type === 'collection' && 'Ver Colección'}
                      {item.type === 'guide' && 'Leer Guía'}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notas técnicas */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Notas técnicas:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• El título y descripción mostrados son {item.customTitle || item.customDescription ? 'personalizados' : 'automáticos del contenido original'}</li>
              <li>• La imagen se selecciona automáticamente del contenido referenciado</li>
              <li>• Los colores y animaciones siguen el diseño actual del Hero</li>
              <li>• URL de destino: <code className="bg-blue-100 px-1 rounded">{previewData.url}</code></li>
            </ul>
          </div>

          {/* Acciones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button onClick={() => window.open(previewData.url, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir en Nueva Pestaña
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
