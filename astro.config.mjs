import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://sankore.africa',
  output: 'hybrid',
  adapter: vercel(),

  integrations: [
    mdx(),
    tailwind({ applyBaseStyles: false }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Exclure les routes API et les pages sans valeur SEO
      filter: (page) =>
        !page.includes('/api/') &&
        !page.includes('/mentions-legales') &&
        !page.includes('/confidentialite'),
      serialize(item) {
        // Articles : priorité maximale + fréquence mensuelle
        if (item.url.includes('/articles/')) {
          return { ...item, priority: 1.0, changefreq: 'monthly' };
        }
        // Accueil : priorité maximale + fréquence hebdomadaire
        if (item.url === 'https://sankore.africa/' || item.url === 'https://sankore.africa') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        // Pages catégorie : haute priorité
        if (item.url.includes('/categories/')) {
          return { ...item, priority: 0.8, changefreq: 'weekly' };
        }
        return item;
      },
    }),
  ],

  // Optimisations build
  build: {
    inlineStylesheets: 'auto',
  },
});
