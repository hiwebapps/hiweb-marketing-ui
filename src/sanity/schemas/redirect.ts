import { defineField, defineType } from 'sanity';

function pathRule(value: unknown) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return 'Empieza con / y sin dominio';
  }
  return true;
}

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirección',
  type: 'document',
  fields: [
    defineField({
      name: 'from',
      title: 'Desde',
      type: 'string',
      description: 'Ruta vieja, por ejemplo /blog/slug-anterior. Se publica en el sitio en el próximo deploy.',
      validation: (rule) =>
        rule.required().custom(async (value, context) => {
          const format = pathRule(value);
          if (format !== true) return format;
          const id = context.document?._id?.replace(/^drafts\./, '') ?? '';
          const client = context.getClient({ apiVersion: '2024-01-01' });
          const count = await client.fetch<number>(
            `count(*[_type == "redirect" && from == $from && !(_id in [$id, "drafts." + $id])])`,
            { from: value, id },
          );
          return count === 0 ? true : 'Ya hay una redirección desde esa ruta';
        }),
    }),
    defineField({
      name: 'to',
      title: 'Hacia',
      type: 'string',
      description: 'Ruta nueva, por ejemplo /blog/slug-nuevo.',
      validation: (rule) => rule.required().custom((value) => pathRule(value)),
    }),
  ],
  preview: {
    select: { title: 'from', subtitle: 'to' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Redirección',
      subtitle: subtitle ? `→ ${subtitle}` : 'Sin destino',
    }),
  },
});
