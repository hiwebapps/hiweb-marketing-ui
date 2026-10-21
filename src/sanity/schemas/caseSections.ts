import { BlockElementIcon } from '@sanity/icons/BlockElement';
import { CaseIcon } from '@sanity/icons/Case';
import { ImageIcon } from '@sanity/icons/Image';
import { RocketIcon } from '@sanity/icons/Rocket';
import { TrendUpwardIcon } from '@sanity/icons/TrendUpward';
import { UsersIcon } from '@sanity/icons/Users';
import { defineArrayMember, defineField, defineType, type ArrayOfObjectsMember } from 'sanity';
import { headingTitleField, headingWidthField, imageWithAlt, richParagraphsField, withVisibility } from './shared';

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
    imageWithAlt({
      name: 'imagen',
      title: 'Imagen principal',
      description:
        'Fondo de la hero. Sube una foto o elige una de la galería. Si la dejas vacía, se usa la imagen Open Graph.',
    }),
    defineField({
      name: 'anio',
      title: 'Año del proyecto',
      type: 'string',
      description: 'Aparece sobre el título cuando termina la animación. Ejemplo: 2024.',
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: 'ubicacion',
      title: 'Ubicación',
      type: 'string',
      description: 'Sobre el título principal (ej. Mérida, México). Si se omite, se usa la ubicación del caso.',
    }),
    defineField({
      name: 'imagenesProyecto',
      title: 'Imágenes del proyecto',
      type: 'array',
      description: 'Fotos que flotan en la animación. No son el fondo. Máximo 10.',
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
    select: { title: 'anio', media: 'imagen' },
    prepare: ({ title, media }) => ({ title: title || 'Hero', subtitle: 'Sección Hero', media }),
  },
});

export const caseContext = defineType({
  name: 'caseContext',
  title: 'Contexto',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ name: 'retoEyebrow', title: 'Eyebrow del reto', type: 'string', initialValue: 'Reto' }),
    headingTitleField({ name: 'retoTitle', title: 'Título del reto', initialValue: 'Contexto inicial' }),
    richParagraphsField({
      name: 'reto',
      title: 'Reto',
      description: 'Usa la barra de herramientas para negritas, cursivas, viñetas, listas numeradas y enlaces.',
    }),
    defineField({
      name: 'estrategiaEyebrow',
      title: 'Eyebrow de la estrategia',
      type: 'string',
      initialValue: 'Estrategia',
    }),
    headingTitleField({
      name: 'estrategiaTitle',
      title: 'Título de la estrategia',
      initialValue: 'Servicios aplicados',
    }),
    headingWidthField(),
    richParagraphsField({
      name: 'estrategia',
      title: 'Estrategia',
      description: 'Usa la barra de herramientas para negritas, cursivas, viñetas, listas numeradas y enlaces.',
    }),
    defineField({
      name: 'servicios',
      title: 'Servicios',
      type: 'array',
      description: 'Aparecen como etiquetas junto a la estrategia.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
    }),
    defineField({
      name: 'sitioWeb',
      title: 'Sitio web del cliente',
      type: 'url',
      description: 'Enlace al sitio web oficial del cliente. Si se omite, se usa el sitio web definido en el caso.',
    }),
    defineField({
      name: 'redSocial',
      title: 'Red Social del Cliente',
      type: 'object',
      description: 'Enlace a red social del cliente (ej. Instagram). Si se omite, se usa la del caso.',
      fields: [
        defineField({
          name: 'plataforma',
          title: 'Plataforma',
          type: 'string',
          options: {
            list: [
              { title: 'Instagram', value: 'instagram' },
              { title: 'Facebook', value: 'facebook' },
              { title: 'LinkedIn', value: 'linkedin' },
              { title: 'TikTok', value: 'tiktok' },
              { title: 'X / Twitter', value: 'x' },
              { title: 'YouTube', value: 'youtube' },
            ],
          },
          initialValue: 'instagram',
        }),
        defineField({
          name: 'url',
          title: 'URL del perfil',
          type: 'url',
        }),
        defineField({
          name: 'handle',
          title: 'Usuario / Handle',
          type: 'string',
        }),
      ],
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
    headingTitleField({ initialValue: 'Cómo se hizo el trabajo' }),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({
      name: 'fases',
      title: 'Fases',
      type: 'array',
      description: 'Abre cada fase para cambiar su icono.',
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
    headingTitleField({ initialValue: 'Antes y después' }),
    headingWidthField(),
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
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
    defineField({
      name: 'testimonial',
      title: 'Testimonio',
      type: 'reference',
      to: [{ type: 'testimonial' }],
      description: 'La cita, el nombre, el cargo y la foto salen de la biblioteca.',
    }),
  ],
  preview: {
    select: { title: 'testimonial.name', person: 'testimonial.client', media: 'testimonial.photo' },
    prepare: ({ title, person, media }) => ({
      title: title || 'Testimonio',
      subtitle: person || 'Sección Testimonio',
      media,
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
    headingTitleField({ initialValue: 'Más casos de esta industria' }),
    headingWidthField(),
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
    headingTitleField({ initialValue: 'Agenda un diagnóstico similar' }),
    headingWidthField(),
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
  defineArrayMember({ type: 'beforeAfter', ...dialog }),
  defineArrayMember({ type: 'instagramPhone', ...dialog }),
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
