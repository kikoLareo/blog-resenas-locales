'use client';

import { useEffect, useRef, useState } from 'react';
import { ADS_CONFIG } from '@/lib/constants';

interface AdSlotProps {
  slotId: keyof typeof ADS_CONFIG.slots;
  className?: string;
  lazy?: boolean;
  'data-testid'?: string;
}

export default function AdSlot({ 
  slotId, 
  className = '', 
  lazy = true,
  'data-testid': testId = 'ad-slot'
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  // Get slot configuration (map logical slotId -> size key)
  const sizeKey = ADS_CONFIG.slots[slotId] as keyof typeof ADS_CONFIG.sizes;
  const slotConfig = ADS_CONFIG.sizes[sizeKey];
  const { width, height } = slotConfig;

  // Check for consent (implement your consent management logic here)
  useEffect(() => {
    // This would integrate with your CMP (Consent Management Platform)
    const checkConsent = () => {
      // For demo purposes, assuming consent is granted
      // In production, check actual consent status
      setHasConsent(true);
    };

    checkConsent();
  }, []);

  // Load ad when in viewport (if lazy) and consent is granted
  useEffect(() => {
    if (!hasConsent || isLoaded) return;

    const container = containerRef.current;
    if (!container) return;

    const loadAd = () => {
      if (ADS_CONFIG.provider === 'none') {
        // Show placeholder for development
        setIsLoaded(true);
        return;
      }

      // Google Ad Manager implementation
      if (ADS_CONFIG.provider === 'gam' && typeof window !== 'undefined') {
        // Ensure GPT is loaded
        if (!window.googletag) {
          const script = document.createElement('script');
          script.src = ADS_CONFIG.scriptUrl;
          script.async = true;
          document.head.appendChild(script);
          
          script.onload = () => {
            window.googletag = window.googletag || { cmd: [] };
            initializeAd();
          };
        } else {
          initializeAd();
        }
      }

      // AdSense implementation
      if (ADS_CONFIG.provider === 'adsense' && typeof window !== 'undefined') {
        // AdSense implementation would go here
        // eslint-disable-next-line no-console
        console.log('AdSense implementation needed');
      }

      setIsLoaded(true);
    };

    const initializeAd = () => {
      if (typeof window !== 'undefined' && window.googletag) {
        window.googletag.cmd.push(() => {
          const slot = window.googletag
            .defineSlot(`/your-network-id/${ADS_CONFIG.slots[slotId]}`, [width, height], container)
            ?.addService(window.googletag.pubads());
          
          if (slot) {
            window.googletag.pubads().enableSingleRequest();
            window.googletag.enableServices();
            window.googletag.display(container);
          }
        });
      }
    };

    if (!lazy) {
      loadAd();
      return;
    }

  // Intersection Observer for lazy loading
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
          const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadAd();
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '100px',
          threshold: 0.1,
        }
      );

      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    } else {
      // Fallback: load ad immediately if IntersectionObserver is unavailable
      loadAd();
    }
  }, [hasConsent, isLoaded, lazy, slotId, width, height]);

  // Ads desactivados temporalmente: renderiza solo el contenedor reservado sin contenido de anuncio
  if (true) {
    return (
      <div
        ref={containerRef}
        className={`ad-slot ${className}`}
        style={{ 
          width, 
          height,
          minHeight: height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        data-testid={testId}
        aria-label="Advertisement (disabled)"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`ad-slot ${className}`}
      style={{ 
        width, 
        height,
        minHeight: height, // Prevent CLS
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      data-testid={testId}
      aria-label="Advertisement"
    >
      
    </div>
  );
}

// Extend Window type for TypeScript
declare global {
  interface Window {
    // Minimal shape to satisfy typing without usar any
    googletag: {
      cmd: Array<() => void>;
      pubads: () => { enableSingleRequest: () => void };
      enableServices: () => void;
      defineSlot: (adUnitPath: string, size: [number, number], div: Element) => { addService: (service: unknown) => unknown } | null;
      display: (div: Element) => void;
    };
  }
}
