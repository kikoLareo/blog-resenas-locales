import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/admin/venues/route';

// Mock the dependencies
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(() => Promise.resolve({ user: { id: '1', name: 'Test User' } }))
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {}
}));

vi.mock('@/lib/admin-sanity', () => ({
  adminSanityClient: {
    fetch: vi.fn()
  },
  adminSanityWriteClient: {
    create: vi.fn()
  }
}));

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn()
}));

describe('Venues API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/admin/venues', () => {
    it('should create a venue successfully', async () => {
      const { adminSanityWriteClient } = await import('@/lib/admin-sanity');
      
      // Mock the create method to return a successful response
      vi.mocked(adminSanityWriteClient.create).mockResolvedValue({
        _id: 'venue-123',
        _type: 'venue',
        title: 'Test Venue',
        slug: { current: 'test-venue' },
        address: 'Test Address'
      });

      const request = new NextRequest('http://localhost:3000/api/admin/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Venue',
          address: 'Test Address',
          description: 'A test venue',
          priceRange: '€€'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Local creado exitosamente');
      expect(adminSanityWriteClient.create).toHaveBeenCalledWith({
        _type: 'venue',
        title: 'Test Venue',
        slug: {
          current: 'test-venue',
          _type: 'slug'
        },
        description: 'A test venue',
        address: 'Test Address',
        phone: '',
        website: '',
        priceRange: '€€',
        city: undefined,
        categories: [],
        featured: false,
        geo: undefined,
        images: []
      });
    });

    it('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '', // Empty title
          address: '' // Empty address
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Título y dirección son requeridos');
    });

    it('should auto-generate slug if not provided', async () => {
      const { adminSanityWriteClient } = await import('@/lib/admin-sanity');
      
      vi.mocked(adminSanityWriteClient.create).mockResolvedValue({
        _id: 'venue-123',
        _type: 'venue',
        title: 'Test Venue With Spaces',
        slug: { current: 'test-venue-with-spaces' }
      });

      const request = new NextRequest('http://localhost:3000/api/admin/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Venue With Spaces',
          address: 'Test Address'
        })
      });

      const response = await POST(request);
      
      expect(response.status).toBe(200);
      expect(adminSanityWriteClient.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: {
            current: 'test-venue-with-spaces',
            _type: 'slug'
          }
        })
      );
    });

    it('should handle Sanity client errors', async () => {
      const { adminSanityWriteClient } = await import('@/lib/admin-sanity');
      
      vi.mocked(adminSanityWriteClient.create).mockRejectedValue(new Error('Sanity error'));

      const request = new NextRequest('http://localhost:3000/api/admin/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Venue',
          address: 'Test Address'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error interno del servidor');
    });
  });
});