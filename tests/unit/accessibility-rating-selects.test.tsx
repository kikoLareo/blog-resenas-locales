import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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

describe('Rating Selects Accessibility', () => {
  describe('New Review Form Rating Selects', () => {
    it('should have proper ARIA attributes for food rating select', () => {
      render(<NewReviewPage />);
      
      // Find the food rating trigger button
      const foodRatingTrigger = screen.getByRole('combobox', { name: /valoración de comida, escala del 1 al 5/i });
      
      expect(foodRatingTrigger).toBeInTheDocument();
      expect(foodRatingTrigger).toHaveAttribute('aria-label', 'Valoración de comida, escala del 1 al 5');
      expect(foodRatingTrigger).toHaveAttribute('aria-describedby', 'food-rating-desc');
    });

    it('should have proper ARIA attributes for service rating select', () => {
      render(<NewReviewPage />);
      
      // Find the service rating trigger button
      const serviceRatingTrigger = screen.getByRole('combobox', { name: /valoración de servicio, escala del 1 al 5/i });
      
      expect(serviceRatingTrigger).toBeInTheDocument();
      expect(serviceRatingTrigger).toHaveAttribute('aria-label', 'Valoración de servicio, escala del 1 al 5');
      expect(serviceRatingTrigger).toHaveAttribute('aria-describedby', 'service-rating-desc');
    });

    it('should have proper ARIA attributes for ambience rating select', () => {
      render(<NewReviewPage />);
      
      // Find the ambience rating trigger button
      const ambienceRatingTrigger = screen.getByRole('combobox', { name: /valoración de ambiente, escala del 1 al 5/i });
      
      expect(ambienceRatingTrigger).toBeInTheDocument();
      expect(ambienceRatingTrigger).toHaveAttribute('aria-label', 'Valoración de ambiente, escala del 1 al 5');
      expect(ambienceRatingTrigger).toHaveAttribute('aria-describedby', 'ambience-rating-desc');
    });

    it('should have proper ARIA attributes for value rating select', () => {
      render(<NewReviewPage />);
      
      // Find the value rating trigger button
      const valueRatingTrigger = screen.getByRole('combobox', { name: /valoración de relación calidad-precio, escala del 1 al 5/i });
      
      expect(valueRatingTrigger).toBeInTheDocument();
      expect(valueRatingTrigger).toHaveAttribute('aria-label', 'Valoración de relación calidad-precio, escala del 1 al 5');
      expect(valueRatingTrigger).toHaveAttribute('aria-describedby', 'value-rating-desc');
    });

    it('should have screen reader only description elements for each rating', () => {
      render(<NewReviewPage />);
      
      // Check for hidden description elements
      expect(document.getElementById('food-rating-desc')).toBeInTheDocument();
      expect(document.getElementById('service-rating-desc')).toBeInTheDocument();
      expect(document.getElementById('ambience-rating-desc')).toBeInTheDocument();
      expect(document.getElementById('value-rating-desc')).toBeInTheDocument();
      
      // Verify they have sr-only class for screen readers
      expect(document.getElementById('food-rating-desc')).toHaveClass('sr-only');
      expect(document.getElementById('service-rating-desc')).toHaveClass('sr-only');
      expect(document.getElementById('ambience-rating-desc')).toHaveClass('sr-only');
      expect(document.getElementById('value-rating-desc')).toHaveClass('sr-only');
    });

    it('should have descriptive text content in description elements', () => {
      render(<NewReviewPage />);
      
      expect(document.getElementById('food-rating-desc')).toHaveTextContent('Selecciona una puntuación del 1 al 5 para la calidad de la comida');
      expect(document.getElementById('service-rating-desc')).toHaveTextContent('Selecciona una puntuación del 1 al 5 para la calidad del servicio');
      expect(document.getElementById('ambience-rating-desc')).toHaveTextContent('Selecciona una puntuación del 1 al 5 para la calidad del ambiente');
      expect(document.getElementById('value-rating-desc')).toHaveTextContent('Selecciona una puntuación del 1 al 5 para la relación calidad-precio');
    });
  });

  describe('Accessibility Requirements', () => {
    it('should provide clear context for screen readers', () => {
      render(<NewReviewPage />);
      
      // All rating selects should have accessible names that include rating context
      const ratingSelects = screen.getAllByRole('combobox', { name: /valoración de .*, escala del 1 al 5/i });
      expect(ratingSelects).toHaveLength(4);
      
      // Each should have a corresponding description
      ratingSelects.forEach(select => {
        const describedBy = select.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(describedBy!)).toBeInTheDocument();
      });
    });

    it('should maintain functionality while improving accessibility', () => {
      render(<NewReviewPage />);
      
      // Verify all rating inputs are still functional
      const foodRating = screen.getByRole('combobox', { name: /valoración de comida/i });
      const serviceRating = screen.getByRole('combobox', { name: /valoración de servicio/i });
      const ambienceRating = screen.getByRole('combobox', { name: /valoración de ambiente/i });
      const valueRating = screen.getByRole('combobox', { name: /valoración de relación calidad-precio/i });
      
      // All should be enabled and interactive
      expect(foodRating).not.toBeDisabled();
      expect(serviceRating).not.toBeDisabled();
      expect(ambienceRating).not.toBeDisabled();
      expect(valueRating).not.toBeDisabled();
    });
  });
});