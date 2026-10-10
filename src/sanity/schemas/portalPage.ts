import { DocumentIcon } from '@sanity/icons/Document';
import { defineArrayMember, defineField, defineType, type ArrayOfObjectsMember } from 'sanity';
import { headingTitleField, headingWidthField, seoFields, seoGroups, withVisibility } from './shared';

const dialog = { options: { modal: { type: 'dialog' as const, width: 'medium' as const } } };

const badgeVariants = [
  { title: 'Lima', value: 'lime' },
  { title: 'Cian', value: 'cyan' },
  { title: 'Morado', value: 'purple' },
  { title: 'Naranja', value: 'orange' },
  { title: 'Neutro', value: 'neutral' },
];

const modules = [
  { title: 'Redes', value: 'rrss' },
  { title: 'Web', value: 'web' },
  { title: 'SEO', value: 'seo' },
  { title: 'Reportes', value: 'docs' },
  { title: 'HiLinks', value: 'hilinks' },
];

const portalHero = defineType({
  name: 'portalHero',
  title: 'Hero y visor',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'badgeNote', title: 'Texto junto al badge', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 3 }),
    defineField({ name: 'clientName', title: 'Cliente de la demo', type: 'string' }),
    defineField({ name: 'windowTitle', title: 'Título de la ventana', type: 'string' }),
    defineField({ name: 'proofTitle', title: 'Prueba, título', type: 'string' }),
    defineField({ name: 'proofText', title: 'Prueba, párrafo', type: 'text', rows: 2 }),
    defineField({ name: 'tourLabel', title: 'Botón del tour', type: 'string' }),
    defineField({ name: 'viewerLabel', title: 'Botón del visor', type: 'string' }),
    defineField({ name: 'coachLabel', title: 'Etiqueta del coach', type: 'string' }),
    defineField({ name: 'coachText', title: 'Texto del coach', type: 'text', rows: 2 }),
    defineField({
      name: 'samples',
      title: 'Entregables de la demo',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'module',
              title: 'Módulo',
              type: 'string',
              options: { list: modules },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'detail', title: 'Detalle', type: 'string' }),
          ],
          preview: {
            select: { title: 'title', module: 'module' },
            prepare: ({ title, module }) => ({ title: title || 'Entregable', subtitle: module }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Hero', subtitle: 'Visor' }),
  },
});

const portalStrip = defineType({
  name: 'portalStrip',
  title: 'Franja',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Texto', type: 'string' }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Texto', type: 'string' }),
            defineField({
              name: 'variant',
              title: 'Color',
              type: 'string',
              options: { list: badgeVariants },
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'text' },
    prepare: ({ title }) => ({ title: title || 'Franja', subtitle: 'Franja' }),
  },
});

const portalJourney = defineType({
  name: 'portalJourney',
  title: 'Flujo',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 3 }),
    defineField({
      name: 'steps',
      title: 'Pasos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'index', title: 'Número', type: 'string' }),
            defineField({ name: 'title', title: 'Título', type: 'string' }),
            defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
            defineField({ name: 'panelTitle', title: 'Título del panel', type: 'string' }),
            defineField({ name: 'panelText', title: 'Texto del panel', type: 'text', rows: 3 }),
            defineField({ name: 'badge', title: 'Badge', type: 'string' }),
            defineField({
              name: 'badgeVariant',
              title: 'Color',
              type: 'string',
              options: { list: badgeVariants },
            }),
          ],
          preview: {
            select: { title: 'title', index: 'index' },
            prepare: ({ title, index }) => ({ title: title || 'Paso', subtitle: index }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Flujo', subtitle: 'Flujo' }),
  },
});

const portalBento = defineType({
  name: 'portalBento',
  title: 'Características',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 3 }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
            defineField({ name: 'title', title: 'Título', type: 'string' }),
            defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 2 }),
            defineField({
              name: 'module',
              title: 'Módulo de la demo',
              type: 'string',
              options: { list: modules },
            }),
          ],
          preview: {
            select: { title: 'title', eyebrow: 'eyebrow' },
            prepare: ({ title, eyebrow }) => ({ title: title || 'Card', subtitle: eyebrow }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Características', subtitle: 'Bento' }),
  },
});

const portalFaq = defineType({
  name: 'portalFaq',
  title: 'Preguntas',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 2 }),
    defineField({ name: 'searchPlaceholder', title: 'Placeholder de búsqueda', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Preguntas',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Pregunta', type: 'string' }),
            defineField({ name: 'answer', title: 'Respuesta', type: 'text', rows: 4 }),
            defineField({ name: 'badge', title: 'Badge', type: 'string' }),
            defineField({ name: 'category', title: 'Categoría', type: 'string' }),
          ],
          preview: {
            select: { title: 'question', subtitle: 'badge' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Preguntas', subtitle: 'FAQ' }),
  },
});

const portalCloser = defineType({
  name: 'portalCloser',
  title: 'Cierre',
  type: 'object',
  fields: [
    defineField({ name: 'lead', title: 'Línea previa', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 3 }),
    defineField({ name: 'primaryLabel', title: 'Botón principal', type: 'string' }),
    defineField({ name: 'secondaryLabel', title: 'Botón secundario', type: 'string' }),
    defineField({
      name: 'trust',
      title: 'Notas de confianza',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Cierre', subtitle: 'Cierre' }),
  },
});

export const portalSectionMembers: ArrayOfObjectsMember[] = [
  defineArrayMember({ type: 'portalHero', ...dialog }),
  defineArrayMember({ type: 'portalStrip', ...dialog }),
  defineArrayMember({ type: 'portalJourney', ...dialog }),
  defineArrayMember({ type: 'portalBento', ...dialog }),
  defineArrayMember({ type: 'portalFaq', ...dialog }),
  defineArrayMember({ type: 'portalCloser', ...dialog }),
  defineArrayMember({ type: 'beforeAfter', ...dialog }),
];

export const portalSectionTypes = [
  portalHero,
  portalStrip,
  portalJourney,
  portalBento,
  portalFaq,
  portalCloser,
].map(withVisibility);

export const portalPage = defineType({
  name: 'portalPage',
  title: 'Portal de clientes',
  type: 'document',
  icon: DocumentIcon,
  groups: seoGroups,
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre interno',
      type: 'string',
      group: 'content',
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
    }),
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      group: 'content',
      of: portalSectionMembers,
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: 'title', locale: 'locale' },
    prepare: ({ title, locale }) => ({
      title: title || 'Portal de clientes',
      subtitle: locale === 'en' ? 'English' : 'Español',
    }),
  },
});
