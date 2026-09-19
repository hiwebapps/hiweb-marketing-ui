import { defineArrayMember, defineField, defineType } from 'sanity';

/** Legacy table shape from production posts. Hidden in Studio. */
export const blogTable = defineType({
  name: 'blogTable',
  title: 'Tabla (legado)',
  type: 'object',
  hidden: true,
  fields: [
    defineField({
      name: 'caption',
      title: 'Título / caption (opcional)',
      type: 'string',
    }),
    defineField({
      name: 'hasHeaderRow',
      title: 'Primera fila es encabezado',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'rows',
      title: 'Filas',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tableRow',
          fields: [
            defineField({
              name: 'cells',
              title: 'Celdas',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (rule) => rule.min(1),
            }),
          ],
          preview: {
            select: { cells: 'cells' },
            prepare({ cells }) {
              return { title: (cells ?? []).filter(Boolean).join(' · ') || 'Fila vacía' };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { caption: 'caption', rows: 'rows' },
    prepare({ caption, rows }) {
      const count = Array.isArray(rows) ? rows.length : 0;
      return {
        title: caption || 'Tabla',
        subtitle: `${count} fila${count === 1 ? '' : 's'}`,
      };
    },
  },
});
