import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/client'
import { postsQuery, settingsQuery } from '@/sanity/lib/queries'
import type { SanityPost, SanitySettings } from '@/types/sanity'
import { PostCard } from '@/components/PostCard'
import { FeaturedPost } from '@/components/FeaturedPost'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SanitySettings | null>({
    query: settingsQuery,
    tags: ['settings'],
  })

  return {
    title: {
      default: settings?.siteName ?? 'Blog',
      template: `%s | ${settings?.siteName ?? 'Blog'}`,
    },
    description: settings?.description,
  }
}

export default async function HomePage() {
  const posts = await sanityFetch<SanityPost[]>({
    query: postsQuery,
    tags: ['post'],
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="mb-12 font-[--font-display] text-4xl font-bold text-[--color-fg]">
        Latest Articles
      </h1>

      {posts.length === 0 ? (
        <p className="text-[--color-fg-muted]">No posts published yet.</p>
      ) : (
        <>
          <FeaturedPost post={posts[0]} />
          {posts.length > 1 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(1).map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
