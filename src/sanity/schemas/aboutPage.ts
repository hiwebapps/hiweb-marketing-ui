import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageWithAlt, seoFields, seoGroups } from './shared';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Nosotros',
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
      name: 'heroDescription',
      title: 'Descripción hero',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    imageWithAlt({
      name: 'heroImage',
      title: 'Imagen hero',
      group: 'content',
    }),
    defineField({
      name: 'historyEyebrow',
      title: 'Historia — eyebrow',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'historyTitle',
      title: 'Historia — título',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'historyDescription',
      title: 'Historia — descripción',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'historyColumns',
      title: 'Historia — columnas',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string' }),
            defineField({
              name: 'paragraphs',
              title: 'Párrafos',
              type: 'array',
              of: [defineArrayMember({ type: 'text' })],
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(2),
    }),
    ...seoFields,
  ],
  preview: {
    prepare: () => ({ title: 'Nosotros' }),
  },
});
