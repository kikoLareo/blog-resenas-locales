export const apiVersion =
  process.env.SANITY_API_VERSION || process.env.SANITY_STUDIO_API_VERSION || '2025-08-16'

export const dataset = assertValue(
  process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET,
  'Missing environment variable: SANITY_DATASET or SANITY_STUDIO_DATASET'
)

export const projectId = assertValue(
  process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID,
  'Missing environment variable: SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined || v === null || (typeof v === 'string' && v.length === 0)) {
    throw new Error(errorMessage)
  }

  return v
}