# mutable-sanity-blog

A visually modern, tech-focused blog built with Next.js 15, Tailwind CSS v4, and Sanity v3. White-labelable, SEO-first, deployed on Netlify.

## Stack

- **Next.js 15** — App Router, React Server Components, SSR
- **Tailwind CSS v4** — CSS-first `@theme` variables for white-labeling
- **Sanity v3** — Headless CMS, Studio embedded at `/studio`
- **Shiki** — Server-side syntax highlighting in Portable Text
- **Netlify** — Hosting with `@netlify/plugin-nextjs` and on-demand ISR

---

## Setup for a new instance

### 1. Create a Sanity project

Go to [sanity.io/manage](https://sanity.io/manage) and create a new project. Note your **Project ID** and **Dataset** name.

### 2. Clone and install

```bash
git clone <repo-url>
cd sanity-blog
npm install
```

### 3. Configure environment variables

Next.js loads environment variables from `.env.local`, which is intentionally excluded from version control (see `.gitignore`). You must create this file yourself — it is never committed to the repo.

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and fill in your values:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SITE_URL=https://<your-netlify-subdomain>.netlify.app
SANITY_REVALIDATE_SECRET=<random-string>   # openssl rand -hex 32
```

> **Never commit `.env.local`** — it contains your revalidation secret. The `.env.local.example` file is the shareable template; `.env.local` is the live config that stays on your machine (and in Netlify's environment variable settings).

### 4. Update the CLI config

Open `sanity.cli.ts` and update the three values to match your new project:

```ts
export default defineCliConfig({
  api: {
    projectId: '<your-project-id>',   // ← replace
    dataset: 'production',            // ← replace if different
  },
  studioHost: '<your-unique-name>',   // ← replace — sets <name>.sanity.studio
})
```

> The `studioHost` must be globally unique across all Sanity projects.

### 5. Add CORS origin in Sanity

In [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **CORS Origins**, add:

- `http://localhost:3000` (for local development)
- `https://<your-netlify-url>` (for production)

### 6. Run locally

```bash
npm run dev
```

- Blog: [http://localhost:3000](http://localhost:3000)
- Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

Log into the Studio, create a **Settings** document first (site name, logo, footer text), then start adding posts.

### 7. Deploy the Sanity Studio

```bash
npx sanity login   # first time only
npx sanity deploy
```

This publishes the Studio to `https://<studioHost>.sanity.studio` — a stable URL you can share with content editors independent of Netlify.

### 8. Deploy to Netlify

Push to your Git provider and connect the repo in Netlify. Set all the environment variables from step 3 in **Netlify → Site → Environment Variables**.

The `netlify.toml` and `@netlify/plugin-nextjs` handle the rest.

### 9. Configure the ISR webhook

In [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **Webhooks**, add:

| Field   | Value |
|---------|-------|
| URL     | `https://<your-netlify-url>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>` |
| Method  | POST |
| Trigger | create, update, delete |
| Filter  | `_type == "post" \|\| _type == "settings"` |

This clears the Netlify cache the moment a post is published.

---

## White-labeling

All branding lives in one place — `app/globals.css`. To re-skin for a new client, only change the `@theme` block:

```css
@theme {
  --color-brand-500: oklch(...);   /* primary */
  --color-accent:    oklch(...);   /* highlight */
  --font-sans:    "YourFont", ...;
  --font-display: "YourFont", ...;
}
```

No component files need to change.

---

## Project structure

```
app/
  [slug]/page.tsx             Post page — SSR, generateMetadata, JSON-LD
  api/revalidate/route.ts     Sanity webhook → revalidateTag()
  studio/[[...tool]]/page.tsx Embedded Sanity Studio
  globals.css                 @theme white-label stamp
  layout.tsx / page.tsx       Root layout and blog listing

components/
  PortableTextRenderer.tsx    Server Component — Shiki async highlighting
  PortableTextContent.tsx     Client Component — @portabletext/react renderer
  JsonLd.tsx                  BlogPosting structured data
  Header.tsx / Footer.tsx / PostCard.tsx

sanity/
  schemas/                    post, author, category, settings
  lib/client.ts               sanityFetch() with Next.js cache tags
  lib/queries.ts              All GROQ queries
```
