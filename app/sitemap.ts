import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/client'
import { postSlugsQuery } from '@/sanity/lib/queries'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: postSlugsQuery,
    tags: ['post'],
  })

  const posts: MetadataRoute.Sitemap = slugs.map(({ slug }) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...posts,
  ]
}
