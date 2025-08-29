"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, ExternalLink, RefreshCw } from 'lucide-react';
import { FeaturedItemForm } from './FeaturedItemForm';
import { FeaturedItemPreview } from './FeaturedItemPreview';
import Link from 'next/link';

// API functions
async function fetchFeaturedItems() {
  try {
    const response = await fetch('/api/admin/featured-items');
    if (response.ok) {
      return await response.json();
    }
    console.error('Error fetching featured items:', response.statusText);
    return [];
  } catch (error) {
    console.error('Error fetching featured items:', error);
    return [];
  }
}

async function fetchStats() {
  try {
    const response = await fetch('/api/admin/featured-items?action=stats');
    if (response.ok) {
      return await response.json();
    }
    console.error('Error fetching stats:', response.statusText);
    return { total: 0, active: 0, inactive: 0, byType: [] };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { total: 0, active: 0, inactive: 0, byType: [] };
  }
}

async function createFeaturedItem(data: any) {
  try {
    const response = await fetch('/api/admin/featured-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      return await response.json();
    }
    console.error('Error creating featured item:', response.statusText);
    return null;
  } catch (error) {
    console.error('Error creating featured item:', error);
    return null;
  }
}

async function updateFeaturedItem(id: string, data: any) {
  try {
    const response = await fetch(`/api/admin/featured-items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      return await response.json();
    }
    console.error('Error updating featured item:', response.statusText);
    return null;
  } catch (error) {
    console.error('Error updating featured item:', error);
    return null;
  }
}

async function deleteFeaturedItem(id: string) {
  try {
    const response = await fetch(`/api/admin/featured-items/${id}`, {
      method: 'DELETE'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting featured item:', error);
    return false;
  }
}

async function toggleFeaturedItemStatus(id: string, isActive: boolean) {
  try {
    const response = await fetch(`/api/admin/featured-items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error toggling featured item status:', error);
    return false;
  }
}

async function updateItemsOrder(items: { _id: string; order: number }[]) {
  try {
    const response = await fetch('/api/admin/featured-items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error updating items order:', error);
    return false;
  }
}

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

export function FeaturedItemsManager() {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, byType: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FeaturedItem | null>(null);
  const [previewItem, setPreviewItem] = useState<FeaturedItem | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [itemsData, statsData] = await Promise.all([
      fetchFeaturedItems(),
      fetchStats()
    ]);
    
    setFeaturedItems(itemsData);
    setStats(statsData);
    setIsLoading(false);
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: FeaturedItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      const success = await deleteFeaturedItem(id);
      if (success) {
        await loadData();
      } else {
        alert('Error al eliminar el elemento');
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const success = await toggleFeaturedItemStatus(id, !currentStatus);
    if (success) {
      await loadData();
    } else {
      alert('Error al cambiar el estado');
    }
  };

  const handleSave = async (itemData: any) => {
    let success = false;
    
    if (editingItem) {
      const result = await updateFeaturedItem(editingItem._id, itemData);
      success = !!result;
    } else {
      const result = await createFeaturedItem(itemData);
      success = !!result;
    }
    
    if (success) {
      await loadData();
      setIsFormOpen(false);
      setEditingItem(null);
    } else {
      alert('Error al guardar el elemento');
    }
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = featuredItems.findIndex(item => item._id === draggedItem);
    const targetIndex = featuredItems.findIndex(item => item._id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newItems = [...featuredItems];
    const [draggedElement] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedElement);

    const updatedItems = newItems.map((item, index) => ({
      _id: item._id,
      order: index + 1
    }));

    const success = await updateItemsOrder(updatedItems);
    if (success) {
      await loadData();
    } else {
      alert('Error al reordenar elementos');
    }
    
    setDraggedItem(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'review': return '⭐';
      case 'venue': return '🏪';
      case 'category': return '🏷️';
      case 'collection': return '📚';
      case 'guide': return '🗺️';
      default: return '📄';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'review': return 'Reseña';
      case 'venue': return 'Local';
      case 'category': return 'Categoría';
      case 'collection': return 'Colección';
      case 'guide': return 'Guía';
      default: return 'Desconocido';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Elementos Destacados</h1>
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando elementos destacados...</p>
        </div>
      </div>
    );
  }

  const sortedItems = [...featuredItems].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Elementos Destacados</h1>
        <div className="flex space-x-3">
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Elemento
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <span className="text-2xl">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">elementos configurados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">visibles en carrusel</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            <span className="text-2xl">⏸️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">ocultos temporalmente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Carrusel</CardTitle>
            <span className="text-2xl">🎠</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{Math.min(stats.active, 5)}</div>
            <p className="text-xs text-muted-foreground">máximo 5 elementos</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de elementos */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Elementos</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No hay elementos destacados configurados</p>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Elemento
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedItems.map((item, index) => (
                <div
                  key={item._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item._id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item._id)}
                  className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                    draggedItem === item._id ? 'opacity-50' : ''
                  } ${item.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="cursor-move">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{getTypeIcon(item.type)}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{item.title}</h3>
                            <Badge variant={item.isActive ? 'default' : 'secondary'}>
                              {getTypeLabel(item.type)}
                            </Badge>
                            <Badge variant="outline">#{item.order}</Badge>
                          </div>
                          {item.customTitle && (
                            <p className="text-sm text-gray-600 mt-1">
                              Título personalizado: "{item.customTitle}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewItem(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(item._id, item.isActive)}
                      >
                        {item.isActive ? (
                          <EyeOff className="h-4 w-4 text-orange-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {isFormOpen && (
        <FeaturedItemForm
          item={editingItem}
          onClose={() => {
            setIsFormOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />
      )}

      {previewItem && (
        <FeaturedItemPreview
          item={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}
    </div>
  );
}
