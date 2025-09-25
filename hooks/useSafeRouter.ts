'use client';

import { useRouter as useNextRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Safe wrapper around useRouter that prevents destructuring errors
 */
export function useSafeRouter() {
  try {
    const router = useNextRouter();
    
    const safePush = useCallback((url: string) => {
      try {
        if (router && typeof router.push === 'function') {
          router.push(url);
        } else {
          // Fallback to window.location if router is not available
          if (typeof window !== 'undefined') {
            window.location.href = url;
          }
        }
      } catch (error) {
        console.warn('Router push failed, using window.location:', error);
        if (typeof window !== 'undefined') {
          window.location.href = url;
        }
      }
    }, [router]);

    const safeReplace = useCallback((url: string) => {
      try {
        if (router && typeof router.replace === 'function') {
          router.replace(url);
        } else {
          // Fallback to window.location if router is not available
          if (typeof window !== 'undefined') {
            window.location.replace(url);
          }
        }
      } catch (error) {
        console.warn('Router replace failed, using window.location:', error);
        if (typeof window !== 'undefined') {
          window.location.replace(url);
        }
      }
    }, [router]);

    return {
      push: safePush,
      replace: safeReplace,
      back: () => {
        try {
          if (router && typeof router.back === 'function') {
            router.back();
          } else if (typeof window !== 'undefined') {
            window.history.back();
          }
        } catch (error) {
          console.warn('Router back failed:', error);
          if (typeof window !== 'undefined') {
            window.history.back();
          }
        }
      },
      forward: () => {
        try {
          if (router && typeof router.forward === 'function') {
            router.forward();
          } else if (typeof window !== 'undefined') {
            window.history.forward();
          }
        } catch (error) {
          console.warn('Router forward failed:', error);
          if (typeof window !== 'undefined') {
            window.history.forward();
          }
        }
      },
      refresh: () => {
        try {
          if (router && typeof router.refresh === 'function') {
            router.refresh();
          } else if (typeof window !== 'undefined') {
            window.location.reload();
          }
        } catch (error) {
          console.warn('Router refresh failed:', error);
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }
      }
    };
  } catch (error) {
    console.warn('useRouter failed, providing fallback methods:', error);
    
    // Return fallback methods that use window.location
    return {
      push: (url: string) => {
        if (typeof window !== 'undefined') {
          window.location.href = url;
        }
      },
      replace: (url: string) => {
        if (typeof window !== 'undefined') {
          window.location.replace(url);
        }
      },
      back: () => {
        if (typeof window !== 'undefined') {
          window.history.back();
        }
      },
      forward: () => {
        if (typeof window !== 'undefined') {
          window.history.forward();
        }
      },
      refresh: () => {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }
    };
  }
}
