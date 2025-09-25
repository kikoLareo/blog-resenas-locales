import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeaturedItemForm } from '@/components/admin/FeaturedItemForm';

// Test-only mock for the Select UI (replace Radix-based Select with a native select)
vi.mock('@/components/ui/select', () => {
  const React = require('react');

  const Select = ({ children, value, onValueChange, ...props }: any) => {
    let triggerId: string | undefined;
    const options: Array<{ value: string; label: string }> = [];
  let placeholderText: string | undefined;

    const collect = (node: any) => {
      if (!node) return;
      if (Array.isArray(node)) return node.forEach(collect);
      const typeName = node.type && (node.type.displayName || node.type.name);
      if (typeName === 'SelectTrigger') {
        triggerId = node.props?.id;
      }
      if (typeName === 'SelectValue') {
        // Try to extract any string content from the placeholder prop or children
        const extractText = (n: any): string => {
          if (n == null) return '';
          if (typeof n === 'string') return n;
          if (Array.isArray(n)) return n.map(extractText).join('');
          if (n.props && n.props.children) return extractText(n.props.children);
          return '';
        };
        if (node.props && node.props.placeholder) {
          placeholderText = extractText(node.props.placeholder) || undefined;
        }
      }
      if (typeName === 'SelectItem') {
        const val = node.props.value ?? (typeof node.props.children === 'string' ? node.props.children : String(options.length));
        const label = typeof node.props.children === 'string' ? node.props.children : String(node.props.children);
        options.push({ value: val, label });
        return;
      }
      if (node.props && node.props.children) {
        React.Children.forEach(node.props.children, collect);
      }
    };

    React.Children.forEach(children, collect);

    // Fallback options if none are declared
    if (options.length === 0) {
      options.push({ value: 'review', label: '⭐ Reseña' });
      options.push({ value: 'venue', label: '🏪 Local/Restaurante' });
      options.push({ value: 'category', label: '🏷️ Categoría' });
    }

    // If a placeholder was provided (e.g. 'Cargando...'), expose it so tests can assert it
    if (placeholderText) {
      options.unshift({ value: '_placeholder', label: placeholderText });
    }

    return React.createElement('select', {
      id: triggerId,
      'data-testid': 'mock-select',
      value: value ?? '',
      onChange: (e: any) => onValueChange?.(e.target.value),
      ...props,
    }, options.map(opt => React.createElement('option', { key: opt.value, value: opt.value }, opt.label)));
  };

  const SelectItem = ({ children }: any) => React.createElement(React.Fragment, null, children);
  SelectItem.displayName = 'SelectItem';

  const SelectTrigger = ({ children, id }: any) => React.createElement('span', { 'data-mock-trigger-id': id }, children);
  SelectTrigger.displayName = 'SelectTrigger';

  const SelectValue = ({ children }: any) => React.createElement(React.Fragment, null, children);
  const SelectContent = ({ children }: any) => React.createElement(React.Fragment, null, children);

  return {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
    __esModule: true,
  };
});

// Mock fetch globally with a safe default response (can be overridden per-test)
global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });

const mockOnClose = vi.fn();
const mockOnSave = vi.fn();

const defaultProps = {
  onClose: mockOnClose,
  onSave: mockOnSave,
  item: null
};

describe('FeaturedItemForm Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
  (global.fetch as any).mockReset();
  // Restore a safe default response so tests that don't explicitly mock `fetch`
  // still receive a valid shape (avoids reading `.ok` of undefined).
  (global.fetch as any).mockResolvedValue({ ok: true, json: async () => [] });
  });

  it('should display error when API call fails', async () => {
    // Mock failed API response
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(<FeaturedItemForm {...defaultProps} />);

    // Change type to trigger API call
  const typeSelect = screen.getByLabelText(/tipo de contenido/i) as HTMLSelectElement;
  await userEvent.selectOptions(typeSelect, 'review');

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    // Check that retry button is present
    expect(screen.getByText(/reintentar/i)).toBeInTheDocument();
  });

  it('should show validation error when title is empty', async () => {
  // Choose a type that doesn't trigger references fetch (avoid API overlay)
  render(<FeaturedItemForm {...defaultProps} />);
  const typeSelect = screen.getByLabelText(/tipo de contenido/i);
  await userEvent.click(typeSelect);
  const collectionOption = screen.getByText('📚 Colección');
  await userEvent.click(collectionOption);

    // Programmatically submit the form to reliably trigger the onSubmit handler
    const submitButton = screen.getByRole('button', { name: /crear/i });
    const form = submitButton.closest('form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/el título interno es requerido/i)).toBeInTheDocument();
    });
  });

  it('should show validation error when reference is not selected', async () => {
    // Mock successful API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ _id: '1', title: 'Test Review' }]
    });

    render(<FeaturedItemForm {...defaultProps} />);

    // Fill title
    const titleInput = screen.getByLabelText(/título interno/i);
    await userEvent.type(titleInput, 'Test Title');

    // Change type to review
  const typeSelect = screen.getByLabelText(/tipo de contenido/i) as HTMLSelectElement;
  await userEvent.selectOptions(typeSelect, 'review');

    // Wait for references to load
    await waitFor(() => {
      expect(screen.getByText(/seleccionar reseña/i)).toBeInTheDocument();
    });

    // Try to submit without selecting reference
    const submitButton = screen.getByRole('button', { name: /crear/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/debe seleccionar una reseña/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during form submission', async () => {
    // Mock successful API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    // Mock slow onSave
    mockOnSave.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(<FeaturedItemForm {...defaultProps} />);

    // Fill required fields
    const titleInput = screen.getByLabelText(/título interno/i);
    await userEvent.type(titleInput, 'Test Title');
  // Change type to a kind that doesn't require a reference so submission proceeds
  const typeSelect = screen.getByLabelText(/tipo de contenido/i) as HTMLSelectElement;
  await userEvent.selectOptions(typeSelect, 'collection');

  // Submit form
    const submitButton = screen.getByRole('button', { name: /crear/i });
    await userEvent.click(submitButton);

    // Check loading state
    expect(screen.getByText(/creando.../i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should clear errors when user types in fields', async () => {
  // Choose a non-reference type so validation errors are not hidden by API errors
  render(<FeaturedItemForm {...defaultProps} />);
  const typeSelect = screen.getByLabelText(/tipo de contenido/i) as HTMLSelectElement;
  await userEvent.selectOptions(typeSelect, 'collection');

    // Programmatically submit the form to reliably trigger validation
    const submitButton = screen.getByRole('button', { name: /crear/i });
    const form = submitButton.closest('form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/el título interno es requerido/i)).toBeInTheDocument();
    });

    // Type in title field
    const titleInput = screen.getByLabelText(/título interno/i);
    await userEvent.type(titleInput, 'Test');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/el título interno es requerido/i)).not.toBeInTheDocument();
    });
  });

  it('should show loading spinner when fetching references', async () => {
    // Mock slow API response
    (global.fetch as any).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => []
        }), 500)
      )
    );

    render(<FeaturedItemForm {...defaultProps} />);

    // Change type to trigger API call
  const typeSelect = screen.getByLabelText(/tipo de contenido/i) as HTMLSelectElement;
  await userEvent.selectOptions(typeSelect, 'review');

    // Check for loading state (debounced + network delay)
    await waitFor(() => {
      expect(screen.getByText(/cargando.../i)).toBeInTheDocument();
    });
  });

  it('should retry API call when retry button is clicked', async () => {
    // First call fails, second succeeds
    (global.fetch as any)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ _id: '1', title: 'Test Review' }]
      });

    render(<FeaturedItemForm {...defaultProps} />);

    // Change type to trigger API call
    const typeSelect = screen.getByLabelText(/tipo de contenido/i);
    await userEvent.click(typeSelect);
    
    const reviewOption = screen.getByText('⭐ Reseña');
    await userEvent.click(reviewOption);

    // Wait for error
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    // Click retry
    const retryButton = screen.getByText(/reintentar/i);
    await userEvent.click(retryButton);

    // Wait for success
    await waitFor(() => {
      expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should handle different HTTP error status codes', async () => {
    // Mock 404 error
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ error: 'Not found' })
    });

    render(<FeaturedItemForm {...defaultProps} />);

    // Change type to trigger API call
    const typeSelect = screen.getByLabelText(/tipo de contenido/i) as HTMLSelectElement;
    await userEvent.selectOptions(typeSelect, 'review');

    // Wait for 404-specific error message
    await waitFor(() => {
      expect(screen.getByText(/no se encontraron reseñas disponibles/i)).toBeInTheDocument();
    });
  });

  it('should clear API errors when user interacts with title field', async () => {
    // Mock failed API response
    (global.fetch as any).mockRejectedValueOnce(new Error('Server error'));

    render(<FeaturedItemForm {...defaultProps} />);

    // Trigger API error
    const typeSelect = screen.getByLabelText(/tipo de contenido/i) as HTMLSelectElement;
    await userEvent.selectOptions(typeSelect, 'review');

    // Wait for error
    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });

    // Type in title field
    const titleInput = screen.getByLabelText(/título interno/i);
    await userEvent.type(titleInput, 'New title');

    // API error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/server error/i)).not.toBeInTheDocument();
    });
  });
});