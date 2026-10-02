import { BlockElementIcon } from '@sanity/icons/BlockElement';
import { CaseIcon } from '@sanity/icons/Case';
import { HelpCircleIcon } from '@sanity/icons/HelpCircle';
import { ImageIcon } from '@sanity/icons/Image';
import { RocketIcon } from '@sanity/icons/Rocket';
import { ThLargeIcon } from '@sanity/icons/ThLarge';
import { defineArrayMember, defineField, defineType, type ArrayOfObjectsMember } from 'sanity';
import { headingTitleField, headingWidthField, imageWithAlt, withVisibility } from './shared';

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

export const industryHero = defineType({
  name: 'industryHero',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    headingTitleField({ required: true }),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 4 }),
    imageWithAlt({ name: 'image', title: 'Imagen' }),
    defineField({
      name: 'ctaLabel',
      title: 'Texto del botón',
      type: 'string',
      initialValue: 'Ver casos de éxito',
    }),
    defineField({
      name: 'ctaHref',
      title: 'URL del botón',
      type: 'string',
      initialValue: '#casos',
    }),
  ],
  preview: sectionPreview('Sección Hero'),
});

export const industryWhy = defineType({
  name: 'industryWhy',
  title: 'Por qué Hiweb',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string', initialValue: 'Por qué Hiweb' }),
    headingTitleField(),
    headingWidthField(),
    defineField({
      name: 'pillars',
      title: 'Pilares',
      type: 'array',
      of: [defineArrayMember({ type: 'titledBlock' })],
    }),
    defineField({
      name: 'retos',
      title: 'Retos',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: sectionPreview('Sección Por qué'),
});

export const industryServices = defineType({
  name: 'industryServices',
  title: 'Servicios',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string', initialValue: 'Servicios' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
    defineField({
      name: 'catalogLabel',
      title: 'Texto del botón general',
      type: 'string',
      initialValue: 'Ver todos los servicios',
    }),
    defineField({
      name: 'catalogHref',
      title: 'URL del botón general',
      type: 'string',
      initialValue: '/servicios',
    }),
    defineField({ name: 'ctaLabel', title: 'Texto del enlace en cada servicio', type: 'string', initialValue: 'Ver más' }),
    defineField({ name: 'tagLabel', title: 'Etiqueta de cada servicio', type: 'string', initialValue: 'Servicio' }),
    defineField({
      name: 'blurbs',
      title: 'Copy industria × servicio',
      type: 'array',
      description: 'El texto de cada card. El orden de las cards sigue el catálogo de servicios.',
      of: [defineArrayMember({ type: 'serviceBlurb' })],
    }),
  ],
  preview: sectionPreview('Sección Servicios'),
});

export const industryCases = defineType({
  name: 'industryCases',
  title: 'Casos',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string', initialValue: 'Casos' }),
    headingTitleField(),
    headingWidthField(),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 2,
      description: 'Se muestra cuando hay casos de esta industria.',
    }),
    defineField({
      name: 'emptyText',
      title: 'Texto si no hay casos',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: sectionPreview('Sección Casos'),
});

export const industryFaq = defineType({
  name: 'industryFaq',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string', initialValue: 'FAQ' }),
    headingTitleField(),
    headingWidthField(),
    defineField({
      name: 'items',
      title: 'Preguntas',
      type: 'array',
      of: [defineArrayMember({ type: 'faqItem' })],
    }),
  ],
  preview: sectionPreview('Sección FAQ'),
});

export const industryCta = defineType({
  name: 'industryCta',
  title: 'Cierre',
  type: 'object',
  icon: RocketIcon,
  fields: [headingTitleField(), headingWidthField()],
  preview: sectionPreview('Sección Cierre'),
});

export const industrySectionMembers: ArrayOfObjectsMember[] = [
  defineArrayMember({ type: 'industryHero', ...dialog }),
  defineArrayMember({ type: 'industryWhy', ...dialog }),
  defineArrayMember({ type: 'industryServices', ...dialog }),
  defineArrayMember({ type: 'industryCases', ...dialog }),
  defineArrayMember({ type: 'industryFaq', ...dialog }),
  defineArrayMember({ type: 'industryCta', ...dialog }),
];

export const industrySectionTypes = [
  industryHero,
  industryWhy,
  industryServices,
  industryCases,
  industryFaq,
  industryCta,
].map(withVisibility);
