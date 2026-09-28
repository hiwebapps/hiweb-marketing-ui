import { defineArrayMember, defineField, defineType } from 'sanity';
import { industrySectionMembers } from './industrySections';
import { seoFields, seoGroups } from './shared';

export const industry = defineType({
  name: 'industry',
  title: 'Industria',
  type: 'document',
  groups: [
    { name: 'datos', title: 'Datos', default: true },
    { name: 'content', title: 'Secciones' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      group: 'datos',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'datos',
      options: {
        source: 'nombre',
        maxLength: 96,
        isUnique: async (slug, context) => {
          const { document, getClient } = context;
          if (!document || !slug) return true;
          const id = document._id.replace(/^drafts\./, '');
          const locale = (document as { locale?: string }).locale ?? 'es';
          const client = getClient({ apiVersion: '2024-01-01' });
          const count = await client.fetch(
            `count(*[_type == "industry" && slug.current == $slug && coalesce(locale, "es") == $locale && !(_id in [$id, $draftId])])`,
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
      group: 'datos',
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
      group: 'datos',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      rows: 2,
      group: 'datos',
      description: 'Aparece en las cards del índice, en Home y en las páginas de servicio.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      group: 'content',
      description: 'Mini page builder: añade, reordena o quita componentes de la página.',
      of: industrySectionMembers,
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
    select: { title: 'nombre', locale: 'locale', media: 'sections.0.image' },
    prepare: ({ title, locale }) => ({
      title: title || 'Industria',
      subtitle: locale === 'en' ? 'English' : 'Español',
    }),
  },
});

export const industriesIndex = defineType({
  name: 'industriesIndex',
  title: 'Índice de industrias',
  type: 'document',
  groups: seoGroups,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'whyEyebrow', title: 'Badge de pilares', type: 'string' }),
    defineField({ name: 'whyTitle', title: 'Título de pilares', type: 'string' }),
    defineField({
      name: 'pillars',
      title: 'Pilares',
      type: 'array',
      of: [defineArrayMember({ type: 'titledBlock' })],
    }),
    defineField({ name: 'closingTitle', title: 'Título de cierre', type: 'string' }),
    defineField({ name: 'cardCtaLabel', title: 'Texto del botón en cada card', type: 'string' }),
    ...seoFields,
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Índice de industrias' }),
  },
});
