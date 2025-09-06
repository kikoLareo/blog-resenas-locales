import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

// Mock fetch for venues API
const mockVenues = [
  {
    _id: 'venue1',
    title: 'Restaurant Uno',
    slug: { current: 'restaurant-uno' }
  },
  {
    _id: 'venue2', 
    title: 'Pizzería Dos',
    slug: { current: 'pizzeria-dos' }
  },
  {
    _id: 'venue3',
    title: 'Café Tres',
    slug: { current: 'cafe-tres' }
  }
];

describe('Reviews Form - Dynamic Venues Loading', () => {
  beforeEach(() => {
    mockLocation.href = '';
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('should call venues API on component mount', async () => {
    // Mock successful API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVenues,
    });

    render(<NewReviewPage />);
    
    // Verify API was called
    expect(global.fetch).toHaveBeenCalledWith('/api/admin/venues');
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/cargando locales/i)).not.toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    // Mock pending API response
    (global.fetch as any).mockImplementation(() => new Promise(() => {}));

    render(<NewReviewPage />);
    
    // Should show loading state in placeholder
    expect(screen.getByText(/cargando locales/i)).toBeInTheDocument();
  });

  it('should not show hard-coded venue options anymore', () => {
    // Mock successful API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVenues,
    });

    render(<NewReviewPage />);
    
    // Verify old hard-coded venues are NOT present in the DOM
    expect(screen.queryByText('Pizzería Tradizionale')).not.toBeInTheDocument();
    expect(screen.queryByText('Restaurante El Bueno')).not.toBeInTheDocument();
    expect(screen.queryByText('Café Central')).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    // Mock API failure
    (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

    render(<NewReviewPage />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/error.*cargar.*locales/i)).toBeInTheDocument();
    });
  });

  it('should show empty state when no venues returned', async () => {
    // Mock empty API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<NewReviewPage />);
    
    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText(/no hay locales disponibles/i)).toBeInTheDocument();
    });
  });
});