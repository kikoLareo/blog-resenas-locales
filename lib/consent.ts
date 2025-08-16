'use client';

// Simple consent management system
// In production, replace with a proper CMP like OneTrust, Cookiebot, etc.

const CONSENT_STORAGE_KEY = 'user-consent';

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
  timestamp: number;
}

export const DEFAULT_CONSENT: ConsentPreferences = {
  necessary: true, // Always required
  analytics: false,
  advertising: false,
  functional: false,
  timestamp: Date.now(),
};

// Get consent from localStorage
export function getConsent(): ConsentPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_CONSENT;
  }

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_CONSENT;
    }

    const parsed = JSON.parse(stored) as ConsentPreferences;
    
    // Check if consent is older than 13 months (GDPR requirement)
    const thirteenMonthsAgo = Date.now() - (13 * 30 * 24 * 60 * 60 * 1000);
    if (parsed.timestamp < thirteenMonthsAgo) {
      return DEFAULT_CONSENT;
    }

    return parsed;
  } catch {
    return DEFAULT_CONSENT;
  }
}

// Save consent to localStorage
export function setConsent(preferences: Partial<ConsentPreferences>): void {
  if (typeof window === 'undefined') return;

  const currentConsent = getConsent();
  const newConsent: ConsentPreferences = {
    ...currentConsent,
    ...preferences,
    necessary: true, // Always true
    timestamp: Date.now(),
  };

  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newConsent));
  
  // Dispatch custom event for components to listen to
  window.dispatchEvent(new CustomEvent('consent-updated', {
    detail: newConsent,
  }));
}

// Check if user has given consent for a specific category
export function hasConsent(category: keyof ConsentPreferences): boolean {
  if (category === 'necessary') return true;
  
  const consent = getConsent();
  return consent[category] === true;
}

// Check if consent banner should be shown
export function shouldShowConsentBanner(): boolean {
  if (typeof window === 'undefined') return false;
  
  const consent = getConsent();
  return consent.timestamp === DEFAULT_CONSENT.timestamp;
}

// Clear all consent (for testing or user request)
export function clearConsent(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(CONSENT_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('consent-cleared'));
}