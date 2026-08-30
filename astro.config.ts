// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { SITE } from './src/consts';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },

  trailingSlash: 'always',

  // Inline the compiled CSS into the HTML so it doesn't block first paint
  // (improves FCP / Speed Index). The site stylesheet is ~36KB — small enough
  // that removing the extra render-blocking request is a net win.
  build: {
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  // Single source of truth for the domain — see src/consts.ts.
  site: SITE.url,

  // Self-host Google Fonts at build time (no fonts.googleapis.com dependency,
  // no render-blocking request). Astro inlines the @font-face CSS, generates
  // size-matched fallbacks (low CLS), and emits preloads via <Font>. Weights
  // are trimmed to those actually used across the site.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Poppins',
      cssVariable: '--font-poppins',
      weights: [600, 700],
      display: 'swap',
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600, 700],
      display: 'swap',
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Fira Code',
      cssVariable: '--font-fira-code',
      weights: [400],
      display: 'swap',
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],

  integrations: [
    sitemap({ filter: (page) => !page.includes('/404') }),
    icon(),
    // Strip HTML comments from the built pages so developer notes never ship in
    // production view-source. Source files keep their comments for maintainers.
    {
      name: 'strip-html-comments',
      hooks: {
        'astro:build:done': async ({ dir, logger }) => {
          // Match a whole <script>/<style> block OR an HTML comment; keep the
          // blocks verbatim (a JSON-LD string may contain "<!--") and drop only
          // real comments. The alternation is left-to-right and non-overlapping,
          // so a "<!--" inside a script/style is consumed by that block first.
          const stripHtmlComments = (html: string): string =>
            html.replace(
              /<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi,
              (m) => (m.startsWith('<!--') ? '' : m),
            );
          let pages = 0;
          const walk = async (d: string): Promise<void> => {
            for (const entry of await readdir(d, { withFileTypes: true })) {
              const full = join(d, entry.name);
              if (entry.isDirectory()) await walk(full);
              else if (entry.name.endsWith('.html')) {
                // Never let one unreadable/locked file fail the whole build.
                try {
                  const html = await readFile(full, 'utf8');
                  const cleaned = stripHtmlComments(html);
                  if (cleaned !== html) {
                    await writeFile(full, cleaned);
                    pages++;
                  }
                } catch (err) {
                  logger.warn(`Skipped ${entry.name}: ${(err as Error).message}`);
                }
              }
            }
          };
          await walk(fileURLToPath(dir));
          logger.info(`Stripped HTML comments from ${pages} page(s).`);
        },
      },
    },
  ],
});
