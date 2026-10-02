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
      name: 'locale',
      title: 'Idioma',
      type: 'string',
      group: 'content',
      hidden: true,
      options: {
        list: [
          { title: 'Español', value: 'es' },
          { title: 'English', value: 'en' },
        ],
      },
      initialValue: 'es',
      validation: (rule) => rule.required(),
    }),
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
        rule.required().custom(async (value, context) => {
          const current = value?.current;
          if (!current) return 'El slug es obligatorio';
          if (isReservedSlug(current)) {
            return `“${current}” está reservado por una ruta del sitio`;
          }
          const document = context.document;
          if (!document) return true;
          const id = document._id.replace(/^drafts\./, '');
          const locale = (document as { locale?: string }).locale ?? 'es';
          const client = context.getClient({ apiVersion: '2024-01-01' });
          const count = await client.fetch(
            `count(*[_type == "landingPage" && slug.current == $slug && coalesce(locale, "es") == $locale && !(_id in [$id, $draftId])])`,
            { slug: current, locale, id, draftId: `drafts.${id}` },
          );
          return count === 0 || 'Ya hay una página con este slug en este idioma';
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
    select: { title: 'title', slug: 'slug.current', locale: 'locale' },
    prepare: ({ title, slug, locale }) => ({
      title: title || 'Página',
      subtitle: [locale === 'en' ? 'English' : 'Español', slug ? `/${slug}` : 'Sin slug'].join(' · '),
    }),
  },
});
