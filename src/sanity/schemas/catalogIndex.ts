import { defineField, defineType, type FieldDefinition } from 'sanity';
import { seoFields, seoGroups } from './shared';

const catalogFields: FieldDefinition[] = [
  defineField({
    name: 'eyebrow',
    title: 'Badge',
    type: 'string',
    group: 'content',
  }),
  defineField({
    name: 'title',
    title: 'Título',
    type: 'string',
    group: 'content',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'description',
    title: 'Descripción',
    type: 'text',
    rows: 3,
    group: 'content',
  }),
  defineField({
    name: 'label',
    title: 'Etiqueta del hero',
    type: 'string',
    group: 'content',
    description: 'Texto accesible del hero. En el portafolio también es la etiqueta visible.',
  }),
  defineField({
    name: 'sectionTitle',
    title: 'Título de la segunda sección',
    type: 'string',
    group: 'content',
    description: 'En servicios, el título del bloque de industrias.',
  }),
  defineField({
    name: 'listTitle',
    title: 'Título del listado',
    type: 'string',
    group: 'content',
  }),
  defineField({
    name: 'listDescription',
    title: 'Descripción del listado',
    type: 'text',
    rows: 2,
    group: 'content',
  }),
  defineField({
    name: 'allLabel',
    title: 'Texto de “todos”',
    type: 'string',
    group: 'content',
  }),
  defineField({
    name: 'filterLabel',
    title: 'Etiqueta del filtro',
    type: 'string',
    group: 'content',
  }),
  defineField({
    name: 'featuredCta',
    title: 'Texto del artículo destacado',
    type: 'string',
    group: 'content',
  }),
  defineField({
    name: 'readingSuffix',
    title: 'Sufijo de lectura',
    type: 'string',
    group: 'content',
    description: 'Por ejemplo “minutos” o “min read”.',
  }),
  defineField({
    name: 'closingTitle',
    title: 'Título de cierre',
    type: 'string',
    group: 'content',
  }),
  ...seoFields,
];

function catalogType(name: string, title: string) {
  return defineType({
    name,
    title,
    type: 'document',
    groups: seoGroups,
    fields: catalogFields,
    preview: {
      select: { title: 'title' },
      prepare: ({ title: value }) => ({ title: value || title }),
    },
  });
}

export const servicesIndex = catalogType('servicesIndex', 'Índice de servicios');
export const blogIndex = catalogType('blogIndex', 'Índice del blog');
export const casesIndex = catalogType('casesIndex', 'Índice de casos');

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Página legal',
  type: 'document',
  groups: seoGroups,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Badge',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Texto',
      type: 'text',
      rows: 8,
      group: 'content',
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Página legal' }),
  },
});
