import { defineArrayMember, defineField, defineType } from 'sanity';

export const seoFields = [
  defineField({
    name: 'metaTitle',
    title: 'Título SEO',
    type: 'string',
    group: 'seo',
    validation: (rule) => rule.max(70).warning('Idealmente ≤ 60–70 caracteres'),
  }),
  defineField({
    name: 'metaDescription',
    title: 'Descripción SEO',
    type: 'text',
    rows: 3,
    group: 'seo',
    validation: (rule) => rule.max(160).warning('Idealmente ≤ 155–160 caracteres'),
  }),
  defineField({
    name: 'ogImage',
    title: 'Imagen Open Graph',
    type: 'image',
    group: 'seo',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Texto alternativo',
        type: 'string',
        validation: (rule) => rule.required().warning('El alt es obligatorio en imágenes'),
      }),
    ],
  }),
];

export const seoGroups = [
  { name: 'content', title: 'Contenido', default: true },
  { name: 'seo', title: 'SEO' },
];

export function imageWithAlt({
  name,
  title,
  required = false,
  group,
}: {
  name: string;
  title: string;
  required?: boolean;
  group?: string;
}) {
  return defineField({
    name,
    title,
    type: 'image',
    group,
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Texto alternativo',
        type: 'string',
        validation: (rule) =>
          required
            ? rule.required().error('El alt es obligatorio')
            : rule.required().warning('El alt es obligatorio en imágenes'),
      }),
    ],
    validation: required ? (rule) => rule.required() : undefined,
  });
}

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Pregunta',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Respuesta',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'question' },
  },
});

export const titledBlock = defineType({
  name: 'titledBlock',
  title: 'Bloque con título',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
});

export const processStep = defineType({
  name: 'processStep',
  title: 'Paso de proceso',
  type: 'object',
  fields: [
    defineField({
      name: 'index',
      title: 'Índice',
      type: 'string',
      description: 'Ej. 01. Si se deja vacío, el front lo numera.',
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'index' },
  },
});

export const metric = defineType({
  name: 'metric',
  title: 'Métrica',
  type: 'object',
  fields: [
    defineField({
      name: 'valor',
      title: 'Valor',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Etiqueta',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'prefix', title: 'Prefijo', type: 'string' }),
    defineField({ name: 'suffix', title: 'Sufijo', type: 'string' }),
    defineField({ name: 'decimals', title: 'Decimales', type: 'number' }),
    defineField({ name: 'antes', title: 'Antes', type: 'string' }),
    defineField({ name: 'despues', title: 'Después', type: 'string' }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'valor' },
  },
});

export const cta = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Etiqueta',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
});

export const faqCategory = defineType({
  name: 'faqCategory',
  title: 'Categoría FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Etiqueta',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Preguntas',
      type: 'array',
      of: [defineArrayMember({ type: 'faqItem' })],
    }),
  ],
  preview: {
    select: { title: 'label' },
  },
});

export const serviceBlurb = defineType({
  name: 'serviceBlurb',
  title: 'Blurb de servicio',
  type: 'object',
  fields: [
    defineField({
      name: 'service',
      title: 'Servicio',
      type: 'reference',
      to: [{ type: 'service' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción para esta industria',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'service.nombre', subtitle: 'description' },
  },
});
