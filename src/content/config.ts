import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    dek: z.string().optional(),
    excerpt: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum([
      'ia-au-travail',
      'transformation-digitale',
      'decryptages',
      'outils-methodes',
    ]),
    tags: z.array(z.string()).optional(),
    illustration: z.enum([
      'bars',
      'comparison',
      'network',
      'donut',
      'quote',
      'list',
      'pen',
      'default',
    ]),
    illustrationProps: z
      .object({
        number: z.string().optional(),
      })
      .optional(),
    author: z.object({
      name: z.string(),
      role: z.string(),
      bio: z.string(),
      initial: z.string(),
    }),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
