import { defineField, defineType, type FieldDefinition } from 'sanity';
import { headingTitleField, headingWidthField, seoFields, seoGroups } from './shared';

const catalogFields: FieldDefinition[] = [
  defineField({
    name: 'eyebrow',
    title: 'Badge',
    type: 'string',
    group: 'content',
  }),
  headingTitleField({ required: true, group: 'content' }),
  headingWidthField({ group: 'content' }),
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
  headingTitleField({
    name: 'sectionTitle',
    title: 'Título de la segunda sección',
    group: 'content',
  }),
  headingWidthField({ name: 'sectionHeadingWidth', group: 'content', title: 'Ancho de la segunda sección' }),
  headingTitleField({ name: 'listTitle', title: 'Título del listado', group: 'content' }),
  headingWidthField({ name: 'listHeadingWidth', group: 'content', title: 'Ancho del listado' }),
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
  headingTitleField({ name: 'closingTitle', title: 'Título de cierre', group: 'content' }),
  headingWidthField({ name: 'closingHeadingWidth', group: 'content', title: 'Ancho del cierre' }),
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
