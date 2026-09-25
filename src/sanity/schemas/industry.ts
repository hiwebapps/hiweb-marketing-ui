import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageWithAlt, seoFields, seoGroups } from './shared';

export const industry = defineType({
  name: 'industry',
  title: 'Industria',
  type: 'document',
  groups: seoGroups,
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'nombre',
        maxLength: 96,
        isUnique: async (slug, context) => {
          const { document, getClient } = context;
          if (!document || !slug) return true;
          const id = document._id.replace(/^drafts\./, '');
          const locale = (document as { locale?: string }).locale ?? 'es';
          const client = getClient({ apiVersion: '2024-01-01' });
          const count = await client.fetch(
            `count(*[_type == "industry" && slug.current == $slug && coalesce(locale, "es") == $locale && !(_id in [$id, $draftId])])`,
            { slug, locale, id, draftId: `drafts.${id}` },
          );
          return count === 0;
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'locale',
      title: 'Idioma',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Español', value: 'es' },
          { title: 'English', value: 'en' },
        ],
        layout: 'radio',
      },
      initialValue: 'es',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      group: 'content',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      rows: 2,
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Título hero',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroDescription',
      title: 'Descripción hero',
      type: 'text',
      rows: 4,
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    imageWithAlt({ name: 'heroImage', title: 'Imagen hero', group: 'content' }),
    defineField({
      name: 'heroBadge',
      title: 'Badge hero',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'retos',
      title: 'Retos',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'porQue',
      title: 'Por qué Hiweb',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'titledBlock' })],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'faqItem' })],
    }),
    defineField({ name: 'heroCtaLabel', title: 'Texto del botón del hero', type: 'string', group: 'content' }),
    defineField({ name: 'whyEyebrow', title: 'Badge de Por qué', type: 'string', group: 'content' }),
    defineField({ name: 'whyTitle', title: 'Título de Por qué', type: 'string', group: 'content' }),
    defineField({ name: 'servicesTitle', title: 'Título de servicios', type: 'string', group: 'content' }),
    defineField({ name: 'servicesDescription', title: 'Descripción de servicios', type: 'text', rows: 2, group: 'content' }),
    defineField({ name: 'servicesCtaLabel', title: 'Texto del enlace en cada servicio', type: 'string', group: 'content' }),
    defineField({ name: 'servicesTag', title: 'Etiqueta de cada servicio', type: 'string', group: 'content' }),
    defineField({ name: 'casesEyebrow', title: 'Badge de casos', type: 'string', group: 'content' }),
    defineField({ name: 'casesTitle', title: 'Título de casos', type: 'string', group: 'content' }),
    defineField({ name: 'casesDescription', title: 'Descripción de casos', type: 'text', rows: 2, group: 'content' }),
    defineField({ name: 'casesEmpty', title: 'Texto si no hay casos', type: 'text', rows: 2, group: 'content' }),
    defineField({ name: 'faqTitle', title: 'Título de FAQ', type: 'string', group: 'content' }),
    defineField({ name: 'closingTitle', title: 'Título de cierre', type: 'string', group: 'content' }),
    defineField({
      name: 'serviceBlurbs',
      title: 'Copy industria × servicio',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'serviceBlurb' })],
    }),
    ...seoFields,
  ],
  orderings: [
    {
      title: 'Orden',
      name: 'ordenAsc',
      by: [{ field: 'orden', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'nombre', subtitle: 'tagline', media: 'heroImage' },
  },
});

export const industriesIndex = defineType({
  name: 'industriesIndex',
  title: 'Índice de industrias',
  type: 'document',
  groups: seoGroups,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'whyEyebrow', title: 'Badge de pilares', type: 'string' }),
    defineField({ name: 'whyTitle', title: 'Título de pilares', type: 'string' }),
    defineField({
      name: 'pillars',
      title: 'Pilares',
      type: 'array',
      of: [defineArrayMember({ type: 'titledBlock' })],
    }),
    defineField({ name: 'closingTitle', title: 'Título de cierre', type: 'string' }),
    defineField({ name: 'cardCtaLabel', title: 'Texto del botón en cada card', type: 'string' }),
    ...seoFields,
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Índice de industrias' }),
  },
});
