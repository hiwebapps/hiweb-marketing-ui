import { BlockElementIcon } from '@sanity/icons/BlockElement';
import { BoltIcon } from '@sanity/icons/Bolt';
import { CaseIcon } from '@sanity/icons/Case';
import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe';
import { ImageIcon } from '@sanity/icons/Image';
import { RocketIcon } from '@sanity/icons/Rocket';
import { ThLargeIcon } from '@sanity/icons/ThLarge';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { headingTitleField, headingWidthField, withVisibility } from '../shared';

const serviceLink = defineArrayMember({
  type: 'object',
  fields: [
    defineField({ name: 'slug', title: 'Slug', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'short', title: 'Descripción corta', type: 'text', rows: 2 }),
    defineField({ name: 'href', title: 'URL', type: 'string', validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: 'name', subtitle: 'short' } },
});

export const lpHero = defineType({
  name: 'lpHero',
  title: 'Hero de campaña',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    headingTitleField({ title: 'Título (H1)', required: true }),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'trust', title: 'Línea de confianza', type: 'string' }),
    defineField({
      name: 'avatars',
      title: 'Avatares',
      type: 'array',
      of: [defineArrayMember({ type: 'url' })],
    }),
    defineField({ name: 'primaryLabel', title: 'Botón principal', type: 'string' }),
    defineField({ name: 'secondaryLabel', title: 'Botón WhatsApp', type: 'string' }),
    defineField({ name: 'whatsappHref', title: 'URL de WhatsApp', type: 'url' }),
    defineField({ name: 'landingName', title: 'Nombre de la landing (en el lead)', type: 'string' }),
    defineField({
      name: 'interests',
      title: 'Servicios preseleccionados',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Hero', subtitle: 'Campaña' }) },
});

export const logoMarquee = defineType({
  name: 'logoMarquee',
  title: 'Logos de clientes',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({ name: 'label', title: 'Etiqueta', type: 'string' }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'src', title: 'Imagen (URL)', type: 'url', validation: (rule) => rule.required() }),
            defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
          ],
          preview: { select: { title: 'alt', subtitle: 'src' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'label' }, prepare: ({ title }) => ({ title: title || 'Logos', subtitle: 'Marquee' }) },
});

export const roiCalculator = defineType({
  name: 'roiCalculator',
  title: 'Calculadora de ROI',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'ctaLabel', title: 'Botón', type: 'string' }),
    defineField({ name: 'preset', title: 'Industria inicial (slug)', type: 'string' }),
    defineField({
      name: 'industries',
      title: 'Supuestos por industria',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'slug', title: 'Slug', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'cpl', title: 'Costo por lead', type: 'number' }),
            defineField({ name: 'close', title: 'Tasa de cierre (%)', type: 'number' }),
            defineField({ name: 'ticket', title: 'Venta promedio', type: 'number' }),
            defineField({ name: 'margin', title: 'Margen (%)', type: 'number' }),
          ],
          preview: { select: { title: 'name' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'ROI', subtitle: 'Calculadora' }) },
});

export const lpStatement = defineType({
  name: 'statement',
  title: 'Enfoque',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({
      name: 'paragraphs',
      title: 'Párrafos',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
    }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Enfoque', subtitle: 'Statement' }) },
});

export const serviceSystem = defineType({
  name: 'serviceSystem',
  title: 'Sistema de servicios',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({
      name: 'quadrants',
      title: 'Cuadrantes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
            defineField({ name: 'services', title: 'Servicios', type: 'array', of: [serviceLink] }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
    defineField({ name: 'coreLabel', title: 'Etiqueta central', type: 'string' }),
    defineField({ name: 'foot', title: 'Cierre', type: 'text', rows: 2 }),
    defineField({ name: 'ctaLabel', title: 'Botón', type: 'string' }),
    defineField({ name: 'combosTitle', title: 'Título de combinaciones', type: 'string' }),
    defineField({
      name: 'combos',
      title: 'Combinaciones',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
            defineField({ name: 'services', title: 'Slugs', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
            defineField({ name: 'ctaLabel', title: 'Botón', type: 'string' }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Servicios', subtitle: 'Sistema' }) },
});

export const lpServiceFocus = defineType({
  name: 'lpServiceFocus',
  title: 'Enfoque de servicio o industria',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({
      name: 'challenges',
      title: 'Retos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
    defineField({ name: 'stepsTitle', title: 'Título de los pasos', type: 'string' }),
    defineField({ name: 'steps', title: 'Pasos', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'relatedTitle', title: 'Título de relacionados', type: 'string' }),
    defineField({ name: 'relatedDescription', title: 'Descripción de relacionados', type: 'text', rows: 2 }),
    defineField({ name: 'related', title: 'Servicios relacionados', type: 'array', of: [serviceLink] }),
    defineField({ name: 'kpis', title: 'Qué medimos', type: 'text', rows: 2 }),
    defineField({ name: 'foot', title: 'Cierre', type: 'text', rows: 2 }),
    defineField({ name: 'bundleLabel', title: 'Botón de combinación', type: 'string' }),
    defineField({ name: 'bundle', title: 'Slugs de la combinación', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Enfoque', subtitle: 'Servicio / industria' }) },
});

export const ctaBand = defineType({
  name: 'ctaBand',
  title: 'Banda de CTA',
  type: 'object',
  icon: RocketIcon,
  fields: [
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
    defineField({ name: 'primaryLabel', title: 'Botón principal', type: 'string' }),
    defineField({ name: 'secondaryLabel', title: 'Botón WhatsApp', type: 'string' }),
    defineField({ name: 'whatsappHref', title: 'URL de WhatsApp', type: 'url' }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'CTA', subtitle: 'Banda' }) },
});

export const lpPortal = defineType({
  name: 'lpPortal',
  title: 'Portal de clientes',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'primaryLabel', title: 'Botón principal', type: 'string' }),
    defineField({ name: 'primaryHref', title: 'URL principal', type: 'string' }),
    defineField({ name: 'secondaryLabel', title: 'Botón secundario', type: 'string' }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Portal', subtitle: 'Cómo operamos' }) },
});

export const lpIndustryCards = defineType({
  name: 'lpIndustryCards',
  title: 'Industrias de la landing',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
    defineField({ name: 'hrefPrefix', title: 'Prefijo de URL', type: 'string', initialValue: '/lp/industrias' }),
    defineField({
      name: 'industries',
      title: 'Industrias',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'slug', title: 'Slug', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'nombre', title: 'Nombre', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'tagline', title: 'Párrafo', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'nombre', subtitle: 'tagline' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Industrias', subtitle: 'Cards' }) },
});

export const lpCaseCards = defineType({
  name: 'lpCaseCards',
  title: 'Casos de la landing',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
    defineField({
      name: 'cases',
      title: 'Casos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'client', title: 'Cliente', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'industry', title: 'Industria', type: 'string' }),
            defineField({ name: 'outcome', title: 'Resultado', type: 'string' }),
            defineField({ name: 'title', title: 'Título', type: 'string' }),
            defineField({ name: 'summary', title: 'Resumen', type: 'text', rows: 3 }),
            defineField({ name: 'href', title: 'URL', type: 'string' }),
            defineField({
              name: 'accent',
              title: 'Acento',
              type: 'string',
              options: { list: ['cyan', 'orange', 'purple'].map((value) => ({ title: value, value })) },
            }),
          ],
          preview: { select: { title: 'client', subtitle: 'outcome' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Casos', subtitle: 'Cards' }) },
});

export const lpSectionTypes = [
  lpHero,
  logoMarquee,
  roiCalculator,
  lpStatement,
  serviceSystem,
  lpServiceFocus,
  ctaBand,
  lpPortal,
  lpIndustryCards,
  lpCaseCards,
].map(withVisibility);
