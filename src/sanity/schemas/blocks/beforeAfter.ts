import { ImageIcon } from '@sanity/icons/Image';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { headingTitleField, headingWidthField, imageWithAlt } from '../shared';

const badgeVariants = [
  { title: 'Lima', value: 'lime' },
  { title: 'Cian', value: 'cyan' },
  { title: 'Morado', value: 'purple' },
  { title: 'Naranja', value: 'orange' },
  { title: 'Neutro', value: 'neutral' },
];

export const beforeAfter = defineType({
  name: 'beforeAfter',
  title: 'Antes y después',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    headingTitleField({ initialValue: 'Antes y después' }),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({
      name: 'badgeVariant',
      title: 'Color del badge',
      type: 'string',
      options: { list: badgeVariants, layout: 'radio' },
      initialValue: 'orange',
    }),
    defineField({
      name: 'pairs',
      title: 'Comparaciones',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título de la card', type: 'string' }),
            defineField({
              name: 'beforeLabel',
              title: 'Etiqueta antes',
              type: 'string',
              initialValue: 'Antes',
            }),
            defineField({
              name: 'afterLabel',
              title: 'Etiqueta después',
              type: 'string',
              initialValue: 'Después',
            }),
            imageWithAlt({ name: 'beforeImage', title: 'Foto antes' }),
            defineField({
              name: 'beforeVideo',
              title: 'Video antes',
              type: 'file',
              options: { accept: 'video/*' },
            }),
            imageWithAlt({ name: 'afterImage', title: 'Foto después' }),
            defineField({
              name: 'afterVideo',
              title: 'Video después',
              type: 'file',
              options: { accept: 'video/*' },
            }),
          ],
          preview: {
            select: { title: 'title', before: 'beforeLabel', after: 'afterLabel' },
            prepare: ({ title, before, after }) => ({
              title: title || 'Comparación',
              subtitle: [before, after].filter(Boolean).join(' / '),
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Antes y después', subtitle: 'Comparador' }),
  },
});
