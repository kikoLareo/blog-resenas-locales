'use client';

import React from 'react';
import { X, Check } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface TagChip {
  id: string;
  label: string;
  value: string;
  count?: number;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

interface TagChipsProps {
  chips: TagChip[];
  selectedChips?: string[];
  onChipToggle?: (chipId: string) => void;
  onChipRemove?: (chipId: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filter' | 'removable';
  multiSelect?: boolean;
  showCount?: boolean;
}

export const TagChips: React.FC<TagChipsProps> = ({
  chips,
  selectedChips = [],
  onChipToggle,
  onChipRemove,
  className,
  size = 'md',
  variant = 'default',
  multiSelect = true,
  showCount = false,
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const getChipClasses = (chip: TagChip, isSelected: boolean) => {
    const baseClasses = cn(
      "inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200",
      sizeClasses[size]
    );

    if (variant === 'removable') {
      return cn(
        baseClasses,
        "border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
      );
    }

    if (variant === 'filter') {
      return cn(
        baseClasses,
        isSelected
          ? "border border-primary-500 bg-primary-50 text-primary-700 hover:bg-primary-100"
          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
      );
    }

    // Default variant with colors
    const colorClasses = {
      default: isSelected
        ? "bg-gray-100 text-gray-800"
        : "bg-gray-50 text-gray-600 hover:bg-gray-100",
      primary: isSelected
        ? "bg-primary-100 text-primary-800"
        : "bg-primary-50 text-primary-600 hover:bg-primary-100",
      secondary: isSelected
        ? "bg-secondary-100 text-secondary-800"
        : "bg-secondary-50 text-secondary-600 hover:bg-secondary-100",
      success: isSelected
        ? "bg-green-100 text-green-800"
        : "bg-green-50 text-green-600 hover:bg-green-100",
      warning: isSelected
        ? "bg-yellow-100 text-yellow-800"
        : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
      danger: isSelected
        ? "bg-red-100 text-red-800"
        : "bg-red-50 text-red-600 hover:bg-red-100",
    };

    return cn(baseClasses, colorClasses[chip.color || 'default']);
  };

  const handleChipClick = (chip: TagChip) => {
    if (!onChipToggle) return;

    if (!multiSelect) {
      // Single select: if already selected, unselect; otherwise select only this one
      const isSelected = selectedChips.includes(chip.id);
      onChipToggle(isSelected ? '' : chip.id);
    } else {
      // Multi select: toggle the chip
      onChipToggle(chip.id);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent, chipId: string) => {
    e.stopPropagation();
    onChipRemove?.(chipId);
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => {
        const isSelected = selectedChips.includes(chip.id);
        
        return (
          <button
            key={chip.id}
            onClick={() => handleChipClick(chip)}
            className={cn(
              getChipClasses(chip, isSelected),
              onChipToggle && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            )}
            disabled={!onChipToggle}
            aria-pressed={variant === 'filter' ? isSelected : undefined}
          >
            {/* Check icon for selected filter chips */}
            {variant === 'filter' && isSelected && (
              <Check className={iconSizeClasses[size]} />
            )}
            
            <span>{chip.label}</span>
            
            {/* Count display */}
            {showCount && chip.count !== undefined && (
              <span className="ml-1 rounded-full bg-black/10 px-1.5 py-0.5 text-xs font-normal">
                {chip.count}
              </span>
            )}
            
            {/* Remove button for removable variant */}
            {variant === 'removable' && onChipRemove && (
              <button
                onClick={(e) => handleRemoveClick(e, chip.id)}
                className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                aria-label={`Remove ${chip.label}`}
              >
                <X className={iconSizeClasses[size]} />
              </button>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TagChips;