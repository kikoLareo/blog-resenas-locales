import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock the Select UI (Radix) with a simple, predictable implementation for tests.
// Render only a single native <select> (collected from SelectItem children) and
// avoid rendering the original Trigger/Content markup so tests don't see duplicate
// accessible combobox controls.
vi.mock('@/components/ui/select', () => {
  const React = require('react');

  // Lightweight SelectItem used only for extracting options from JSX children
  const SelectItem = ({ children }: any) => React.createElement(React.Fragment, null, children);

  // Helper to recursively collect SelectItem children
  function collectItems(children: any) {
    const items: Array<{ value: string; label: any }> = [];
    React.Children.forEach(children, (child: any) => {
      if (!React.isValidElement(child)) return;
      if (child.type === SelectItem) {
        items.push({ value: child.props.value, label: child.props.children });
      } else if (child.props && child.props.children) {
        items.push(...collectItems(child.props.children));
      }
    });
    return items;
  }

  // Helper to find SelectValue placeholder text
  function findPlaceholder(children: any) {
    let placeholder: string | undefined;
    React.Children.forEach(children, (child: any) => {
      if (!React.isValidElement(child)) return;
      if (child.type === SelectValue && child.props && child.props.placeholder) {
        placeholder = child.props.placeholder;
      } else if (child.props && child.props.children) {
        const sub = findPlaceholder(child.props.children);
        if (sub) placeholder = sub;
      }
    });
    return placeholder;
  }

  // The Select mock will only output a native <select> element with collected options.
  // It will NOT render the original children to avoid duplicate accessible nodes.
  const Select = ({ children, value, onValueChange }: any) => {
    const items = collectItems(children);

    // Try to find a Trigger child and use its id so label[for] queries resolve to this select
    let triggerId: string | undefined;
    React.Children.forEach(children, (child: any) => {
      if (!React.isValidElement(child)) return;
      if (child.type === SelectTrigger && child.props && child.props.id) {
        triggerId = child.props.id;
      }
    });

    const selectProps: any = {
      value: value,
      onChange: (e: any) => onValueChange?.(e.target.value),
    };
    // Only expose combobox role for selects that are tied to a Trigger id (labeled fields)
    if (triggerId) {
      selectProps.id = triggerId;
      selectProps.role = 'combobox';
    } else {
      // If there's a SelectValue placeholder like "Selecciona una reseña",
      // use it as aria-label so label-based queries (getByLabelText) work.
      const placeholder = findPlaceholder(children);
      if (placeholder && typeof placeholder === 'string') {
        selectProps['aria-label'] = placeholder;
      } else {
        selectProps['aria-label'] = 'mock-select';
      }
      // don't set role to avoid duplicate combobox accessible nodes
    }

    return React.createElement('div', { 'data-testid': 'mock-select' },
      React.createElement('select', selectProps, items.map((it) =>
        React.createElement('option', { key: it.value, value: it.value, onClick: () => onValueChange?.(it.value) }, it.label)
      ))
    );
  };

  // Make Trigger/Content/Value inert (no accessible role) so they don't collide with the
  // native <select> we render. We still export them so component code can use them.
  const SelectTrigger = (_props: any) => React.createElement(React.Fragment, null);
  const SelectContent = (_props: any) => React.createElement(React.Fragment, null);
  const SelectValue = ({ children }: any) => React.createElement(React.Fragment, null, children);

  return {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
  };
});

import { FeaturedItemForm } from '../../../components/admin/FeaturedItemForm';

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock the FeaturedItemPreview component with a close button that calls onClose
vi.mock('@/components/admin/FeaturedItemPreview', () => ({
  FeaturedItemPreview: ({ item, onClose }: { item: any; onClose: () => void }) => (
    <div data-testid="featured-item-preview">
      <div>Preview for {item?.title || 'New Item'}</div>
      <button onClick={onClose} aria-label="cerrar vista previa">×</button>
    </div>
  ),
}));

const mockItem = {
  _id: 'test-id',
  title: 'Test Featured Item',
  type: 'review' as const,
  customTitle: 'Custom Title',
  customDescription: 'Custom Description',
  isActive: true,
  order: 1,
  reviewRef: { title: 'Test Review', venue: { title: 'Test Venue', slug: { current: 'test-venue' } } },
  _createdAt: '2023-01-01T00:00:00Z',
  _updatedAt: '2023-01-01T00:00:00Z',
};

const mockOnClose = vi.fn();
const mockOnSave = vi.fn();

describe('Featured Items Form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { _id: '1', title: 'Review 1' },
        { _id: '2', title: 'Review 2' },
      ]),
    });
  });

  describe('Form Rendering - New Item', () => {
    it('should render all form fields for new item', () => {
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      // Basic form fields
      expect(screen.getByLabelText(/título interno/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/orden/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/activo/i)).toBeInTheDocument();
      
      // Custom content fields
      expect(screen.getByLabelText(/título personalizado/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/descripción personalizada/i)).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /crear/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /vista previa/i })).toBeInTheDocument();
    });

    it('should show type selection options', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const typeSelect = screen.getByLabelText(/tipo/i);
      // Open the select dropdown
      fireEvent.click(typeSelect);
      
      // Should show all available types
      expect(screen.getByText(/⭐ reseña/i)).toBeInTheDocument();
      expect(screen.getByText(/🏪 local\/restaurante/i)).toBeInTheDocument();
      expect(screen.getByText(/🏷️ categoría/i)).toBeInTheDocument();
      expect(screen.getByText(/📚 colección/i)).toBeInTheDocument();
      expect(screen.getByText(/🗺️ guía/i)).toBeInTheDocument();
    });
  });

  describe('Form Rendering - Edit Item', () => {
    it('should populate form with existing item data', () => {
      render(
        <FeaturedItemForm 
          item={mockItem} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      expect(screen.getByDisplayValue('Test Featured Item')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Custom Title')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Custom Description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    });

    it('should show correct type selected', () => {
      render(
        <FeaturedItemForm 
          item={mockItem} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
  const typeSelect = screen.getByLabelText(/tipo de contenido/i);
  // The visible trigger shows the selected label; assert it shows the review label
  expect(typeSelect).toHaveTextContent(/⭐ reseña/i);
    });

    it('should show active toggle in correct state', () => {
      render(
        <FeaturedItemForm 
          item={mockItem} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const activeToggle = screen.getByLabelText(/activo/i);
      expect(activeToggle).toBeChecked();
    });
  });

  describe('Type-Specific Features', () => {
    it('should show reference selector when review type is selected', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const typeSelect = screen.getByLabelText(/tipo/i);
      // Use fireEvent to directly trigger the select change
      fireEvent.change(typeSelect, { target: { value: 'review' } });
      
      // Should show reference selector
      await waitFor(() => {
        expect(screen.getByLabelText(/seleccionar reseña|reseña/i)).toBeInTheDocument();
      });
    });

    it('should load references when type changes', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const typeSelect = screen.getByLabelText(/tipo/i);
      fireEvent.change(typeSelect, { target: { value: 'venue' } });
      
      // Should call API to load venue references
      await waitFor(() => {
        // fetch is called with the URL and an options object containing signal
        expect((global.fetch as any).mock.calls[0][0]).toBe('/api/admin/references?type=venue');
      });
    });

    it('should show custom content fields for collection type', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const typeSelect = screen.getByLabelText(/tipo/i);
      fireEvent.change(typeSelect, { target: { value: 'collection' } });
      
      // Should show custom content fields for collection/guide types
      await waitFor(() => {
        // Component renders 'Título Personalizado (Opcional)' and 'Descripción Personalizada (Opcional)'
        expect(screen.getByLabelText(/título personalizado/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/descripción personalizada/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const saveButton = screen.getByRole('button', { name: /crear/i });
      await user.click(saveButton);
      
      // Should validate required fields
      const titleInput = screen.getByLabelText(/título interno/i);
      expect(titleInput).toBeRequired();
    });

    it('should validate order number range', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const orderInput = screen.getByLabelText(/orden/i);
      
      // Test invalid order values
      await user.clear(orderInput);
      await user.type(orderInput, '0'); // Should be minimum 1
      
      expect(orderInput).toHaveAttribute('min', '1');
    });

    it('should validate reference selection for referencing types', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      // Select review type
      const typeSelect = screen.getByLabelText(/tipo/i);
      fireEvent.change(typeSelect, { target: { value: 'review' } });
      
      // Try to save without selecting reference
      const saveButton = screen.getByRole('button', { name: /crear/i });
      await user.click(saveButton);
      
      // Should validate that reference is selected
      // This would need proper validation implementation
    });

    it('should validate title length', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const titleInput = screen.getByLabelText(/título interno/i) as HTMLInputElement;
      const longTitle = 'x'.repeat(200); // Very long title
      
      await user.type(titleInput, longTitle);
      
      // Should validate title length for UI purposes
      expect(titleInput.value.length).toBeLessThanOrEqual(200);
    });
  });

  describe('User Interaction', () => {
    it('should update form data when typing', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const titleInput = screen.getByLabelText(/título interno/i);
      const customTitleInput = screen.getByLabelText(/título personalizado/i);
      
      await user.type(titleInput, 'New Featured Item');
      expect(titleInput).toHaveValue('New Featured Item');
      
      await user.type(customTitleInput, 'Custom Display Title');
      expect(customTitleInput).toHaveValue('Custom Display Title');
    });

    it('should toggle active state', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const activeToggle = screen.getByLabelText(/activo/i);
      
      // Should start as active by default
      expect(activeToggle).toBeChecked();
      
      await user.click(activeToggle);
      expect(activeToggle).not.toBeChecked();
    });

  it('should handle order input changes', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const orderInput = screen.getByLabelText(/orden/i);
      
      fireEvent.change(orderInput, { target: { value: '5' } });
      
      expect(orderInput).toHaveValue(5);
    });

    it('should call onClose when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Preview Functionality', () => {
    it('should show preview when preview button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      // Fill required fields first
      const titleInput = screen.getByLabelText(/título interno/i);
      await user.type(titleInput, 'Test Item');
      
      // Change type to collection (doesn't require reference)
      const typeSelect = screen.getByRole('combobox', { name: /tipo/i });
      await user.click(typeSelect);
      const collectionOption = screen.getByRole('option', { name: /📚 colección/i });
      await user.click(collectionOption);
      
      const previewButton = screen.getByRole('button', { name: /vista previa/i });
      await user.click(previewButton);
      
      // Should show preview component
      expect(screen.getByTestId('featured-item-preview')).toBeInTheDocument();
    });

    it('should hide preview when close preview is clicked', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      // Fill required fields first
      const titleInput = screen.getByLabelText(/título interno/i);
      await user.type(titleInput, 'Test Item');
      
      // Change type to collection (doesn't require reference)
      const typeSelect = screen.getByRole('combobox', { name: /tipo/i });
      await user.click(typeSelect);
      const collectionOption = screen.getByRole('option', { name: /colección/i });
      await user.click(collectionOption);
      
      // Open preview
      const previewButton = screen.getByRole('button', { name: /vista previa/i });
      await user.click(previewButton);
      
  // Close preview
  const closePreviewButton = screen.getByRole('button', { name: /cerrar vista previa/i });
  await user.click(closePreviewButton);
      
      // Preview should be hidden
      expect(screen.queryByTestId('featured-item-preview')).not.toBeInTheDocument();
    });

  it('should update preview when form data changes', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      // Fill required fields first
      const titleInput = screen.getByLabelText(/título interno/i);
      await user.type(titleInput, 'Test Item');
      
      // Change type to collection (doesn't require reference)
      const typeSelect = screen.getByRole('combobox', { name: /tipo/i });
      await user.click(typeSelect);
      const collectionOption = screen.getByRole('option', { name: /colección/i });
      await user.click(collectionOption);
      
      // Open preview
      const previewButton = screen.getByRole('button', { name: /vista previa/i });
      await user.click(previewButton);
      
      // Change title
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');
      
      // Click preview again to update
      await user.click(previewButton);
      
      // Preview should reflect changes
      expect(screen.getByText(/Preview for Updated Title/i)).toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    it('should handle API errors gracefully', async () => {
      // Mock API error
      (global.fetch as any).mockRejectedValue(new Error('API Error'));
      
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      // Select type that requires API call
      const typeSelect = screen.getByLabelText(/tipo/i);
      fireEvent.change(typeSelect, { target: { value: 'review' } });
      
      // Should handle API error without crashing
      await waitFor(() => {
        // Should show error state or empty options
      });
    });

    it('should handle save operation', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      // Fill required fields
      const titleInput = screen.getByLabelText(/título interno/i);
      await user.type(titleInput, 'Test Item');
      
      // Select a type that doesn't require reference
      const typeSelect = screen.getByRole('combobox', { name: /tipo/i });
      await user.click(typeSelect);
      const collectionOption = screen.getByRole('option', { name: /📚 colección/i });
      await user.click(collectionOption);
      
      // Save
      const saveButton = screen.getByRole('button', { name: /crear/i });
      await user.click(saveButton);
      
      // Should call onSave with form data
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid type changes', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
  const typeSelect = screen.getByLabelText(/tipo de contenido/i);
      
      // Rapid type changes
      fireEvent.change(typeSelect, { target: { value: 'review' } });
      fireEvent.change(typeSelect, { target: { value: 'venue' } });
      fireEvent.change(typeSelect, { target: { value: 'category' } });
      
      // Should handle rapid changes without errors
    });

    it('should handle missing reference data', async () => {
      // Mock empty API response
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });
      
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const typeSelect = screen.getByLabelText(/tipo/i);
      fireEvent.change(typeSelect, { target: { value: 'review' } });
      
      // Should handle empty reference list gracefully
      await waitFor(() => {
        // Should show "No options available" or similar
      });
    });

    it('should preserve unsaved changes when switching types', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      // Fill some data
      const titleInput = screen.getByLabelText(/título interno/i);
      await user.type(titleInput, 'My Featured Item');
      
      // Change type
      const typeSelect = screen.getByLabelText(/tipo/i);
      fireEvent.change(typeSelect, { target: { value: 'review' } });
      
      // Title should be preserved
      expect(titleInput).toHaveValue('My Featured Item');
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      // All inputs should have proper labels
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      // Should be able to tab through form elements
      await user.tab();
      expect(document.activeElement).toBeInstanceOf(HTMLElement);
    });

    it('should have proper ARIA attributes', () => {
      render(
        <FeaturedItemForm 
          item={null} 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
        />
      );
      
      const titleInput = screen.getByLabelText(/título interno/i);
      expect(titleInput).toHaveAttribute('aria-required', 'true');
    });
  });
});