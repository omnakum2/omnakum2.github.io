// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { SITE } from './src/consts';

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
    icon()
  ],
});
