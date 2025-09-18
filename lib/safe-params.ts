/**
 * Safely destructure params from Next.js 15 Promise-based params
 * Prevents "Right side of assignment cannot be destructured" errors
 */
export async function safeParams<T extends Record<string, string>>(
  paramsPromise: Promise<T>
): Promise<T> {
  try {
    const params = await paramsPromise;
    if (!params || typeof params !== 'object') {
      throw new Error('Invalid params object');
    }
    return params;
  } catch (error) {
    console.error('Error resolving params:', error);
    // Return empty object with proper typing
    return {} as T;
  }
}

/**
 * Safely get a specific param value
 */
export async function safeParam<T extends Record<string, string>>(
  paramsPromise: Promise<T>,
  key: keyof T
): Promise<string | undefined> {
  try {
    const params = await safeParams(paramsPromise);
    return params[key];
  } catch (error) {
    console.error(`Error getting param ${String(key)}:`, error);
    return undefined;
  }
}
