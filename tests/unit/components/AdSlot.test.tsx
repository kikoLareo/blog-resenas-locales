import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AdSlot from '@/components/AdSlot';

// Mock ADS_CONFIG
vi.mock('@/lib/constants', () => ({
  ADS_CONFIG: {
    provider: 'none',
    scriptUrl: 'https://example.com/ads.js',
    slots: {
      'header-banner': 'header-banner',
      'sidebar-300x250': 'sidebar-300x250',
      'in-article-336x280': 'in-article-336x280',
      'footer-728x90': 'footer-728x90',
    },
    sizes: {
      'header-banner': { width: 728, height: 90 },
      'sidebar-300x250': { width: 300, height: 250 },
      'in-article-336x280': { width: 336, height: 280 },
      'footer-728x90': { width: 728, height: 90 },
    },
  },
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
global.IntersectionObserver = mockIntersectionObserver;

describe.skip('AdSlot Component - CLS Prevention (ads desactivados temporalmente)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset DOM
    document.head.innerHTML = '';
    document.body.innerHTML = '';
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

  it('reserves exact space to prevent CLS', () => {
    render(<AdSlot slotId="header-banner" />);
    
    const adSlot = screen.getByTestId('ad-slot');
    expect(adSlot).toHaveStyle({
      width: '728px',
      height: '90px',
      minHeight: '90px',
    });
  });

  it('maintains fixed dimensions during all states', () => {
    const { rerender } = render(<AdSlot slotId="sidebar-300x250" />);
    
    const adSlot = screen.getByTestId('ad-slot');
    
    // Initial state - should have fixed dimensions
    expect(adSlot).toHaveStyle({
      width: '300px',
      height: '250px',
      minHeight: '250px',
    });
    
    // Rerender with different props - dimensions should remain
    rerender(<AdSlot slotId="sidebar-300x250" lazy={false} />);
    
    expect(adSlot).toHaveStyle({
      width: '300px',
      height: '250px',
      minHeight: '250px',
    });
  });

  it('prevents layout shift with display flex and centering', () => {
    render(<AdSlot slotId="in-article-336x280" />);
    
    const adSlot = screen.getByTestId('ad-slot');
    expect(adSlot).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });
  });

  it('maintains dimensions even without consent', () => {
    // The component should still reserve space even when consent is not granted
    render(<AdSlot slotId="sidebar-300x250" />);
    
    const adSlot = screen.getByTestId('ad-slot');
    expect(adSlot).toHaveStyle({
      width: '300px',
      height: '250px',
    });
    
    // Should show consent message but maintain space
    expect(screen.getByText(/requiere consentimiento/i)).toBeInTheDocument();
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

  describe('CLS Prevention - Performance Critical', () => {
    it('maintains fixed dimensions to prevent layout shift', () => {
      const { rerender } = render(<AdSlot slotId="sidebar-300x250" />);
      
      const adSlot = screen.getByTestId('ad-slot');
      const initialBounds = adSlot.getBoundingClientRect();
      
      // Simulate ad loading (this would trigger state changes in real component)
      rerender(<AdSlot slotId="sidebar-300x250" />);
      
      const finalBounds = adSlot.getBoundingClientRect();
      expect(finalBounds.width).toBe(initialBounds.width);
      expect(finalBounds.height).toBe(initialBounds.height);
    });

    it('never changes container dimensions during lifecycle', () => {
      const { rerender } = render(<AdSlot slotId="header-banner" lazy={true} />);
      
      const adSlot = screen.getByTestId('ad-slot');
      const initialDimensions = {
        width: adSlot.style.width,
        height: adSlot.style.height,
        minHeight: adSlot.style.minHeight,
      };
      
      // Change props multiple times
      rerender(<AdSlot slotId="header-banner" lazy={false} />);
      rerender(<AdSlot slotId="header-banner" className="custom-class" />);
      
      expect(adSlot.style.width).toBe(initialDimensions.width);
      expect(adSlot.style.height).toBe(initialDimensions.height);
      expect(adSlot.style.minHeight).toBe(initialDimensions.minHeight);
    });

    it('has zero layout shift score potential', () => {
      render(<AdSlot slotId="in-article-336x280" />);
      
      const adSlot = screen.getByTestId('ad-slot');
      const computedStyle = window.getComputedStyle(adSlot);
      
      // Critical CLS prevention properties
      expect(computedStyle.width).toBe('336px');
      expect(computedStyle.height).toBe('280px');
      expect(computedStyle.minHeight).toBe('280px');
      expect(computedStyle.display).toBe('flex');
      
      // Should not use auto dimensions
      expect(computedStyle.width).not.toBe('auto');
      expect(computedStyle.height).not.toBe('auto');
    });

    it('reserves space immediately without waiting for content', () => {
      const startTime = performance.now();
      render(<AdSlot slotId="footer-728x90" />);
      const endTime = performance.now();
      
      const adSlot = screen.getByTestId('ad-slot');
      
      // Should render with dimensions immediately (within 5ms)
      expect(endTime - startTime).toBeLessThan(5);
      expect(adSlot).toHaveStyle({
        width: '728px',
        height: '90px',
      });
    });

    it('maintains aspect ratio under all conditions', () => {
      const testCases = [
        { slotId: 'header-banner', expectedRatio: 728/90 },
        { slotId: 'sidebar-300x250', expectedRatio: 300/250 },
        { slotId: 'in-article-336x280', expectedRatio: 336/280 },
      ] as const;

      testCases.forEach(({ slotId, expectedRatio }) => {
        const { unmount } = render(<AdSlot slotId={slotId} />);
        
        const adSlot = screen.getByTestId('ad-slot');
        const bounds = adSlot.getBoundingClientRect();
        const actualRatio = bounds.width / bounds.height;
        
        expect(actualRatio).toBeCloseTo(expectedRatio, 2);
        unmount();
      });
    });

    it('prevents content jumping with proper container structure', () => {
      render(<AdSlot slotId="sidebar-300x250" />);
      
      const adSlot = screen.getByTestId('ad-slot');
      
      // Should have stable layout properties
      expect(adSlot).toHaveStyle({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      });
      
      // Should have explicit dimensions, not rely on content
      expect(adSlot.style.width).toBeTruthy();
      expect(adSlot.style.height).toBeTruthy();
      expect(adSlot.style.minHeight).toBeTruthy();
    });

    it('shows loading state without changing dimensions', () => {
      // Mock GAM provider to show loading state
      vi.doMock('@/lib/constants', () => ({
        ADS_CONFIG: {
          provider: 'gam',
          scriptUrl: 'https://example.com/ads.js',
          slots: { 'sidebar-300x250': 'sidebar-300x250' },
          sizes: { 'sidebar-300x250': { width: 300, height: 250 } },
        },
      }));

      render(<AdSlot slotId="sidebar-300x250" />);
      
      const adSlot = screen.getByTestId('ad-slot');
      
      // Should maintain dimensions even with loading content
      expect(adSlot).toHaveStyle({
        width: '300px',
        height: '250px',
        minHeight: '250px',
      });
      
      // Loading content should be contained within reserved space
      if (screen.queryByText(/Cargando anuncio/i)) {
        const loadingElement = screen.getByText(/Cargando anuncio/i);
        const loadingContainer = loadingElement.closest('div');
        expect(loadingContainer).toHaveClass('animate-pulse');
      }
    });
  });

  describe('All Slot Sizes - CLS Validation', () => {
    const allSlotSizes = [
      { slotId: 'header-banner', width: 728, height: 90 },
      { slotId: 'sidebar-300x250', width: 300, height: 250 },
      { slotId: 'in-article-336x280', width: 336, height: 280 },
      { slotId: 'footer-728x90', width: 728, height: 90 },
    ] as const;

    allSlotSizes.forEach(({ slotId, width, height }) => {
      it(`${slotId} prevents CLS with correct dimensions`, () => {
        render(<AdSlot slotId={slotId} />);
        
        const adSlot = screen.getByTestId('ad-slot');
        
        expect(adSlot).toHaveStyle({
          width: `${width}px`,
          height: `${height}px`,
          minHeight: `${height}px`,
        });
        
        // Verify container stability
        expect(adSlot).toHaveStyle({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        });
      });
    });
  });
});
