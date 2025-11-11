"use client";
import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  X, 
  Image as ImageIcon,
  Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string, alt?: string, caption?: string) => void;
  className?: string;
  multiple?: boolean;
}

interface UploadedImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
  file: File;
}

export default function ImageUploader({ onImageUploaded, className, multiple = false }: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFiles = useCallback(async (files: FileList) => {
    setUploading(true);
    
    const newImages: UploadedImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} no es una imagen válida`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} es muy grande. Máximo 5MB permitido`);
        continue;
      }

      try {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        
        // Create image object
        const imageObj: UploadedImage = {
          id: Math.random().toString(36).substr(2, 9),
          url: previewUrl,
          alt: '',
          caption: '',
          file
        };

        newImages.push(imageObj);

        // If single mode, immediately call callback
        if (!multiple) {
          onImageUploaded(previewUrl, '', '');
        }
      } catch (error) {
        alert(`Error procesando ${file.name}`);
      }
    }

    setImages(prev => multiple ? [...prev, ...newImages] : newImages);
    setUploading(false);
  }, [multiple, onImageUploaded]);

  // Handle drag and drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  // Handle file input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  // Remove image
  const removeImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      // Cleanup object URL
      const toRemove = prev.find(img => img.id === id);
      if (toRemove?.url.startsWith('blob:')) {
        URL.revokeObjectURL(toRemove.url);
      }
      return updated;
    });
  };

  // Update image metadata
  const updateImageMeta = (id: string, field: 'alt' | 'caption', value: string) => {
    setImages(prev => prev.map(img => 
      img.id === id 
        ? { ...img, [field]: value }
        : img
    ));
  };

  // Simulate upload to Sanity (placeholder for real implementation)
  const uploadToSanity = async (image: UploadedImage) => {
    // TODO: Implement actual Sanity upload
    // This would use adminSanityWriteClient.assets.upload()
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock Sanity URL
    return {
      url: `https://cdn.sanity.io/images/project/${image.id}.jpg`,
      alt: image.alt,
      caption: image.caption
    };
  };

  // Finalize upload
  const finalizeUploads = async () => {
    setUploading(true);
    
    try {
      for (const image of images) {
        const uploaded = await uploadToSanity(image);
        onImageUploaded(uploaded.url, uploaded.alt, uploaded.caption);
      }
      
      // Clear images after successful upload
      setImages([]);
    } catch (error) {
      alert('Error subiendo imágenes');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-4">
        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300",
            uploading ? "pointer-events-none opacity-50" : "hover:border-gray-400"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          
          <div className="flex flex-col items-center space-y-4">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            )}
            
            <div>
              <Label
                htmlFor="image-upload"
                className="cursor-pointer text-sm text-gray-600"
              >
                {uploading ? 'Procesando imágenes...' : (
                  <>
                    <span className="text-blue-600 underline">
                      Haz clic para seleccionar
                    </span>{' '}
                    o arrastra {multiple ? 'imágenes' : 'una imagen'} aquí
                  </>
                )}
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WEBP hasta 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Image Preview and Metadata */}
        {images.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              Imágenes seleccionadas ({images.length})
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="p-4">
                  <div className="flex space-x-4">
                    {/* Image Preview */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={image.url}
                        alt={image.alt || 'Preview'}
                        fill
                        className="object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Metadata Form */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label className="text-sm">Texto alternativo (ALT) *</Label>
                        <Input
                          placeholder="Describe la imagen para accesibilidad"
                          value={image.alt}
                          onChange={(e) => updateImageMeta(image.id, 'alt', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Pie de foto (opcional)</Label>
                        <Input
                          placeholder="Descripción o créditos"
                          value={image.caption}
                          onChange={(e) => updateImageMeta(image.id, 'caption', e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div className="text-xs text-gray-500">
                        Archivo: {image.file.name} ({Math.round(image.file.size / 1024)}KB)
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Upload Button */}
            <div className="flex justify-end">
              <Button 
                onClick={finalizeUploads}
                disabled={uploading || images.some(img => !img.alt)}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Subir {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
                  </>
                )}
              </Button>
            </div>

            {images.some(img => !img.alt) && (
              <p className="text-xs text-amber-600">
                * Todas las imágenes necesitan texto alternativo antes de subir
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}