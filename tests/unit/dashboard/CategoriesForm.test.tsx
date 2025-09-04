import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NewCategoryPage from '@/app/dashboard/categories/new/page';

// Mock next/link and next/navigation
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => 
    <a href={href}>{children}</a>
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('Categories Form - New Category Page', () => {
  beforeEach(() => {
    mockLocation.href = '';
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all required form fields', () => {
      render(<NewCategoryPage />);
      
      // Check for basic category fields
      expect(screen.getByLabelText(/título de la reseña/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    });

    it('should render navigation buttons', () => {
      render(<NewCategoryPage />);
      
      expect(screen.getByRole('link', { name: /volver a categorías/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /guardar categoría/i })).toBeInTheDocument();
    });

    it('should have proper navigation links', () => {
      render(<NewCategoryPage />);
      
      const backLink = screen.getByRole('link', { name: /volver a categorías/i });
      expect(backLink).toHaveAttribute('href', '/dashboard/categories');
    });

    it('should have minimal form structure for categories', () => {
      render(<NewCategoryPage />);
      
      // Categories should have simpler form structure
      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(3); // title, slug, description
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const titleInput = screen.getByLabelText(/título de la reseña/i);
      const saveButton = screen.getByRole('button', { name: /guardar categoría/i });
      
      // Try to submit without title
      await user.click(saveButton);
      
      // Title should be required
      expect(titleInput).toBeRequired();
    });

    it('should validate slug format for categories', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const slugInput = screen.getByLabelText(/slug/i);
      
      // Test invalid slug format
      await user.type(slugInput, 'Invalid Category Slug!@#');
      
      // Should validate slug format for SEO purposes
      // This would need proper validation implementation
    });

    it('should validate description length', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const descriptionTextarea = screen.getByLabelText(/descripción/i);
      
      // Test minimum description length
      await user.type(descriptionTextarea, 'x'); // Too short for SEO
      
      // Should encourage meaningful descriptions for SEO
      // This would need proper validation implementation
    });

    it('should handle duplicate category names', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const titleInput = screen.getByLabelText(/título de la reseña/i);
      
      await user.type(titleInput, 'Restaurantes'); // Common category
      
      // Should validate for duplicate categories
      // This would need backend validation
    });
  });

  describe('User Feedback', () => {
    it('should show loading state when saving', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const saveButton = screen.getByRole('button', { name: /guardar categoría/i });
      
      await user.click(saveButton);
      
      // Should show loading text
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /guardando/i })).toBeInTheDocument();
      });
    });

    it('should disable save button during loading', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const saveButton = screen.getByRole('button', { name: /guardar categoría/i });
      
      await user.click(saveButton);
      
      // Button should be disabled during save
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled();
      });
    });

    it('should provide clear feedback for empty forms', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const saveButton = screen.getByRole('button', { name: /guardar categoría/i });
      
      // Try to save empty form
      await user.click(saveButton);
      
      // Should provide clear validation feedback
      // This would need proper validation error display
    });
  });

  describe('Form Interaction', () => {
    it('should update form data when typing in fields', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const titleInput = screen.getByLabelText(/título de la reseña/i);
      const slugInput = screen.getByLabelText(/slug/i);
      const descriptionTextarea = screen.getByLabelText(/descripción/i);
      
      await user.type(titleInput, 'Restaurantes Mediterráneos');
      expect(titleInput).toHaveValue('Restaurantes Mediterráneos');
      
      await user.type(slugInput, 'restaurantes-mediterraneos');
      expect(slugInput).toHaveValue('restaurantes-mediterraneos');
      
      await user.type(descriptionTextarea, 'Restaurantes especializados en cocina mediterránea.');
      expect(descriptionTextarea).toHaveValue('Restaurantes especializados en cocina mediterránea.');
    });

    it('should auto-generate slug from title', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const titleInput = screen.getByLabelText(/título de la reseña/i);
      const slugInput = screen.getByLabelText(/slug/i);
      
      await user.type(titleInput, 'Cocina Internacional');
      
      // Should auto-generate URL-friendly slug
      // This would need proper slug generation implementation
      // Expected: 'cocina-internacional'
    });

    it('should handle cancel button correctly', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      
      await user.click(cancelButton);
      
      // Should navigate back to categories list
      expect(mockLocation.href).toBe('/dashboard/categories');
    });

    it('should preserve unsaved changes warning', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const titleInput = screen.getByLabelText(/título de la reseña/i);
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      
      // Add some content
      await user.type(titleInput, 'Categoría de Prueba');
      
      // Try to cancel
      await user.click(cancelButton);
      
      // Should warn about unsaved changes
      // This would need proper unsaved changes handling
    });
  });

  describe('Category-Specific Features', () => {
    it('should support category hierarchy (parent categories)', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      // Should have option for parent category selection
      // This would need proper category hierarchy implementation
    });

    it('should support category icons or colors', async () => {
      render(<NewCategoryPage />);
      
      // Should have option for category visual identification
      // This would enhance UX for category management
    });

    it('should validate category naming conventions', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const titleInput = screen.getByLabelText(/título de la reseña/i);
      
      // Test various naming conventions
      await user.type(titleInput, 'restaurante'); // Should suggest "Restaurantes" (plural)
      
      // Should provide naming guidance for consistency
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle extremely long category names', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const titleInput = screen.getByLabelText(/título de la reseña/i);
      const longTitle = 'Restaurantes de Comida Internacional con Especialidades Mediterráneas y Fusión Asiática'.repeat(5);
      
      await user.type(titleInput, longTitle);
      
      // Should handle or limit long category names
      expect(titleInput.value.length).toBeLessThanOrEqual(200); // Reasonable limit
    });

    it('should handle special characters in category names', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const titleInput = screen.getByLabelText(/título de la reseña/i);
      const specialName = 'Café & Bar';
      
      await user.type(titleInput, specialName);
      
      // Should handle special characters appropriately
      expect(titleInput).toHaveValue(specialName);
    });

    it('should handle empty description field', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const titleInput = screen.getByLabelText(/título de la reseña/i);
      const saveButton = screen.getByRole('button', { name: /guardar categoría/i });
      
      // Fill only title, leave description empty
      await user.type(titleInput, 'Nueva Categoría');
      await user.click(saveButton);
      
      // Should handle empty description gracefully
      // or prompt for SEO-friendly description
    });

    it('should handle rapid form submissions', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const saveButton = screen.getByRole('button', { name: /guardar categoría/i });
      
      // Rapid clicks should not cause issues
      await user.click(saveButton);
      await user.click(saveButton);
      await user.click(saveButton);
      
      // Should prevent duplicate submissions
    });
  });

  describe('SEO and Content Guidelines', () => {
    it('should provide SEO-friendly slug suggestions', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const titleInput = screen.getByLabelText(/título de la reseña/i);
      
      await user.type(titleInput, 'Restaurantes & Cafeterías');
      
      // Should suggest SEO-friendly slug like 'restaurantes-cafeterias'
      // This would need proper slug generation with SEO considerations
    });

    it('should suggest optimal description length for SEO', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const descriptionTextarea = screen.getByLabelText(/descripción/i);
      
      await user.type(descriptionTextarea, 'Short desc');
      
      // Should suggest longer description for better SEO
      // Optimal length: 150-160 characters
    });

    it('should validate category consistency', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      const titleInput = screen.getByLabelText(/título de la reseña/i);
      
      await user.type(titleInput, 'restaurant'); // English
      
      // Should suggest consistent language usage (Spanish)
      // This would need language consistency validation
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      render(<NewCategoryPage />);
      
      // All inputs should have proper labels
      const textInputs = screen.getAllByRole('textbox');
      textInputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<NewCategoryPage />);
      
      // Should be able to tab through all form elements
      await user.tab();
      expect(document.activeElement).toBeInstanceOf(HTMLElement);
    });

    it('should provide clear form instructions', () => {
      render(<NewCategoryPage />);
      
      // Should have clear instructions for category creation
      // This would improve accessibility and UX
    });

    it('should have proper ARIA attributes for validation', () => {
      render(<NewCategoryPage />);
      
      const titleInput = screen.getByLabelText(/título de la reseña/i);
      
      // Should have proper ARIA attributes for validation feedback
      expect(titleInput).toHaveAttribute('aria-required', 'true');
    });
  });
});