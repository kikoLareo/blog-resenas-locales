import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VenueDetailPage from '../../../app/dashboard/venues/[id]/page';
import '@testing-library/jest-dom';

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
  notFound: vi.fn(),
})); 

// Mock admin Sanity client
vi.mock('../../../lib/admin-sanity', () => ({
  adminSanityClient: {
    fetch: vi.fn(),
  },
}));

// Mock admin queries
vi.mock('../../../lib/admin-queries', () => ({
  venueByIdQuery: 'mockQuery',
}));

// Mock ImageManager component
vi.mock('../../../components/ImageManager', () => ({
  default: ({ title }: { title: string }) => <div data-testid="image-manager">{title}</div>
}));

// Mock window.location
const mockLocation = {
  href: '',
  reload: vi.fn(),
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock fetch
global.fetch = vi.fn();

const mockVenue = {
  _id: 'venue-1',
  title: 'Test Venue',
  slug: { current: 'test-venue' },
  description: 'A test venue description',
  address: 'Test Address 123',
  phone: '+34 123 456 789',
  website: 'https://example.com',
  priceRange: '€€',
  schemaType: 'Restaurant',
  _createdAt: '2024-01-01T10:00:00Z',
  _updatedAt: '2024-01-01T10:00:00Z',
  city: {
    _id: 'city-1',
    title: 'Test City',
    slug: { current: 'test-city' }
  },
  categories: [
    { _id: 'cat-1', title: 'Restaurant' }
  ],
  reviews: []
};

describe('Venue Edit Form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = '';
    (mockLocation.reload as any).mockClear();
    
    // Mock successful API responses
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Local actualizado exitosamente' })
    });
  });

  describe('Edit Form Functionality', () => {
    it('should render edit button and open modal', async () => {
      const user = userEvent.setup();
      
      // Mock the venue data fetch
      const { adminSanityClient } = await import('../../../lib/admin-sanity');
      (adminSanityClient.fetch as any).mockResolvedValue(mockVenue);
      
      render(await VenueDetailPage({ params: Promise.resolve({ id: 'venue-1' }) }));
      
      const editButton = screen.getByRole('button', { name: /editar local/i });
      expect(editButton).toBeInTheDocument();
      
      await user.click(editButton);
      
      // Modal should open
      expect(screen.getByRole('heading', { name: 'Editar Local' })).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Venue')).toBeInTheDocument();
    });

    it('should update form fields when editing', async () => {
      const user = userEvent.setup();
      
      const { adminSanityClient } = await import('../../../lib/admin-sanity');
      (adminSanityClient.fetch as any).mockResolvedValue(mockVenue);
      
      render(await VenueDetailPage({ params: Promise.resolve({ id: 'venue-1' }) }));
      
      // Open edit modal
      const editButton = screen.getByRole('button', { name: /editar local/i });
      await user.click(editButton);
      
      // Update title field
      const titleInput = screen.getByDisplayValue('Test Venue');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Venue Name');
      
      expect(titleInput).toHaveValue('Updated Venue Name');
    });

    it('should call API when saving changes', async () => {
      const user = userEvent.setup();
      
      const { adminSanityClient } = await import('../../../lib/admin-sanity');
      (adminSanityClient.fetch as any).mockResolvedValue(mockVenue);
      
      render(await VenueDetailPage({ params: Promise.resolve({ id: 'venue-1' }) }));
      
      // Open edit modal
      const editButton = screen.getByRole('button', { name: /editar local/i });
      await user.click(editButton);
      
      // Update title
      const titleInput = screen.getByDisplayValue('Test Venue');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Venue');
      
      // Save changes
      const saveButton = screen.getByRole('button', { name: /guardar cambios/i });
      await user.click(saveButton);
      
      // Should call the API
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/admin/venues/venue-1',
          expect.objectContaining({
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: expect.stringContaining('Updated Venue')
          })
        );
      });
    });

    it('should show loading state while saving', async () => {
      const user = userEvent.setup();
      
      // Mock a slow API response
      (global.fetch as any).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        }), 100))
      );
      
      const { adminSanityClient } = await import('../../../lib/admin-sanity');
      (adminSanityClient.fetch as any).mockResolvedValue(mockVenue);
      
      render(await VenueDetailPage({ params: Promise.resolve({ id: 'venue-1' }) }));
      
      // Open edit modal
      const editButton = screen.getByRole('button', { name: /editar local/i });
      await user.click(editButton);
      
      // Save changes
      const saveButton = screen.getByRole('button', { name: /guardar cambios/i });
      await user.click(saveButton);
      
      // Should show loading state
      expect(screen.getByRole('button', { name: /guardando/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled();
    });

    it('should validate required fields', async () => {
      const user = userEvent.setup();
      
      // Mock alert
      window.alert = vi.fn();
      
      const { adminSanityClient } = await import('../../../lib/admin-sanity');
      (adminSanityClient.fetch as any).mockResolvedValue(mockVenue);
      
      render(await VenueDetailPage({ params: Promise.resolve({ id: 'venue-1' }) }));
      
      // Open edit modal
      const editButton = screen.getByRole('button', { name: /editar local/i });
      await user.click(editButton);
      
      // Clear required fields
      const titleInput = screen.getByDisplayValue('Test Venue');
      await user.clear(titleInput);
      
      // Try to save
      const saveButton = screen.getByRole('button', { name: /guardar cambios/i });
      await user.click(saveButton);
      
      // Should show validation error
      expect(window.alert).toHaveBeenCalledWith('Título y dirección son campos requeridos');
    });

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock API error
      (global.fetch as any).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Server error' })
      });
      
      // Mock alert
      window.alert = vi.fn();
      
      const { adminSanityClient } = await import('../../../lib/admin-sanity');
      (adminSanityClient.fetch as any).mockResolvedValue(mockVenue);
      
      render(await VenueDetailPage({ params: Promise.resolve({ id: 'venue-1' }) }));
      
      // Open edit modal
      const editButton = screen.getByRole('button', { name: /editar local/i });
      await user.click(editButton);
      
      // Save changes
      const saveButton = screen.getByRole('button', { name: /guardar cambios/i });
      await user.click(saveButton);
      
      // Should show error message
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Server error');
      });
    });

    it('should close modal after successful save', async () => {
      const user = userEvent.setup();
      
      const { adminSanityClient } = await import('../../../lib/admin-sanity');
      (adminSanityClient.fetch as any).mockResolvedValue(mockVenue);
      
      render(await VenueDetailPage({ params: Promise.resolve({ id: 'venue-1' }) }));
      
      // Open edit modal
      const editButton = screen.getByRole('button', { name: /editar local/i });
      await user.click(editButton);
      
      // Save changes
      const saveButton = screen.getByRole('button', { name: /guardar cambios/i });
      await user.click(saveButton);
      
      // Modal should be closed after save
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Editar Local' })).not.toBeInTheDocument();
      });
    });
  });
});