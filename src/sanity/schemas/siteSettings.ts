import { defineArrayMember, defineField, defineType } from 'sanity';
import { seoFields, seoGroups } from './shared';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Ajustes del sitio',
  type: 'document',
  groups: seoGroups,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre corto',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'legalName',
      title: 'Nombre legal',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'phoneHref',
      title: 'Teléfono (href)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'url',
      group: 'content',
    }),
    defineField({
      name: 'locales',
      title: 'Ciudades / bases',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'socials',
      title: 'Redes',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Nombre', type: 'string' }),
            defineField({ name: 'href', title: 'URL', type: 'url' }),
          ],
        }),
      ],
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: 'legalName', subtitle: 'tagline' },
  },
});
