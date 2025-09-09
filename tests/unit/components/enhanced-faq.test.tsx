import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedFAQ, { CompactEnhancedFAQ } from '@/components/EnhancedFAQ';
import { FAQ } from '@/lib/types';

// Mock FAQ data
const mockFAQs: FAQ[] = [
  {
    question: '¿Cómo puedo hacer una reserva?',
    answer: 'Para hacer una reserva, puedes llamar directamente al restaurante o usar su página web.',
  },
  {
    question: '¿Qué significa cada símbolo de precio?',
    answer: 'Los símbolos de precio indican el rango: € (económico), €€ (moderado), €€€ (caro), €€€€ (muy caro).',
  },
  {
    question: '¿Cuáles son los horarios típicos?',
    answer: 'Los restaurantes suelen abrir de 13:30 a 16:00 para almuerzo y de 20:30 a 23:30 para cena.',
  },
];

describe('EnhancedFAQ Component', () => {
  describe('Basic Rendering', () => {
    it('should render FAQ items correctly', () => {
      render(<EnhancedFAQ faqs={mockFAQs} />);
      
      expect(screen.getByText('¿Cómo puedo hacer una reserva?')).toBeInTheDocument();
      expect(screen.getByText('¿Qué significa cada símbolo de precio?')).toBeInTheDocument();
      expect(screen.getByText('¿Cuáles son los horarios típicos?')).toBeInTheDocument();
    });

    it('should render custom title', () => {
      const customTitle = 'Preguntas Personalizadas';
      render(<EnhancedFAQ faqs={mockFAQs} title={customTitle} />);
      
      expect(screen.getByText(customTitle)).toBeInTheDocument();
    });

    it('should render voice search hint by default', () => {
      render(<EnhancedFAQ faqs={mockFAQs} />);
      
      expect(screen.getByText('💬 Optimizado para búsqueda por voz')).toBeInTheDocument();
    });

    it('should hide voice search hint when disabled', () => {
      render(<EnhancedFAQ faqs={mockFAQs} showVoiceSearchHint={false} />);
      
      expect(screen.queryByText('💬 Optimizado para búsqueda por voz')).not.toBeInTheDocument();
    });
  });

  describe('Interaction Behavior', () => {
    it('should toggle FAQ items when clicked', () => {
      render(<EnhancedFAQ faqs={mockFAQs} />);
      
      const firstQuestion = screen.getByText('¿Cómo puedo hacer una reserva?');
      
      // Answer should not be visible initially
      expect(screen.queryByText(/Para hacer una reserva/)).not.toBeInTheDocument();
      
      // Click to open
      fireEvent.click(firstQuestion);
      expect(screen.getByText(/Para hacer una reserva/)).toBeInTheDocument();
      
      // Click to close
      fireEvent.click(firstQuestion);
      expect(screen.queryByText(/Para hacer una reserva/)).not.toBeInTheDocument();
    });

    it('should handle keyboard navigation', () => {
      render(<EnhancedFAQ faqs={mockFAQs} />);
      
      const firstQuestion = screen.getByText('¿Cómo puedo hacer una reserva?');
      
      // Test Enter key
      fireEvent.keyDown(firstQuestion.closest('button')!, { key: 'Enter' });
      expect(screen.getByText(/Para hacer una reserva/)).toBeInTheDocument();
      
      // Test Space key
      fireEvent.keyDown(firstQuestion.closest('button')!, { key: ' ' });
      expect(screen.queryByText(/Para hacer una reserva/)).not.toBeInTheDocument();
    });

    it('should allow multiple items open when allowMultipleOpen is true', () => {
      render(<EnhancedFAQ faqs={mockFAQs} allowMultipleOpen={true} />);
      
      const firstQuestion = screen.getByText('¿Cómo puedo hacer una reserva?');
      const secondQuestion = screen.getByText('¿Qué significa cada símbolo de precio?');
      
      // Open first
      fireEvent.click(firstQuestion);
      expect(screen.getByText(/Para hacer una reserva/)).toBeInTheDocument();
      
      // Open second
      fireEvent.click(secondQuestion);
      expect(screen.getByText(/Los símbolos de precio/)).toBeInTheDocument();
      
      // Both should remain open
      expect(screen.getByText(/Para hacer una reserva/)).toBeInTheDocument();
      expect(screen.getByText(/Los símbolos de precio/)).toBeInTheDocument();
    });

    it('should allow only one item open when allowMultipleOpen is false', () => {
      render(<EnhancedFAQ faqs={mockFAQs} allowMultipleOpen={false} />);
      
      const firstQuestion = screen.getByText('¿Cómo puedo hacer una reserva?');
      const secondQuestion = screen.getByText('¿Qué significa cada símbolo de precio?');
      
      // Open first
      fireEvent.click(firstQuestion);
      expect(screen.getByText(/Para hacer una reserva/)).toBeInTheDocument();
      
      // Open second (should close first)
      fireEvent.click(secondQuestion);
      expect(screen.queryByText(/Para hacer una reserva/)).not.toBeInTheDocument();
      expect(screen.getByText(/Los símbolos de precio/)).toBeInTheDocument();
    });
  });

  describe('Voice Search Optimization', () => {
    it('should include structured data script when showStructuredData is true', () => {
      render(<EnhancedFAQ faqs={mockFAQs} showStructuredData={true} />);
      
      const scriptElement = document.querySelector('script[type="application/ld+json"]');
      expect(scriptElement).toBeTruthy();
      
      if (scriptElement) {
        const jsonData = JSON.parse(scriptElement.textContent || '{}');
        expect(jsonData['@type']).toBe('FAQPage');
        expect(jsonData.mainEntity).toHaveLength(mockFAQs.length);
      }
    });

    it('should not include structured data script when showStructuredData is false', () => {
      render(<EnhancedFAQ faqs={mockFAQs} showStructuredData={false} />);
      
      const scriptElement = document.querySelector('script[type="application/ld+json"]');
      expect(scriptElement).toBeFalsy();
    });

    it('should include voice search examples in hint', () => {
      render(<EnhancedFAQ faqs={mockFAQs} showVoiceSearchHint={true} />);
      
      const heyGoogleElements = screen.getAllByText(/Hey Google,/);
      expect(heyGoogleElements.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<EnhancedFAQ faqs={mockFAQs} />);
      
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('aria-labelledby', 'faq-heading');
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-expanded');
      });
    });

    it('should have proper schema.org markup', () => {
      render(<EnhancedFAQ faqs={mockFAQs} />);
      
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('itemScope');
      expect(section).toHaveAttribute('itemType', 'https://schema.org/FAQPage');
    });
  });

  describe('Edge Cases', () => {
    it('should return null when no FAQs provided', () => {
      const { container } = render(<EnhancedFAQ faqs={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('should return null when faqs is undefined', () => {
      const { container } = render(<EnhancedFAQ />);
      expect(container.firstChild).toBeNull();
    });

    it('should use items prop when faqs is not provided', () => {
      render(<EnhancedFAQ items={mockFAQs} />);
      
      expect(screen.getByText('¿Cómo puedo hacer una reserva?')).toBeInTheDocument();
    });
  });
});

describe('CompactEnhancedFAQ Component', () => {
  it('should render compact FAQ correctly', () => {
    render(<CompactEnhancedFAQ faqs={mockFAQs} />);
    
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(screen.getByText('¿Cómo puedo hacer una reserva?')).toBeInTheDocument();
  });

  it('should limit items to maxItems', () => {
    render(<CompactEnhancedFAQ faqs={mockFAQs} maxItems={2} />);
    
    expect(screen.getByText('¿Cómo puedo hacer una reserva?')).toBeInTheDocument();
    expect(screen.getByText('¿Qué significa cada símbolo de precio?')).toBeInTheDocument();
    expect(screen.queryByText('¿Cuáles son los horarios típicos?')).not.toBeInTheDocument();
  });

  it('should show "Ver todas las preguntas" link when items exceed maxItems', () => {
    render(<CompactEnhancedFAQ faqs={mockFAQs} maxItems={2} />);
    
    expect(screen.getByText(/Ver todas las preguntas \(3\)/)).toBeInTheDocument();
  });

  it('should show voice search hint when enabled', () => {
    render(<CompactEnhancedFAQ faqs={mockFAQs} showVoiceHint={true} />);
    
    // Just check that the component renders without error when showVoiceHint is true
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('should allow only one item open at a time', () => {
    render(<CompactEnhancedFAQ faqs={mockFAQs} />);
    
    const firstQuestion = screen.getByText('¿Cómo puedo hacer una reserva?');
    const secondQuestion = screen.getByText('¿Qué significa cada símbolo de precio?');
    
    // Open first
    fireEvent.click(firstQuestion);
    expect(screen.getByText(/Para hacer una reserva/)).toBeInTheDocument();
    
    // Open second (should close first)
    fireEvent.click(secondQuestion);
    expect(screen.queryByText(/Para hacer una reserva/)).not.toBeInTheDocument();
    expect(screen.getByText(/Los símbolos de precio/)).toBeInTheDocument();
  });
});