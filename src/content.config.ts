import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({
  question: z.string(),
  answer: z.string(),
});

const industrias = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/industrias' }),
  schema: z.object({
    nombre: z.string(),
    orden: z.number(),
    tagline: z.string(),
    heroTitle: z.string(),
    heroDescription: z.string(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    heroBadge: z.string().optional(),
    retos: z.array(z.string()),
    porQue: z.array(z.object({ title: z.string(), description: z.string() })),
    faqs: z.array(faq),
  }),
});

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/servicios' }),
  schema: z.object({
    nombre: z.string(),
    orden: z.number(),
    tagline: z.string(),
    heroTitle: z.string(),
    heroDescription: z.string().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    heroBadge: z.string().optional(),
    cards: z.tuple([
      z.object({ title: z.string(), description: z.string() }),
      z.object({ title: z.string(), description: z.string() }),
      z.object({ title: z.string(), description: z.string() }),
    ]),
    proceso: z.array(z.object({ title: z.string(), description: z.string() })),
    faqs: z.array(faq),
  }),
});

const casos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/casos' }),
  schema: z.object({
    cliente: z.string(),
    industria: reference('industrias').optional(),
    servicios: z.array(reference('servicios')),
    resultadoFrase: z.string(),
    titulo: z.string(),
    resumen: z.string(),
    destacado: z.boolean().default(false),
    accent: z.enum(['cyan', 'orange', 'purple']).default('cyan'),
    metricas: z.array(
      z.object({
        valor: z.number(),
        label: z.string(),
        prefix: z.string().optional(),
        suffix: z.string().optional(),
        decimals: z.number().optional(),
        antes: z.string().optional(),
        despues: z.string().optional(),
      }),
    ),
    reto: z.string(),
    estrategia: z.string(),
    fases: z.array(z.object({ title: z.string(), description: z.string() })),
    testimonio: z
      .object({
        quote: z.string(),
        name: z.string(),
        role: z.string(),
      })
      .optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keyword: z.string(),
    categoriaServicio: reference('servicios').optional(),
    categoriaIndustria: reference('industrias').optional(),
    autor: z.string(),
    fecha: z.coerce.date(),
    featured: z.boolean().default(false),
    faqs: z.array(faq).default([]),
  }),
});

export const collections = { industrias, servicios, casos, posts };
