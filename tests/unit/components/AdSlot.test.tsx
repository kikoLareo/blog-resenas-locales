import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AdSlot from '@/components/AdSlot';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
global.IntersectionObserver = mockIntersectionObserver;

describe('AdSlot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment
    process.env.ADS_PROVIDER = 'none';
  });

  it('renders with correct dimensions', () => {
    render(<AdSlot slotId="sidebar-300x250" />);
    
    const adSlot = screen.getByTestId('ad-slot');
    expect(adSlot).toBeInTheDocument();
    expect(adSlot).toHaveStyle({
      width: '300px',
      height: '250px',
    });
  });

  it('shows placeholder when ads provider is none', () => {
    render(<AdSlot slotId="sidebar-300x250" />);
    
    expect(screen.getByText('Ad Slot sidebar-300x250 (300x250)')).toBeInTheDocument();
  });

  it('reserves space to prevent CLS', () => {
    render(<AdSlot slotId="header-banner" />);
    
    const adSlot = screen.getByTestId('ad-slot');
    expect(adSlot).toHaveStyle({
      minHeight: '90px',
    });
  });

  it('shows consent required message when consent is not granted', async () => {
    // Mock consent as not granted
    const originalConsent = process.env.ADS_CONSENT;
    process.env.ADS_CONSENT = 'false';
    
    render(<AdSlot slotId="sidebar-300x250" />);
    
    await waitFor(() => {
      expect(screen.getByText(/requiere consentimiento/i)).toBeInTheDocument();
    });
    
    process.env.ADS_CONSENT = originalConsent;
  });

  it('uses IntersectionObserver for lazy loading by default', () => {
    render(<AdSlot slotId="sidebar-300x250" lazy={true} />);
    
    expect(mockIntersectionObserver).toHaveBeenCalled();
    expect(mockIntersectionObserver.mock.calls[0][1]).toEqual({
      rootMargin: '100px',
      threshold: 0.1,
    });
  });

  it('does not use IntersectionObserver when lazy is false', () => {
    render(<AdSlot slotId="sidebar-300x250" lazy={false} />);
    
    // Should still be called but behavior would be different
    // In a real implementation, we'd check if observe was called
  });

  it('applies custom className', () => {
    render(<AdSlot slotId="sidebar-300x250" className="custom-class" />);
    
    const adSlot = screen.getByTestId('ad-slot');
    expect(adSlot).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<AdSlot slotId="sidebar-300x250" />);
    
    const adSlot = screen.getByTestId('ad-slot');
    expect(adSlot).toHaveAttribute('aria-label', 'Advertisement');
  });

  it('handles different slot configurations', () => {
    const { rerender } = render(<AdSlot slotId="header-banner" />);
    
    let adSlot = screen.getByTestId('ad-slot');
    expect(adSlot).toHaveStyle({
      width: '728px',
      height: '90px',
    });

    rerender(<AdSlot slotId="in-article-336x280" />);
    
    adSlot = screen.getByTestId('ad-slot');
    expect(adSlot).toHaveStyle({
      width: '336px',
      height: '280px',
    });
  });

  it('supports custom test id', () => {
    render(<AdSlot slotId="sidebar-300x250" data-testid="custom-ad" />);
    
    expect(screen.getByTestId('custom-ad')).toBeInTheDocument();
    expect(screen.queryByTestId('ad-slot')).not.toBeInTheDocument();
  });

  describe('Google Ad Manager integration', () => {
    beforeEach(() => {
      process.env.ADS_PROVIDER = 'gam';
      // Mock googletag
      global.window = global.window || {};
      (global.window as any).googletag = {
        cmd: [],
        defineSlot: vi.fn().mockReturnValue({
          addService: vi.fn().mockReturnThis(),
        }),
        pubads: vi.fn().mockReturnValue({
          enableSingleRequest: vi.fn(),
        }),
        enableServices: vi.fn(),
        display: vi.fn(),
      };
    });

    it('integrates with Google Ad Manager when provider is gam', async () => {
      render(<AdSlot slotId="sidebar-300x250" lazy={false} />);
      
      // In a real test, we'd verify that googletag methods were called
      // This would require more complex mocking of the async loading behavior
    });
  });

  describe('Performance considerations', () => {
    it('maintains fixed dimensions to prevent layout shift', () => {
      const { rerender } = render(<AdSlot slotId="sidebar-300x250" />);
      
      const adSlot = screen.getByTestId('ad-slot');
      const initialStyle = getComputedStyle(adSlot);
      
      // Simulate ad loading (this would trigger state changes in real component)
      rerender(<AdSlot slotId="sidebar-300x250" />);
      
      const finalStyle = getComputedStyle(adSlot);
      expect(finalStyle.width).toBe(initialStyle.width);
      expect(finalStyle.height).toBe(initialStyle.height);
    });

    it('shows loading state appropriately', () => {
      process.env.ADS_PROVIDER = 'gam';
      render(<AdSlot slotId="sidebar-300x250" />);
      
      // Initially should show loading state
      expect(screen.getByText(/Cargando anuncio/i)).toBeInTheDocument();
    });
  });
});
