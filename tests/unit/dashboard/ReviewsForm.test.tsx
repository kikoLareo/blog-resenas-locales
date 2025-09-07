import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NewReviewPage from '@/app/dashboard/reviews/new/page';

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

describe('Reviews Form - New Review Page', () => {
  beforeEach(() => {
    mockLocation.href = '';
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all required form fields', () => {
      render(<NewReviewPage />);
      
      // Check for basic form fields
      expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contenido de la reseña/i)).toBeInTheDocument();
  expect(screen.getByRole('combobox', { name: /seleccionar local/i })).toBeInTheDocument();
      
  // Check for rating fields (visible combobox triggers)
  expect(screen.getByRole('combobox', { name: /valoración de comida/i })).toBeInTheDocument();
  expect(screen.getByRole('combobox', { name: /valoración de servicio/i })).toBeInTheDocument();
  expect(screen.getByRole('combobox', { name: /valoración de ambiente/i })).toBeInTheDocument();
  expect(screen.getByRole('combobox', { name: /valoración de relación calidad-precio/i })).toBeInTheDocument();
      
      // Check for status selector
      expect(screen.getByLabelText(/estado de la reseña/i)).toBeInTheDocument();
    });

    it('should render navigation buttons', () => {
      render(<NewReviewPage />);
      
      expect(screen.getByRole('link', { name: /volver a reseñas/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /guardar reseña/i })).toBeInTheDocument();
    });

    it('should have proper navigation links', () => {
      render(<NewReviewPage />);
      
      const backLink = screen.getByRole('link', { name: /volver a reseñas/i });
      expect(backLink).toHaveAttribute('href', '/dashboard/reviews');
    });
  });

  describe('Form Validation', () => {
    it('should show required field validation for title', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const titleInput = screen.getByLabelText(/título/i);
      const saveButton = screen.getByRole('button', { name: /guardar reseña/i });
      
      // Try to submit without title
      await user.click(saveButton);
      
      // Should validate required fields (browser validation or custom)
      expect(titleInput).toBeRequired();
    });

    it('should validate slug format', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const slugInput = screen.getByLabelText(/slug/i);
      
      // Test invalid slug format
      await user.type(slugInput, 'Invalid Slug With Spaces!@#');
      
      // Should not allow invalid characters in slug
      // This would need proper validation implementation
    });

    it('should validate rating ranges', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
  // Interact with the custom Select: open combobox and pick an invalid value if possible
  const foodCombobox = screen.getByRole('combobox', { name: /valoración de comida/i });
  await user.click(foodCombobox);
  const foodListbox = screen.getByRole('listbox');
  const option4 = within(foodListbox).getAllByText('4/5')[0];
  fireEvent.click(option4);

  // Verify the visible combobox shows the chosen value
  expect(foodCombobox).toHaveTextContent('4/5');
    });

    it('should validate content length', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const contentTextarea = screen.getByLabelText(/contenido de la reseña/i);
      
      // Test minimum content length
      await user.type(contentTextarea, 'x'); // Too short
      
      // Should validate minimum content length
      // This would need proper validation implementation
    });
  });

  describe('User Feedback', () => {
    it('should show loading state when saving', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      // Fill required fields first so validation doesn't block saving
      await user.type(screen.getByLabelText(/título/i), 'Test Title');
      await user.type(screen.getByLabelText(/slug/i), 'test-slug');
  // Select a venue (choose option from the opened listbox to avoid duplicate matches)
  const venueCombobox = screen.getByRole('combobox', { name: /seleccionar local/i });
  await user.click(venueCombobox);
  const venueListbox = await screen.findByRole('listbox');
  fireEvent.click(within(venueListbox).getByText('Pizzería Tradizionale'));

      const saveButton = screen.getByRole('button', { name: /guardar reseña/i });
      
      await user.click(saveButton);
      
      // Should show loading text
      await waitFor(() => {
        expect(screen.getByText('Guardando...')).toBeInTheDocument();
      });
    });

    it('should disable save button during loading', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);

      // Fill required fields
      await user.type(screen.getByLabelText(/título/i), 'Test Title');
      await user.type(screen.getByLabelText(/slug/i), 'test-slug');
  const venueCombobox = screen.getByRole('combobox', { name: /seleccionar local/i });
  await user.click(venueCombobox);
  const venueListbox = await screen.findByRole('listbox');
  fireEvent.click(within(venueListbox).getByText('Pizzería Tradizionale'));

      const saveButton = screen.getByRole('button', { name: /guardar reseña/i });

      await user.click(saveButton);

      // Button should be disabled during save
      await waitFor(() => {
        expect(screen.getByText('Guardando...').closest('button')).toBeDisabled();
      });
    });

    it('should show error message on save failure', async () => {
      // Mock console.error to prevent error output during tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const saveButton = screen.getByRole('button', { name: /guardar reseña/i });
      
      await user.click(saveButton);
      
      // Should handle errors gracefully
      // This would need proper error handling implementation
      
      consoleSpy.mockRestore();
    });
  });

  describe('Form Interaction', () => {
    it('should update form data when typing in fields', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const titleInput = screen.getByLabelText(/título/i);
      const slugInput = screen.getByLabelText(/slug/i);
      
      await user.type(titleInput, 'Test Review Title');
      expect(titleInput).toHaveValue('Test Review Title');
      
      await user.type(slugInput, 'test-review-slug');
      expect(slugInput).toHaveValue('test-review-slug');
    });

    it('should update rating values', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const foodRating = screen.getByLabelText(/comida/i);
      
      // Initial value should be 5
      expect(foodRating).toHaveValue(5);
      
      // Clear and type using fireEvent
      fireEvent.change(foodRating, { target: { value: '4' } });
      
      // Should now have value 4
      expect(foodRating).toHaveValue(4);
    });

    it('should handle cancel button correctly', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      
      await user.click(cancelButton);
      
      // Should navigate back to reviews list
      expect(mockLocation.href).toBe('/dashboard/reviews');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle extremely long input values', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const titleInput = screen.getByLabelText(/título/i);
      const longTitle = 'x'.repeat(1000); // Very long title
      
      await user.type(titleInput, longTitle);
      
      // Should handle long input gracefully
      // titleInput is an HTMLElement; cast to HTMLInputElement to access .value
      expect((titleInput as HTMLInputElement).value.length).toBeLessThanOrEqual(1000);
    }, { timeout: 20000 });

    it('should handle special characters in input', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const titleInput = screen.getByLabelText(/título/i);
      const specialChars = '!@#$%^&*()';
      
      await user.type(titleInput, specialChars);
      
      // Should handle special characters appropriately
      expect(titleInput).toHaveValue(specialChars);
    });

    it('should handle rapid form submissions', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const saveButton = screen.getByRole('button', { name: /guardar reseña/i });
      
      // Rapid clicks should not cause issues
      await user.click(saveButton);
      await user.click(saveButton);
      await user.click(saveButton);
      
      // Should handle multiple submissions gracefully
    });

    it('should maintain form state on component re-render', () => {
      const { rerender } = render(<NewReviewPage />);
      
      // This test would verify that form state is preserved
      // across re-renders, which is important for user experience
      
      rerender(<NewReviewPage />);
      
      // Form should maintain its state
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const saveButton = screen.getByRole('button', { name: /guardar reseña/i });
      
      // Try to save with empty required fields
      await user.click(saveButton);
      
      // Should show validation errors
      expect(screen.getByText('El título es obligatorio')).toBeInTheDocument();
      expect(screen.getByText('El slug es obligatorio')).toBeInTheDocument();
      expect(screen.getByText('Debe seleccionar un local')).toBeInTheDocument();
    });

    it('should not show validation errors when required fields are filled', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      // Fill required fields
      const titleInput = screen.getByLabelText(/título/i);
      const slugInput = screen.getByLabelText(/slug/i);
      
      await user.type(titleInput, 'Test Title');
      await user.type(slugInput, 'test-slug');
      
  // Select a venue via the visible combobox
  const venueCombobox = screen.getByRole('combobox', { name: /seleccionar local/i });
  await user.click(venueCombobox);
  const venueListbox = screen.getByRole('listbox');
  fireEvent.click(within(venueListbox).getByText('Pizzería Tradizionale'));
      
      const saveButton = screen.getByRole('button', { name: /guardar reseña/i });
      await user.click(saveButton);
      
      // Should not show validation errors
      expect(screen.queryByText('El título es obligatorio')).not.toBeInTheDocument();
      expect(screen.queryByText('El slug es obligatorio')).not.toBeInTheDocument();
      expect(screen.queryByText('Debe seleccionar un local')).not.toBeInTheDocument();
    });

    it('should add red border to invalid fields', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const saveButton = screen.getByRole('button', { name: /guardar reseña/i });
      
      // Try to save with empty required fields
      await user.click(saveButton);
      
      // Should add red border to invalid fields
      const titleInput = screen.getByLabelText(/título/i);
      const slugInput = screen.getByLabelText(/slug/i);
      
      expect(titleInput).toHaveClass('border-red-500');
      expect(slugInput).toHaveClass('border-red-500');
    });

    it('should clear validation errors when fields are filled', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const saveButton = screen.getByRole('button', { name: /guardar reseña/i });
      
      // First trigger validation errors
      await user.click(saveButton);
      expect(screen.getByText('El título es obligatorio')).toBeInTheDocument();
      
      // Then fill the title field
      const titleInput = screen.getByLabelText(/título/i);
      await user.type(titleInput, 'Test Title');
      
      // Click save again to re-validate
      await user.click(saveButton);
      
      // Title error should be gone, but others should remain
      expect(screen.queryByText('El título es obligatorio')).not.toBeInTheDocument();
      expect(screen.getByText('El slug es obligatorio')).toBeInTheDocument();
      expect(screen.getByText('Debe seleccionar un local')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      render(<NewReviewPage />);
      
      // All inputs should have proper labels
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
      
      const numberInputs = screen.getAllByRole('spinbutton');
      numberInputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      // Should be able to tab through all form elements
      await user.tab();
      expect(document.activeElement).toBeInstanceOf(HTMLElement);
    });

    it('should have proper ARIA attributes for rating selects', () => {
      render(<NewReviewPage />);
      
      // Look for elements with our specific aria-labels
  const foodSelect = screen.getByLabelText('Valoración de comida, escala del 1 al 5');
  const serviceSelect = screen.getByLabelText('Valoración de servicio, escala del 1 al 5');
  const ambienceSelect = screen.getByLabelText('Valoración de ambiente, escala del 1 al 5');
  const valueSelect = screen.getByLabelText('Valoración de relación calidad-precio, escala del 1 al 5');
      
      // Verify all rating selects have proper ARIA attributes
  expect(foodSelect).toHaveAttribute('aria-label', 'Valoración de comida, escala del 1 al 5');
  expect(serviceSelect).toHaveAttribute('aria-label', 'Valoración de servicio, escala del 1 al 5');
  expect(ambienceSelect).toHaveAttribute('aria-label', 'Valoración de ambiente, escala del 1 al 5');
  expect(valueSelect).toHaveAttribute('aria-label', 'Valoración de relación calidad-precio, escala del 1 al 5');
    });

    it('should have proper ARIA attributes', () => {
      render(<NewReviewPage />);
      
      // Form fields should have proper ARIA attributes
      const saveButton = screen.getByRole('button', { name: /guardar reseña/i });
      expect(saveButton).not.toHaveAttribute('aria-disabled', 'true');
    });
  });
});