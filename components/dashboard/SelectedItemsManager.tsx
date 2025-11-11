/**
 * SelectedItemsManager Component
 * Gestiona items seleccionados con drag & drop para reordenar
 */

'use client';

import { SelectedItem } from '@/types/homepage';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GripVertical, X } from 'lucide-react';
import Image from 'next/image';
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
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SelectedItemsManagerProps {
  items: SelectedItem[];
  onReorder: (items: SelectedItem[]) => void;
  onRemove: (itemId: string) => void;
}

// Componente individual sortable
function SortableItem({
  item,
  onRemove,
}: {
  item: SelectedItem;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'venue': return '🏪';
      case 'review': return '📝';
      case 'category': return '🏷️';
      case 'city': return '🗺️';
      default: return '📄';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'venue': return 'Local';
      case 'review': return 'Reseña';
      case 'category': return 'Categoría';
      case 'city': return 'Ciudad';
      default: return type;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-white border rounded-lg hover:border-primary/50 transition-colors group"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Imagen */}
      {item.imageUrl && (
        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-200">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs">{getTypeIcon(item.type)}</span>
          <p className="font-medium text-sm truncate">{item.title}</p>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
            {getTypeLabel(item.type)}
          </span>
          {(item.city || item.venue) && (
            <span className="text-xs text-muted-foreground truncate">
              {item.venue || item.city}
            </span>
          )}
        </div>
      </div>

      {/* Botón eliminar */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(item.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}

export default function SelectedItemsManager({
  items,
  onReorder,
  onRemove,
}: SelectedItemsManagerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      
      // Actualizar el campo order
      const updatedItems = reorderedItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      onReorder(updatedItems);
    }
  };

  if (items.length === 0) {
    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No hay elementos seleccionados
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Selecciona items de las listas superiores
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">
          Elementos Seleccionados ({items.length})
        </Label>
        <span className="text-xs text-muted-foreground">
          Arrastra para reordenar
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
