import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageWithAlt, seoFields, seoGroups } from './shared';

export const author = defineType({
  name: 'author',
  title: 'Autor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
  ],
  preview: {
    select: { title: 'name' },
  },
});

export const post = defineType({
  name: 'post',
  title: 'Artículo',
  type: 'document',
  groups: seoGroups,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'keyword',
      title: 'Keyword',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'autor',
      title: 'Autor (texto)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      group: 'content',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha',
      type: 'date',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Destacado',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'categoriaServicio',
      title: 'Categoría servicio',
      type: 'reference',
      group: 'content',
      to: [{ type: 'service' }],
    }),
    defineField({
      name: 'categoriaIndustria',
      title: 'Categoría industria',
      type: 'reference',
      group: 'content',
      to: [{ type: 'industry' }],
    }),
    imageWithAlt({ name: 'cover', title: 'Portada', group: 'content' }),
    defineField({
      name: 'body',
      title: 'Cuerpo',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({ type: 'table' }),
        defineArrayMember({ type: 'blogTable' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Pie de foto',
              type: 'string',
            }),
          ],
        }),
      ],
      components: {
        portableText: {
          plugins: (props) =>
            props.renderDefault({
              ...props,
              plugins: {
                ...props.plugins,
                table: { enabled: true },
              },
            }),
        },
      },
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'faqItem' })],
    }),
    ...seoFields,
  ],
  orderings: [
    {
      title: 'Fecha',
      name: 'fechaDesc',
      by: [{ field: 'fecha', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'autor', media: 'cover' },
  },
});
