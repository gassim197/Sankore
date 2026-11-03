import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// Dates réelles des articles pour le sitemap : Google n'utilise lastmod que
// s'il reflète de vraies modifications (pas la date de chaque déploiement).
const ARTICLES_DIR = new URL('./src/content/articles/', import.meta.url);
const articleDates = new Map();   // slug → date de dernière modification
const categoryDates = new Map();  // catégorie → date de l'article le plus récent
let latestArticleDate;

for (const file of readdirSync(ARTICLES_DIR)) {
  if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;
  const frontmatter = readFileSync(new URL(file, ARTICLES_DIR), 'utf8').split('---')[1] ?? '';
  const field = (name) => frontmatter.match(new RegExp(`^${name}:\\s*["']?([^"'\\n#]+)`, 'm'))?.[1].trim();
  if (field('draft') === 'true') continue;
  const date = new Date(field('updatedAt') ?? field('publishedAt'));
  if (Number.isNaN(date.getTime())) continue;
  articleDates.set(file.replace(/\.mdx?$/, ''), date);
  const category = field('category');
  if (category && !(categoryDates.get(category) > date)) categoryDates.set(category, date);
  if (!(latestArticleDate > date)) latestArticleDate = date;
}

export default defineConfig({
  site: 'https://www.sankore.africa',
  trailingSlash: 'never',
  output: 'hybrid',
  adapter: vercel({
    imageService: true,
  }),

  integrations: [
    mdx(),
    tailwind({ applyBaseStyles: false }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // Exclure les routes API et les pages sans valeur SEO
      filter: (page) =>
        !page.includes('/api/') &&
        !page.includes('/recherche') &&
        !page.includes('/mentions-legales') &&
        !page.includes('/confidentialite'),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '');
        // Articles : priorité maximale + date de publication ou de mise à jour
        if (path.startsWith('/articles/')) {
          const lastmod = articleDates.get(path.slice('/articles/'.length));
          return { ...item, priority: 1.0, changefreq: 'monthly', ...(lastmod && { lastmod: lastmod.toISOString() }) };
        }
        // Pages catégorie : date de l'article le plus récent de la catégorie
        if (path.startsWith('/categories/')) {
          const lastmod = categoryDates.get(path.slice('/categories/'.length));
          return { ...item, priority: 0.8, changefreq: 'weekly', ...(lastmod && { lastmod: lastmod.toISOString() }) };
        }
        // Accueil et archive : changent à chaque nouvel article
        if ((path === '' || path === '/archive') && latestArticleDate) {
          return { ...item, priority: path === '' ? 1.0 : item.priority, changefreq: path === '' ? 'daily' : 'weekly', lastmod: latestArticleDate.toISOString() };
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
