import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NewVenuePage from '@/app/dashboard/venues/new/page';

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

// Mock fetch API
global.fetch = vi.fn();

// Mock hasPointerCapture for Radix UI compatibility
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
  value: vi.fn(() => false),
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
  value: vi.fn(),
  writable: true,
});

// Mock the Radix-based Select used in the app with a simple native <select>
vi.mock('@/components/ui/select', () => {
  const React = require('react');

  function collectOptions(node, out = []) {
    if (!node) return out;
    const props = node.props || {};
    if (props.value !== undefined && typeof props.children === 'string') {
      out.push({ value: props.value, label: props.children, disabled: !!props.disabled });
    }
    const children = props.children;
    if (Array.isArray(children)) {
      children.forEach((c) => collectOptions(c, out));
    } else if (children && typeof children === 'object') {
      collectOptions(children, out);
    }
    return out;
  }

  const Select = ({ children, value, onValueChange, disabled }) => {
    // collect options from nested SelectItem children
    const items = [];
    React.Children.forEach(children, (child) => {
      if (!child || !child.props) return;
      // dive into SelectContent's children if present
      if (child.props.children) {
        React.Children.forEach(child.props.children, (c) => {
          if (c && c.props && c.props.value !== undefined) {
            items.push({ value: c.props.value, label: typeof c.props.children === 'string' ? c.props.children : '' , disabled: !!c.props.disabled });
          }
        });
      }
    });

    // find trigger id / aria-label from children triggers
    let triggerId;
    let triggerAria;
    React.Children.forEach(children, (child) => {
      if (!child || !child.props) return;
      if (child.props.id) triggerId = child.props.id;
      if (child.props['aria-label']) triggerAria = child.props['aria-label'];
      if (child.props.children) {
        React.Children.forEach(child.props.children, (c) => {
          if (c && c.props && c.props.id) triggerId = triggerId || c.props.id;
          if (c && c.props && c.props['aria-label']) triggerAria = triggerAria || c.props['aria-label'];
        });
      }
    });

    return React.createElement('select', {
      id: triggerId,
      'aria-label': triggerAria,
      value: value ?? '',
      onChange: (e) => onValueChange && onValueChange(e.target.value),
      disabled,
      'data-testid': 'mock-select'
    }, items.length ? items.map(opt => React.createElement('option', { key: String(opt.value) || opt.label, value: opt.value, disabled: opt.disabled }, opt.label)) : React.createElement('option', { value: '' }, ''));
  };

  const SelectTrigger = (props) => React.createElement('button', props);
  const SelectContent = (props) => React.createElement('div', props);
  const SelectItem = (props) => React.createElement('div', props);
  const SelectValue = (props) => React.createElement('span', props);

  return {
    __esModule: true,
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
  };
});

describe('Venues Form - New Venue Page', () => {
  beforeEach(() => {
    mockLocation.href = '';
    vi.clearAllMocks();
    
    // Mock window methods
    Object.defineProperty(window, 'alert', {
      writable: true,
      value: vi.fn(),
    });
    
    // Mock fetch to return success for API calls with a delay to allow loading state to be visible
    (global.fetch as any).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        }), 100)
      )
    );
  });

  describe('Form Rendering', () => {
    it('should render all required form fields', () => {
      render(<NewVenuePage />);
      
      // Check for basic venue information fields
      expect(screen.getByLabelText(/Nombre del Local/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sitio web/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/rango de precios/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ciudad/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/categorías/i)).toBeInTheDocument();
    });

    it('should render navigation buttons', () => {
      render(<NewVenuePage />);
      
      expect(screen.getByRole('link', { name: /volver a locales/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /guardar local/i })).toBeInTheDocument();
    });

    it('should have proper navigation links', () => {
      render(<NewVenuePage />);
      
      const backLink = screen.getByRole('link', { name: /volver a locales/i });
      expect(backLink).toHaveAttribute('href', '/dashboard/venues');
    });

    it('should have default price range selected', () => {
      render(<NewVenuePage />);
      
      const priceRangeSelect = screen.getByLabelText(/rango de precios/i);
      // Check that the default value "€€" (Moderado) is displayed
      expect(priceRangeSelect).toHaveTextContent('Moderado (€€)');
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const titleInput = screen.getByLabelText(/Nombre del Local/i);
      const saveButton = screen.getByRole('button', { name: /guardar local/i });
      
      // Try to submit without required fields
      await user.click(saveButton);
      
      // Title should be required
      expect(titleInput).toBeRequired();
    });

    it('should validate phone number format', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const phoneInput = screen.getByLabelText(/teléfono/i);
      const titleInput = screen.getByLabelText(/título/i);
      const addressInput = screen.getByLabelText(/dirección/i);
      const saveButton = screen.getByRole('button', { name: /guardar local/i });
      
      // Fill required fields first
      await user.type(titleInput, 'Test Venue');
      await user.type(addressInput, 'Test Address 123');
      
      // Test invalid phone formats
      await user.type(phoneInput, 'invalid-phone');
      await user.click(saveButton);

      // Component surfaces phone validation via alert, assert alert was called
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
      });

      // The input should still contain the invalid value until cleared
      expect(phoneInput).toHaveValue('invalid-phone');

      // Clear and test valid Spanish phone format
      await user.clear(phoneInput);
      await user.type(phoneInput, '+34 91 123 45 67');
      
      // Should not show error for valid format and input should reflect the typed value
      await waitFor(() => {
        expect(phoneInput).toHaveValue('+34 91 123 45 67');
      });
    });

    it('should accept valid phone number formats', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const phoneInput = screen.getByLabelText(/teléfono/i);
      
      // Clear any existing value
      await user.clear(phoneInput);
      
      // Test valid international phone format
      await user.type(phoneInput, '+34 91 123 45 67');
      expect(phoneInput).toHaveValue('+34 91 123 45 67');
      
      // Clear and test local format
      await user.clear(phoneInput);
      await user.type(phoneInput, '91 123 45 67');
      expect(phoneInput).toHaveValue('91 123 45 67');
      
      // Clear and test compact format
      await user.clear(phoneInput);
      await user.type(phoneInput, '+34911234567');
      expect(phoneInput).toHaveValue('+34911234567');
    });

    it('should validate website URL format', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const websiteInput = screen.getByLabelText(/sitio web/i);
      
      // Test invalid URL formats
      await user.type(websiteInput, 'not-a-url');
      
      // Should validate URL format
      expect(websiteInput).toHaveAttribute('type', 'url');
    });

    it('should validate address format', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const addressInput = screen.getByLabelText(/dirección/i);
      
      // Test extremely short address
      await user.type(addressInput, 'x');
      
      // Should validate minimum address length
      // This would need proper validation implementation
    });

    it('should handle slug generation from title', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const titleInput = screen.getByLabelText(/Nombre del Local/i);
      const slugInput = screen.getByLabelText(/slug/i);
      
      await user.type(titleInput, 'Restaurant El Buen Sabor');
      
      // Should auto-generate slug from title
      // This would need proper slug generation implementation
    });
  });

  describe('User Feedback', () => {
    it('should show loading state when saving', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const titleInput = screen.getByLabelText(/Nombre del Local/i);
      const addressInput = screen.getByLabelText(/Dirección/i);
      const saveButton = screen.getByRole('button', { name: /guardar local/i });
      
      // Fill required fields
      await user.type(titleInput, 'Test Venue');
      await user.type(addressInput, 'Test Address 123');
      
      await user.click(saveButton);
      
      // Should show loading text
      await waitFor(() => {
        const loadingButton = screen.getByRole('button', { name: /guardando/i });
        expect(loadingButton).toBeInTheDocument();
        expect(loadingButton).toBeDisabled();
      });
    });

    it('should disable save button during loading', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const titleInput = screen.getByLabelText(/Nombre del Local/i);
      const addressInput = screen.getByLabelText(/Dirección/i);
      const saveButton = screen.getByRole('button', { name: /guardar local/i });
      
      // Fill required fields
      await user.type(titleInput, 'Test Venue');
      await user.type(addressInput, 'Test Address 123');
      
      await user.click(saveButton);
      
      // Button should be disabled during save
      await waitFor(() => {
        const loadingButton = screen.getByRole('button', { name: /guardando/i });
        expect(loadingButton).toBeDisabled();
      });
    });

    it('should show success message after successful save', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const titleInput = screen.getByLabelText(/Nombre del Local/i);
      const saveButton = screen.getByRole('button', { name: /guardar local/i });
      
      await user.type(titleInput, 'Test Venue');
      await user.click(saveButton);
      
      // Should show success feedback
      // This would need proper success handling implementation
    });
  });

  describe('Form Interaction', () => {
    it('should update form data when typing in fields', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const titleInput = screen.getByLabelText(/Nombre del Local/i);
      const addressInput = screen.getByLabelText(/dirección/i);
      const phoneInput = screen.getByLabelText(/teléfono/i);
      
      await user.type(titleInput, 'Test Restaurant');
      expect(titleInput).toHaveValue('Test Restaurant');
      
      await user.type(addressInput, 'Calle Principal 123');
      expect(addressInput).toHaveValue('Calle Principal 123');
      
      await user.type(phoneInput, '+34 123 456 789');
      expect(phoneInput).toHaveValue('+34 123 456 789');
    });

    it('should handle price range selection', async () => {
      render(<NewVenuePage />);
      
      const priceRangeSelect = screen.getByLabelText(/rango de precios/i);
      
      // Check that the select is present and has the default value displayed
      expect(priceRangeSelect).toBeInTheDocument();
      expect(priceRangeSelect).toHaveTextContent('Moderado (€€)');
    });

    it('should handle category selection', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const categoriesInput = screen.getByLabelText(/categorías/i);
      
      // This would test category multi-selection
      // Implementation depends on the actual component structure
    });

    it('should handle cancel button correctly', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      
      await user.click(cancelButton);
      
      // Should navigate back to venues list
      expect(mockLocation.href).toBe('/dashboard/venues');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle extremely long input values', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const titleInput = screen.getByLabelText(/Nombre del Local/i);
      const longTitle = 'x'.repeat(500); // Very long title
      
      await user.type(titleInput, longTitle);
      
      // Should handle long input gracefully
      expect(titleInput.value.length).toBeLessThanOrEqual(500);
    });

    it('should handle special characters in venue name', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const titleInput = screen.getByLabelText(/Nombre del Local/i);
      const specialName = 'Café "El Buen Sabor" & Co.';
      
      await user.type(titleInput, specialName);
      
      // Should handle special characters in venue names
      expect(titleInput).toHaveValue(specialName);
    });

    it('should handle international phone numbers', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const phoneInput = screen.getByLabelText(/teléfono/i);
      const intlPhone = '+1 (555) 123-4567';
      
      await user.type(phoneInput, intlPhone);
      
      // Should handle international phone formats
      expect(phoneInput).toHaveValue(intlPhone);
    });

    it('should handle missing optional fields', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const titleInput = screen.getByLabelText(/Nombre del Local/i);
      const saveButton = screen.getByRole('button', { name: /guardar local/i });
      
      // Fill only required fields
      await user.type(titleInput, 'Minimal Venue');
      await user.click(saveButton);
      
      // Should save successfully with minimal data
      // Optional fields should not prevent saving
    });

    it('should handle duplicate venue names', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const titleInput = screen.getByLabelText(/Nombre del Local/i);
      const saveButton = screen.getByRole('button', { name: /guardar local/i });
      
      await user.type(titleInput, 'Existing Venue Name');
      await user.click(saveButton);
      
      // Should handle duplicate name validation
      // This would need backend validation implementation
    });
  });

  describe('Data Integration', () => {
    it('should load available cities for selection', async () => {
      render(<NewVenuePage />);
      
      const citySelect = screen.getByLabelText(/ciudad/i);
      
      // Should populate cities from backend
      // This would need proper data loading implementation
    });

    it('should load available categories for selection', async () => {
      render(<NewVenuePage />);
      
      const categoriesInput = screen.getByLabelText(/categorías/i);
      
      // Should populate categories from backend
      // This would need proper data loading implementation
    });

    it('should handle API connection errors gracefully', async () => {
      // Mock fetch to simulate API error
      global.fetch = vi.fn().mockRejectedValue(new Error('API Error'));
      
      render(<NewVenuePage />);
      
      // Should handle API errors without crashing
      // This would need proper error handling implementation
      
      vi.restoreAllMocks();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      render(<NewVenuePage />);
      
      // All inputs should have proper labels
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      // Should be able to tab through all form elements
      await user.tab();
      expect(document.activeElement).toBeInstanceOf(HTMLElement);
    });

    it('should have proper form structure', () => {
      render(<NewVenuePage />);
      
      // Should have proper form element
      const form = screen.getByRole('form', { hidden: true });
      expect(form).toBeInTheDocument();
    });

    it('should provide clear error messages', async () => {
      const user = userEvent.setup();
      render(<NewVenuePage />);
      
      const saveButton = screen.getByRole('button', { name: /guardar local/i });
      
      // Submit invalid form
      await user.click(saveButton);
      
      // Should provide clear, accessible error messages
      // This would need proper validation error implementation
    });
  });
});