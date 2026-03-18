import type { Image, PortableTextBlock } from 'sanity'

export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface SanityImageAsset extends Image {
  alt?: string
  caption?: string
}

export interface SanityAuthor {
  name: string
  slug: SanitySlug
  image?: SanityImageAsset
  bio?: PortableTextBlock[]
}

export interface SanityCategory {
  title: string
  slug: SanitySlug
}

export interface SanityPostSeo {
  metaTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  shareImage?: SanityImageAsset
}

export interface SanityPost {
  _id: string
  title: string
  slug: SanitySlug
  publishedAt: string
  excerpt?: string
  mainImage?: SanityImageAsset
  body: PortableTextBlock[]
  author?: SanityAuthor
  categories?: SanityCategory[]
  seo?: SanityPostSeo
}

export interface SanitySocialLink {
  platform: string
  url: string
}

export interface SanitySettings {
  siteName: string
  description?: string
  logo?: SanityImageAsset
  footerText?: string
  socialLinks?: SanitySocialLink[]
}
