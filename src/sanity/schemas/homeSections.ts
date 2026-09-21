import { defineField, defineType } from 'sanity';

export const homeServiceItem = defineType({
  name: 'homeServiceItem',
  title: 'Servicio en home',
  type: 'object',
  fields: [
    defineField({
      name: 'service',
      title: 'Servicio',
      type: 'reference',
      to: [{ type: 'service' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline en esta sección',
      type: 'text',
      rows: 2,
      description: 'Si lo dejas vacío, se usa el tagline del servicio.',
    }),
  ],
  preview: {
    select: { title: 'service.nombre', subtitle: 'tagline' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Servicio',
      subtitle: subtitle || 'Usa el tagline del servicio',
    }),
  },
});
