// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },

  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()],
  },

  // TODO: replace 'https://example.com' with actual domain after deployment
  site: 'https://example.com',

  integrations: [
    sitemap({ filter: (page) => !page.includes('/404') }),
    icon()
  ],
});