# SEO + Blog Architecture Blueprint

A reusable, framework-agnostic specification for building marketing websites with a strong SEO foundation and a scalable blog/learning-hub. Written to be fed directly to an AI coding assistant as the primary spec.

The reference implementation is [Astro v5 + MDX + Content Collections + Tailwind]. Where a pattern is framework-specific, it is flagged. Everything else is portable.

---

## 0. How to use this document

- Copy sections into a new project's `PROJECT_SPEC.md` or hand this whole file to an assistant.
- Replace every `{{PLACEHOLDER}}` with real project values.
- Do NOT skip §1 (single-source-of-truth constants) , every later section depends on it.
- Every pattern lists **Purpose · Why · Where · How** so an assistant can decide *when* to apply it.

Keyword tags used throughout: `SEO`, `SSG`, `JSON-LD`, `OG`, `TwitterCard`, `Sitemap`, `Canonical`, `Robots`, `Breadcrumbs`, `Content-Collection`, `MDX`, `Frontmatter`, `TOC`, `RelatedPosts`, `Taxonomy`, `Pagination`, `Redirects`.

---

## 1. Single source of truth: `SITE` constants

**Purpose** , one immutable object that every SEO helper, JSON-LD builder, sitemap, and page reads from. Prevents drift between the meta tag, the schema, and the sitemap.

**Why** , SEO bugs almost always come from two places disagreeing (title suffix in one file, canonical base in another). Centralise once.

**Where** , `src/consts.ts` (or `src/config/site.ts`). Imported by:
- Framework config (sitemap `site` field, canonical base)
- SEO builder (title suffix, absolute URLs)
- JSON-LD builders (`Organization`, `WebSite`, `LocalBusiness`)
- Layout `<head>` (favicons, apple-touch, manifest)

**How** , declare `as const`, freeze the shape, never mutate at runtime.

```ts
// src/consts.ts
export const SITE = {
  url: 'https://www.{{DOMAIN}}',            // canonical hostname, no trailing slash
  name: '{{BRAND}}',                         // short brand
  legalName: '{{LEGAL_ENTITY}}',
  tagline: '{{TAGLINE}}',
  email: 'hello@{{DOMAIN}}',
  telephone: '+{{E164_PHONE}}',              // E.164 for JSON-LD
  telephoneDisplay: '{{FORMATTED_PHONE}}',
  address: {
    streetAddress: '{{STREET}}',
    addressLocality: '{{CITY}}',
    addressRegion: '{{REGION}}',
    postalCode: '{{POSTCODE}}',
    addressCountry: '{{ISO_COUNTRY}}',        // e.g. 'GB', 'US'
  },
  geo:   { latitude: 0, longitude: 0 },
  areaServed: '{{PRIMARY_CITY}}',
  priceRange: '{{$_TO_$$$}}',
  openingHours: [
    { dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '17:00' },
  ],
  aggregateRating: { ratingValue: '5.0', reviewCount: '0', bestRating: '5', worstRating: '1' },
  social: {
    linkedin: '', x: '', facebook: '', youtube: '',
  },
  logo: 'https://www.{{DOMAIN}}/logo.webp',
} as const;

export const DEFAULT_OG_IMAGE = '/og-image.webp';
export const SITE_TITLE_SUFFIX = ` | ${SITE.name}`;
```

**Rules**
- `SITE.url` MUST match the framework config `site` field (Astro: `defineConfig({ site: SITE.url })`).
- Choose ONE canonical hostname (with or without `www`) and stay consistent everywhere.
- All absolute URLs derive from `SITE.url` , never hardcode `https://…` again.

---

## 2. URL & routing conventions

**Purpose** , a predictable URL space that never changes shape across the site, so canonicals, sitemap, redirects, and internal links stay consistent.

| Rule | Value |
|---|---|
| Trailing slash | **Always** (`/foo/`) OR **never** (`/foo`) , pick one and enforce framework-wide. Recommended: **always**, for parity with common CMS exports. |
| Case | Lowercase, kebab-case, ASCII only. Reject filenames with capitals or underscores at build time. |
| Depth | Marketing/service pages at root (`/service-name/`). Blog articles at root (`/{{slug}}/`) **or** namespaced (`/blog/{{slug}}/`) , pick one, document the choice. |
| Query strings | Never used for canonical content. Filters use hash fragments (`#category=X`) so SSG works. |
| Reserved slugs | Explicit deny-list to prevent article slugs colliding with top-level pages. |

**Framework-specific (Astro)**
```ts
// astro.config.ts
export default defineConfig({
  site: SITE.url,
  output: 'static',
  trailingSlash: 'always',
  integrations: [ sitemap({ /* ... */ }), mdx(), icon() ],
});
```

**Reserved-slug guard** , add a `Set<string>` in `content.config.ts` and a build-time script that fails the build on collision.

```ts
export const RESERVED_SLUGS = new Set<string>([
  'blog','about','about-us','contact','contact-us','pricing',
  'privacy-policy','terms','cookies','sitemap','sitemap.xml',
  'robots','robots.txt','rss','feed',
  'category','tag','page','author',
]);
```

---

## 3. SEO builder , resolved config from a per-page input

**Purpose** , every page declares intent (`SeoConfig`), the builder produces a fully resolved object (`ResolvedSeo`) with derived defaults.

**Why** , pages should describe *what they are*, not repeat OG/Twitter/robots plumbing. One builder guarantees uniformity.

### 3.1 `SeoConfig` (page input) and `ResolvedSeo` (output)

```ts
// src/types/seo.ts
export type PageType = 'organic' | 'ads';

export interface SeoConfig {
  pageType: PageType;
  title: string;
  description: string;
  canonical: string;                 // absolute or root-relative , builder normalises
  keywords?: string;
  noindex?: boolean;                 // explicit override
  nofollow?: boolean;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  geoPosition?: string;              // "lat;lng"
  geoPlacename?: string;
  geoRegion?: string;                // ISO 3166-2 e.g. "GB-LND"
  jsonLd?: {
    localBusiness?: { description: string };
    faq?: { question: string; answer: string }[];
    breadcrumbs?: { name: string; url: string }[];
  };
}

export interface ResolvedSeo {
  title: string;
  fullTitle: string;                 // with brand suffix appended
  description: string;
  canonical: string;                 // ALWAYS absolute, ALWAYS trailing-slash-normalised
  keywords: string | undefined;
  noindex: boolean;
  nofollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;                   // absolute
  geo: { position?: string; placename?: string; region?: string } | undefined;
  jsonLd: SeoConfig['jsonLd'] | undefined;
}
```

### 3.2 `buildSeo()` derivation rules

| Field | Rule |
|---|---|
| `fullTitle` | Append ` \| {SITE.name}` unless title already contains `SITE.name` |
| `canonical` | Convert to absolute against `SITE.url`; force trailing slash unless path has a file extension |
| `noindex` | `config.noindex ?? (pageType === 'ads' \|\| IS_STAGING)` |
| `nofollow` | same as noindex |
| `ogTitle` | `ogTitle ?? title` |
| `ogDescription` | `ogDescription ?? description` |
| `ogImage` | `toAbsoluteUrl(ogImage ?? DEFAULT_OG_IMAGE)` |
| `geo` | `undefined` for ads pages |
| `jsonLd` | `undefined` for ads pages |

```ts
// src/lib/seo.ts (essence)
export function buildSeo(config: SeoConfig): ResolvedSeo {
  const isAds = config.pageType === 'ads';
  return {
    title: config.title,
    fullTitle: applyTitleTemplate(config.title),
    description: config.description,
    canonical: toAbsoluteUrl(withTrailingSlash(config.canonical)),
    keywords: config.keywords,
    noindex: config.noindex ?? (isAds || IS_STAGING),
    nofollow: config.nofollow ?? (isAds || IS_STAGING),
    ogTitle: config.ogTitle ?? config.title,
    ogDescription: config.ogDescription ?? config.description,
    ogImage: toAbsoluteUrl(config.ogImage ?? DEFAULT_OG_IMAGE),
    geo: isAds ? undefined : resolveGeo(config),
    jsonLd: isAds ? undefined : config.jsonLd,
  };
}
```

**Staging safety** , read a public env var (e.g. `PUBLIC_STAGING`); when `'true'` every page defaults to `noindex,nofollow`. Backstops any missing `X-Robots-Tag` header at the CDN.

---

## 4. `<head>` emission , one component, all directives

**Purpose** , a single `Seo` component renders `<title>`, `<meta>`, OG, Twitter, canonical, robots, geo, JSON-LD. Pages never touch `<head>` directly.

**Why** , prevents duplicated or missing directives. Grep-friendly (one place to update).

**Where** , `src/components/shared/Seo.astro`, mounted by `BaseLayout`.

**How** , either use `astro-seo` (or `next-seo` equivalent), or roll your own. Contract below.

### 4.1 Directive matrix produced per page

| Emitted | Source | Notes |
|---|---|---|
| `<title>` | `fullTitle` | brand-suffixed |
| `<meta name="description">` | `description` | 50–160 chars ideal |
| `<link rel="canonical">` | `canonical` | absolute + trailing slash |
| `<meta name="robots">` | derived from `noindex`, `nofollow` | plus `max-snippet:-1, max-image-preview:large, max-video-preview:-1` |
| `<meta property="og:title">` | `ogTitle` | falls back to `title` |
| `<meta property="og:description">` | `ogDescription` | falls back to `description` |
| `<meta property="og:image">` | `ogImage` (absolute) | falls back to `DEFAULT_OG_IMAGE` |
| `<meta property="og:type">` | `'website'` (marketing) or `'article'` (blog post) | |
| `<meta property="og:site_name">` | `SITE.name` | |
| `<meta property="og:locale">` | e.g. `'en_GB'` | hardcode per project locale |
| `<meta name="twitter:card">` | `'summary_large_image'` | |
| `<meta name="twitter:title">` | `ogTitle` | |
| `<meta name="twitter:description">` | `ogDescription` | |
| `<meta name="twitter:image">` | `ogImage` | |
| `<meta name="keywords">` | `keywords` | only if set |
| `<meta name="geo.*">`, `<meta name="ICBM">` | `geo` | local business pages |
| JSON-LD scripts | `jsonLd` breadcrumbs + FAQ (page) + WebSite/Org/LocalBusiness (site) | see §5 |

### 4.2 Reuse rule (critical)

OG/Twitter title & description **reuse** the meta title & description by default. So fixing `title` or `description` automatically fixes OG/Twitter. Only override `ogTitle` / `ogDescription` when they genuinely need to differ (e.g. hub landing pages that want a shorter social hook).

### 4.3 Component contract

```astro
---
// src/components/shared/Seo.astro
import { buildSeo } from '@/lib/seo';
import { buildBreadcrumbLd, buildFaqLd } from '@/lib/schema';
import SchemaOrg from './SchemaOrg.astro';
import { SITE } from '@/consts';
import type { SeoConfig } from '@/types/seo';

interface Props { config: SeoConfig }
const { config } = Astro.props;
const seo = buildSeo(config);

const pageScoped = [
  ...(seo.jsonLd?.faq?.length ? [buildFaqLd(seo.jsonLd.faq)] : []),
  ...(seo.jsonLd?.breadcrumbs?.length ? [buildBreadcrumbLd(seo.jsonLd.breadcrumbs)] : []),
];
---
<title>{seo.fullTitle}</title>
<meta name="description" content={seo.description} />
<link rel="canonical" href={seo.canonical} />
<meta name="robots" content={[
  seo.noindex && 'noindex', seo.nofollow && 'nofollow',
  'max-snippet:-1','max-image-preview:large','max-video-preview:-1',
].filter(Boolean).join(', ')} />

<!-- Open Graph -->
<meta property="og:title" content={seo.ogTitle} />
<meta property="og:description" content={seo.ogDescription} />
<meta property="og:image" content={seo.ogImage} />
<meta property="og:type" content="website" />
<meta property="og:site_name" content={SITE.name} />
<meta property="og:locale" content="en_GB" />
<meta property="og:url" content={seo.canonical} />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={seo.ogTitle} />
<meta name="twitter:description" content={seo.ogDescription} />
<meta name="twitter:image" content={seo.ogImage} />

{seo.keywords && <meta name="keywords" content={seo.keywords} />}
{pageScoped.length > 0 && <SchemaOrg schema={pageScoped} />}
```

---

## 5. Schema.org / JSON-LD

**Purpose** , structured data that search engines parse for rich results (breadcrumb trails, FAQ, sitelinks search, article cards).

**Rule of thumb** , emit only schemas whose *content* is actually visible on the page. Fabricated schema risks manual actions.

### 5.1 Sitewide schemas (emit in `BaseLayout`)

| Schema | When | Notes |
|---|---|---|
| `WebSite` | every page | site identity + optional `potentialAction` search box |
| `Organization` | every organic page (opt-out for schema-mirror parity) | brand identity |
| `LocalBusiness` | every organic page for local-service brands | includes `areaServed`, `geo`, `openingHoursSpecification`, `aggregateRating` |

### 5.2 Page-scoped schemas (emit in `Seo`)

| Schema | When |
|---|---|
| `BreadcrumbList` | Any page deeper than root , always safe |
| `FAQPage` | Only when a real, visible FAQ list is on the page |
| `BlogPosting` | Blog articles , includes `headline`, `datePublished`, `dateModified`, `author`, `publisher`, `mainEntityOfPage`, `image`, `wordCount`, `articleSection`, `keywords` |
| `Article` / `NewsArticle` | Use `BlogPosting` unless brand needs distinction |

### 5.3 Builder pattern

```ts
// src/lib/schema.ts (essence)
const CONTEXT = 'https://schema.org';
const BUSINESS_ID = `${SITE.url}/#business`;
const ORG_ID      = `${SITE.url}/#org`;
const WEBSITE_ID  = `${SITE.url}/#website`;

export function buildWebSiteLd() {
  return { '@context': CONTEXT, '@type': 'WebSite', '@id': WEBSITE_ID,
    name: SITE.name, url: SITE.url, publisher: { '@id': ORG_ID }, inLanguage: 'en-GB' };
}
export function buildOrganizationLd() { /* Organization with sameAs = Object.values(SITE.social) */ }
export function buildLocalBusinessLd(overrides?) { /* LocalBusiness w/ geo, hours, rating */ }
export function buildFaqLd(items) { /* FAQPage w/ mainEntity[] of Question/Answer */ }
export function buildBreadcrumbLd(items) { /* BreadcrumbList w/ itemListElement[] */ }
export function buildBlogPostingLd(post, canonical) { /* BlogPosting */ }
```

**Best practices**
- Use stable `@id` URIs (`{site}/#org`, `{site}/#website`) so entities can be cross-referenced.
- `sameAs: Object.values(SITE.social)` , LinkedIn/X/Facebook profiles.
- Keep `aggregateRating` synced with the review data source shown on-page.
- Use a typed schema library (e.g. `schema-dts`) so wrong field names fail at build time.

---

## 6. Sitemap, robots, RSS

### 6.1 XML Sitemap

**How (Astro)** , the `@astrojs/sitemap` integration walks all statically-generated routes. Filter out fetch-only or noindex pages:

```ts
sitemap({
  filter: (page) =>
    !page.includes('/blog/all-cards') &&
    !page.includes('/404') &&
    !page.includes('/style'),
})
```

**Rules**
- Emit `sitemap-index.xml` + `sitemap-0.xml`. Reference from `robots.txt`.
- Every URL in the sitemap MUST be indexable and self-canonical. Never sitemap a noindex or canonicalised-away URL.
- Refresh lastmod from build time; if content collections track `datePublished`/`lastReviewed`, plug those in.

### 6.2 `robots.txt` (`public/robots.txt`)

```txt
User-agent: *
Allow: /

Sitemap: https://www.{{DOMAIN}}/sitemap-index.xml
```

**Staging override** , either serve a different `robots.txt` per environment, OR rely on the `noindex` default from `PUBLIC_STAGING` (belt + braces).

### 6.3 RSS (optional but recommended for blogs)

**Where** , `src/pages/rss.xml.ts`. Emit the latest N articles from the blog collection.

```ts
// src/pages/rss.xml.ts (Astro)
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '@/consts';

export async function GET(context) {
  const posts = (await getCollection('posts'))
    .sort((a,b) => b.data.datePublished.getTime() - a.data.datePublished.getTime())
    .slice(0, 50);
  return rss({
    title: `${SITE.name} Blog`,
    description: SITE.tagline,
    site: context.site!,
    items: posts.map(p => ({
      title: p.data.title,
      pubDate: p.data.datePublished,
      description: p.data.metaDescription,
      link: `/${p.id}/`,
    })),
  });
}
```

---

## 7. Redirects

**Purpose** , preserve link equity when migrating from another CMS and when renaming article slugs.

**How** , one authoritative table at the platform edge (Netlify `_redirects`, Cloudflare rule, Nginx map, etc.).

**Rules**
- Always `301` for permanent moves.
- Preserve trailing-slash convention on both sides.
- Never chain more than one redirect hop.
- Track slug history in content frontmatter (`oldSlugs: []`) and generate redirect entries at build time from it.

**Example `public/_redirects` (Netlify)**
```
/old-path/                  /new-path/                    301
/blog/legacy-slug/          /new-slug/                    301
/category/old-cat/*         /blog/category/new-cat/:splat 301
```

**Old-slug generator**
```ts
// generate-redirects.ts
for (const post of posts) {
  for (const oldSlug of post.data.oldSlugs ?? []) {
    console.log(`/${oldSlug}/  /${post.id}/  301`);
  }
}
```

---

## 8. Breadcrumbs

**Purpose** , improves SERP display (breadcrumb trail rich result) AND user navigation.

**Rule** , emit both:
1. Visible HTML `<nav aria-label="Breadcrumb">` with an ordered list.
2. `BreadcrumbList` JSON-LD via `Seo` config.

Both must match exactly (same labels, same order, same URLs).

**Standard trail patterns**
- Marketing page: `Home › {Page}`
- Blog article: `Home › Blog › {Category} › {Article}`
- Category page: `Home › Blog › {Category}`

---

## 9. Internal linking strategy

| Pattern | Purpose | Where |
|---|---|---|
| **Contextual body links** | Rank surrounding pages by topical relevance | 2–5 per article body; use descriptive anchor text (not "click here") |
| **Related posts** | Increase session depth; distribute link equity | Bottom of every article, 3 items |
| **Category/journey landing pages** | Hub pages that consolidate topical authority | Linked from every article footer + article eyebrow |
| **CTA sidebars** | Push readers to money pages | 1 per article, tuned to article's "journey" |
| **Sitewide footer links** | Distribute equity to conversion pages | 4–6 curated links, not a link farm |
| **Breadcrumb trails** | Cheap, semantic backlinks | Every page below root |

**Anchor-text rules**
- Use natural noun-phrase anchors: `IT support in Croydon` not `read more`.
- Never repeat the exact same anchor text 3+ times on the same page.
- Never use anchor text that misrepresents the destination (Google treats as manipulative).

---

## 10. Pagination

**Purpose** , paginated archives (blog index, category pages) that are each self-canonical + indexable.

**Framework-specific (Astro)** , `paginate()` in `getStaticPaths`. Route: `/blog/[...page].astro` produces `/blog/`, `/blog/2/`, `/blog/3/`…

```ts
export async function getStaticPaths({ paginate }) {
  const PAGE_SIZE = 12;
  const posts = (await getCollection('posts')).sort(sortPinnedThenDateDesc);
  return paginate(posts, { pageSize: PAGE_SIZE });
}
```

**SEO rules**
- Every page is self-canonical (`/blog/2/` canonicals to itself, NOT to `/blog/`).
- Title suffix indicates page number: `Blog | Brand | Page 2 of 8`.
- Do NOT use `rel="prev"` / `rel="next"` , Google deprecated these.
- Same design on page 1 landing vs page 2+ archive is optional; content-only difference is fine.

---

## 11. Categories, tags, taxonomies (two-layer model)

**Purpose** , organise content across (a) durable topic buckets (Categories), (b) intent-based reader journeys (Journeys/Personas). Kept generic here.

**File** , `src/content/taxonomy.ts` , single source of truth for slugs, display names, descriptions. Zod schemas validate frontmatter against these.

```ts
export const categories = [
  { slug: '{{cat-1-slug}}', name: '{{Category 1}}', description: '{{...}}' },
  // 8–14 evergreen categories
] as const;

export const journeys = [
  { slug: '{{journey-1-slug}}', name: '{{Journey 1}}',
    purpose: '{{who it is for}}', intro: '{{what they will learn}}' },
  // 4–8 intent-based journeys
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];
export type JourneySlug  = (typeof journeys)[number]['slug'];

export const categorySlugs = categories.map(c => c.slug);
export const journeySlugs  = journeys.map(j => j.slug);
export const categoryBySlug = Object.fromEntries(categories.map(c => [c.slug, c]));
export const journeyBySlug  = Object.fromEntries(journeys.map(j => [j.slug, j]));
```

**Rules**
- Each post has ONE `primaryCategory`, optional `secondaryCategory` (must differ), ONE `journey`.
- Never invent a category or journey inline in a post , always add to `taxonomy.ts` first.
- Category page URL: `/blog/category/{{slug}}/`. Journey page URL: `/blog/journeys/{{slug}}/`.
- Category & journey landing pages are paginated with the same rules as §10.
- Do NOT emit a page for every tag , tags create noindex thin pages that dilute crawl budget. Prefer categories + journeys.

---

## 12. Content collection schema (blog frontmatter)

**Purpose** , enforce content quality at build time. Bad SEO, missing authors, or invalid taxonomies fail the build.

**Where** , `src/content.config.ts`.

### 12.1 Full Zod schema

```ts
import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
import { categorySlugs, journeySlugs } from './content/taxonomy';
import { SEO_LIMITS, renderedTitle } from './lib/seo-limits.mjs';

const CONTENT_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
const CONTENT_TYPES = [
  'guide','opinion','case-study','news','explainer',
  'checklist','company-update','faq','glossary',
] as const;

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) => z.object({
    // ─ Identity ─
    title: z.string().min(1),
    seoTitle: z.string().max(120).refine(
      v => renderedTitle(v).length >= SEO_LIMITS.title.hardMin,
      { message: `Rendered <title> under ${SEO_LIMITS.title.hardMin} chars incl. brand suffix` },
    ),
    // ─ Authorship ─
    author: z.string().min(1),               // must be a known author key
    // ─ Dates ─
    datePublished: z.coerce.date(),
    lastReviewed: z.coerce.date().optional(),
    // ─ Summary ─
    intro: z.string().min(20).max(300),      // visible lead paragraph
    metaDescription: z.string()
      .min(SEO_LIMITS.metaDescription.hardMin).max(320),
    // ─ Optional key takeaways card ─
    takeaways: z.array(z.string().min(5).max(200)).min(2).max(6).optional(),
    // ─ Taxonomy (validated against taxonomy.ts) ─
    primaryCategory:   z.enum([...categorySlugs] as [string, ...string[]]),
    secondaryCategory: z.enum([...categorySlugs] as [string, ...string[]]).optional(),
    journey:           z.enum([...journeySlugs] as [string, ...string[]]),
    contentLevel:      z.enum(CONTENT_LEVELS),
    contentType:       z.enum(CONTENT_TYPES),
    // ─ Hub behaviour ─
    evergreen: z.boolean().default(false),
    featured:  z.boolean().default(false),
    pinnedPosition: z.number().int().positive().optional(),
    // ─ Rendering ─
    readingTimeMin: z.number().int().positive().optional(),
    heroImage: image().optional(),
    cta: z.object({ label: z.string().min(1), href: z.string().min(1) }).optional(),
    testimonialPreview: z.object({
      quote: z.string().min(10).max(200), attribution: z.string().min(1),
    }).optional(),
    // ─ Related-post override ─
    relatedPosts: z.array(z.string()).max(3).optional(),
    // ─ Slug-rename history for redirect generation ─
    oldSlugs: z.array(z.string()).optional(),
  })
  .refine(d => !d.secondaryCategory || d.secondaryCategory !== d.primaryCategory,
    { message: 'secondaryCategory must differ from primaryCategory', path: ['secondaryCategory'] }),
});

export const collections = { posts };
```

### 12.2 Field purpose table

| Field | Purpose | Reused for |
|---|---|---|
| `title` | Editorial H1 shown on page | Rich results `headline`, breadcrumb tail |
| `seoTitle` | The `<title>` value | `og:title`, `twitter:title` (via reuse) |
| `metaDescription` | `<meta name=description>` | `og:description`, `twitter:description` |
| `intro` | Visible lead paragraph below H1 | Article cards on hub/related lists |
| `author` | Byline | JSON-LD `author.name` |
| `datePublished` | Article publish date | Sort order, sitemap `lastmod`, JSON-LD `datePublished` |
| `lastReviewed` | Optional "Updated" date | Displayed only when different from publish |
| `primaryCategory` | Main topic bucket | Category page membership, breadcrumb category slot |
| `secondaryCategory` | Optional co-topic | Extra category-page membership |
| `journey` | Intent-based grouping | Journey pages, related-posts fallback, CTA selection |
| `contentType` | Layout switch (guide/case-study/news/…) | H1 size, byline style, drop cap, TOC visibility |
| `contentLevel` | Reader-experience label | Optional badge display |
| `featured` + `pinnedPosition` | Hub carousel/ordering | Hero carousel + Featured Reads on `/blog/` |
| `heroImage` | Article cover | OG image (blog post override), hero band, hub cards |
| `takeaways` | 2–6 bullet card at top of body | Scan-friendly preview |
| `testimonialPreview` | Case-study social-proof above the fold | Case-study header |
| `relatedPosts` | Manual override for the 3 related items | Skips auto-related algorithm |
| `oldSlugs` | Redirect generator input | `_redirects` generation |

---

## 13. SEO length limits + build-time enforcement

**Purpose** , reject content that will truncate in SERPs BEFORE it ships.

**Where** , `src/lib/seo-limits.mjs` (dual-usable from TS and plain Node scripts).

```js
export const SITE_NAME = '{{BRAND}}';
export const TITLE_SUFFIX = ` | ${SITE_NAME}`;
export const SEO_LIMITS = {
  title: { hardMin: 15, idealMin: 40, idealMax: 60 },
  metaDescription: { hardMin: 50, idealMin: 120, idealMax: 160 },
  h1: { idealMax: 70 },
};
export function renderedTitle(seoTitle) {
  return seoTitle.includes(SITE_NAME) ? seoTitle : `${seoTitle}${TITLE_SUFFIX}`;
}
```

**Enforcement layers**
1. Zod hard floors → build fails.
2. `scripts/check-seo-lengths.mjs` → soft warnings for `idealMin/idealMax`.
3. Optional editor lint via same module.

**Ideal targets (Google desktop pixel widths)** , title ~40–60 chars, description ~120–160 chars, H1 ≤ 70 chars.

---

## 14. Slug generation

- **Article slug = filename.** No frontmatter override, no derivation from title. Enforces one-slug-per-file and avoids drift.
- Filename rules: lowercase, kebab-case, ASCII, `.mdx`.
- Renames create a redirect via `oldSlugs: ['previous-filename']` in the new file's frontmatter , never delete + rename in git without leaving the trail.
- Reserved-slug guard (§2) MUST run before build.

---

## 15. Author metadata

**Purpose** , display consistent byline info across all posts; add authors in one file.

```ts
// src/content/authors.ts
export interface AuthorMeta {
  readonly title: string;                 // job title
  readonly initials?: string;
  readonly avatarTint?: 'primary' | 'accent' | 'mint' | 'cool' | 'neutral';
  readonly photo?: ImageMetadata;
  readonly linkedin?: string;
}
export const AUTHORS: Record<string, AuthorMeta> = {
  '{{Author Name}}': { title: '{{Role}}', avatarTint: 'primary' },
};

export function resolveAuthor(name: string) {
  const meta = AUTHORS[name] ?? { title: 'Team' };
  const initials = meta.initials ?? deriveInitials(name);
  return { name, meta, initials };
}
```

**Rules**
- `author` in post frontmatter is the *display name* , never derive from git commit.
- Unknown author → fall back to a `{{Brand}} Team` byline, not to a 404.
- JSON-LD `author.name` = the raw display name.

---

## 16. Reading time

Compute at render time from the body word count:

```ts
const wordCount = (post.body ?? '').trim().split(/\s+/).filter(Boolean).length;
const readingTimeMin = post.data.readingTimeMin ?? Math.max(1, Math.round(wordCount / 230));
```

Frontmatter `readingTimeMin` overrides the computed value (useful for content-heavy posts with tables, embeds).

---

## 17. Table of Contents (TOC)

**Purpose** , improve UX + increase dwell time on long-form guides.

**How (Astro/MDX)**
```ts
const { Content, headings } = await render(post);
const h2s = headings.filter(h => h.depth === 2);
```

**Rules**
- Show TOC only when `h2s.length >= 3` AND content type is long-form (`guide`, `explainer`, `checklist`, `opinion`, `faq`, `glossary`).
- Auto-generate H2 slugs (Astro/MDX does this automatically → `#heading-slug`).
- Sticky sidebar on `lg+`, stacked card on mobile.
- Active-section highlight via `IntersectionObserver` with `rootMargin: '-15% 0px -70% 0px'`.
- Click-to-copy on H2s: writes `location.origin + pathname + '#' + id` to clipboard.

---

## 18. Related posts algorithm

Auto-picker (used unless `relatedPosts` frontmatter override is present):

```
if contentType == 'case-study':
    pick 3 most recent case-studies (excl. current)
    if fewer than 3: fill from same-journey posts
elif contentType in ('news', 'company-update'):
    pick 3 most recent news/updates
    if fewer than 3: fill from same-category posts
else:
    pick 3 most recent same-journey posts
    if fewer than 3: fill from same-category posts
```

**Rules**
- Always exclude the current post.
- Never fewer than 0; hide the section if the pool is empty.
- Cap at 3.

---

## 19. Content processing pipeline (MDX)

```
src/content/posts/{slug}.mdx
        │
        ▼
[Zod schema]  ── fails build on bad frontmatter
        │
        ▼
[render(post)] → Content component + headings[]
        │
        ├─── ContentType branch (guide|case-study|news|…)
        │       ↓
        ├─── Header band (H1, breadcrumb, byline, hero image)
        ├─── Optional Key Takeaways card
        ├─── TOC (if applicable)  ⟷  Article body (Content)
        ├─── Share rail / sticky CTA (case studies)
        ├─── Author card
        ├─── Related posts (3)
        ├─── Journey-tuned final CTA
        │
        ▼
[BlogPosting JSON-LD]
[Breadcrumb JSON-LD]
```

### 19.1 MDX conventions

- Import assets from `../../assets/blog/{{slug}}/`. Never `/public` for content images (loses fingerprinting).
- Reusable MDX components live under `src/components/blog/*` , imported at the top of the post:
  - `KeyTakeaways`, `Callout`, `KeyPoint`, `PullQuote`, `Steps`/`Step`, `InsightGrid`/`InsightItem`, `Stat`/`StatCallout`, `Scenario`, `Compare`/`CompareItem`, `InlineCta`, `ClosingTestimonial`.
- Prefer semantic HTML in body , `<h2>`, `<h3>`, `<ul>`, `<ol>`, `<blockquote>`, `<mark>` , styled globally via `.prose-article` (see §21).
- One `<h1>` per page (rendered by the template, NOT in MDX body).

### 19.2 Example frontmatter (copy this template)

```mdx
---
title: "{{Human-readable H1 (≤ 70 chars ideal)}}"
seoTitle: "{{<title> value; will get brand suffix if missing}}"
author: "{{Author Display Name}}"
datePublished: 2026-01-15
lastReviewed: 2026-03-02              # optional
intro: "{{1–2 sentence lead paragraph shown below H1 (20–300 chars)}}"
metaDescription: "{{50–160 chars, sales-y allowed, distinct from intro}}"
primaryCategory: {{category-slug}}
secondaryCategory: {{other-category-slug}}    # optional, must differ
journey: {{journey-slug}}
contentLevel: beginner                # beginner | intermediate | advanced
contentType: guide                    # guide | opinion | case-study | news | explainer | checklist | company-update | faq | glossary
evergreen: true
featured: false
pinnedPosition: 2                     # optional; lower = higher priority
heroImage: ../../assets/blog/{{slug}}/hero.webp
takeaways:
  - "Bullet 1 (5–200 chars)"
  - "Bullet 2"
  - "Bullet 3"
oldSlugs: ["prior-filename"]          # optional; drives redirect generation
relatedPosts: ["some-slug", "another"] # optional; overrides auto-picker
---

import { Image } from 'astro:assets';
import PullQuote from '@/components/blog/PullQuote.astro';

Article body starts here. First paragraph gets a drop cap for editorial types.
```

---

## 20. Directory structure

```
{{project-root}}/
├── astro.config.ts            # site url, sitemap, mdx, trailingSlash
├── package.json
├── tsconfig.json
├── public/
│   ├── robots.txt
│   ├── _redirects             # or platform equivalent
│   ├── og-image.webp          # DEFAULT_OG_IMAGE
│   ├── logo.webp
│   ├── favicon.svg, favicon.ico, apple-touch-icon.png, site.webmanifest
│   └── og/                    # per-page OG overrides
└── src/
    ├── consts.ts              # SITE (§1)
    ├── content.config.ts      # Zod schema for posts collection (§12)
    ├── content/
    │   ├── taxonomy.ts        # categories + journeys (§11)
    │   ├── authors.ts         # author roster (§15)
    │   └── posts/             # {slug}.mdx per article (§14)
    ├── assets/
    │   ├── authors/           # author photos
    │   └── blog/{slug}/       # per-post hero + inline images
    ├── layouts/
    │   └── BaseLayout.astro   # <head>, header, footer, sitewide schemas (§21)
    ├── components/
    │   ├── shared/
    │   │   ├── Seo.astro
    │   │   ├── SchemaOrg.astro
    │   │   ├── Hero.astro
    │   │   ├── SectionHeader.astro
    │   │   ├── Card.astro / CardGrid.astro
    │   │   ├── CTABanner.astro
    │   │   ├── FaqSection.astro
    │   │   ├── Header.astro / Footer.astro
    │   │   └── …
    │   └── blog/
    │       ├── PostCard.astro
    │       ├── Pagination.astro
    │       ├── BrowseAllArticles.astro
    │       ├── KeyTakeaways.astro
    │       ├── Callout.astro / KeyPoint.astro / PullQuote.astro
    │       ├── Steps.astro / Step.astro
    │       ├── InsightGrid.astro / InsightItem.astro
    │       ├── Stat.astro / StatCallout.astro
    │       ├── Scenario.astro / Compare.astro / CompareItem.astro
    │       ├── InlineCta.astro / ClosingTestimonial.astro
    │       ├── JourneyArc.astro / Portal.astro
    │       └── contentTypes.ts
    ├── lib/
    │   ├── seo.ts             # buildSeo() (§3)
    │   ├── schema.ts          # JSON-LD builders (§5)
    │   └── seo-limits.mjs     # SEO_LIMITS + renderedTitle (§13)
    ├── types/
    │   └── seo.ts             # SeoConfig, ResolvedSeo, FaqItem, BreadcrumbItem
    ├── pages/
    │   ├── index.astro
    │   ├── 404.astro
    │   ├── {marketing-page}.astro
    │   ├── [slug].astro       # blog article template
    │   ├── rss.xml.ts
    │   └── blog/
    │       ├── [...page].astro          # /blog/, /blog/2/, …
    │       ├── search.astro
    │       └── category/[category].astro
    │       └── journeys/[journey].astro
    ├── scripts/
    │   ├── check-reserved-slugs.mjs
    │   ├── check-seo-lengths.mjs
    │   └── generate-redirects.mjs
    └── styles/
        └── global.css
```

---

## 21. Layouts & templates

### 21.1 `BaseLayout`

**Responsibilities**
- HTML shell (`<html lang>`, viewport meta, favicons, font preloads).
- Mount `<Seo>` and sitewide JSON-LD (`WebSite`, `Organization`, `LocalBusiness`).
- Optional GTM bootstrap + Consent Mode v2 defaults (denied by default in GDPR regions).
- Skip-to-content link, sticky Header, Footer, cookie/consent banner.
- `<slot />` = page content.

**Props contract**
```ts
interface Props {
  seo: SeoConfig;
  hideHeader?: boolean;
  hideFooter?: boolean;
  hideSitewideSchemas?: boolean;  // for schema-mirror parity with legacy source
}
```

### 21.2 Marketing page template

Every marketing page follows the same shape (adapt sections to the content):

```
<Hero eyebrow="…" headline="…" accentTail="…" />       # H1 lives here
<PartnerLogosSection />                                # optional social proof
<ServiceBrowser | SplitContentSection … />             # main pitch
<ClientStoriesSection />                                # testimonials
<IndustriesSection />                                   # cross-sell rail
<ResourcesSection />                                    # blog cross-links
<FaqSection />                                          # emits FAQ JSON-LD when supplied
<CTABanner />                                           # closing CTA
<FormCalendlySection />                                 # conversion form
```

**H1 = Hero `headline` + optional `accentTail`.** Do NOT put a second `<h1>` in body.

### 21.3 Blog article template (`src/pages/[slug].astro`)

Layout by content type:

| Content type | Header | Body | Sidebar |
|---|---|---|---|
| `guide`, `explainer`, `checklist`, `faq`, `glossary`, `opinion` | Standard header + drop cap | Numbered H2 counters, TOC ≥ 3 H2s | Vertical share rail |
| `case-study` | Header + testimonial preview above fold | Standard body, wider right rail | Sticky "Work with us" CTA card |
| `news`, `company-update` | Compact header (smaller H1, no dot pattern) | Single centred column, no TOC, no counters | None |

---

## 22. Reusable components (contract summaries)

Marketing/shared (`src/components/shared/`):

| Component | Purpose |
|---|---|
| `Hero` | Header band with `eyebrow`, `headline`, `accentTail` , renders the page `<h1>` |
| `SectionHeader` | Consistent eyebrow + heading + accentTail rhythm inside sections |
| `Card`, `CardGrid` | Uniform card surface (boxed variant available) |
| `CTABanner` | Full-bleed conversion strip with accent-tail heading + button |
| `FaqSection` | Renders visible FAQ + wires `jsonLd.faq` to the FAQ Page JSON-LD emitter |
| `PartnerLogosSection` | Social-proof strip |
| `TestimonialsSection` | Reviews carousel |
| `MapEmbed` | Local-business map inside location pages |
| `FormCalendlySection` | Booking + calendly with contact fallback |
| `Header`, `Footer` | Nav + footer using `SITE` constants |

Blog (`src/components/blog/`):

| Component | Purpose |
|---|---|
| `KeyTakeaways` | 2–6 bullet card driven by frontmatter `takeaways` |
| `Callout` / `KeyPoint` | Inline emphasis blocks in article body |
| `PullQuote` | Editorial blockquote with attribution |
| `Steps` + `Step` | Numbered how-to block |
| `InsightGrid` + `InsightItem` | 2- or 3-up mini-cards inside an article |
| `Stat` + `StatCallout` | Numeric emphasis block |
| `Scenario` | Named example ("If your team does X…") |
| `Compare` + `CompareItem` | Side-by-side comparison |
| `InlineCta` | Mid-article call to action |
| `ClosingTestimonial` | Attributed quote near the end |
| `PostCard` | Standard article card for grids |
| `Pagination` | Page N of M control |
| `BrowseAllArticles` | Paginated archive component (chips optional) |
| `contentTypes.ts` | Maps `contentType` → display label + icon |

**Rules for reusable components**
- Every component's props are typed (Props interface in the `---` fence).
- Prefer *composition* (slots) over 10-flag prop soup.
- Use design tokens (Tailwind CSS vars) not hardcoded colours.
- Never fetch data inside a component; pass it in.

---

## 23. Naming conventions

| Kind | Convention |
|---|---|
| Files & folders | `kebab-case`; components `PascalCase.astro` |
| Component names | `PascalCase` (`Hero`, `PostCard`) |
| Slugs (URL, filename) | `kebab-case`, ASCII only, no trailing punctuation |
| Category / Journey slugs | `kebab-case`, singular noun-phrases |
| Frontmatter keys | `camelCase` |
| CSS variables | `--color-brand-{{token}}`, `--color-brand-accent`, `--color-brand-surface-*` |
| Aliases | `@/*` → `src/*` (tsconfig `paths`) |
| Env vars (client-safe) | `PUBLIC_{{NAME}}` (Vite convention) |
| JSON-LD `@id` | `${SITE.url}/#{{entity}}` e.g. `/#org`, `/#business`, `/#website` |

---

## 24. Configuration patterns

### 24.1 `astro.config.ts` checklist

- [ ] `site: SITE.url`
- [ ] `output: 'static'`
- [ ] `trailingSlash: 'always'`
- [ ] `integrations: [sitemap({ filter }), mdx(), icon()]`
- [ ] `env.schema.PUBLIC_STAGING` (string, client, optional)
- [ ] Optional analytics env vars (`PUBLIC_GTM_ID`, etc.)
- [ ] Tailwind via `vite.plugins`

### 24.2 `tsconfig.json` essentials

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "allowJs": true                 // lets .mjs seo-limits type-check via JSDoc
  }
}
```

### 24.3 Environment strategy

| Env | `PUBLIC_STAGING` | Default robots | Notes |
|---|---|---|---|
| Production | unset / `false` | indexable | Real analytics, real Calendly, real Turnstile |
| Preview / staging | `true` | noindex, nofollow | Sandbox creds; safe to link publicly |
| Local dev | unset | indexable | No analytics loaded |

---

## 25. Indexability rules (decision table)

| Page kind | Indexable? | Canonical | In sitemap? |
|---|---|---|---|
| Marketing landing | ✅ | self | ✅ |
| Location / service page | ✅ | self | ✅ |
| Blog index page 1 (`/blog/`) | ✅ | self | ✅ |
| Blog paginated (`/blog/2/`) | ✅ | self | ✅ |
| Blog article | ✅ | self | ✅ |
| Category page + pagination | ✅ | self | ✅ |
| Journey page + pagination | ✅ | self | ✅ |
| Search results page | ❌ (`noindex`) | self | ❌ |
| Style guide / dev pages | ❌ | self | ❌ |
| Legacy WordPress duplicate | ❌ (`noindex`) or redirect | to canonical target | ❌ |
| Ads landing page (`pageType: 'ads'`) | ❌ (`noindex, nofollow`) | self | ❌ |
| 404 | ❌ (`noindex`) | , | ❌ |
| Staging deploy (any page) | ❌ (env override) | self | ❌ |

---

## 26. Accessibility + performance baseline (SEO adjacent)

- `lang` attribute on `<html>` matches content locale.
- Every image has `alt`; decorative → `alt=""` + `aria-hidden="true"`.
- Every interactive control is a `<button>` or `<a>` , never a bare `<div>`.
- Skip-to-content link at top of `<body>`.
- Fonts preloaded (`<link rel="preload" as="font" crossorigin>`) , only the WOFF2 variants you actually use.
- Third-party resource hints (`preconnect`) are colocated with the component that uses them (YouTube, Calendly, Maps) , never a blanket list.
- Images use responsive `widths` + `sizes` attributes.
- Hero image uses `loading="eager"` and `fetchpriority="high"`; every other image `loading="lazy"`.
- Prefers-reduced-motion is honoured for entrance animations.
- Consent Mode v2 defaults (denied for ad/analytics storage in GDPR regions) fire BEFORE any tag manager loads.

---

## 27. Implementation checklist for a new project

### Bootstrap
- [ ] Create `SITE` in `src/consts.ts`
- [ ] Wire `site: SITE.url` in framework config, `trailingSlash` policy chosen
- [ ] Create `robots.txt`, favicons, `og-image.webp`, `logo.webp`
- [ ] Copy `src/types/seo.ts`, `src/lib/seo.ts`, `src/lib/seo-limits.mjs`, `src/lib/schema.ts`
- [ ] Copy `src/components/shared/Seo.astro` + `SchemaOrg.astro`
- [ ] Copy `src/layouts/BaseLayout.astro`

### Marketing pages
- [ ] Home + core service pages with `Hero`, `CTABanner`, `FaqSection`
- [ ] Location pages (if local) with `MapEmbed` + LocalBusiness JSON-LD overrides
- [ ] Contact + booking page

### Blog
- [ ] Copy `src/content.config.ts` (adjust categories, journeys, content types)
- [ ] Fill `src/content/taxonomy.ts` with real categories & journeys
- [ ] Fill `src/content/authors.ts` roster
- [ ] Ship `/blog/[...page].astro`, `/blog/category/[category].astro`, `/blog/journeys/[journey].astro`
- [ ] Ship `[slug].astro` article template with TOC, share rail, related picker, BlogPosting JSON-LD
- [ ] Ship `pages/rss.xml.ts`

### SEO plumbing
- [ ] Sitemap integration + filter
- [ ] Reserved-slug guard (`scripts/check-reserved-slugs.mjs`)
- [ ] SEO length check (`scripts/check-seo-lengths.mjs`)
- [ ] Redirect generator (`scripts/generate-redirects.mjs`) from `oldSlugs`
- [ ] Add `PUBLIC_STAGING=true` to preview environment
- [ ] Ensure every article's `datePublished`, `metaDescription`, `heroImage` are present

### QA before launch
- [ ] Every page emits: `<title>`, meta description, canonical, robots, OG title/desc/image, Twitter card, at least one JSON-LD
- [ ] No duplicate H1
- [ ] No duplicate canonical URLs across pages
- [ ] Sitemap contains every indexable URL, no noindex URLs
- [ ] `robots.txt` references sitemap
- [ ] Every article passes Zod schema
- [ ] Rich Results Test passes for one article (BlogPosting), one FAQ page, one Breadcrumb, `LocalBusiness`
- [ ] Lighthouse SEO ≥ 95 on 5 sampled URLs

---

## 28. Anti-patterns to reject

- ❌ Writing meta tags inline in a page template (must go through `Seo` builder).
- ❌ Deriving `author` from git commit metadata.
- ❌ Auto-generating tags to bloat internal linking.
- ❌ Canonicalising paginated pages back to page 1.
- ❌ Using `rel="prev"` / `rel="next"` (deprecated by Google).
- ❌ Hardcoding domain strings anywhere except `SITE.url`.
- ❌ Emitting `FAQPage` JSON-LD when no FAQ is visible on the page.
- ❌ Fabricating `aggregateRating`.
- ❌ Blanket third-party `preconnect` list in `<head>`.
- ❌ Redirecting through more than one hop.
- ❌ Article slug that duplicates a top-level route (must be caught by reserved-slug guard).
- ❌ Mixing trailing-slash styles across the site.
- ❌ Uppercase or underscore characters in slugs.
- ❌ Publishing without a `metaDescription` , Google will invent one, badly.

---

## 29. Quick reference , copy-paste snippets

### 29.1 Minimal marketing page

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/shared/Hero.astro';
import type { SeoConfig } from '@/types/seo';
const SELF = '/{{slug}}/';
const seo: SeoConfig = {
  pageType: 'organic',
  title: '{{Page Title}} | {{Brand}}',
  description: '{{50–160 chars}}',
  canonical: SELF,
  jsonLd: {
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: '{{Page}}', url: SELF },
    ],
  },
};
---
<BaseLayout seo={seo}>
  <Hero eyebrow="{{Eyebrow}}" headline="{{Headline}}" accentTail="{{Tail}}" />
  <!-- more sections -->
</BaseLayout>
```

### 29.2 FAQ page config (visible FAQ + JSON-LD)

```ts
const faqs = [
  { question: 'Q1?', answer: 'A1.' },
  { question: 'Q2?', answer: 'A2.' },
];
const seo: SeoConfig = {
  pageType: 'organic', title: '…', description: '…', canonical: SELF,
  jsonLd: { faq: faqs, breadcrumbs: [/* … */] },
};
// render <FaqSection items={faqs} /> in the body
```

### 29.3 Location page (LocalBusiness + geo meta)

```ts
const seo: SeoConfig = {
  pageType: 'organic',
  title: '{{Service}} in {{City}} | {{Brand}}',
  description: '…',
  canonical: SELF,
  geoPosition: '{{lat}};{{lng}}',
  geoPlacename: '{{City}}',
  geoRegion: '{{ISO-3166-2}}',
  jsonLd: {
    localBusiness: { description: '{{City}}-specific description}}' },
    faq, breadcrumbs,
  },
};
```

### 29.4 BlogPosting JSON-LD (article template)

```ts
const canonical = new URL(`/${post.id}/`, SITE.url).toString();
const blogPostingLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: data.title,
  description: data.metaDescription,
  datePublished: data.datePublished.toISOString(),
  dateModified: (data.lastReviewed ?? data.datePublished).toISOString(),
  author: { '@type': 'Person', name: data.author },
  publisher: { '@type': 'Organization', name: SITE.name,
    logo: { '@type': 'ImageObject', url: SITE.logo } },
  mainEntityOfPage: canonical,
  articleSection: category.name,
  keywords: [data.journey, data.secondaryCategory].filter(Boolean).join(','),
  wordCount,
  ...(heroImageUrl ? { image: heroImageUrl } : {}),
};
```

---

## 30. Glossary

| Term | Meaning |
|---|---|
| SSG | Static Site Generation , HTML pre-rendered at build |
| MDX | Markdown + JSX components |
| Canonical | `<link rel="canonical">` telling Google the preferred URL for a piece of content |
| OG | Open Graph , Facebook's meta protocol; also used by LinkedIn, Slack, iMessage |
| JSON-LD | JSON for Linking Data , Google's preferred structured-data format |
| Journey | An intent-based grouping ("who are they, what are they trying to do") |
| Content type | Layout switch that shapes header, TOC, sidebar, and body chrome |
| Journey CTA | The CTA shown at the end of an article, chosen by the post's `journey` |
| Rich result | A SERP treatment (breadcrumb trail, FAQ accordion, review stars, sitelinks search) |

---

*End of blueprint. Version 1.0 , framework-agnostic where possible; Astro v5 patterns flagged where relevant.*
