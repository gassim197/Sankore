import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles', ({ data }) => !data.draft);

  const sorted = articles.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );

  return rss({
    title: "Sankoré — L'IA au travail, en Afrique",
    description:
      'Un média indépendant, en français, pour les cadres et entrepreneurs ' +
      "ouest-africains qui veulent que l'intelligence artificielle serve leur métier.",
    site: context.site!,
    items: sorted.map(article => ({
      title:       article.data.title,
      pubDate:     article.data.publishedAt,
      description: article.data.excerpt,
      link:        `/articles/${article.slug}/`,
      categories:  [article.data.category],
      author:      article.data.author.name,
      ...(article.data.updatedAt && {
        customData: `<lastBuildDate>${article.data.updatedAt.toUTCString()}</lastBuildDate>`,
      }),
    })),
    customData: [
      '<language>fr</language>',
      '<copyright>© Sankoré — Tous droits réservés</copyright>',
      '<managingEditor>contact@sankore.africa (Gassimou Cissé)</managingEditor>',
      '<webMaster>contact@sankore.africa</webMaster>',
    ].join('\n'),
    stylesheet: false,
  });
}
