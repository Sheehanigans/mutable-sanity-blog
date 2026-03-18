'use client'

import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

// Portable text blocks are augmented server-side with _highlightedHtml for code nodes
type AugmentedBlock = PortableTextBlock & {
  _highlightedHtml?: string
  code?: string
  language?: string
  alt?: string
  caption?: string
}

interface Props {
  value: AugmentedBlock[]
}

export function PortableTextContent({ value }: Props) {
  return (
    <PortableText
      value={value}
      components={{
        types: {
          // Code blocks — pre-highlighted HTML is injected server-side
          code: ({ value }: { value: AugmentedBlock }) => {
            if (value._highlightedHtml) {
              return (
                <div
                  className="my-8 overflow-x-auto rounded-[--radius-lg] text-sm [&_pre]:p-6 [&_pre]:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: value._highlightedHtml }}
                />
              )
            }
            return (
              <pre className="my-8 overflow-x-auto rounded-[--radius-lg] bg-zinc-900 p-6 text-sm text-zinc-100 leading-relaxed">
                <code>{value.code}</code>
              </pre>
            )
          },
          // Inline images in body
          image: ({ value }: { value: AugmentedBlock }) => {
            const src = urlFor(value as Parameters<typeof urlFor>[0])
              .width(800)
              .url()
            return (
              <figure className="my-8">
                <div className="relative overflow-hidden rounded-[--radius-lg]">
                  <Image
                    src={src}
                    alt={value.alt ?? ''}
                    width={800}
                    height={450}
                    className="w-full object-cover"
                  />
                </div>
                {value.caption && (
                  <figcaption className="mt-2 text-center text-sm text-[--color-fg-subtle]">
                    {value.caption}
                  </figcaption>
                )}
              </figure>
            )
          },
        },
        block: {
          normal: ({ children }) => (
            <p className="mb-5 leading-[1.75] text-[--color-fg-muted]">{children}</p>
          ),
          h2: ({ children }) => (
            <h2 className="mt-12 mb-4 text-2xl font-bold text-[--color-fg] font-[--font-display]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 mb-3 text-xl font-semibold text-[--color-fg]">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-6 mb-2 text-lg font-semibold text-[--color-fg]">{children}</h4>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-[--color-brand-500] pl-6 italic text-[--color-fg-muted]">
              {children}
            </blockquote>
          ),
        },
        marks: {
          link: ({ children, value }) => (
            <a
              href={value?.href}
              rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              target={value?.href?.startsWith('http') ? '_blank' : undefined}
              className="text-[--color-brand-600] underline underline-offset-2 hover:text-[--color-brand-700] transition-colors"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-[--color-surface-subtle] px-1.5 py-0.5 font-[--font-mono] text-sm text-[--color-brand-700]">
              {children}
            </code>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-[--color-fg]">{children}</strong>
          ),
        },
        list: {
          bullet: ({ children }) => (
            <ul className="my-5 ml-6 list-disc space-y-2 text-[--color-fg-muted]">{children}</ul>
          ),
          number: ({ children }) => (
            <ol className="my-5 ml-6 list-decimal space-y-2 text-[--color-fg-muted]">{children}</ol>
          ),
        },
        listItem: {
          bullet: ({ children }) => <li className="leading-[1.75]">{children}</li>,
          number: ({ children }) => <li className="leading-[1.75]">{children}</li>,
        },
      }}
    />
  )
}
