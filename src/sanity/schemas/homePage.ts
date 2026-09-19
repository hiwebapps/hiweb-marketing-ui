import { defineArrayMember, defineField, defineType } from 'sanity';
import { seoFields, seoGroups } from './shared';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home',
  type: 'document',
  groups: seoGroups,
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Título hero',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroLead',
      title: 'Lead hero',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'primaryCta',
      title: 'CTA principal',
      type: 'cta',
      group: 'content',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'CTA secundario',
      type: 'cta',
      group: 'content',
    }),
    defineField({
      name: 'process',
      title: 'Fases del proceso',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'processStep' })],
    }),
    defineField({
      name: 'faqCategories',
      title: 'FAQ (home)',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'faqCategory' })],
    }),
    ...seoFields,
  ],
  preview: {
    prepare: () => ({ title: 'Home' }),
  },
});
