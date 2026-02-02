"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
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
import type { HomepageSection } from '@/types/homepage';
import SectionConfigModal from '@/components/dashboard/SectionConfigModal';

// Componente sortable individual
interface SortableItemProps {
  section: HomepageSection;
  onToggle: (id: string) => void;
  onEdit: (section: HomepageSection) => void;
  onDelete: (id: string) => void;
}

function SortableItem({ section, onToggle, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'hero': return '🎯';
      case 'poster': return '📄';
      case 'poster-v2': return '📋';
      case 'banner': return '🖼️';
      case 'card-square': return '▪️';
      default: return '📄';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Section info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{getSectionIcon(section.sectionType)}</div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-50">{section.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {section.config.displayTitle || 'Sin título configurado'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {section.config.selectedItems?.length || 0} elementos
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle(section._id)}
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
            onClick={() => onEdit(section)}
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(section._id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>

        {/* Status badge */}
        <Badge variant={section.enabled ? "default" : "secondary"}>
          {section.enabled ? 'Activa' : 'Inactiva'}
        </Badge>
      </div>
    </div>
  );
}

export default function HomepageSectionsPage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedSection, setSelectedSection] = useState<HomepageSection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Cargar secciones desde API
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('/api/admin/homepage-sections');
        const data = await response.json();
        
        if (data.sections) {
          setSections(data.sections);
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  // Manejar drag & drop
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        
        const newSections = arrayMove(items, oldIndex, newIndex);
        
        const updatedSections = newSections.map((section, index) => ({
          ...section,
          order: index + 1
        }));

        setHasChanges(true);
        return updatedSections;
      });
    }
  }

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(section => 
      section._id === id ? { ...section, enabled: !section.enabled } : section
    ));
    setHasChanges(true);
  };

  const deleteSection = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta sección?')) {
      setSections(prev => prev.filter(section => section._id !== id));
      setHasChanges(true);
    }
  };

  const editSection = (section: HomepageSection) => {
    setSelectedSection(section);
    setIsModalOpen(true);
  };

  const addNewSection = () => {
    setSelectedSection(null);
    setIsModalOpen(true);
  };

  const handleSaveSection = (section: HomepageSection) => {
    if (section._id.startsWith('new-')) {
      // Nueva sección - usar POST
      createSection(section);
    } else {
      // Actualizar sección existente
      setSections(prev => prev.map(s => s._id === section._id ? section : s));
      setHasChanges(true);
    }
    
    setIsModalOpen(false);
  };

  const createSection = async (section: HomepageSection) => {
    try {
      const response = await fetch('/api/admin/homepage-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: section.title,
          sectionType: section.sectionType,
          config: section.config
        }),
      });

      if (response.ok) {
        const { section: newSection } = await response.json();
        setSections(prev => [...prev, newSection]);
      }
    } catch (error) {
      console.error('Error creating section:', error);
    }
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/homepage-sections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sections }),
      });

      if (response.ok) {
        setHasChanges(false);
        alert('Cambios guardados correctamente');
      } else {
        alert('Error al guardar los cambios');
      }
    } catch (error) {
      console.error('Error saving sections:', error);
      alert('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando secciones...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Secciones</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configura las secciones de la página principal
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={addNewSection}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Sección
          </Button>

          <Button
            onClick={saveChanges}
            disabled={!hasChanges || saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Tienes cambios sin guardar. No olvides guardar antes de salir.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Secciones Activas ({sections.filter(s => s.enabled).length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sections.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No hay secciones configuradas</p>
              <Button
                onClick={addNewSection}
                variant="outline"
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Sección
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections.map(s => s._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {sections.map((section) => (
                    <SortableItem
                      key={section._id}
                      section={section}
                      onToggle={toggleSection}
                      onEdit={editSection}
                      onDelete={deleteSection}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Modal de configuración */}
      <SectionConfigModal
        section={selectedSection}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSection}
      />
    </div>
  );
}
