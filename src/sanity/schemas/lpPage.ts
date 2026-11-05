import { DocumentIcon } from '@sanity/icons/Document';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { sectionInsertMenu } from '../sectionInsertMenu';
import { LANDING_SECTION_MEMBERS } from './landingPage';
import { seoFields, seoGroups } from './shared';

const LP_MEMBERS = [
  ...LANDING_SECTION_MEMBERS,
  defineArrayMember({ type: 'lpHero' }),
  defineArrayMember({ type: 'logoMarquee' }),
  defineArrayMember({ type: 'roiCalculator' }),
  defineArrayMember({ type: 'statement' }),
  defineArrayMember({ type: 'serviceSystem' }),
  defineArrayMember({ type: 'lpServiceFocus' }),
  defineArrayMember({ type: 'ctaBand' }),
  defineArrayMember({ type: 'lpPortal' }),
  defineArrayMember({ type: 'lpIndustryCards' }),
  defineArrayMember({ type: 'lpCaseCards' }),
];

export const lpPage = defineType({
  name: 'lpPage',
  title: 'Landing de campaña',
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
      name: 'path',
      title: 'Ruta',
      type: 'string',
      group: 'content',
      description: 'Empieza con /lp/. Por ejemplo /lp/servicios/seo.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value !== 'string' || !value.startsWith('/lp/')) return 'La ruta debe empezar con /lp/';
          return true;
        }),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'string',
      group: 'content',
      description: 'Último segmento de la ruta.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'template',
      title: 'Plantilla',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Servicios', value: 'servicios' },
          { title: 'Industrias', value: 'industrias' },
        ],
        layout: 'radio',
      },
      initialValue: 'general',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rol',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Hub', value: 'hub' },
          { title: 'Detalle', value: 'detail' },
        ],
        layout: 'radio',
      },
      initialValue: 'hub',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'nav',
      title: 'Barra',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'ctaLabel', title: 'Botón', type: 'string' }),
        defineField({ name: 'badge', title: 'Insignia', type: 'string' }),
        defineField({ name: 'whatsappHref', title: 'WhatsApp', type: 'url' }),
        defineField({ name: 'whatsappLabel', title: 'Texto de WhatsApp', type: 'string' }),
      ],
    }),
    defineField({
      name: 'picker',
      title: 'Selector',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtítulo', type: 'string' }),
        defineField({ name: 'allLabel', title: 'Ver todos', type: 'string' }),
        defineField({ name: 'allHref', title: 'URL de ver todos', type: 'string' }),
        defineField({ name: 'barPrefix', title: 'Prefijo de la barra', type: 'string' }),
        defineField({
          name: 'options',
          title: 'Opciones',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'slug', title: 'Slug', type: 'string' }),
                defineField({ name: 'title', title: 'Título', type: 'string' }),
                defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
                defineField({ name: 'href', title: 'URL', type: 'string' }),
              ],
              preview: { select: { title: 'title', subtitle: 'description' } },
            }),
          ],
        }),
      ],
    }),
    defineField({ name: 'watching', title: 'Estás viendo', type: 'string', group: 'content' }),
    defineField({
      name: 'interests',
      title: 'Servicios de interés',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      group: 'content',
      description: 'Añade, reordena, oculta o quita bloques.',
      of: LP_MEMBERS,
      options: { insertMenu: sectionInsertMenu },
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: 'title', path: 'path', template: 'template' },
    prepare: ({ title, path, template }) => ({
      title: title || 'Landing',
      subtitle: [template, path].filter(Boolean).join(' · '),
    }),
  },
});
