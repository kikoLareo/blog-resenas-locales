/**
 * ContentTypeSelector Component
 * Multi-selector para elegir tipos de contenido (venue, review, category, city)
 */

import { ContentType } from '@/types/homepage';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ContentTypeSelectorProps {
  selectedTypes: ContentType[];
  onChange: (types: ContentType[]) => void;
}

const CONTENT_TYPES: { value: ContentType; label: string; icon: string; description: string }[] = [
  {
    value: 'venue',
    label: 'Locales',
    icon: '🏪',
    description: 'Restaurantes, cafés, bares',
  },
  {
    value: 'review',
    label: 'Reseñas',
    icon: '📝',
    description: 'Reseñas individuales de locales',
  },
  {
    value: 'category',
    label: 'Categorías',
    icon: '🏷️',
    description: 'Tipos de cocina y categorías',
  },
  {
    value: 'city',
    label: 'Ciudades',
    icon: '🗺️',
    description: 'Ciudades con locales',
  },
];

export default function ContentTypeSelector({ selectedTypes, onChange }: ContentTypeSelectorProps) {
  const handleToggle = (type: ContentType) => {
    if (selectedTypes.includes(type)) {
      // Remover tipo
      onChange(selectedTypes.filter(t => t !== type));
    } else {
      // Añadir tipo
      onChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">Tipos de Contenido</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Selecciona uno o más tipos de contenido para esta sección
        </p>
      </div>

      {/* Lista de checkboxes */}
      <div className="space-y-3">
        {CONTENT_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type.value);
          
          return (
            <div
              key={type.value}
              className={`
                flex items-start space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer
                ${isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              onClick={() => handleToggle(type.value)}
            >
              <Checkbox
                id={`content-type-${type.value}`}
                checked={isSelected}
                onCheckedChange={() => handleToggle(type.value)}
                className="mt-0.5"
              />
              
              <div className="flex-1">
                <Label
                  htmlFor={`content-type-${type.value}`}
                  className="flex items-center gap-2 cursor-pointer font-medium"
                >
                  <span className="text-xl">{type.icon}</span>
                  {type.label}
                </Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {type.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badges de tipos seleccionados */}
      {selectedTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-sm font-medium">Seleccionados:</span>
          {selectedTypes.map((type) => {
            const typeInfo = CONTENT_TYPES.find(t => t.value === type);
            return (
              <Badge key={type} variant="secondary" className="gap-1">
                <span>{typeInfo?.icon}</span>
                {typeInfo?.label}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Advertencia si no hay tipos seleccionados */}
      {selectedTypes.length === 0 && (
        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <p className="text-sm text-yellow-800">
            ⚠️ Selecciona al menos un tipo de contenido
          </p>
        </div>
      )}
    </div>
  );
}
