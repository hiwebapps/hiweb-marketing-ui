import { defineField, defineType } from 'sanity';
import { aboutSectionMembers } from './aboutSections';
import { seoFields } from './shared';

const EN_ROUTES = [
  'servicios',
  'industrias',
  'blog',
  'blogs',
  'terminos',
  'aviso-de-privacidad',
  'calendario',
  'portal',
  '404',
];

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Nosotros',
  type: 'document',
  groups: [
    { name: 'datos', title: 'Datos', default: true },
    { name: 'content', title: 'Secciones' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'datos',
      description:
        'La página queda en /en/<slug>. Vacío usa /en/nosotros. Si cambias un slug ya publicado, usa Crear redirección antes de publicar para que la ruta anterior siga funcionando.',
      hidden: ({ document }) => document?.locale !== 'en',
      options: { maxLength: 96 },
      validation: (rule) =>
        rule.custom((value) => {
          const slug = value?.current;
          if (!slug) return true;
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            return 'Solo minúsculas, números y guiones. Sin espacios, acentos ni diagonales.';
          }
          if (EN_ROUTES.includes(slug)) return `/en/${slug} ya es otra página del sitio.`;
          return true;
        }),
    }),
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      group: 'content',
      description: 'Mini page builder: añade, reordena o quita componentes de la página.',
      of: aboutSectionMembers,
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
    select: { locale: 'locale', slug: 'slug.current' },
    prepare({ locale, slug }) {
      return { title: 'Nosotros', subtitle: locale === 'en' ? `English · /en/${slug || 'nosotros'}` : 'Español' };
    },
  },
});
