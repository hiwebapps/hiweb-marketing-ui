import { DocumentIcon } from '@sanity/icons/Document';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { sectionInsertMenu } from '../sectionInsertMenu';
import { lpIconField } from './blocks/lpSections';
import { seoFields, seoGroups } from './shared';

const LP_MEMBERS = [
  'lpHero',
  'logoMarquee',
  'roiCalculator',
  'statement',
  'serviceSystem',
  'lpServiceFocus',
  'lpIndustryCards',
  'pillarGrid',
  'lpPortal',
  'metricsBand',
  'lpCaseCards',
  'processPhases',
  'teamGrid',
  'faqSection',
  'finalCta',
].map((type) => defineArrayMember({ type }));

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
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      group: 'content',
      description: 'Añade, reordena, oculta o quita bloques.',
      of: LP_MEMBERS,
      options: { insertMenu: sectionInsertMenu },
    }),
    defineField({
      name: 'nav',
      title: 'Barra inferior en móvil',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'calendarLabel', title: 'Botón de agendar', type: 'string', description: 'Abre el calendario.' }),
        defineField({ name: 'whatsappLabel', title: 'Botón de WhatsApp', type: 'string' }),
        defineField({ name: 'whatsappHref', title: 'URL de WhatsApp', type: 'url' }),
      ],
    }),
    defineField({
      name: 'calendar',
      title: 'Ventana del calendario',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
      ],
    }),
    defineField({
      name: 'picker',
      title: 'Selector de servicio o industria',
      type: 'object',
      group: 'content',
      description: 'Ventana para elegir una landing. Déjala vacía para no mostrarla.',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'autoOpen', title: 'Abrir al entrar a la página', type: 'boolean', initialValue: false }),
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtítulo', type: 'string' }),
        defineField({ name: 'allLabel', title: 'Enlace a ver todos', type: 'string' }),
        defineField({ name: 'allHref', title: 'URL de ver todos', type: 'string' }),
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
                lpIconField(),
                defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
                defineField({ name: 'href', title: 'URL', type: 'string' }),
              ],
              preview: { select: { title: 'title', subtitle: 'description' } },
            }),
          ],
        }),
      ],
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
