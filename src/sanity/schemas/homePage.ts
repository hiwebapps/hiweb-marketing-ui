import { defineField, defineType } from 'sanity';
import { homeSectionMembers } from './homeSections';
import { seoFields } from './shared';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home',
  type: 'document',
  groups: [
    { name: 'content', title: 'Secciones', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      group: 'content',
      description: 'Mini page builder: añade, reordena o quita componentes de la home.',
      of: homeSectionMembers,
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
    prepare: () => ({ title: 'Home' }),
  },
});
