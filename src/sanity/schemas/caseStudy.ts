import { defineField, defineType } from 'sanity';
import { caseSectionMembers } from './caseSections';
import { seoFields } from './shared';

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Caso',
  type: 'document',
  groups: [
    { name: 'datos', title: 'Datos', default: true },
    { name: 'content', title: 'Secciones' },
    { name: 'seo', title: 'SEO' },
  ],
  fieldsets: [
    {
      name: 'cards',
      title: 'Datos de las cards',
      description: 'Aparecen en las cards del índice de Casos de éxito.',
      options: { collapsible: false },
    },
  ],
  fields: [
    defineField({
      name: 'cliente',
      title: 'Cliente',
      type: 'string',
      group: 'datos',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ubicacion',
      title: 'Ubicación',
      type: 'string',
      group: 'datos',
      description: 'Ciudad, Estado / País que se muestra en el tag superior (ej. Mérida, México; Cancún, México; Hickory, Estados Unidos)',
    }),
    defineField({
      name: 'sitioWeb',
      title: 'Sitio web del cliente',
      type: 'url',
      group: 'datos',
      description: 'URL oficial del sitio web o catálogo del cliente (ej. https://diazar.com)',
    }),
    defineField({
      name: 'redSocial',
      title: 'Red Social del Cliente',
      type: 'object',
      group: 'datos',
      fields: [
        defineField({
          name: 'plataforma',
          title: 'Plataforma',
          type: 'string',
          options: {
            list: [
              { title: 'Instagram', value: 'instagram' },
              { title: 'Facebook', value: 'facebook' },
              { title: 'LinkedIn', value: 'linkedin' },
              { title: 'TikTok', value: 'tiktok' },
              { title: 'X / Twitter', value: 'x' },
              { title: 'YouTube', value: 'youtube' },
            ],
          },
          initialValue: 'instagram',
        }),
        defineField({
          name: 'url',
          title: 'URL del perfil',
          type: 'url',
          description: 'Enlace al perfil de la red social (ej. https://www.instagram.com/diazarcontrol/)',
        }),
        defineField({
          name: 'handle',
          title: 'Usuario / Handle',
          type: 'string',
          description: 'Opcional (ej. @diazarcontrol)',
        }),
      ],
    }),
    defineField({
      name: 'socialBrand',
      title: 'Feed de Instagram (Celular)',
      type: 'reference',
      to: [{ type: 'socialBrand' }],
      group: 'datos',
      description: 'Vincula la marca de Instagram para alimentar el mockup del celular interactivo de este caso.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'datos',
      options: {
        source: 'cliente',
        maxLength: 96,
        isUnique: async (slug, context) => {
          const { document, getClient } = context;
          if (!document || !slug) return true;
          const id = document._id.replace(/^drafts\./, '');
          const locale = (document as { locale?: string }).locale ?? 'es';
          const client = getClient({ apiVersion: '2024-01-01' });
          const count = await client.fetch(
            `count(*[_type == "caseStudy" && slug.current == $slug && coalesce(locale, "es") == $locale && !(_id in [$id, $draftId])])`,
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
      name: 'industria',
      title: 'Industria',
      type: 'reference',
      group: 'datos',
      to: [{ type: 'industry' }],
    }),
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      group: 'datos',
      fieldset: 'cards',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'resumen',
      title: 'Resumen',
      type: 'text',
      rows: 3,
      group: 'datos',
      fieldset: 'cards',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'destacado',
      title: 'Destacado',
      type: 'boolean',
      group: 'datos',
      initialValue: false,
    }),
    defineField({
      name: 'accent',
      title: 'Acento',
      type: 'string',
      group: 'datos',
      options: {
        list: [
          { title: 'Cyan', value: 'cyan' },
          { title: 'Orange', value: 'orange' },
          { title: 'Purple', value: 'purple' },
        ],
        layout: 'radio',
      },
      initialValue: 'cyan',
    }),
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      group: 'content',
      description: 'Mini page builder: añade, reordena o quita componentes de la página del caso.',
      of: caseSectionMembers,
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
  preview: {
    select: { title: 'cliente', subtitle: 'titulo', locale: 'locale' },
    prepare: ({ title, subtitle, locale }) => ({
      title: title || 'Caso',
      subtitle: [locale === 'en' ? 'English' : 'Español', subtitle].filter(Boolean).join(' · '),
    }),
  },
});
