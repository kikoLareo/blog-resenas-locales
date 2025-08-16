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

    let timeoutId: NodeJS.Timeout;
    let observer: IntersectionObserver;

    const loadAd = () => {
      if (!adRef.current) return;

      try {
        // Create ad container with exact dimensions to prevent CLS
        const adContainer = adRef.current;
        adContainer.style.width = `${dimensions.width}px`;
        adContainer.style.height = `${dimensions.height}px`;
        adContainer.style.minHeight = `${dimensions.height}px`;
        adContainer.style.display = 'block';
        adContainer.style.position = 'relative';
        adContainer.style.overflow = 'hidden';
        adContainer.style.backgroundColor = '#f8f9fa';
        adContainer.style.border = '1px solid #e9ecef';

        // Add loading placeholder
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #6c757d;
          font-size: 12px;
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
          line-height: 1.4;
        `;
        placeholder.innerHTML = `
          <div style="margin-bottom: 4px;">📢</div>
          <div>Publicidad</div>
          <div style="font-size: 10px; opacity: 0.7;">${dimensions.width}×${dimensions.height}</div>
        `;
        adContainer.appendChild(placeholder);

        // Simulate ad loading (replace with actual ad network integration)
        timeoutId = setTimeout(() => {
          if (adContainer && placeholder) {
            // Remove placeholder
            adContainer.removeChild(placeholder);
            
            // Add actual ad content (replace with real ad network code)
            const adContent = document.createElement('div');
            adContent.style.cssText = `
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 14px;
              font-weight: 500;
              text-align: center;
            `;
            adContent.innerHTML = `
              <div>
                <div style="margin-bottom: 8px;">🎯</div>
                <div>Espacio Publicitario</div>
                <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">
                  ${slot.replace('-', ' ').toUpperCase()}
                </div>
              </div>
            `;
            adContainer.appendChild(adContent);
            
            setIsLoaded(true);
          }
        }, Math.random() * 1000 + 500); // Random delay to simulate real ad loading

      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading ad:', error);
        setHasError(true);
        
        // Show error state with preserved dimensions
        if (adRef.current) {
          adRef.current.innerHTML = `
            <div style="
              width: ${dimensions.width}px;
              height: ${dimensions.height}px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f8f9fa;
              border: 1px solid #e9ecef;
              color: #6c757d;
              font-size: 12px;
              font-family: system-ui, -apple-system, sans-serif;
              text-align: center;
            ">
              <div>
                <div style="margin-bottom: 4px;">⚠️</div>
                <div>Error de publicidad</div>
              </div>
            </div>
          `;
        }
      }
    };

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

      if (adRef.current) {
        observer.observe(adRef.current);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
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
          display: 'block',
        }}
      />
    </div>
  );
}

// Higher-order component for common ad placements
export function HeaderAd({ className }: { className?: string }) {
  return <AdSlot slot="header" className={className} priority />;
}

export function SidebarAd({ className }: { className?: string }) {
  return <AdSlot slot="sidebar" className={className} />;
}

export function InArticleAd({ className }: { className?: string }) {
  return <AdSlot slot="inArticle" className={className} />;
}

export function FooterAd({ className }: { className?: string }) {
  return <AdSlot slot="footer" className={className} />;
}
