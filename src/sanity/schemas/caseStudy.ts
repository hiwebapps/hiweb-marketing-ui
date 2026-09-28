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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'datos',
      options: { source: 'cliente', maxLength: 96 },
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
    select: { title: 'cliente', subtitle: 'titulo' },
  },
});
