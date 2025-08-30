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
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching featured items:', response.statusText);
    }
    return [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching featured items:', error);
    }
    return [];
  }
}

async function toggleFeaturedItemStatus(id: string, isActive: boolean) {
  try {
    const response = await fetch(`/api/admin/featured-items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });
    if (response.ok) {
      return await response.json();
    }
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error toggling featured item status:', response.statusText);
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error toggling featured item status:', error);
    }
    return null;
  }
}

async function createFeaturedItem(item: any) {
  try {
    const response = await fetch('/api/admin/featured-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (response.ok) {
      return await response.json();
    }
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error creating featured item:', response.statusText);
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error creating featured item:', error);
    }
    return null;
  }
}

async function updateFeaturedItem(id: string, item: any) {
  try {
    const response = await fetch(`/api/admin/featured-items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (response.ok) {
      return await response.json();
    }
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error updating featured item:', response.statusText);
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error updating featured item:', error);
    }
    return null;
  }
}

async function deleteFeaturedItem(id: string) {
  try {
    const response = await fetch(`/api/admin/featured-items/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      return await response.json();
    }
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error deleting featured item:', response.statusText);
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error deleting featured item:', error);
    }
    return null;
  }
}

async function reorderFeaturedItems(items: any[]) {
  try {
    const response = await fetch('/api/admin/featured-items/reorder', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });
    if (response.ok) {
      return await response.json();
    }
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error reordering featured items:', response.statusText);
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error reordering featured items:', error);
    }
    return null;
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

function FeaturedItemsManager() {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, byType: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FeaturedItem | null>(null);
  const [previewItem, setPreviewItem] = useState<FeaturedItem | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Load featured items
  useEffect(() => {
    const loadData = async () => {
      const [itemsData] = await Promise.all([
        fetchFeaturedItems(),
      ]);
      setFeaturedItems(itemsData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleSave = async (item: FeaturedItem) => {
    if (editingItem) {
      const updated = await updateFeaturedItem(editingItem._id, item);
      if (updated) {
        setFeaturedItems(prev => 
          prev.map(i => i._id === editingItem._id ? updated : i)
        );
        setEditingItem(null);
        setIsFormOpen(false);
      }
    } else {
      const created = await createFeaturedItem(item);
      if (created) {
        setFeaturedItems(prev => [...prev, created]);
        setIsFormOpen(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      const result = await deleteFeaturedItem(id);
      if (result) {
        setFeaturedItems(prev => prev.filter(item => item._id !== id));
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleFeaturedItemStatus(id, !currentStatus);
    if (result) {
      setFeaturedItems(prev => 
        prev.map(item => 
          item._id === id ? { ...item, isActive: !currentStatus } : item
        )
      );
    }
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = featuredItems.findIndex(item => item._id === draggedItem);
    const targetIndex = featuredItems.findIndex(item => item._id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }

    const newItems = [...featuredItems];
    const [draggedElement] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedElement);

    // Update order property
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setFeaturedItems(updatedItems);
    setDraggedItem(null);

    // Update order in backend
    await reorderFeaturedItems(updatedItems.map(item => ({
      _id: item._id,
      order: item.order
    })));
  };

  const openEditForm = (item: FeaturedItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingItem(null);
    setIsFormOpen(false);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      review: 'bg-blue-100 text-blue-800',
      venue: 'bg-green-100 text-green-800',
      category: 'bg-purple-100 text-purple-800',
      collection: 'bg-orange-100 text-orange-800',
      guide: 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getItemLink = (item: FeaturedItem) => {
    switch (item.type) {
      case 'review':
        if (item.reviewRef?.venue?.slug?.current) {
          return `/${item.reviewRef.venue.slug.current}`;
        }
        break;
      case 'venue':
        if (item.venueRef?.slug?.current) {
          return `/${item.venueRef.slug.current}`;
        }
        break;
      case 'category':
        if (item.categoryRef?.slug?.current) {
          return `/categorias/${item.categoryRef.slug.current}`;
        }
        break;
    }
    return '#';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Cargando elementos destacados...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Elementos Destacados</h2>
          <p className="text-gray-600">Administra los elementos que aparecen en el carousel principal</p>
        </div>
        <Button onClick={openCreateForm} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Elemento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {featuredItems.filter(item => item.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {featuredItems.filter(item => !item.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reseñas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {featuredItems.filter(item => item.type === 'review').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Elementos Destacados</CardTitle>
        </CardHeader>
        <CardContent>
          {featuredItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay elementos destacados configurados</p>
              <Button onClick={openCreateForm} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Crear primer elemento
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {featuredItems
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div
                    key={item._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item._id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item._id)}
                    className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                      draggedItem === item._id ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {item.customTitle || item.title}
                            </h3>
                            <Badge className={getTypeColor(item.type)}>
                              {item.type}
                            </Badge>
                            <Badge variant={item.isActive ? 'default' : 'secondary'}>
                              {item.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.customDescription || 'Sin descripción personalizada'}
                          </p>
                          {item.type === 'review' && item.reviewRef && (
                            <p className="text-xs text-gray-500">
                              Reseña: {item.reviewRef.title}
                              {item.reviewRef.venue && ` • Venue: ${item.reviewRef.venue.title}`}
                            </p>
                          )}
                          {item.type === 'venue' && item.venueRef && (
                            <p className="text-xs text-gray-500">
                              Venue: {item.venueRef.title}
                            </p>
                          )}
                          {item.type === 'category' && item.categoryRef && (
                            <p className="text-xs text-gray-500">
                              Categoría: {item.categoryRef.title}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewItem(item)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {getItemLink(item) !== '#' && (
                          <Link href={getItemLink(item)} target="_blank">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(item._id, item.isActive)}
                        >
                          {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditForm(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      {isFormOpen && (
        <FeaturedItemForm
          item={editingItem}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {/* Preview Modal */}
      {previewItem && (
        <FeaturedItemPreview
          item={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}
    </div>
  );
}

export default FeaturedItemsManager;
