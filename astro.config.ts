// @ts-check
import { defineConfig } from 'astro/config';

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

  vite: {
    plugins: [tailwindcss()],
  },

  // Single source of truth for the domain — see src/consts.ts.
  site: SITE.url,

  integrations: [
    sitemap({ filter: (page) => !page.includes('/404') }),
    icon()
  ],
});
