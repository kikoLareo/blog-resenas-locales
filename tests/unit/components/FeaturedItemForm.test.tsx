import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeaturedItemForm } from '@/components/admin/FeaturedItemForm';

// Mock fetch globally
global.fetch = vi.fn();

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
  });

  it('should display error when API call fails', async () => {
    // Mock failed API response
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(<FeaturedItemForm {...defaultProps} />);

    // Change type to trigger API call
    const typeSelect = screen.getByLabelText(/tipo de contenido/i);
    await userEvent.click(typeSelect);
    
    const reviewOption = screen.getByText('⭐ Reseña');
    await userEvent.click(reviewOption);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    // Check that retry button is present
    expect(screen.getByText(/reintentar/i)).toBeInTheDocument();
  });

  it('should show validation error when title is empty', async () => {
    render(<FeaturedItemForm {...defaultProps} />);

    // Try to submit with empty title
    const submitButton = screen.getByRole('button', { name: /crear/i });
    await userEvent.click(submitButton);

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
    const typeSelect = screen.getByLabelText(/tipo de contenido/i);
    await userEvent.click(typeSelect);
    
    const reviewOption = screen.getByText('⭐ Reseña');
    await userEvent.click(reviewOption);

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

    // Submit form
    const submitButton = screen.getByRole('button', { name: /crear/i });
    await userEvent.click(submitButton);

    // Check loading state
    expect(screen.getByText(/creando.../i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should clear errors when user types in fields', async () => {
    render(<FeaturedItemForm {...defaultProps} />);

    // Submit to trigger validation errors
    const submitButton = screen.getByRole('button', { name: /crear/i });
    await userEvent.click(submitButton);

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
    const typeSelect = screen.getByLabelText(/tipo de contenido/i);
    await userEvent.click(typeSelect);
    
    const reviewOption = screen.getByText('⭐ Reseña');
    await userEvent.click(reviewOption);

    // Check for loading state
    expect(screen.getByText(/cargando.../i)).toBeInTheDocument();
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
});