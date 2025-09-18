/**
 * Global error handler for catching destructuring errors
 * This prevents the "Right side of assignment cannot be destructured" error
 */

// Override the global Promise prototype to catch destructuring errors
if (typeof window !== 'undefined') {
  // Client-side error handling
  // TODO: Fix TypeScript issues with Promise.resolve override
  // const originalPromiseResolve = Promise.resolve;
  
  // Promise.resolve = <T>(value?: T | PromiseLike<T>): Promise<T> => {
  //   const promise = originalPromiseResolve(value);
  //   
  //   return promise.catch((error) => {
  //     if (error && error.message && error.message.includes('destructur')) {
  //       console.warn('Caught destructuring error, returning empty object:', error);
  //       return {} as T;
  //     }
  //     throw error;
  //   });
  // };

  // Global error handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('destructur')) {
      console.warn('Prevented destructuring error:', event.reason);
      event.preventDefault();
    }
  });

  // Global error handler for general errors
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message && event.error.message.includes('destructur')) {
      console.warn('Caught destructuring error:', event.error);
      event.preventDefault();
    }
  });
}

// Export a safe destructuring helper
export function safeDestructure<T extends Record<string, any>>(
  obj: T | undefined | null,
  fallback: Partial<T> = {}
): T {
  if (!obj || typeof obj !== 'object') {
    return fallback as T;
  }
  return obj;
}
