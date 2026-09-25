import { defineField, defineType } from 'sanity';
import { serviceSectionMembers } from './serviceSections';
import { seoFields } from './shared';

export const service = defineType({
  name: 'service',
  title: 'Servicio',
  type: 'document',
  groups: [
    { name: 'content', title: 'Secciones', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'nombre',
        maxLength: 96,
        isUnique: async (slug, context) => {
          const { document, getClient } = context;
          if (!document || !slug) return true;
          const id = document._id.replace(/^drafts\./, '');
          const locale = document.locale ?? 'es';
          const client = getClient({ apiVersion: '2024-01-01' });
          const count = await client.fetch(
            `count(*[_type == "service" && slug.current == $slug && coalesce(locale, "es") == $locale && !(_id in [$id, $draftId])])`,
            { slug, locale, id, draftId: `drafts.${id}` },
          );
          return count === 0;
        },
      },
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      group: 'content',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      rows: 2,
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      group: 'content',
      description: 'Mini page builder: añade, reordena o quita componentes de la página.',
      of: serviceSectionMembers,
      options: {
        insertMenu: { filter: true, views: [{ name: 'list' }] },
      },
      validation: (rule) =>
        rule.custom((sections) => {
          const types = (sections ?? []).map((section) => section._type);
          const duplicate = types.find((type, index) => types.indexOf(type) !== index);
          return duplicate ? 'Cada sección solo puede aparecer una vez.' : true;
        }),
    }),
    ...seoFields,
  ],
  orderings: [
    {
      title: 'Orden',
      name: 'ordenAsc',
      by: [{ field: 'orden', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'nombre', subtitle: 'tagline', media: 'sections.0.image' },
  },
});
