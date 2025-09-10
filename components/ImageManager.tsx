"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminSanityClient } from "@/lib/admin-sanity";
import Image from "next/image";

interface ImageAsset {
  _id: string;
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface ImageManagerProps {
  entityId: string;
  entityType: 'venue' | 'review' | 'city' | 'category' | 'post';
  currentImages?: ImageAsset[];
  onImagesChange: (images: ImageAsset[]) => void;
  maxImages?: number;
  title?: string;
}

export default function ImageManager({
  entityId,
  entityType,
  currentImages = [],
  onImagesChange,
  maxImages = 10,
  title = "Gestionar imágenes"
}: ImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const newImages: ImageAsset[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          alert(`El archivo ${file.name} no es una imagen válida`);
          continue;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`El archivo ${file.name} es demasiado grande (máximo 5MB)`);
          continue;
        }

        // Crear FormData para subir a Sanity
        const formData = new FormData();
        formData.append('file', file);

        // Subir imagen a Sanity
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error al subir ${file.name}`);
        }

        const result = await response.json();
        
        newImages.push({
          _id: result._id,
          url: result.url,
          alt: file.name.replace(/\.[^/.]+$/, ""), // Usar nombre del archivo como alt
          caption: "",
        });
      }

      // Actualizar imágenes
      const updatedImages = [...currentImages, ...newImages];
      onImagesChange(updatedImages);

    } catch (error) {
      alert('Error al subir las imágenes. Por favor, inténtalo de nuevo.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (imageId: string) => {
    const updatedImages = currentImages.filter(img => img._id !== imageId);
    onImagesChange(updatedImages);
  };

  const handleUpdateImage = (imageId: string, updates: Partial<ImageAsset>) => {
    const updatedImages = currentImages.map(img => 
      img._id === imageId ? { ...img, ...updates } : img
    );
    onImagesChange(updatedImages);
    setEditingImage(null);
  };

  const handleReorderImages = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...currentImages];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    onImagesChange(updatedImages);
  };

  const setFeaturedImage = (imageId: string) => {
    const updatedImages = currentImages.map((img, index) => ({
      ...img,
      featured: index === 0 ? false : (img as any).featured || false,
    }));
    
    // Mover la imagen seleccionada al principio
    const selectedImage = updatedImages.find(img => img._id === imageId);
    const otherImages = updatedImages.filter(img => img._id !== imageId);
    
    if (selectedImage) {
      onImagesChange([{ ...selectedImage, featured: true }, ...otherImages]);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="text-sm text-gray-500">
            {currentImages.length} / {maxImages} imágenes
          </div>
        </div>

        {/* Subir imágenes */}
        <div className="mb-6">
          <Label htmlFor="image-upload">Añadir imágenes</Label>
          <div className="mt-2 flex items-center space-x-4">
            <Input
              ref={fileInputRef}
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={uploading || currentImages.length >= maxImages}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || currentImages.length >= maxImages}
            >
              {uploading ? "Subiendo..." : "Seleccionar"}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Formatos: JPG, PNG, WebP. Máximo 5MB por imagen.
          </p>
        </div>

        {/* Lista de imágenes */}
        {currentImages.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Imágenes actuales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentImages.map((image, index) => (
                <div key={image._id} className="relative group">
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.alt || "Imagen"}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Overlay con acciones */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditingImage(image._id)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveImage(image._id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>

                    {/* Indicador de imagen destacada */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Destacada
                      </div>
                    )}

                    {/* Botones de reordenar */}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {index > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-6 h-6 p-0"
                          onClick={() => handleReorderImages(index, index - 1)}
                        >
                          ↑
                        </Button>
                      )}
                      {index < currentImages.length - 1 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-6 h-6 p-0"
                          onClick={() => handleReorderImages(index, index + 1)}
                        >
                          ↓
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Información de la imagen */}
                  <div className="mt-2">
                    <p className="text-sm font-medium truncate">
                      {image.alt || "Sin título"}
                    </p>
                    {image.caption && (
                      <p className="text-xs text-gray-500 truncate">
                        {image.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de edición */}
        {editingImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h4 className="text-lg font-semibold mb-4">Editar imagen</h4>
              
              {(() => {
                const image = currentImages.find(img => img._id === editingImage);
                if (!image) return null;

                return (
                  <form role="form" onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleUpdateImage(editingImage, {
                      alt: formData.get('alt') as string,
                      caption: formData.get('caption') as string,
                    });
                  }}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="alt">Texto alternativo</Label>
                        <Input
                          id="alt"
                          name="alt"
                          defaultValue={image.alt}
                          placeholder="Descripción de la imagen"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="caption">Pie de foto</Label>
                        <Textarea
                          id="caption"
                          name="caption"
                          defaultValue={image.caption}
                          placeholder="Pie de foto opcional"
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingImage(null)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          Guardar
                        </Button>
                      </div>
                    </div>
                  </form>
                );
              })()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

