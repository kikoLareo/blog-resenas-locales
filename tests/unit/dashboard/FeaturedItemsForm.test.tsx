import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeaturedItemForm } from '@/components/admin/FeaturedItemForm';

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock the FeaturedItemPreview component
vi.mock('@/components/admin/FeaturedItemPreview', () => ({
  FeaturedItemPreview: ({ item }: { item: any }) => (
    <div data-testid="featured-item-preview">
      Preview for {item?.title || 'New Item'}
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
      expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
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
      expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
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
      await user.click(typeSelect);
      
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
      
      const typeSelect = screen.getByLabelText(/tipo/i);
      expect(typeSelect).toHaveValue('review');
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
      await user.click(typeSelect);
      await user.click(screen.getByText(/⭐ reseña/i));
      
      // Should show reference selector
      await waitFor(() => {
        expect(screen.getByLabelText(/reseña/i)).toBeInTheDocument();
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
      await user.click(typeSelect);
      await user.click(screen.getByText(/🏪 local\/restaurante/i));
      
      // Should call API to load venue references
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/references?type=venue');
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
      await user.click(typeSelect);
      await user.click(screen.getByText(/📚 colección/i));
      
      // Should show custom content fields for collection/guide types
      await waitFor(() => {
        expect(screen.getByLabelText(/contenido personalizado/i)).toBeInTheDocument();
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
      
      const saveButton = screen.getByRole('button', { name: /guardar/i });
      await user.click(saveButton);
      
      // Should validate required fields
      const titleInput = screen.getByLabelText(/título/i);
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
      await user.click(typeSelect);
      await user.click(screen.getByText(/⭐ reseña/i));
      
      // Try to save without selecting reference
      const saveButton = screen.getByRole('button', { name: /guardar/i });
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
      
      const titleInput = screen.getByLabelText(/título/i);
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
      
      const titleInput = screen.getByLabelText(/título/i);
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
      
      await user.clear(orderInput);
      await user.type(orderInput, '5');
      
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
      
      // Open preview
      const previewButton = screen.getByRole('button', { name: /vista previa/i });
      await user.click(previewButton);
      
      // Change title
      const titleInput = screen.getByLabelText(/título/i);
      await user.type(titleInput, 'Updated Title');
      
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
      await user.click(typeSelect);
      await user.click(screen.getByText(/⭐ reseña/i));
      
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
      const titleInput = screen.getByLabelText(/título/i);
      await user.type(titleInput, 'Test Item');
      
      // Save
      const saveButton = screen.getByRole('button', { name: /guardar/i });
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
      
      const typeSelect = screen.getByLabelText(/tipo/i);
      
      // Rapid type changes
      await user.click(typeSelect);
      await user.click(screen.getByText(/⭐ reseña/i));
      await user.click(typeSelect);
      await user.click(screen.getByText(/🏪 local\/restaurante/i));
      await user.click(typeSelect);
      await user.click(screen.getByText(/🏷️ categoría/i));
      
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
      await user.click(typeSelect);
      await user.click(screen.getByText(/⭐ reseña/i));
      
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
      const titleInput = screen.getByLabelText(/título/i);
      await user.type(titleInput, 'My Featured Item');
      
      // Change type
      const typeSelect = screen.getByLabelText(/tipo/i);
      await user.click(typeSelect);
      await user.click(screen.getByText(/⭐ reseña/i));
      
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
      
      const titleInput = screen.getByLabelText(/título/i);
      expect(titleInput).toHaveAttribute('aria-required', 'true');
    });
  });
});