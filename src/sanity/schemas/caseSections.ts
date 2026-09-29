import { BlockElementIcon } from '@sanity/icons/BlockElement';
import { CaseIcon } from '@sanity/icons/Case';
import { ImageIcon } from '@sanity/icons/Image';
import { RocketIcon } from '@sanity/icons/Rocket';
import { TrendUpwardIcon } from '@sanity/icons/TrendUpward';
import { UsersIcon } from '@sanity/icons/Users';
import { defineArrayMember, defineField, defineType, type ArrayOfObjectsMember } from 'sanity';
import { withVisibility } from './shared';

const dialog = { options: { modal: { type: 'dialog' as const, width: 'medium' as const } } };

function sectionPreview(subtitle: string, titleField = 'title') {
  return {
    select: { title: titleField },
    prepare: ({ title }: { title?: string }) => ({
      title: title || subtitle,
      subtitle,
    }),
  };
}

export const caseHero = defineType({
  name: 'caseHero',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'anio',
      title: 'Año del proyecto',
      type: 'string',
      description: 'Aparece sobre el título cuando termina la animación. Ejemplo: 2024.',
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: 'imagenesProyecto',
      title: 'Imágenes del proyecto',
      type: 'array',
      description: 'Fotos de la animación del hero. Máximo 10.',
      validation: (rule) => rule.max(10),
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'anio' },
    prepare: ({ title }) => ({ title: title || 'Hero', subtitle: 'Sección Hero' }),
  },
});

export const caseContext = defineType({
  name: 'caseContext',
  title: 'Contexto',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ name: 'retoEyebrow', title: 'Eyebrow del reto', type: 'string', initialValue: 'Reto' }),
    defineField({ name: 'retoTitle', title: 'Título del reto', type: 'string', initialValue: 'Contexto inicial' }),
    defineField({ name: 'reto', title: 'Reto', type: 'text', rows: 5 }),
    defineField({
      name: 'estrategiaEyebrow',
      title: 'Eyebrow de la estrategia',
      type: 'string',
      initialValue: 'Estrategia',
    }),
    defineField({
      name: 'estrategiaTitle',
      title: 'Título de la estrategia',
      type: 'string',
      initialValue: 'Servicios aplicados',
    }),
    defineField({ name: 'estrategia', title: 'Estrategia', type: 'text', rows: 5 }),
    defineField({
      name: 'servicios',
      title: 'Servicios',
      type: 'array',
      description: 'Aparecen como etiquetas junto a la estrategia.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
    }),
  ],
  preview: sectionPreview('Sección Contexto', 'retoTitle'),
});

export const caseProcess = defineType({
  name: 'caseProcess',
  title: 'Ejecución',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'Ejecución' }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      initialValue: 'Cómo se hizo el trabajo',
    }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({
      name: 'fases',
      title: 'Fases',
      type: 'array',
      of: [defineArrayMember({ type: 'titledBlock' })],
    }),
  ],
  preview: sectionPreview('Sección Ejecución'),
});

export const caseMetrics = defineType({
  name: 'caseMetrics',
  title: 'Cifras',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'Cifras' }),
    defineField({ name: 'title', title: 'Título', type: 'string', initialValue: 'Antes y después' }),
    defineField({
      name: 'titleMuted',
      title: 'Segunda línea del título',
      type: 'string',
      initialValue: 'en cifras verificables',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      initialValue: 'Baseline incluido cuando aplica. Números de negocio, no recortes de Ads Manager.',
    }),
    defineField({
      name: 'items',
      title: 'Métricas',
      type: 'array',
      of: [defineArrayMember({ type: 'metric' })],
    }),
    defineField({ name: 'primaryCta', title: 'CTA principal', type: 'cta' }),
    defineField({ name: 'secondaryCta', title: 'CTA secundario', type: 'cta' }),
  ],
  preview: sectionPreview('Sección Cifras'),
});

export const caseTestimonial = defineType({
  name: 'caseTestimonial',
  title: 'Testimonio',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'Testimonio' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
    defineField({ name: 'quote', title: 'Cita', type: 'text', rows: 4 }),
    defineField({ name: 'name', title: 'Nombre', type: 'string' }),
    defineField({ name: 'role', title: 'Cargo', type: 'string' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'quote' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Testimonio',
      subtitle: subtitle || 'Sección Testimonio',
    }),
  },
});

export const caseRelated = defineType({
  name: 'caseRelated',
  title: 'Más casos',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'Casos' }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      initialValue: 'Más casos de esta industria',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 2,
      initialValue: 'Cliente, industria y el trabajo realizado.',
    }),
  ],
  preview: sectionPreview('Sección Más casos'),
});

export const caseCta = defineType({
  name: 'caseCta',
  title: 'Cierre',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string', initialValue: 'Siguiente paso' }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      initialValue: 'Agenda un diagnóstico similar',
    }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'primaryCta', title: 'CTA', type: 'cta' }),
  ],
  preview: sectionPreview('Sección Cierre'),
});

export const caseSectionMembers: ArrayOfObjectsMember[] = [
  defineArrayMember({ type: 'caseHero', ...dialog }),
  defineArrayMember({ type: 'caseContext', ...dialog }),
  defineArrayMember({ type: 'caseProcess', ...dialog }),
  defineArrayMember({ type: 'caseMetrics', ...dialog }),
  defineArrayMember({ type: 'caseTestimonial', ...dialog }),
  defineArrayMember({ type: 'caseRelated', ...dialog }),
  defineArrayMember({ type: 'caseCta', ...dialog }),
];

export const caseSectionTypes = [
  caseHero,
  caseContext,
  caseProcess,
  caseMetrics,
  caseTestimonial,
  caseRelated,
  caseCta,
].map(withVisibility);
