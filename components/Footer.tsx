import type { SanitySettings } from '@/types/sanity'

interface Props {
  settings: SanitySettings | null
}

export function Footer({ settings }: Props) {
  const year = new Date().getFullYear()
  const defaultText = `© ${year} ${settings?.siteName ?? 'Blog'}`

  return (
    <footer className="mt-24 border-t border-[--color-border] bg-[--color-surface-muted]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6">
        <p className="text-sm text-[--color-fg-subtle]">
          {settings?.footerText ?? defaultText}
        </p>

        {settings?.socialLinks && settings.socialLinks.length > 0 && (
          <div className="flex gap-5">
            {settings.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[--color-fg-subtle] transition-colors hover:text-[--color-fg]"
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}
