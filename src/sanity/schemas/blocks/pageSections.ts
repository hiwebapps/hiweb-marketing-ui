import { BlockElementIcon } from '@sanity/icons/BlockElement';
import { CaseIcon } from '@sanity/icons/Case';
import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe';
import { HelpCircleIcon } from '@sanity/icons/HelpCircle';
import { HomeIcon } from '@sanity/icons/Home';
import { ImageIcon } from '@sanity/icons/Image';
import { RocketIcon } from '@sanity/icons/Rocket';
import { ThLargeIcon } from '@sanity/icons/ThLarge';
import { TrendUpwardIcon } from '@sanity/icons/TrendUpward';
import { UsersIcon } from '@sanity/icons/Users';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { imageWithAlt } from '../shared';

const TONE_OPTIONS = [
  { title: 'Canvas', value: 'canvas' },
  { title: 'Surface', value: 'surface' },
];

function toneField() {
  return defineField({
    name: 'tone',
    title: 'Fondo',
    type: 'string',
    options: { list: TONE_OPTIONS, layout: 'radio' },
    initialValue: 'canvas',
  });
}

function headerFields() {
  return [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
  ];
}

function sourceField(title: string) {
  return defineField({
    name: 'source',
    title: title,
    type: 'string',
    options: {
      list: [
        { title: 'Todos los publicados', value: 'all' },
        { title: 'Selección', value: 'refs' },
      ],
      layout: 'radio',
    },
    initialValue: 'all',
  });
}

export const pageHero = defineType({
  name: 'pageHero',
  title: 'Hero de página',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'variant',
      title: 'Variante',
      type: 'string',
      options: {
        list: [
          { title: 'Claro (sin foto)', value: 'plain' },
          { title: 'Foto de fondo', value: 'photo' },
        ],
        layout: 'radio',
      },
      initialValue: 'plain',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'title',
      title: 'Título (H1)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 4 }),
    imageWithAlt({ name: 'image', title: 'Imagen de fondo' }),
    defineField({
      name: 'imagePosition',
      title: 'Posición de la imagen',
      type: 'string',
      description: 'CSS object-position, p. ej. center 42%',
      hidden: ({ parent }) => parent?.variant !== 'photo',
    }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Texto', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'variant',
              title: 'Color',
              type: 'string',
              options: {
                list: [
                  { title: 'Lime', value: 'lime' },
                  { title: 'Cyan', value: 'cyan' },
                  { title: 'Orange', value: 'orange' },
                  { title: 'Purple', value: 'purple' },
                  { title: 'Neutral', value: 'neutral' },
                ],
              },
              initialValue: 'lime',
            }),
          ],
          preview: { select: { title: 'label' } },
        }),
      ],
    }),
    defineField({ name: 'cta', title: 'CTA', type: 'cta' }),
    defineField({
      name: 'atmosphere',
      title: 'Atmósfera (hero claro)',
      type: 'string',
      options: {
        list: [
          { title: 'Spotlight', value: 'spotlight' },
          { title: 'Mesh', value: 'mesh' },
          { title: 'Wash', value: 'wash' },
          { title: 'Ninguna', value: 'none' },
        ],
      },
      initialValue: 'spotlight',
      hidden: ({ parent }) => parent?.variant === 'photo',
    }),
    toneField(),
  ],
  preview: {
    select: { title: 'title', subtitle: 'variant' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Hero de página',
      subtitle: subtitle === 'photo' ? 'Foto de fondo' : 'Claro',
    }),
  },
});

export const pillarGrid = defineType({
  name: 'pillarGrid',
  title: 'Grid de pilares',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    ...headerFields(),
    toneField(),
    defineField({
      name: 'pillars',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3, validation: (rule) => rule.required() }),
            defineField({
              name: 'icon',
              title: 'Icono',
              type: 'string',
              options: {
                list: [
                  { title: 'Users', value: 'users' },
                  { title: 'Globe', value: 'globe' },
                  { title: 'Target', value: 'target' },
                  { title: 'Check', value: 'check' },
                  { title: 'Layers', value: 'layers' },
                  { title: 'Workflow', value: 'workflow' },
                ],
              },
            }),
            defineField({
              name: 'accent',
              title: 'Acento',
              type: 'string',
              options: {
                list: [
                  { title: 'Purple', value: 'purple' },
                  { title: 'Cyan', value: 'cyan' },
                  { title: 'Orange', value: 'orange' },
                  { title: 'Green', value: 'green' },
                ],
              },
            }),
            defineField({ name: 'href', title: 'URL (opcional)', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        }),
      ],
      validation: (rule) => rule.min(2).max(4),
    }),
    defineField({ name: 'ctaLabel', title: 'Texto del link en card', type: 'string', initialValue: 'Ver más' }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Grid de pilares', subtitle: 'Pilares' }),
  },
});

export const serviceGrid = defineType({
  name: 'serviceGrid',
  title: 'Grid de servicios',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'variant',
      title: 'Variante',
      type: 'string',
      options: {
        list: [
          { title: 'Catálogo', value: 'catalog' },
          { title: 'Leído por industria', value: 'industry' },
        ],
        layout: 'radio',
      },
      initialValue: 'catalog',
    }),
    sourceField('Servicios a mostrar'),
    defineField({
      name: 'services',
      title: 'Servicios',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
      hidden: ({ parent }) => parent?.source !== 'refs',
    }),
    defineField({
      name: 'industryName',
      title: 'Nombre de industria (variante industria)',
      type: 'string',
      hidden: ({ parent }) => parent?.variant !== 'industry',
    }),
    ...headerFields(),
    toneField(),
  ],
  preview: {
    select: { title: 'title', subtitle: 'variant' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Grid de servicios',
      subtitle: subtitle === 'industry' ? 'Por industria' : 'Catálogo',
    }),
  },
});

export const industryGrid = defineType({
  name: 'industryGrid',
  title: 'Grid de industrias',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    sourceField('Industrias a mostrar'),
    defineField({
      name: 'industries',
      title: 'Industrias',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'industry' }] })],
      hidden: ({ parent }) => parent?.source !== 'refs',
    }),
    ...headerFields(),
    toneField(),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Grid de industrias', subtitle: 'Industrias' }),
  },
});

export const processPhases = defineType({
  name: 'processPhases',
  title: 'Fases de proceso',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    ...headerFields(),
    toneField(),
    defineField({
      name: 'phases',
      title: 'Pasos',
      type: 'array',
      of: [defineArrayMember({ type: 'processStep' })],
      validation: (rule) => rule.min(2).max(6),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Fases de proceso', subtitle: 'Proceso' }),
  },
});

export const caseStories = defineType({
  name: 'caseStories',
  title: 'Historias de casos',
  type: 'object',
  icon: CaseIcon,
  fields: [
    sourceField('Casos a mostrar'),
    defineField({
      name: 'cases',
      title: 'Casos',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'caseStudy' }] })],
      hidden: ({ parent }) => parent?.source !== 'refs',
    }),
    ...headerFields(),
    toneField(),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Historias de casos', subtitle: 'Slider' }),
  },
});

export const casePreview = defineType({
  name: 'casePreview',
  title: 'Preview de casos',
  type: 'object',
  icon: CaseIcon,
  fields: [
    sourceField('Casos a mostrar'),
    defineField({
      name: 'cases',
      title: 'Casos',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'caseStudy' }] })],
      hidden: ({ parent }) => parent?.source !== 'refs',
    }),
    ...headerFields(),
    toneField(),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Preview de casos', subtitle: 'Cards compactas' }),
  },
});

export const landingFaqSection = defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    ...headerFields(),
    toneField(),
    defineField({
      name: 'items',
      title: 'Preguntas de esta página',
      type: 'array',
      of: [defineArrayMember({ type: 'faqItem' })],
    }),
    defineField({
      name: 'faqRefs',
      title: 'FAQs de la biblioteca',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'FAQ', subtitle: 'Preguntas' }),
  },
});

export const finalCta = defineType({
  name: 'finalCta',
  title: 'CTA final',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'primaryCta', title: 'CTA principal', type: 'cta' }),
    defineField({ name: 'secondaryCta', title: 'CTA secundario', type: 'cta' }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'CTA final', subtitle: 'Cierre' }),
  },
});

export const teamGrid = defineType({
  name: 'teamGrid',
  title: 'Equipo',
  type: 'object',
  icon: UsersIcon,
  fields: [
    sourceField('Personas a mostrar'),
    defineField({
      name: 'people',
      title: 'Personas',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'person' }] })],
      hidden: ({ parent }) => parent?.source !== 'refs',
    }),
    ...headerFields(),
    defineField({ name: 'limit', title: 'Límite visible', type: 'number' }),
    defineField({
      name: 'showFilters',
      title: 'Mostrar filtros de categoría',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'cta', title: 'CTA', type: 'cta' }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Equipo', subtitle: 'Team grid' }),
  },
});

export const metricsBand = defineType({
  name: 'metricsBand',
  title: 'Banda de métricas',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    ...headerFields(),
    defineField({ name: 'titleMuted', title: 'Título muted', type: 'string' }),
    defineField({
      name: 'metrics',
      title: 'Métricas',
      type: 'array',
      of: [defineArrayMember({ type: 'metric' })],
      validation: (rule) => rule.min(1).max(6),
    }),
    defineField({ name: 'primaryCta', title: 'CTA principal', type: 'cta' }),
    defineField({ name: 'secondaryCta', title: 'CTA secundario', type: 'cta' }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Banda de métricas', subtitle: 'Cifras' }),
  },
});

export const presenceMap = defineType({
  name: 'presenceMap',
  title: 'Mapa de presencia',
  type: 'object',
  icon: HomeIcon,
  fields: [
    ...headerFields(),
    defineField({ name: 'cta', title: 'CTA', type: 'cta' }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Mapa de presencia', subtitle: 'Sedes' }),
  },
});

export const landingSectionTypes = [
  pageHero,
  pillarGrid,
  serviceGrid,
  industryGrid,
  processPhases,
  caseStories,
  casePreview,
  landingFaqSection,
  finalCta,
  teamGrid,
  metricsBand,
  presenceMap,
];
