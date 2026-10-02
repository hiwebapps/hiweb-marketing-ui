import { CommentIcon } from '@sanity/icons/Comment';
import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'locale',
      title: 'Idioma',
      type: 'string',
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
      name: 'client',
      title: 'Cliente',
      type: 'string',
      description: 'La marca que aparece arriba de la cita.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Cita',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Cargo',
      type: 'string',
    }),
    defineField({
      name: 'stats',
      title: 'Cifras',
      type: 'array',
      description: 'Hasta dos cifras en la tarjeta del caso. Valor y texto, por ejemplo +184% y demos calificadas.',
      validation: (rule) => rule.max(2),
      of: [
        {
          type: 'object',
          name: 'testimonialStat',
          fields: [
            defineField({
              name: 'value',
              title: 'Valor',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Texto',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      description: 'Retrato que se muestra en la tarjeta del testimonio.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', client: 'client', locale: 'locale', media: 'photo' },
    prepare: ({ title, client, locale, media }) => ({
      title: title || 'Testimonio',
      subtitle: [locale === 'en' ? 'English' : 'Español', client].filter(Boolean).join(' · '),
      media,
    }),
  },
});
