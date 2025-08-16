/**
 * IndexNow integration for notifying search engines about URL updates
 */

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

/**
 * Builds the IndexNow payload for submission
 */
export function buildIndexNowPayload(
  urls: string[],
  key: string,
  host: string,
  keyLocation: string
): IndexNowPayload {
  return {
    host,
    key,
    keyLocation,
    urlList: urls
  };
}

/**
 * Submits URLs to IndexNow API
 * Reads configuration from environment variables:
 * - INDEXNOW_HOST: Domain without protocol
 * - INDEXNOW_KEY: IndexNow API key
 * - INDEXNOW_KEY_LOCATION: URL where the key verification file is served
 * 
 * If any required environment variable is missing, the function does nothing.
 * Errors are logged but not thrown to avoid blocking the calling flow.
 */
export async function submitToIndexNow(urls: string[]): Promise<number> {
  const host = process.env.INDEXNOW_HOST;
  const key = process.env.INDEXNOW_KEY;
  const keyLocation = process.env.INDEXNOW_KEY_LOCATION;

  // Skip if configuration is incomplete
  if (!host || !key || !keyLocation) {
    // eslint-disable-next-line no-console
    console.log('IndexNow: Configuración incompleta, saltando envío');
    return 0;
  }

  if (urls.length === 0) {
    // eslint-disable-next-line no-console
    console.log('IndexNow: No hay URLs para enviar');
    return 0;
  }

  // Dry-run mode for local development
  const isDryRun = process.env.NODE_ENV === 'development' || process.env.INDEXNOW_DRY_RUN === 'true';
  
  if (isDryRun) {
    const payload = buildIndexNowPayload(urls, key, host, keyLocation);
    // eslint-disable-next-line no-console
    console.log('IndexNow (dry-run):', JSON.stringify(payload, null, 2));
    return urls.length;
  }

  try {
    const payload = buildIndexNowPayload(urls, key, host, keyLocation);
    
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BlogResenasLocales/1.0'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      // eslint-disable-next-line no-console
      console.log(`IndexNow: Enviadas ${urls.length} URLs exitosamente (${response.status})`);
      return urls.length;
    } else {
      // eslint-disable-next-line no-console
      console.error(`IndexNow: Error ${response.status}: ${response.statusText}`);
      return 0;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('IndexNow: Error al enviar URLs:', error);
    return 0;
  }
}

/**
 * Helper function to build absolute URLs from paths
 */
export function buildAbsoluteUrls(paths: string[], baseUrl: string): string[] {
  return paths.map(path => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl.replace(/\/$/, '')}${cleanPath}`;
  });
}
