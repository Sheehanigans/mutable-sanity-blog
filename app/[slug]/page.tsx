import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { sanityFetch } from '@/sanity/lib/client'
import { postBySlugQuery, postSlugsQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { SanityPost } from '@/types/sanity'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { JsonLd } from '@/components/JsonLd'
import { formatDate } from '@/lib/utils'

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: postSlugsQuery,
    tags: ['post'],
  })
  return slugs.map(({ slug }) => ({ slug }))
}

// ─── Metadata ──────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const post = await sanityFetch<SanityPost | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: [`post:${slug}`],
  })

  if (!post) return {}

  const ogImage =
    post.seo?.shareImage
      ? urlFor(post.seo.shareImage).width(1200).height(630).url()
      : post.mainImage
        ? urlFor(post.mainImage).width(1200).height(630).url()
        : undefined

  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    alternates: {
      canonical: post.seo?.canonicalUrl ?? `/${post.slug.current}`,
    },
    openGraph: {
      title: post.seo?.metaTitle ?? post.title,
      description: post.seo?.metaDescription ?? post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.metaTitle ?? post.title,
      description: post.seo?.metaDescription ?? post.excerpt,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function PostPage({ params }: Props) {
  const { slug } = await params

  const post = await sanityFetch<SanityPost | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: [`post:${slug}`],
  })

  if (!post) notFound()

  return (
    <>
      <JsonLd post={post} />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {/* Header */}
        <header className="mb-12">
          {post.categories && post.categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.categories.map((cat) => (
                <span
                  key={cat.slug?.current ?? cat.title}
                  className="rounded-full bg-[--color-brand-100] px-3 py-1 text-xs font-medium text-[--color-brand-700]"
                >
                  {cat.title}
                </span>
              ))}
            </div>
          )}

          <h1 className="mb-6 font-[--font-display] text-4xl font-bold leading-tight text-[--color-fg] sm:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mb-6 text-lg text-[--color-fg-muted]">{post.excerpt}</p>
          )}

          <div className="flex items-center gap-3 text-sm text-[--color-fg-subtle]">
            {post.author && (
              <span className="font-medium text-[--color-fg-muted]">{post.author.name}</span>
            )}
            {post.author && post.publishedAt && <span>·</span>}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            )}
          </div>
        </header>

        {/* Hero image */}
        {post.mainImage && (
          <div className="relative mb-12 aspect-video overflow-hidden rounded-[--radius-xl]">
            <Image
              src={urlFor(post.mainImage).width(1200).height(675).url()}
              alt={post.mainImage.alt ?? post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Body */}
        <div className="max-w-none">
          <PortableTextRenderer value={post.body} />
        </div>
      </article>
    </>
  )
}
