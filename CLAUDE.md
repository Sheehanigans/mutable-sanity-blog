# sanity-blog

A visually modern, tech-focused blog. 100% data-driven, white-labelable, deployed on Netlify.

## Tech Stack

| Layer       | Technology                                          |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 15 (App Router, React Server Components)    |
| Styling     | Tailwind CSS v4 — CSS-first `@theme` variables      |
| CMS         | Sanity v3 (headless, Studio embedded at `/studio`)  |
| Rendering   | SSR for all posts + On-Demand ISR via webhooks      |
| Deployment  | Netlify (`@netlify/plugin-nextjs`)                  |

## Common Commands

```bash
npm run dev        # Vite/Turbopack dev server on :3000, Studio on :3000/studio
npm run build      # Production build
npm run start      # Serve production build locally
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Project Structure

```
app/
  layout.tsx                  # Root layout — fetches Settings, renders Header/Footer
  page.tsx                    # Homepage — blog post grid
  [slug]/page.tsx             # Post page — generateMetadata + JSON-LD + PortableText
  api/revalidate/route.ts     # Sanity webhook handler (ISR)
  sitemap.ts                  # Auto-generated sitemap (pulls slugs from Sanity)
  robots.ts                   # robots.txt (blocks /studio, /api)
  studio/[[...tool]]/page.tsx # Embedded Sanity Studio
  globals.css                 # @theme white-label stamp — only file to touch for rebranding

components/
  PortableTextRenderer.tsx    # Server Component — runs Shiki async, passes HTML to client
  PortableTextContent.tsx     # Client Component — renders @portabletext/react
  JsonLd.tsx                  # BlogPosting JSON-LD structured data
  Header.tsx / Footer.tsx     # Layout chrome, driven by Settings document
  PostCard.tsx                # Blog listing card

sanity/
  env.ts                      # Reads + asserts NEXT_PUBLIC_SANITY_* env vars
  lib/client.ts               # createClient + sanityFetch() with Next.js cache tags
  lib/image.ts                # urlFor() helper via @sanity/image-url
  lib/queries.ts              # All GROQ queries (postsQuery, postBySlugQuery, settingsQuery)
  schemas/                    # Sanity document schemas: post, author, category, settings

types/sanity.ts               # TypeScript interfaces for all Sanity document shapes
lib/utils.ts                  # Pure utilities (formatDate, etc.)
```

## White-Labeling

All branding is in `app/globals.css` inside the `@theme {}` block.
To stamp this for a new client, change only these CSS custom properties:

```css
@theme {
  --color-brand-500: oklch(...);   /* primary brand color */
  --color-accent:    oklch(...);   /* secondary / highlight */
  --font-sans:    "YourFont", ...;
  --font-display: "YourFont", ...;
  /* ...radii, shadows as needed */
}
```

Nothing in components or pages contains hardcoded colors — they all reference `var(--color-*)`.

## SEO Architecture

- **`generateMetadata`** on every page pulls `seo.metaTitle`, `seo.metaDescription`, `seo.canonicalUrl`, and `seo.shareImage` from Sanity. Falls back to `title` / `excerpt` / `mainImage`.
- **JSON-LD** `BlogPosting` schema injected by `<JsonLd />` on every post.
- **Sitemap** at `/sitemap.xml` — live slugs from Sanity via `app/sitemap.ts`.
- **`robots.txt`** at `/robots.txt` via `app/robots.ts` — blocks `/studio` and `/api`.

## ISR / On-Demand Revalidation

Posts are SSR with Next.js cache tags (`tags: ['post', 'post:<slug>']`).
When Sanity publishes content, it calls the webhook which calls `revalidateTag()`.

**Sanity Webhook setup:**
- URL: `https://<your-netlify-url>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`
- HTTP Method: POST
- Trigger: create / update / delete
- Filter: `_type == "post" || _type == "settings"`

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=   # from sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET=      # e.g. "production"
NEXT_PUBLIC_SANITY_API_VERSION=  # e.g. "2024-01-01"
NEXT_PUBLIC_SITE_URL=            # canonical origin, e.g. https://blog.acme.com
SANITY_REVALIDATE_SECRET=        # random string, match in Sanity webhook config
```

## Conventions

- **Named exports only** — no default exports except `page.tsx`, `layout.tsx`, `route.ts`, and config files (required by Next.js / Sanity conventions)
- **Server Components by default** — add `'use client'` only when browser APIs or interactivity are needed
- **Data fetching in page/layout RSCs** — never fetch inside client components; pass data as props
- **GROQ queries in `sanity/lib/queries.ts`** — keep all queries co-located and typed
- **Type all Sanity results** — use `sanityFetch<YourType>()`, define matching interfaces in `types/sanity.ts`
- **Tailwind via CSS variables** — use `text-[--color-brand-600]` pattern, never hardcode color values
- **Avoid `any`** — use the type interfaces in `types/sanity.ts`
