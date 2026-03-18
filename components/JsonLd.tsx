import type { SanityPost } from '@/types/sanity'
import { urlFor } from '@/sanity/lib/image'

interface Props {
  post: SanityPost
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

/**
 * Injects a JSON-LD BlogPosting structured data script tag.
 * Place this in the page <head> via the layout or directly in the page component.
 */
export function JsonLd({ post }: Props) {
  const image =
    post.seo?.shareImage
      ? urlFor(post.seo.shareImage).width(1200).height(630).url()
      : post.mainImage
        ? urlFor(post.mainImage).width(1200).height(630).url()
        : undefined

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: `${baseUrl}/${post.slug.current}`,
    ...(image ? { image } : {}),
    ...(post.author
      ? {
          author: {
            '@type': 'Person',
            name: post.author.name,
            url: `${baseUrl}/authors/${post.author.slug?.current}`,
          },
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
