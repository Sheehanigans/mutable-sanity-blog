import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { sanityFetch } from '@/sanity/lib/client'
import { settingsQuery } from '@/sanity/lib/queries'
import type { SanitySettings } from '@/types/sanity'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await sanityFetch<SanitySettings | null>({
    query: settingsQuery,
    tags: ['settings'],
  })

  return (
    <html lang="en">
      <body>
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
