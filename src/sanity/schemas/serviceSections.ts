import { BlockElementIcon } from '@sanity/icons/BlockElement';
import { CaseIcon } from '@sanity/icons/Case';
import { HelpCircleIcon } from '@sanity/icons/HelpCircle';
import { ImageIcon } from '@sanity/icons/Image';
import { RocketIcon } from '@sanity/icons/Rocket';
import { ThLargeIcon } from '@sanity/icons/ThLarge';
import { TrendUpwardIcon } from '@sanity/icons/TrendUpward';
import { defineArrayMember, defineField, defineType, type ArrayOfObjectsMember } from 'sanity';
import { imageWithAlt } from './shared';

const dialog = { options: { modal: { type: 'dialog' as const, width: 'medium' as const } } };

const pillarIcons = [
  { title: 'Capas', value: 'layers' },
  { title: 'Objetivo', value: 'target' },
  { title: 'Globo', value: 'globe' },
  { title: 'Usuarios', value: 'users' },
  { title: 'Check', value: 'check' },
  { title: 'Flujo', value: 'workflow' },
];

const serviceIcons = [
  { title: 'Actividad', value: 'activity' },
  { title: 'Insignia', value: 'badge' },
  { title: 'Chispa', value: 'spark' },
  { title: 'Video', value: 'video' },
  { title: 'Usuarios', value: 'users' },
  { title: 'Objetivo', value: 'target' },
  { title: 'Caja', value: 'box' },
  { title: 'Foco', value: 'focus' },
  { title: 'Código', value: 'code' },
];

const industryIcons = [
  { title: 'Fábrica', value: 'factory' },
  { title: 'Salud', value: 'heart' },
  { title: 'Edificio', value: 'building' },
  { title: 'Avión', value: 'plane' },
  { title: 'Restaurante', value: 'utensils' },
  { title: 'App', value: 'app' },
];

const processIcons = [
  { title: 'Búsqueda', value: 'search' },
  { title: 'Chispa', value: 'spark' },
  { title: 'Play', value: 'play' },
  { title: 'Tendencia', value: 'trend' },
];

const accents = [
  { title: 'Morado', value: 'purple' },
  { title: 'Cian', value: 'cyan' },
  { title: 'Naranja', value: 'orange' },
  { title: 'Lima', value: 'lime' },
  { title: 'Verde', value: 'green' },
];

export const serviceFocusItem = defineType({
  name: 'serviceFocusItem',
  title: 'Frente',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'summary', title: 'Resumen', type: 'text', rows: 2 }),
    defineField({ name: 'detailTitle', title: 'Título del detalle', type: 'string' }),
    defineField({ name: 'detail', title: 'Detalle', type: 'text', rows: 4 }),
    defineField({ name: 'icon', title: 'Icono', type: 'string', options: { list: pillarIcons } }),
    defineField({ name: 'image', title: 'Imagen', type: 'string', description: 'Ruta, por ejemplo /images/services/seo.jpg' }),
    defineField({ name: 'imageAlt', title: 'Texto alternativo', type: 'string' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'summary' },
  },
});

export const serviceWhyCard = defineType({
  name: 'serviceWhyCard',
  title: 'Card',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 3 }),
    defineField({ name: 'icon', title: 'Icono', type: 'string', options: { list: serviceIcons } }),
    defineField({ name: 'accent', title: 'Color', type: 'string', options: { list: accents } }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'accent' },
  },
});

export const serviceIndustryItem = defineType({
  name: 'serviceIndustryItem',
  title: 'Industria',
  type: 'object',
  fields: [
    defineField({
      name: 'industry',
      title: 'Industria',
      type: 'reference',
      to: [{ type: 'industry' }],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'title', title: 'Nombre', type: 'string' }),
    defineField({ name: 'tagline', title: 'Párrafo', type: 'text', rows: 2 }),
    defineField({ name: 'icon', title: 'Icono', type: 'string', options: { list: industryIcons } }),
    defineField({
      name: 'puntos',
      title: 'Bullets',
      type: 'array',
      description: 'Quita un ítem para que no aparezca en la card. Si la lista queda vacía, la card no muestra bullets.',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: {
    select: { title: 'title', industry: 'industry.nombre' },
    prepare: ({ title, industry }: { title?: string; industry?: string }) => ({
      title: title || industry || 'Industria',
    }),
  },
});

export const serviceProcessStep = defineType({
  name: 'serviceProcessStep',
  title: 'Paso',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'icon', title: 'Icono', type: 'string', options: { list: processIcons } }),
    defineField({ name: 'accent', title: 'Color', type: 'string', options: { list: accents } }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'accent' },
  },
});

function titled(subtitle: string, titleField = 'title') {
  return {
    select: { title: titleField },
    prepare: ({ title }: { title?: string }) => ({
      title: title || subtitle,
      subtitle,
    }),
  };
}

export const serviceHero = defineType({
  name: 'serviceHero',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 4 }),
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    imageWithAlt({ name: 'image', title: 'Imagen' }),
    defineField({ name: 'ctaLabel', title: 'Texto del botón', type: 'string', initialValue: 'Cotiza tu proyecto' }),
    defineField({ name: 'ctaHref', title: 'URL del botón', type: 'string', initialValue: '/contacto' }),
  ],
  preview: titled('Sección Hero'),
});

export const serviceOverview = defineType({
  name: 'serviceOverview',
  title: 'Overview',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 3 }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [defineArrayMember({ type: 'titledBlock' })],
    }),
  ],
  preview: titled('Sección Overview'),
});

export const serviceFocus = defineType({
  name: 'serviceFocus',
  title: 'Frentes',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 3 }),
    defineField({
      name: 'items',
      title: 'Frentes',
      type: 'array',
      of: [defineArrayMember({ type: 'serviceFocusItem' })],
    }),
  ],
  preview: titled('Sección Frentes'),
});

export const servicePitch = defineType({
  name: 'servicePitch',
  title: 'Propuesta',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 3 }),
    defineField({ name: 'image', title: 'Imagen', type: 'string', description: 'Ruta, por ejemplo /images/services/seo.jpg' }),
    defineField({ name: 'imageAlt', title: 'Texto alternativo', type: 'string' }),
    defineField({ name: 'ctaLabel', title: 'Texto del botón', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'URL del botón', type: 'string' }),
  ],
  preview: titled('Sección Propuesta'),
});

export const serviceWhy = defineType({
  name: 'serviceWhy',
  title: 'Por qué Hiweb',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 3 }),
    defineField({ name: 'ctaLabel', title: 'Texto del botón', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'URL del botón', type: 'string' }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [defineArrayMember({ type: 'serviceWhyCard' })],
    }),
  ],
  preview: titled('Sección Por qué'),
});

export const servicePlansSection = defineType({
  name: 'servicePlans',
  title: 'Planes',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 3 }),
    defineField({ name: 'note', title: 'Nota al pie', type: 'text', rows: 2 }),
    defineField({ name: 'noteLabel', title: 'Texto del enlace', type: 'string' }),
    defineField({ name: 'noteHref', title: 'URL del enlace', type: 'string' }),
    defineField({ name: 'ctaLabel', title: 'Texto del botón', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'URL del botón', type: 'string' }),
    defineField({
      name: 'plans',
      title: 'Cards',
      type: 'array',
      description: 'De 1 a 3 cards.',
      of: [defineArrayMember({ type: 'servicePlan' })],
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: titled('Sección Planes'),
});

export const serviceIndustries = defineType({
  name: 'serviceIndustries',
  title: 'Industrias',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 2 }),
    defineField({
      name: 'items',
      title: 'Cards',
      type: 'array',
      description: 'Orden, copy e icono de cada industria en esta página.',
      of: [defineArrayMember({ type: 'serviceIndustryItem' })],
    }),
  ],
  preview: titled('Sección Industrias'),
});

export const serviceProcess = defineType({
  name: 'serviceProcess',
  title: 'Proceso',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 2 }),
    defineField({
      name: 'steps',
      title: 'Pasos',
      type: 'array',
      of: [defineArrayMember({ type: 'serviceProcessStep' })],
    }),
  ],
  preview: titled('Sección Proceso'),
});

export const serviceCases = defineType({
  name: 'serviceCases',
  title: 'Casos',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 2 }),
    defineField({
      name: 'items',
      title: 'Proyectos',
      type: 'array',
      description: 'Agrega, quita o arrastra los casos de esta página.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'caseStudy' }] })],
    }),
  ],
  preview: titled('Sección Casos'),
});

export const serviceFaq = defineType({
  name: 'serviceFaq',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({
      name: 'columns',
      title: 'Columnas',
      type: 'number',
      description: '1 o 2. En móvil siempre es una.',
      initialValue: 2,
      validation: (rule) => rule.min(1).max(2).integer(),
    }),
    defineField({
      name: 'items',
      title: 'Preguntas',
      type: 'array',
      of: [defineArrayMember({ type: 'faqItem' })],
    }),
  ],
  preview: {
    select: { title: 'title', question: 'items.0.question' },
    prepare: ({ title, question }: { title?: string; question?: string }) => ({
      title: title || question || 'Sección FAQ',
      subtitle: 'Sección FAQ',
    }),
  },
});

export const serviceCta = defineType({
  name: 'serviceCta',
  title: 'Cierre',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({ name: 'badge', title: 'Tagline', type: 'string', initialValue: 'Siguiente paso' }),
    defineField({ name: 'title', title: 'Heading', type: 'string' }),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 2 }),
  ],
  preview: titled('Sección Cierre'),
});

export const serviceSectionMembers: ArrayOfObjectsMember[] = [
  defineArrayMember({ type: 'serviceHero', ...dialog }),
  defineArrayMember({ type: 'serviceOverview', ...dialog }),
  defineArrayMember({ type: 'serviceFocus', ...dialog }),
  defineArrayMember({ type: 'servicePitch', ...dialog }),
  defineArrayMember({ type: 'serviceWhy', ...dialog }),
  defineArrayMember({ type: 'servicePlans', ...dialog }),
  defineArrayMember({ type: 'serviceIndustries', ...dialog }),
  defineArrayMember({ type: 'serviceProcess', ...dialog }),
  defineArrayMember({ type: 'serviceCases', ...dialog }),
  defineArrayMember({ type: 'serviceFaq', ...dialog }),
  defineArrayMember({ type: 'serviceCta', ...dialog }),
];

export const serviceSectionTypes = [
  serviceFocusItem,
  serviceWhyCard,
  serviceIndustryItem,
  serviceProcessStep,
  serviceHero,
  serviceOverview,
  serviceFocus,
  servicePitch,
  serviceWhy,
  servicePlansSection,
  serviceIndustries,
  serviceProcess,
  serviceCases,
  serviceFaq,
  serviceCta,
];
