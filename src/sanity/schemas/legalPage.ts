import { DocumentIcon } from '@sanity/icons/Document';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { headingTitleField, headingWidthField, seoFields, seoGroups } from './shared';

const leafBlocks = [
  defineArrayMember({ type: 'legalParagraph' }),
  defineArrayMember({ type: 'legalBullets' }),
  defineArrayMember({ type: 'legalTerms' }),
  defineArrayMember({ type: 'legalLines' }),
];

export const legalParagraph = defineType({
  name: 'legalParagraph',
  title: 'Párrafo',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Texto',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'text' },
    prepare: ({ title }: { title?: string }) => ({ title: title || 'Párrafo' }),
  },
});

export const legalBullets = defineType({
  name: 'legalBullets',
  title: 'Lista',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Elementos',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }: { items?: string[] }) => ({
      title: 'Lista',
      subtitle: items?.length ? `${items.length} elementos` : 'Sin elementos',
    }),
  },
});

export const legalTerms = defineType({
  name: 'legalTerms',
  title: 'Definiciones',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Definiciones',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'legalTerm',
          fields: [
            defineField({
              name: 'term',
              title: 'Término',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Texto',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'term', subtitle: 'text' },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }: { items?: { term?: string }[] }) => ({
      title: 'Definiciones',
      subtitle: items?.map((item) => item.term).filter(Boolean).join(', '),
    }),
  },
});

export const legalLines = defineType({
  name: 'legalLines',
  title: 'Datos de contacto',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Datos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'legalLine',
          fields: [
            defineField({
              name: 'label',
              title: 'Etiqueta',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Valor',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }: { items?: { label?: string }[] }) => ({
      title: 'Datos de contacto',
      subtitle: items?.map((item) => item.label).filter(Boolean).join(', '),
    }),
  },
});

export const legalSubsection = defineType({
  name: 'legalSubsection',
  title: 'Subsección',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'blocks',
      title: 'Bloques',
      type: 'array',
      of: leafBlocks,
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }: { title?: string }) => ({ title: title || 'Subsección' }),
  },
});

export const legalSection = defineType({
  name: 'legalSection',
  title: 'Sección',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'blocks',
      title: 'Bloques',
      type: 'array',
      description: 'Párrafos, listas, definiciones, datos de contacto o subsecciones, en el orden en que se leen.',
      of: [...leafBlocks, defineArrayMember({ type: 'legalSubsection' })],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }: { title?: string }) => ({ title: title || 'Sección' }),
  },
});

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Página legal',
  type: 'document',
  icon: DocumentIcon,
  groups: seoGroups,
  fields: [
    defineField({
      name: 'locale',
      title: 'Idioma',
      type: 'string',
      group: 'content',
      hidden: true,
      options: {
        list: [
          { title: 'Español', value: 'es' },
          { title: 'English', value: 'en' },
        ],
      },
      initialValue: 'es',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Badge',
      type: 'string',
      group: 'content',
    }),
    headingTitleField({ required: true, group: 'content' }),
    headingWidthField({ group: 'content' }),
    defineField({
      name: 'updatedLabel',
      title: 'Etiqueta de actualización',
      type: 'string',
      group: 'content',
      description: 'Por ejemplo: Última actualización.',
    }),
    defineField({
      name: 'updatedOn',
      title: 'Fecha de actualización',
      type: 'string',
      group: 'content',
      description: 'El texto de la fecha, tal como se muestra. Por ejemplo: 1 de octubre de 2026.',
    }),
    defineField({
      name: 'intro',
      title: 'Introducción',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'legalSection' })],
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: 'title', locale: 'locale' },
    prepare: ({ title, locale }: { title?: string; locale?: string }) => ({
      title: title || 'Página legal',
      subtitle: locale === 'en' ? 'English' : 'Español',
    }),
  },
});

export const legalObjectTypes = [
  legalParagraph,
  legalBullets,
  legalTerms,
  legalLines,
  legalSubsection,
  legalSection,
];
