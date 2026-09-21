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
import { defineArrayMember, defineField, defineType, type ArrayOfObjectsMember } from 'sanity';

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

export const homeServiceItem = defineType({
  name: 'homeServiceItem',
  title: 'Servicio en home',
  type: 'object',
  fields: [
    defineField({
      name: 'service',
      title: 'Servicio',
      type: 'reference',
      to: [{ type: 'service' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline en esta sección',
      type: 'text',
      rows: 2,
      description: 'Si lo dejas vacío, se usa el tagline del servicio.',
    }),
  ],
  preview: {
    select: { title: 'service.nombre', subtitle: 'tagline' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Servicio',
      subtitle: subtitle || 'Usa el tagline del servicio',
    }),
  },
});

export const homeHero = defineType({
  name: 'homeHero',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'lead', title: 'Lead', type: 'text', rows: 3 }),
    defineField({ name: 'primaryCta', title: 'CTA principal', type: 'cta' }),
    defineField({ name: 'secondaryCta', title: 'CTA secundario', type: 'cta' }),
    defineField({
      name: 'cases',
      title: 'Proyectos del carrusel',
      type: 'array',
      description: 'Elige cuáles casos aparecen y arrástralos para cambiar el orden. Vacío = todos los casos con cover.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'caseStudy' }] })],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: sectionPreview('Sección Hero'),
});

export const homePillars = defineType({
  name: 'homePillars',
  title: 'Pilares',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({ name: 'intro', title: 'Intro', type: 'sectionIntro' }),
    defineField({
      name: 'items',
      title: 'Cards',
      type: 'array',
      of: [defineArrayMember({ type: 'titledBlock' })],
    }),
  ],
  preview: {
    select: { title: 'intro.title' },
    prepare: ({ title }) => ({ title: title || 'Pilares', subtitle: 'Sección Pilares' }),
  },
});

export const homeServices = defineType({
  name: 'homeServices',
  title: 'Servicios',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({ name: 'intro', title: 'Intro', type: 'sectionIntro' }),
    defineField({
      name: 'items',
      title: 'Servicios',
      type: 'array',
      description: 'Elige cuáles aparecen, edita el tagline y arrástralos para el orden. Vacío = todos los servicios.',
      of: [defineArrayMember({ type: 'homeServiceItem' })],
    }),
  ],
  preview: {
    select: { title: 'intro.title' },
    prepare: ({ title }) => ({ title: title || 'Servicios', subtitle: 'Sección Servicios' }),
  },
});

export const homeIndustries = defineType({
  name: 'homeIndustries',
  title: 'Industrias',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({ name: 'intro', title: 'Intro', type: 'sectionIntro' }),
    defineField({
      name: 'items',
      title: 'Industrias',
      type: 'array',
      description: 'Elige cuáles aparecen y arrástralos para el orden. Vacío = todas.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'industry' }] })],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: { title: 'intro.title' },
    prepare: ({ title }) => ({ title: title || 'Industrias', subtitle: 'Sección Industrias' }),
  },
});

export const homeStories = defineType({
  name: 'homeStories',
  title: 'Testimonios',
  type: 'object',
  icon: HomeIcon,
  fields: [
    defineField({ name: 'intro', title: 'Intro', type: 'sectionIntro' }),
    defineField({
      name: 'items',
      title: 'Testimonios',
      type: 'array',
      of: [defineArrayMember({ type: 'homeTestimonial' })],
    }),
  ],
  preview: {
    select: { title: 'intro.title' },
    prepare: ({ title }) => ({ title: title || 'Testimonios', subtitle: 'Sección Testimonios' }),
  },
});

export const homeProcess = defineType({
  name: 'homeProcess',
  title: 'Proceso',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ name: 'intro', title: 'Intro', type: 'sectionIntro' }),
    defineField({
      name: 'items',
      title: 'Fases',
      type: 'array',
      of: [defineArrayMember({ type: 'processStep' })],
    }),
  ],
  preview: {
    select: { title: 'intro.title' },
    prepare: ({ title }) => ({ title: title || 'Proceso', subtitle: 'Sección Proceso' }),
  },
});

export const homeMetrics = defineType({
  name: 'homeMetrics',
  title: 'Métricas',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    defineField({ name: 'intro', title: 'Intro', type: 'sectionIntro' }),
    defineField({
      name: 'items',
      title: 'Métricas',
      type: 'array',
      of: [defineArrayMember({ type: 'metric' })],
    }),
  ],
  preview: {
    select: { title: 'intro.title' },
    prepare: ({ title }) => ({ title: title || 'Métricas', subtitle: 'Sección Métricas' }),
  },
});

export const homeTeam = defineType({
  name: 'homeTeam',
  title: 'Equipo',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'ctaLabel', title: 'Texto del enlace', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'URL del enlace', type: 'string' }),
  ],
  preview: sectionPreview('Sección Equipo'),
});

export const homeFaq = defineType({
  name: 'homeFaq',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: 'intro', title: 'Intro', type: 'sectionIntro' }),
    defineField({
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [defineArrayMember({ type: 'faqCategory' })],
    }),
  ],
  preview: {
    select: { title: 'intro.title' },
    prepare: ({ title }) => ({ title: title || 'FAQ', subtitle: 'Sección FAQ' }),
  },
});

export const homeCta = defineType({
  name: 'homeCta',
  title: 'Cierre',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'primaryCta', title: 'CTA', type: 'cta' }),
  ],
  preview: sectionPreview('Sección Cierre'),
});

export const homeSectionMembers: ArrayOfObjectsMember[] = [
  defineArrayMember({ type: 'homeHero', ...dialog }),
  defineArrayMember({ type: 'homePillars', ...dialog }),
  defineArrayMember({ type: 'homeServices', ...dialog }),
  defineArrayMember({ type: 'homeIndustries', ...dialog }),
  defineArrayMember({ type: 'homeStories', ...dialog }),
  defineArrayMember({ type: 'homeProcess', ...dialog }),
  defineArrayMember({ type: 'homeMetrics', ...dialog }),
  defineArrayMember({ type: 'homeTeam', ...dialog }),
  defineArrayMember({ type: 'homeFaq', ...dialog }),
  defineArrayMember({ type: 'homeCta', ...dialog }),
];

export const homeSectionTypes = [
  homeHero,
  homePillars,
  homeServices,
  homeIndustries,
  homeStories,
  homeProcess,
  homeMetrics,
  homeTeam,
  homeFaq,
  homeCta,
];
