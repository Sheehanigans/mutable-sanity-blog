import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 *
 * Sanity Webhook payload shape (what we read):
 *   { _type: "post" | "settings", slug?: { current: string } }
 *
 * Configure in Sanity → API → Webhooks:
 *   URL:    https://<your-site>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 *   Trigger: on create / update / delete
 *   Filter: _type == "post" || _type == "settings"
 */
export async function POST(req: NextRequest) {
  // ── Auth check ────────────────────────────────────────────────────────────
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json(
      { message: 'SANITY_REVALIDATE_SECRET is not set' },
      { status: 500 },
    )
  }

  const providedSecret = req.nextUrl.searchParams.get('secret')
  if (providedSecret !== secret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  // ── Parse payload ─────────────────────────────────────────────────────────
  let body: { _type?: string; slug?: { current?: string } }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { message: 'Could not parse request body' },
      { status: 400 },
    )
  }

  const { _type, slug } = body

  // ── Targeted revalidation ─────────────────────────────────────────────────
  if (_type === 'settings') {
    revalidateTag('settings')
    return NextResponse.json({ revalidated: true, tags: ['settings'] })
  }

  if (_type === 'post') {
    const tags: string[] = ['post']
    if (slug?.current) {
      tags.push(`post:${slug.current}`)
    }
    tags.forEach(revalidateTag)
    return NextResponse.json({ revalidated: true, tags })
  }

  // ── Fallback: nuke everything ─────────────────────────────────────────────
  revalidateTag('post')
  revalidateTag('settings')
  return NextResponse.json({ revalidated: true, tags: ['post', 'settings'] })
}
