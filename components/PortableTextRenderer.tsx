import type { PortableTextBlock } from 'sanity'
import { codeToHtml } from 'shiki'
import { PortableTextContent } from './PortableTextContent'

interface Props {
  value: PortableTextBlock[]
}

/**
 * Server Component — runs Shiki syntax highlighting for every code block
 * before handing off the augmented value to the client PortableTextContent.
 *
 * Pattern: all async work (Shiki) happens here on the server; the resulting
 * HTML strings are serializable props passed to the Client Component.
 */
export async function PortableTextRenderer({ value }: Props) {
  const augmented = await Promise.all(
    value.map(async (block) => {
      const codeBlock = block as PortableTextBlock & { code?: string; language?: string }

      if (block._type === 'code' && codeBlock.code) {
        const lang = codeBlock.language ?? 'text'
        try {
          const html = await codeToHtml(codeBlock.code, {
            lang,
            theme: 'github-dark-dimmed',
          })
          return { ...block, _highlightedHtml: html }
        } catch {
          // Unsupported language — fall back to plain text highlighting
          const html = await codeToHtml(codeBlock.code, {
            lang: 'text',
            theme: 'github-dark-dimmed',
          })
          return { ...block, _highlightedHtml: html }
        }
      }

      return block
    }),
  )

  return <PortableTextContent value={augmented as Parameters<typeof PortableTextContent>[0]['value']} />
}
