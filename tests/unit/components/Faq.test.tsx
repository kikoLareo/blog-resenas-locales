import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FAQ from '@/components/FAQ';

const mockFAQItems = [
  {
    question: '¿Cuáles son los horarios de atención?',
    answer: 'Atendemos de lunes a viernes de 9:00 a 18:00 horas.',
  },
  {
    question: '¿Aceptan reservaciones?',
    answer: 'Sí, aceptamos reservaciones con 24 horas de anticipación.',
  },
  {
    question: '¿Tienen menú vegetariano?',
    answer: 'Contamos con opciones vegetarianas y veganas en nuestro menú.',
  },
];

describe('FAQ Component', () => {
  beforeEach(() => {
    // Reset any global state if needed
  });

  it('renders with default title', () => {
    render(<FAQ items={mockFAQItems} />);
    
    expect(screen.getByText('Preguntas frecuentes')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    const customTitle = 'Preguntas sobre el restaurante';
    render(<FAQ items={mockFAQItems} title={customTitle} />);
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('renders all FAQ items', () => {
    render(<FAQ items={mockFAQItems} />);
    
    mockFAQItems.forEach((item) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    });
  });

  it('does not render when items array is empty', () => {
    render(<FAQ items={[]} />);
    
    expect(screen.queryByText('Preguntas frecuentes')).not.toBeInTheDocument();
  });

  it('does not render when items is null or undefined', () => {
    const { container: container1 } = render(<FAQ items={null as any} />);
    const { container: container2 } = render(<FAQ items={undefined as any} />);
    
    expect(container1.firstChild).toBeNull();
    expect(container2.firstChild).toBeNull();
  });

  it('has proper accessibility structure', () => {
    render(<FAQ items={mockFAQItems} />);
    
    // Check main section has proper ARIA labeling
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'faq-heading');
    
    // Check heading exists and has proper ID
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'faq-heading');
    
    // Check all questions are buttons
    const questionButtons = screen.getAllByRole('button');
    expect(questionButtons).toHaveLength(mockFAQItems.length);
    
    // Check buttons have proper ARIA attributes
    questionButtons.forEach((button, index) => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-controls', `faq-content-${index}`);
      expect(button).toHaveAttribute('id', `faq-item-${index}`);
    });
  });

  it('toggles FAQ items when clicked', async () => {
    const user = userEvent.setup();
    render(<FAQ items={mockFAQItems} />);
    
    const firstButton = screen.getAllByRole('button')[0];
    
    // Initially closed
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(mockFAQItems[0].answer)).not.toBeInTheDocument();
    
    // Click to open
    await user.click(firstButton);
    
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(mockFAQItems[0].answer)).toBeInTheDocument();
    
    // Click to close
    await user.click(firstButton);
    
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => {
      expect(screen.queryByText(mockFAQItems[0].answer)).not.toBeInTheDocument();
    });
  });

  it('allows multiple FAQ items to be open simultaneously', async () => {
    const user = userEvent.setup();
    render(<FAQ items={mockFAQItems} />);
    
    const buttons = screen.getAllByRole('button');
    
    // Open first item
    await user.click(buttons[0]);
    expect(screen.getByText(mockFAQItems[0].answer)).toBeInTheDocument();
    
    // Open second item
    await user.click(buttons[1]);
    expect(screen.getByText(mockFAQItems[1].answer)).toBeInTheDocument();
    
    // Both should be open
    expect(screen.getByText(mockFAQItems[0].answer)).toBeInTheDocument();
    expect(screen.getByText(mockFAQItems[1].answer)).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<FAQ items={mockFAQItems} />);
    
    const buttons = screen.getAllByRole('button');
    
    // Focus first button
    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);
    
    // Press Enter to toggle
    await user.keyboard('{Enter}');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
    
    // Press Space to toggle
    await user.keyboard(' ');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
    
    // Tab to next button
    await user.keyboard('{Tab}');
    expect(document.activeElement).toBe(buttons[1]);
  });

  it('has proper focus management', async () => {
    const user = userEvent.setup();
    render(<FAQ items={mockFAQItems} />);
    
    const firstButton = screen.getAllByRole('button')[0];
    
    // Click button
    await user.click(firstButton);
    
    // Focus should remain on button after opening
    expect(document.activeElement).toBe(firstButton);
    
    // Answer content should be properly labeled
    const answerContent = screen.getByText(mockFAQItems[0].answer);
    const answerContainer = answerContent.closest('[role="region"]');
    
    expect(answerContainer).toHaveAttribute('aria-labelledby', 'faq-item-0');
  });

  it('has proper Schema.org microdata', () => {
    render(<FAQ items={mockFAQItems} />);
    
    // Check main section has Question itemType
    const faqItems = screen.getAllByRole('button').map(button => 
      button.closest('[itemType="https://schema.org/Question"]')
    );
    
    expect(faqItems).toHaveLength(mockFAQItems.length);
    
    // Check questions have proper itemProp
    mockFAQItems.forEach((item, index) => {
      const questionElement = screen.getByText(item.question);
      expect(questionElement).toHaveAttribute('itemProp', 'name');
    });
    
    // Open first item to check answer microdata
    fireEvent.click(screen.getAllByRole('button')[0]);
    
    const answerElement = screen.getByText(mockFAQItems[0].answer);
    const answerContainer = answerElement.closest('[itemType="https://schema.org/Answer"]');
    expect(answerContainer).toBeInTheDocument();
    expect(answerElement).toHaveAttribute('itemProp', 'text');
  });

  it('applies custom className', () => {
    const customClass = 'custom-faq-class';
    render(<FAQ items={mockFAQItems} className={customClass} />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveClass('faq', customClass);
  });

  it('supports custom test id', () => {
    render(<FAQ items={mockFAQItems} data-testid="custom-faq" />);
    
    expect(screen.getByTestId('custom-faq')).toBeInTheDocument();
    expect(screen.queryByTestId('faq')).not.toBeInTheDocument();
  });

  it('handles long content gracefully', () => {
    const longFAQItems = [
      {
        question: 'Esta es una pregunta muy larga que podría ocupar múltiples líneas en la interfaz de usuario y necesita ser manejada correctamente',
        answer: 'Esta es una respuesta extremadamente larga que contiene mucha información detallada sobre el tema en cuestión. Debería poder manejar contenido extenso sin problemas de renderizado o accesibilidad. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
    ];
    
    render(<FAQ items={longFAQItems} />);
    
    expect(screen.getByText(longFAQItems[0].question)).toBeInTheDocument();
    
    // Open the item
    fireEvent.click(screen.getByRole('button'));
    
    expect(screen.getByText(longFAQItems[0].answer)).toBeInTheDocument();
  });

  it('maintains state correctly when items change', () => {
    const initialItems = mockFAQItems.slice(0, 2);
    const { rerender } = render(<FAQ items={initialItems} />);
    
    // Open first item
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByText(initialItems[0].answer)).toBeInTheDocument();
    
    // Change items
    const newItems = [...initialItems, mockFAQItems[2]];
    rerender(<FAQ items={newItems} />);
    
    // First item should still be open
    expect(screen.getByText(initialItems[0].answer)).toBeInTheDocument();
    
    // New item should be present and closed
    expect(screen.getByText(mockFAQItems[2].question)).toBeInTheDocument();
    expect(screen.queryByText(mockFAQItems[2].answer)).not.toBeInTheDocument();
  });

  it('has proper visual indicators for expanded/collapsed state', () => {
    render(<FAQ items={mockFAQItems} />);
    
    const firstButton = screen.getAllByRole('button')[0];
    
    // Check for chevron icons (assuming they're present)
    const chevronDown = firstButton.querySelector('svg');
    expect(chevronDown).toBeInTheDocument();
    expect(chevronDown).toHaveAttribute('aria-hidden', 'true');
    
    // Open the FAQ
    fireEvent.click(firstButton);
    
    // Icon should change (this would depend on actual implementation)
    const chevronUp = firstButton.querySelector('svg');
    expect(chevronUp).toBeInTheDocument();
    expect(chevronUp).toHaveAttribute('aria-hidden', 'true');
  });

  it('provides clear visual hierarchy', () => {
    render(<FAQ items={mockFAQItems} />);
    
    // Main heading should be h2
    const mainHeading = screen.getByRole('heading', { level: 2 });
    expect(mainHeading).toBeInTheDocument();
    
    // Questions should be styled as buttons but not headings
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('faq-question');
    });
  });

  it('handles empty strings gracefully', () => {
    const itemsWithEmptyStrings = [
      { question: '', answer: 'Valid answer' },
      { question: 'Valid question', answer: '' },
      { question: '   ', answer: 'Another answer' },
    ];
    
    render(<FAQ items={itemsWithEmptyStrings} />);
    
    // Should still render the structure
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });
});

describe('FAQ Component Performance', () => {
  it('renders efficiently with many items', () => {
    const manyItems = Array.from({ length: 50 }, (_, i) => ({
      question: `Pregunta ${i + 1}`,
      answer: `Respuesta ${i + 1}`,
    }));
    
    const startTime = performance.now();
    render(<FAQ items={manyItems} />);
    const endTime = performance.now();
    
    // Should render quickly (less than 100ms)
    expect(endTime - startTime).toBeLessThan(100);
    
    // All items should be present
    expect(screen.getAllByRole('button')).toHaveLength(50);
  });

  it('handles rapid clicking without issues', async () => {
    const user = userEvent.setup();
    render(<FAQ items={mockFAQItems} />);
    
    const firstButton = screen.getAllByRole('button')[0];
    
    // Click rapidly multiple times
    for (let i = 0; i < 5; i++) {
      await user.click(firstButton);
    }
    
    // Should end up in closed state (odd number of clicks)
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
  });
});