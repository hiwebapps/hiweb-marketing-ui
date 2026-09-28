import { defineField, defineType } from 'sanity';
import { aboutSectionMembers } from './aboutSections';
import { seoFields } from './shared';

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
    select: { locale: 'locale' },
    prepare({ locale }) {
      return { title: 'Nosotros', subtitle: locale === 'en' ? 'English' : 'Español' };
    },
  },
});
