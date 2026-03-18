import Link from 'next/link'
import Image from 'next/image'
import type { SanityPost } from '@/types/sanity'
import { urlFor } from '@/sanity/lib/image'
import { formatDate } from '@/lib/utils'

interface Props {
  post: SanityPost
}

export function PostCard({ post }: Props) {
  const href = `/${post.slug.current}`

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-[--radius-xl] border border-[--color-border] bg-[--color-surface] transition-shadow duration-300 hover:shadow-[--shadow-card-hover]"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {/* Thumbnail */}
      <Link href={href} className="block">
        {post.mainImage ? (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={urlFor(post.mainImage).width(640).height(360).url()}
              alt={post.mainImage.alt ?? post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-[--color-surface-subtle]">
            <span className="text-3xl text-[--color-fg-subtle]">✦</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.slug?.current ?? cat.title}
                className="rounded-full bg-[--color-brand-50] px-2 py-0.5 text-xs font-medium text-[--color-brand-600]"
              >
                {cat.title}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={href}>
          <h2 className="mb-2 text-lg font-semibold leading-snug text-[--color-fg] transition-colors group-hover:text-[--color-brand-600]">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mb-4 flex-1 line-clamp-3 text-sm text-[--color-fg-muted]">
            {post.excerpt}
          </p>
        )}

        {/* Byline */}
        <div className="mt-auto flex items-center gap-2 border-t border-[--color-border] pt-4 text-xs text-[--color-fg-subtle]">
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
