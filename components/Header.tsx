import Link from 'next/link'
import Image from 'next/image'
import type { SanitySettings } from '@/types/sanity'
import { urlFor } from '@/sanity/lib/image'

interface Props {
  settings: SanitySettings | null
}

export function Header({ settings }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-[--color-border] bg-[--color-surface]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          {settings?.logo ? (
            <Image
              src={urlFor(settings.logo).height(32).url()}
              alt={settings.siteName ?? 'Logo'}
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          ) : (
            <span className="font-[--font-display] text-lg font-bold text-[--color-fg]">
              {settings?.siteName ?? 'Blog'}
            </span>
          )}
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-[--color-fg-muted] transition-colors hover:text-[--color-fg]"
          >
            Articles
          </Link>
        </nav>
      </div>
    </header>
  )
}
