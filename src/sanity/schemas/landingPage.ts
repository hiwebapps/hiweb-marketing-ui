import { DocumentIcon } from '@sanity/icons/Document';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { landingTemplateSections } from '../landingTemplate';
import { isReservedSlug } from '../reservedSlugs';
import { sectionInsertMenu } from '../sectionInsertMenu';
import { seoFields, seoGroups } from './shared';

export const LANDING_SECTION_MEMBERS = [
  defineArrayMember({ type: 'pageHero' }),
  defineArrayMember({ type: 'pillarGrid' }),
  defineArrayMember({ type: 'serviceGrid' }),
  defineArrayMember({ type: 'industryGrid' }),
  defineArrayMember({ type: 'processPhases' }),
  defineArrayMember({ type: 'caseStories' }),
  defineArrayMember({ type: 'casePreview' }),
  defineArrayMember({ type: 'faqSection' }),
  defineArrayMember({ type: 'finalCta' }),
  defineArrayMember({ type: 'teamGrid' }),
  defineArrayMember({ type: 'metricsBand' }),
  defineArrayMember({ type: 'presenceMap' }),
];

export const landingPage = defineType({
  name: 'landingPage',
  title: 'Página',
  type: 'document',
  icon: DocumentIcon,
  groups: seoGroups,
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre interno',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((value) => {
          const current = value?.current;
          if (!current) return 'El slug es obligatorio';
          if (isReservedSlug(current)) {
            return `“${current}” está reservado por una ruta del sitio`;
          }
          return true;
        }),
    }),
    defineField({
      name: 'templateKind',
      title: 'Plantilla',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Servicio lite', value: 'serviceLite' },
          { title: 'Industria lite', value: 'industryLite' },
          { title: 'Campaña / CTA', value: 'campaign' },
        ],
        layout: 'radio',
      },
      initialValue: 'campaign',
    }),
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      group: 'content',
      description: 'Añade, reordena o quita bloques de la biblioteca.',
      of: LANDING_SECTION_MEMBERS,
      options: { insertMenu: sectionInsertMenu },
      initialValue: () => landingTemplateSections('campaign'),
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare: ({ title, slug }) => ({
      title: title || 'Página',
      subtitle: slug ? `/${slug}` : 'Sin slug',
    }),
  },
});
