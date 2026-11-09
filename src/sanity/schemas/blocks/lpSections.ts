import { BlockElementIcon } from '@sanity/icons/BlockElement';
import { BoltIcon } from '@sanity/icons/Bolt';
import { CaseIcon } from '@sanity/icons/Case';
import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe';
import { ImageIcon } from '@sanity/icons/Image';
import { RocketIcon } from '@sanity/icons/Rocket';
import { ThLargeIcon } from '@sanity/icons/ThLarge';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { LP_INDUSTRIES, LP_SERVICES } from '../../../data/lp/catalog';
import { NavIconInput } from '../../components/NavIconInput';
import { navIcons } from '../navigation';
import { headingTitleField, headingWidthField, withVisibility } from '../shared';

export const LP_SERVICE_OPTIONS = LP_SERVICES.map((item) => ({ title: item.name, value: item.slug }));
export const LP_INDUSTRY_OPTIONS = LP_INDUSTRIES.map((item) => ({ title: item.name, value: item.slug }));

export function lpIconField(options?: { name?: string; title?: string; emptyHint?: string; description?: string }) {
  return defineField({
    name: options?.name ?? 'icon',
    title: options?.title ?? 'Icono',
    type: 'string',
    ...(options?.description ? { description: options.description } : {}),
    options: { list: navIcons, emptyHint: options?.emptyHint ?? 'Vacío: se usa un icono genérico.' } as never,
    components: { input: NavIconInput },
  });
}

export function lpServiceSlugsField(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    type: 'array',
    ...(description ? { description } : {}),
    of: [defineArrayMember({ type: 'string', options: { list: LP_SERVICE_OPTIONS } })],
  });
}

function lpImageMember(title: string) {
  return defineArrayMember({
    type: 'image',
    title,
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Texto alternativo',
        type: 'string',
        validation: (rule) => rule.required().warning('El alt es obligatorio en imágenes'),
      }),
    ],
  });
}

function stringList(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    type: 'array',
    ...(description ? { description } : {}),
    of: [defineArrayMember({ type: 'string' })],
  });
}

const serviceLink = defineArrayMember({
  type: 'object',
  title: 'Servicio',
  fields: [
    defineField({
      name: 'slug',
      title: 'Servicio',
      type: 'string',
      options: { list: LP_SERVICE_OPTIONS },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'short', title: 'Descripción corta', type: 'text', rows: 2 }),
    defineField({ name: 'href', title: 'URL', type: 'string', validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: 'name', subtitle: 'short' } },
});

const serviceCard = defineArrayMember({
  type: 'object',
  title: 'Card de servicio',
  fields: [
    defineField({
      name: 'slug',
      title: 'Servicio',
      type: 'string',
      options: { list: LP_SERVICE_OPTIONS },
      validation: (rule) => rule.required(),
    }),
    lpIconField({ emptyHint: 'Vacío: se usa el icono del servicio.' }),
    defineField({ name: 'name', title: 'Etiqueta', type: 'string', description: 'Texto junto al icono.', validation: (rule) => rule.required() }),
    defineField({ name: 'title', title: 'Título', type: 'text', rows: 2 }),
    defineField({ name: 'short', title: 'Descripción', type: 'text', rows: 2 }),
    defineField({ name: 'href', title: 'URL', type: 'string', validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: 'name', subtitle: 'title' } },
});

export const lpHero = defineType({
  name: 'lpHero',
  title: 'Hero de campaña',
  type: 'object',
  icon: ImageIcon,
  groups: [
    { name: 'content', title: 'Contenido', default: true },
    { name: 'form', title: 'Formulario' },
  ],
  fields: [
    headingTitleField({ title: 'Título (H1)', required: true, group: 'content' }),
    headingWidthField({ group: 'content' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'primaryLabel', title: 'Botón principal', type: 'string', group: 'content', description: 'Abre el calendario.' }),
    defineField({ name: 'secondaryLabel', title: 'Botón de WhatsApp', type: 'string', group: 'content' }),
    defineField({ name: 'whatsappHref', title: 'URL de WhatsApp', type: 'url', group: 'content' }),
    defineField({ name: 'trust', title: 'Línea de confianza', type: 'string', group: 'content' }),
    defineField({
      name: 'avatars',
      title: 'Fotos junto a la línea de confianza',
      type: 'array',
      group: 'content',
      description: 'Se muestran hasta 4.',
      of: [lpImageMember('Foto')],
      validation: (rule) => rule.max(4),
    }),
    defineField({ name: 'formMessageTab', title: 'Pestaña de mensaje', type: 'string', group: 'form' }),
    defineField({ name: 'formCallTab', title: 'Pestaña de llamada', type: 'string', group: 'form', description: 'Abre el calendario.' }),
    defineField({ name: 'formTitle', title: 'Título del formulario', type: 'string', group: 'form' }),
    defineField({ name: 'formSubtitle', title: 'Subtítulo del formulario', type: 'string', group: 'form' }),
    defineField({
      name: 'landingName',
      title: 'Nombre de la landing en el lead',
      type: 'string',
      group: 'form',
      description: 'Así aparece en Slack y en la base de leads.',
    }),
    { ...lpServiceSlugsField('interests', 'Servicios preseleccionados', 'Llegan marcados en el paso 3 del formulario.'), group: 'form' },
    { ...stringList('formCountries', 'Países'), group: 'form' },
    { ...stringList('formSizes', 'Tamaños de empresa'), group: 'form' },
    { ...stringList('formBudgets', 'Presupuestos mensuales'), group: 'form' },
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Hero', subtitle: 'Hero de campaña' }) },
});

export const logoMarquee = defineType({
  name: 'logoMarquee',
  title: 'Logos de clientes',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({ name: 'label', title: 'Etiqueta', type: 'string' }),
    defineField({ name: 'logos', title: 'Logos', type: 'array', of: [lpImageMember('Logo')] }),
  ],
  preview: { select: { title: 'label' }, prepare: ({ title }) => ({ title: title || 'Logos', subtitle: 'Logos de clientes' }) },
});

export const roiCalculator = defineType({
  name: 'roiCalculator',
  title: 'Calculadora de ROI',
  type: 'object',
  icon: BoltIcon,
  groups: [
    { name: 'content', title: 'Contenido', default: true },
    { name: 'numbers', title: 'Números' },
    { name: 'labels', title: 'Textos de la calculadora' },
  ],
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string', group: 'content' }),
    headingTitleField({ group: 'content' }),
    headingWidthField({ group: 'content' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'ctaLabel', title: 'Botón', type: 'string', group: 'content', description: 'Lleva al formulario con el escenario adjunto.' }),
    defineField({
      name: 'preset',
      title: 'Industria inicial',
      type: 'string',
      group: 'numbers',
      options: { list: LP_INDUSTRY_OPTIONS },
      description: 'Vacío: la primera de la lista.',
    }),
    defineField({
      name: 'investment',
      title: 'Inversión mensual (MXN)',
      type: 'object',
      group: 'numbers',
      options: { columns: 2 },
      fields: [
        defineField({ name: 'initial', title: 'Valor inicial', type: 'number', initialValue: 40000 }),
        defineField({ name: 'step', title: 'Paso del slider', type: 'number', initialValue: 5000 }),
        defineField({ name: 'min', title: 'Mínimo', type: 'number', initialValue: 10000 }),
        defineField({ name: 'max', title: 'Máximo', type: 'number', initialValue: 300000 }),
      ],
    }),
    defineField({
      name: 'industries',
      title: 'Industrias y supuestos',
      type: 'array',
      group: 'numbers',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'slug', title: 'Slug', type: 'string', options: { list: LP_INDUSTRY_OPTIONS }, validation: (rule) => rule.required() }),
            defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (rule) => rule.required() }),
            lpIconField(),
            defineField({ name: 'cpl', title: 'Costo por lead (MXN)', type: 'number' }),
            defineField({ name: 'close', title: 'Tasa de cierre (%)', type: 'number' }),
            defineField({ name: 'ticket', title: 'Venta promedio (MXN)', type: 'number' }),
            defineField({ name: 'margin', title: 'Margen de utilidad (%)', type: 'number' }),
          ],
          preview: { select: { title: 'name', subtitle: 'slug' } },
        }),
      ],
    }),
    defineField({ name: 'industryLabel', title: 'Paso 1', type: 'string', group: 'labels' }),
    defineField({ name: 'investmentLabel', title: 'Paso 2', type: 'string', group: 'labels' }),
    defineField({ name: 'assumptionsLabel', title: 'Paso 3', type: 'string', group: 'labels', description: 'Va seguido del nombre de la industria.' }),
    defineField({ name: 'assumptionsHint', title: 'Ayuda de los supuestos', type: 'string', group: 'labels' }),
    defineField({ name: 'resetLabel', title: 'Restablecer supuestos', type: 'string', group: 'labels' }),
    defineField({ name: 'cplLabel', title: 'Campo: costo por lead', type: 'string', group: 'labels' }),
    defineField({ name: 'closeLabel', title: 'Campo: tasa de cierre', type: 'string', group: 'labels' }),
    defineField({ name: 'ticketLabel', title: 'Campo: venta promedio', type: 'string', group: 'labels' }),
    defineField({ name: 'marginLabel', title: 'Campo: margen', type: 'string', group: 'labels' }),
    defineField({ name: 'resultLabel', title: 'Título del resultado', type: 'string', group: 'labels' }),
    defineField({ name: 'formula', title: 'Explicación del ROI', type: 'text', rows: 2, group: 'labels' }),
    defineField({ name: 'negativeBadge', title: 'Badge con ROI negativo', type: 'string', group: 'labels' }),
    defineField({ name: 'negativeHint', title: 'Sugerencia con ROI negativo', type: 'string', group: 'labels' }),
    defineField({ name: 'funnelInvestment', title: 'Embudo: inversión', type: 'string', group: 'labels' }),
    defineField({ name: 'funnelLeads', title: 'Embudo: leads', type: 'string', group: 'labels' }),
    defineField({ name: 'funnelClients', title: 'Embudo: clientes', type: 'string', group: 'labels' }),
    defineField({ name: 'funnelRevenue', title: 'Embudo: ventas', type: 'string', group: 'labels' }),
    defineField({ name: 'funnelProfit', title: 'Embudo: utilidad', type: 'string', group: 'labels' }),
    defineField({ name: 'disclaimer', title: 'Nota legal', type: 'text', rows: 2, group: 'labels' }),
    defineField({ name: 'dockCta', title: 'Botón de la barra móvil', type: 'string', group: 'labels' }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'ROI', subtitle: 'Calculadora de ROI' }) },
});

export const lpStatement = defineType({
  name: 'statement',
  title: 'Enfoque',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'paragraphs', title: 'Párrafos', type: 'array', of: [defineArrayMember({ type: 'text' })] }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Enfoque', subtitle: 'Texto de enfoque' }) },
});

export const serviceSystem = defineType({
  name: 'serviceSystem',
  title: 'Sistema de servicios',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({
      name: 'quadrants',
      title: 'Pestañas',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
            lpIconField(),
            defineField({ name: 'services', title: 'Cards', type: 'array', of: [serviceCard] }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
    defineField({ name: 'ctaTitle', title: 'Card oscura: título', type: 'string', description: 'Abre el calendario.' }),
    defineField({ name: 'ctaText', title: 'Card oscura: texto', type: 'text', rows: 2 }),
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
            lpServiceSlugsField('services', 'Servicios', 'Se preseleccionan en el formulario.'),
            defineField({ name: 'ctaLabel', title: 'Botón', type: 'string' }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Servicios', subtitle: 'Sistema de servicios' }) },
});

export const lpServiceFocus = defineType({
  name: 'lpServiceFocus',
  title: 'Enfoque de servicio o industria',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
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
    stringList('steps', 'Pasos'),
    defineField({ name: 'relatedTitle', title: 'Título de relacionados', type: 'string' }),
    defineField({ name: 'relatedDescription', title: 'Descripción de relacionados', type: 'text', rows: 2 }),
    defineField({ name: 'related', title: 'Servicios relacionados', type: 'array', of: [serviceLink] }),
    defineField({ name: 'kpisLabel', title: 'Etiqueta de “qué medimos”', type: 'string' }),
    defineField({ name: 'kpis', title: 'Qué medimos', type: 'text', rows: 2 }),
    defineField({ name: 'foot', title: 'Texto de la banda oscura', type: 'text', rows: 2 }),
    defineField({ name: 'bundleLabel', title: 'Botón de la banda oscura', type: 'string' }),
    lpServiceSlugsField('bundle', 'Servicios de la combinación', 'Se preseleccionan en el formulario al pulsar el botón.'),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Enfoque', subtitle: 'Servicio o industria' }) },
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
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'primaryLabel', title: 'Botón principal', type: 'string' }),
    defineField({ name: 'primaryHref', title: 'URL principal', type: 'string' }),
    defineField({ name: 'secondaryLabel', title: 'Botón secundario', type: 'string' }),
    defineField({ name: 'secondaryHref', title: 'URL secundaria', type: 'string', description: '#contacto lleva al formulario del hero.' }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Portal', subtitle: 'Portal de clientes' }) },
});

export const lpIndustryCards = defineType({
  name: 'lpIndustryCards',
  title: 'Industrias de la landing',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
    defineField({ name: 'ctaLabel', title: 'Botón de cada card', type: 'string' }),
    defineField({ name: 'hrefPrefix', title: 'Prefijo de URL', type: 'string', initialValue: '/ads/industrias', description: 'La card enlaza a prefijo/slug.' }),
    defineField({
      name: 'industries',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'slug', title: 'Slug', type: 'string', options: { list: LP_INDUSTRY_OPTIONS }, validation: (rule) => rule.required() }),
            defineField({ name: 'nombre', title: 'Nombre', type: 'string', validation: (rule) => rule.required() }),
            lpIconField(),
            defineField({ name: 'tagline', title: 'Párrafo', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'nombre', subtitle: 'tagline' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Industrias', subtitle: 'Industrias de la landing' }) },
});

export const lpCaseCards = defineType({
  name: 'lpCaseCards',
  title: 'Casos de la landing',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
    defineField({
      name: 'caseRefs',
      title: 'Casos',
      type: 'array',
      description: 'Vacío: se eligen 3 casos del servicio o la industria de la página.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'caseStudy' }], options: { disableNew: true } })],
      validation: (rule) => rule.max(6),
    }),
    defineField({ name: 'cardCtaLabel', title: 'Texto del enlace de cada card', type: 'string' }),
    defineField({ name: 'portfolioLabel', title: 'Enlace al portafolio', type: 'string' }),
    defineField({ name: 'portfolioHref', title: 'URL del portafolio', type: 'string' }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Casos', subtitle: 'Casos de la landing' }) },
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
