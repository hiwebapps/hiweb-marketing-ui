import { defineArrayMember, defineField, defineType } from 'sanity';

export const table = defineType({
  name: 'table',
  title: 'Tabla',
  type: 'object',
  fields: [
    defineField({
      name: 'headerRows',
      title: 'Filas de encabezado',
      type: 'number',
      description: 'Usa 1 para tratar la primera fila como encabezado.',
      initialValue: 1,
    }),
    defineField({
      name: 'rows',
      title: 'Filas',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'row',
          type: 'object',
          fields: [
            defineField({
              name: 'cells',
              title: 'Celdas',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'cell',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'value',
                      title: 'Contenido',
                      type: 'array',
                      of: [defineArrayMember({ type: 'block' })],
                    }),
                  ],
                }),
              ],
            }),
          ],
          preview: {
            select: { cells: 'cells' },
            prepare({ cells }) {
              const labels = (cells ?? [])
                .map((cell: { value?: Array<{ children?: Array<{ text?: string }> }> }) =>
                  (cell?.value ?? [])
                    .flatMap((b) => b.children ?? [])
                    .map((c) => c.text ?? '')
                    .join(''),
                )
                .filter(Boolean);
              return { title: labels.join(' · ') || 'Fila' };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { rows: 'rows', headerRows: 'headerRows' },
    prepare({ rows, headerRows }) {
      const count = Array.isArray(rows) ? rows.length : 0;
      return {
        title: 'Tabla',
        subtitle: `${count} fila${count === 1 ? '' : 's'}${headerRows ? ' · con encabezado' : ''}`,
      };
    },
  },
});
