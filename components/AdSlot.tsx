'use client';

import { useEffect, useRef, useState } from 'react';
import { ADS_CONFIG } from '@/lib/constants';
import { hasConsent } from '@/lib/consent';

interface AdSlotProps {
  slot: keyof typeof ADS_CONFIG.slots;
  className?: string;
  priority?: boolean;
}

export default function AdSlot({ slot, className = '', priority = false }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const slotId = ADS_CONFIG.slots[slot];
  const dimensions = ADS_CONFIG.sizes[slotId];

  useEffect(() => {
    // Check initial consent status
    setConsentGiven(hasConsent('advertising'));

    // Listen for consent updates
    const handleConsentUpdate = () => {
      setConsentGiven(hasConsent('advertising'));
    };

    window.addEventListener('consent-updated', handleConsentUpdate);
    return () => window.removeEventListener('consent-updated', handleConsentUpdate);
  }, []);

  useEffect(() => {
    // Skip if ads are disabled, no provider configured, or no consent
    if (!ADS_CONFIG.enabled || ADS_CONFIG.provider === 'none' || !ADS_CONFIG.scriptUrl || !consentGiven) {
      return;
    }

    // Skip if already loaded or in error state
    if (isLoaded || hasError) {
      return;
    }

    let observer: IntersectionObserver;

    const loadAd = () => {
      if (!adRef.current) return;

      try {
        setIsLoaded(true);
        
        // In a real implementation, this would:
        // 1. Load the ad provider script dynamically
        // 2. Initialize the ad slot
        // 3. Request and display the ad
        // 4. Handle success/error states
        
        // For now, we just mark as loaded to prevent CLS
        // eslint-disable-next-line no-console
        console.log(`Ad slot ${slotId} loaded`);
              } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Failed to load ad slot ${slotId}:`, error);
        setHasError(true);
        setIsLoaded(false);
      }
    };

         // Add a small delay to ensure DOM is ready
     const timeoutRef = setTimeout(() => {
      if (!adRef.current) return;

      if (priority) {
        // Load immediately for priority ads (above the fold)
        loadAd();
      } else {
        // Use Intersection Observer for lazy loading
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                loadAd();
                observer.disconnect();
              }
            });
          },
          {
            rootMargin: '50px', // Load 50px before entering viewport
            threshold: 0.1,
          }
        );

        observer.observe(adRef.current);
      }
    }, 100);

         return () => {
       clearTimeout(timeoutRef);
       if (observer) {
         observer.disconnect();
       }
     };
  }, [slot, slotId, dimensions, priority, isLoaded, hasError, consentGiven]);

  // Don't render anything if ads are disabled
  if (!ADS_CONFIG.enabled) {
    return null;
  }

  // Show placeholder if no consent given
  if (!consentGiven) {
    return (
      <div
        className={`ad-slot ad-slot-${slot} ${className}`}
        data-testid={`ad-slot-${slot}`}
        aria-label={`Publicidad ${slot.replace('-', ' ')}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          minWidth: dimensions.width,
          minHeight: dimensions.height,
          maxWidth: dimensions.width,
          maxHeight: dimensions.height,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f9fa',
            border: '1px solid #e9ecef',
            color: '#6c757d',
            fontSize: '12px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ marginBottom: '4px' }}>🔒</div>
            <div>Anuncios deshabilitados</div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>Acepta cookies para ver anuncios</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`ad-slot ad-slot-${slot} ${className}`}
      data-testid={`ad-slot-${slot}`}
      aria-label={`Publicidad ${slot.replace('-', ' ')}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        minWidth: dimensions.width,
        minHeight: dimensions.height,
        maxWidth: dimensions.width,
        maxHeight: dimensions.height,
      }}
    >
      <div
        ref={adRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: hasError ? '#fee' : '#f8f9fa',
          border: '1px solid #e9ecef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6c757d',
          fontSize: '12px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {hasError ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '4px' }}>⚠️</div>
            <div>Error cargando anuncio</div>
          </div>
        ) : !isLoaded ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '4px' }}>📺</div>
            <div>Cargando anuncio...</div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '4px' }}>📺</div>
            <div>Espacio publicitario</div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>
              {dimensions.width}×{dimensions.height}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Higher-order components for specific ad slots
export const HeaderAd = ({ className }: { className?: string }) => (
  <AdSlot slot="header" className={className} priority={true} />
);

export const SidebarAd = ({ className }: { className?: string }) => (
  <AdSlot slot="sidebar" className={className} />
);

export const InArticleAd = ({ className }: { className?: string }) => (
  <AdSlot slot="inArticle" className={className} />
);

export const FooterAd = ({ className }: { className?: string }) => (
  <AdSlot slot="footer" className={className} />
);
