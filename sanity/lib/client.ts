import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

/**
 * Typed fetch wrapper that wires Next.js cache tags for on-demand revalidation.
 * Pass `tags` matching whatever your /api/revalidate route calls revalidateTag() with.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  revalidate,
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
  revalidate?: number | false
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      ...(tags ? { tags } : {}),
      ...(revalidate !== undefined ? { revalidate } : {}),
    },
  })
}
