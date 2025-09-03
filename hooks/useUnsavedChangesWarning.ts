import { useEffect } from 'react';

interface UseUnsavedChangesWarningOptions {
  hasUnsavedChanges: boolean;
  message?: string;
}

/**
 * Hook to warn users about unsaved changes when they try to navigate away
 * @param hasUnsavedChanges - Boolean indicating if there are unsaved changes
 * @param message - Custom warning message (optional)
 */
export function useUnsavedChangesWarning({ 
  hasUnsavedChanges, 
  message = "You have unsaved changes. Are you sure you want to leave?" 
}: UseUnsavedChangesWarningOptions) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);
}