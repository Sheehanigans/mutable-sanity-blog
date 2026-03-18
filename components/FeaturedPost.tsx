import Link from 'next/link'
import Image from 'next/image'
import type { SanityPost } from '@/types/sanity'
import { urlFor } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'

interface Props {
  post: SanityPost
}

export function FeaturedPost({ post }: Props) {
  const href = `/${post.slug.current}`

  return (
    <article
      className="group relative mb-16 overflow-hidden rounded-[--radius-xl] border border-[--color-border] bg-[--color-surface] transition-shadow duration-300 hover:shadow-[--shadow-card-hover] sm:grid sm:grid-cols-2"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {/* Image */}
      <Link href={href} className="block">
        {post.mainImage ? (
          <div className="relative aspect-video h-full overflow-hidden sm:aspect-auto">
            <Image
              src={urlFor(post.mainImage).width(1200).height(675).url()}
              alt={post.mainImage.alt ?? post.title}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        ) : (
          <div className="flex aspect-video h-full items-center justify-center bg-[--color-surface-subtle] sm:aspect-auto">
            <span className="text-5xl text-[--color-fg-subtle]">✦</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col justify-center p-8 lg:p-12">
        {/* Featured label + categories */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[--color-brand-500] px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
            Featured
          </span>
          {post.categories?.slice(0, 2).map((cat) => (
            <span
              key={cat.slug?.current ?? cat.title}
              className="rounded-full bg-[--color-brand-50] px-2 py-0.5 text-xs font-medium text-[--color-brand-600]"
            >
              {cat.title}
            </span>
          ))}
        </div>

        {/* Title */}
        <Link href={href}>
          <h2 className="mb-4 font-[--font-display] text-2xl font-bold leading-snug text-[--color-fg] transition-colors group-hover:text-[--color-brand-600] sm:text-3xl lg:text-4xl">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mb-6 line-clamp-3 text-base leading-relaxed text-[--color-fg-muted]">
            {post.excerpt}
          </p>
        )}

        {/* Byline */}
        <div className="flex items-center gap-2 text-sm text-[--color-fg-subtle]">
          {post.author && <span>{post.author.name}</span>}
          {post.author && post.publishedAt && <span>·</span>}
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          )}
        </div>
      </div>
    </article>
  )
}
