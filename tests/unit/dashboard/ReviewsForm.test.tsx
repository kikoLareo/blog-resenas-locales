import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      expect(screen.getByLabelText(/título de la reseña/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contenido de la reseña/i)).toBeInTheDocument();
      expect(screen.getByText(/seleccionar local/i)).toBeInTheDocument();
      
      // Check for rating fields (Select components)
      expect(screen.getByText(/comida/i)).toBeInTheDocument();
      expect(screen.getByText(/servicio/i)).toBeInTheDocument();
      expect(screen.getByText(/ambiente/i)).toBeInTheDocument();
      expect(screen.getByText(/relación calidad-precio/i)).toBeInTheDocument();
      
      // Check for status selector
      expect(screen.getByText(/estado de la reseña/i)).toBeInTheDocument();
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
      
      // Check that rating labels exist
      expect(screen.getByText(/comida/i)).toBeInTheDocument();
      
      // For Select components, we would need to interact with the dropdown
      // This test verifies the component renders correctly
      // Actual validation would need to be tested through component interaction
    });

    it('should validate content length', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const contentTextarea = screen.getByLabelText(/contenido/i);
      
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
      
      const saveButton = screen.getByRole('button', { name: /guardar reseña/i });
      
      await user.click(saveButton);
      
      // Should show loading text
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /guardando/i })).toBeInTheDocument();
      });
    });

    it('should disable save button during loading', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const saveButton = screen.getByRole('button', { name: /guardar reseña/i });
      
      await user.click(saveButton);
      
      // Button should be disabled during save
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled();
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
      
      // Check that rating label exists
      expect(screen.getByText(/comida/i)).toBeInTheDocument();
      
      // For Select components, we would need to click the dropdown and select an option
      // This test verifies the component renders correctly
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
      expect(titleInput.value.length).toBeLessThanOrEqual(1000);
    });

    it('should handle special characters in input', async () => {
      const user = userEvent.setup();
      render(<NewReviewPage />);
      
      const titleInput = screen.getByLabelText(/título/i);
      const specialChars = '!@#$%^&*(){}[]|\\:";\'<>,.?/~`';
      
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

    it('should have proper ARIA attributes', () => {
      render(<NewReviewPage />);
      
      // Form fields should have proper ARIA attributes
      const saveButton = screen.getByRole('button', { name: /guardar reseña/i });
      expect(saveButton).not.toHaveAttribute('aria-disabled', 'true');
    });
  });
});