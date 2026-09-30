import { CommentIcon } from '@sanity/icons/Comment';
import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  icon: CommentIcon,
  fields: [
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
    select: { title: 'name', subtitle: 'client', media: 'photo' },
  },
});
