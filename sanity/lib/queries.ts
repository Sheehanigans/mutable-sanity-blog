import { groq } from 'next-sanity'

// ─── Post list (no body — keep payload light) ─────────────────────────────────

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "author": author->{ name, slug, image },
    "categories": categories[]->{ title, slug }
  }
`

// ─── All published slugs (for generateStaticParams + sitemap) ─────────────────

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`

// ─── Single post by slug (full body + SEO) ────────────────────────────────────

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    body,
    "author": author->{ name, slug, image, bio },
    "categories": categories[]->{ title, slug },
    seo
  }
`

// ─── Global site settings ─────────────────────────────────────────────────────

export const settingsQuery = groq`
  *[_type == "settings"][0] {
    siteName,
    description,
    logo,
    footerText,
    socialLinks
  }
`
