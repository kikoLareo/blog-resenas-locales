import { NextResponse } from 'next/server'

// Server-side proxy to query Sanity and avoid CORS in the browser.
// Usage from client: /api/sanity/proxy?query=*[_type%20==%20"post"]{title,slug}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const query = url.searchParams.get('query') || url.searchParams.get('q')
    const paramsRaw = url.searchParams.get('params')
    const params = paramsRaw ? JSON.parse(paramsRaw) : undefined

    if (!query) {
      return NextResponse.json({ error: 'Missing `query` parameter' }, { status: 400 })
    }

    const projectId = process.env.SANITY_PROJECT_ID
    const dataset = process.env.SANITY_DATASET ?? 'production'
    const token = process.env.SANITY_READ_TOKEN

    if (!projectId) {
      return NextResponse.json({ error: 'SANITY_PROJECT_ID not set' }, { status: 500 })
    }

    // Build Sanity query url and append params as $paramName=value
    let apiUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(
      query,
    )}`

    if (params && typeof params === 'object') {
      for (const [k, v] of Object.entries(params)) {
        const value = typeof v === 'string' ? v : JSON.stringify(v)
        apiUrl += `&$${encodeURIComponent(k)}=${encodeURIComponent(value)}`
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(apiUrl, { headers })
    const body = await res.text()

    // Forward response status and body. Caller receives JSON from Sanity.
    return new NextResponse(body, { status: res.status, headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  // Optional: allow POST for larger queries in the body
  try {
    const { query, params } = (await req.json()) as { query?: string; params?: Record<string, unknown> }
    if (!query) return NextResponse.json({ error: 'Missing `query` in body' }, { status: 400 })

    const projectId = process.env.SANITY_PROJECT_ID
    const dataset = process.env.SANITY_DATASET ?? 'production'
    const token = process.env.SANITY_READ_TOKEN

    if (!projectId) return NextResponse.json({ error: 'SANITY_PROJECT_ID not set' }, { status: 500 })

    let apiUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(
      query,
    )}`

    if (params && typeof params === 'object') {
      for (const [k, v] of Object.entries(params)) {
        const value = typeof v === 'string' ? v : JSON.stringify(v)
        apiUrl += `&$${encodeURIComponent(k)}=${encodeURIComponent(value)}`
      }
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(apiUrl, { method: 'GET', headers })
    const body = await res.text()
    return new NextResponse(body, { status: res.status, headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
