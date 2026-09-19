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
      options: { source: 'nombre', maxLength: 96 },
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
