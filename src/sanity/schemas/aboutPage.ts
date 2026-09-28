import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageWithAlt, seoFields, seoGroups } from './shared';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Nosotros',
  type: 'document',
  groups: seoGroups,
  fields: [
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
    defineField({
      name: 'heroBadge',
      title: 'Etiqueta del hero',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'Botón del hero',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heroCtaHref',
      title: 'Ruta del botón del hero',
      type: 'string',
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
    defineField({
      name: 'pillarsEyebrow',
      title: 'Diferenciadores — eyebrow',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'pillarsTitle',
      title: 'Diferenciadores — título',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'pillars',
      title: 'Diferenciadores',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string' }),
            defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
            defineField({ name: 'icon', title: 'Icono', type: 'string' }),
            defineField({ name: 'accent', title: 'Color', type: 'string' }),
            defineField({ name: 'href', title: 'Ruta', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        }),
      ],
    }),
    defineField({ name: 'processEyebrow', title: 'Proceso — eyebrow', type: 'string', group: 'content' }),
    defineField({ name: 'processTitle', title: 'Proceso — título', type: 'string', group: 'content' }),
    defineField({ name: 'processDescription', title: 'Proceso — descripción', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'teamEyebrow', title: 'Equipo — eyebrow', type: 'string', group: 'content' }),
    defineField({ name: 'teamTitle', title: 'Equipo — título', type: 'string', group: 'content' }),
    defineField({ name: 'teamDescription', title: 'Equipo — descripción', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'teamCtaLabel', title: 'Equipo — botón', type: 'string', group: 'content' }),
    defineField({ name: 'teamCtaHref', title: 'Equipo — ruta del botón', type: 'string', group: 'content' }),
    defineField({
      name: 'teamFilters',
      title: 'Equipo — filtros',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'id', title: 'Id', type: 'string' }),
            defineField({ name: 'label', title: 'Texto', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'id' } },
        }),
      ],
    }),
    defineField({ name: 'mapEyebrow', title: 'Mapa — eyebrow', type: 'string', group: 'content' }),
    defineField({ name: 'mapTitle', title: 'Mapa — título', type: 'string', group: 'content' }),
    defineField({ name: 'mapDescription', title: 'Mapa — descripción', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'closingBadge', title: 'Cierre — etiqueta', type: 'string', group: 'content' }),
    defineField({ name: 'closingTitle', title: 'Cierre — título', type: 'string', group: 'content' }),
    defineField({ name: 'closingDescription', title: 'Cierre — descripción', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'closingCtaLabel', title: 'Cierre — botón', type: 'string', group: 'content' }),
    ...seoFields,
  ],
  preview: {
    select: { locale: 'locale' },
    prepare({ locale }) {
      return { title: 'Nosotros', subtitle: locale === 'en' ? 'English' : 'Español' };
    },
  },
});
