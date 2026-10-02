import { EyeClosedIcon } from '@sanity/icons/EyeClosed';
import { defineArrayMember, defineField, defineType, type ObjectDefinition, type PreviewConfig } from 'sanity';
import { HEADING_WIDTH_OPTIONS } from '../../lib/heading';
import { charCountInput } from '../components/CharCountInput';
import { serpTitleInput } from '../components/SerpPreview';

const headingTitleDescription =
  'Enter parte el título en otra línea. Así decides si queda en 1, 2, 3 o 4 renglones.';

export function headingTitleField(options?: {
  required?: boolean;
  title?: string;
  group?: string;
  initialValue?: string;
  name?: string;
}) {
  return defineField({
    name: options?.name ?? 'title',
    title: options?.title ?? 'Título',
    type: 'text',
    rows: 4,
    ...(options?.group ? { group: options.group } : {}),
    description: headingTitleDescription,
    ...(options?.initialValue ? { initialValue: options.initialValue } : {}),
    validation: (rule) => (options?.required ? rule.required() : rule),
  });
}

export function headingWidthField(options?: { name?: string; group?: string; title?: string }) {
  return defineField({
    name: options?.name ?? 'headingWidth',
    title: options?.title ?? 'Ancho máximo',
    type: 'string',
    ...(options?.group ? { group: options.group } : {}),
    description: 'Tope del título y del párrafo. Si lo dejas vacío, la sección conserva el ancho actual.',
    options: {
      list: HEADING_WIDTH_OPTIONS.map((item) => ({ title: item.title, value: item.value })),
      layout: 'dropdown',
    },
  });
}

export const seoFields = [
  defineField({
    name: 'metaTitle',
    title: 'Título SEO',
    type: 'string',
    group: 'seo',
    components: { input: serpTitleInput },
    validation: (rule) => rule.max(70).warning('Idealmente ≤ 60–70 caracteres'),
  }),
  defineField({
    name: 'metaDescription',
    title: 'Descripción SEO',
    type: 'text',
    rows: 3,
    group: 'seo',
    components: { input: charCountInput(155, 160) },
    validation: (rule) => rule.max(160).warning('Idealmente ≤ 155–160 caracteres'),
  }),
  defineField({
    name: 'ogImage',
    title: 'Imagen Open Graph',
    type: 'image',
    group: 'seo',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Texto alternativo',
        type: 'string',
        validation: (rule) => rule.required().warning('El alt es obligatorio en imágenes'),
      }),
    ],
  }),
  defineField({
    name: 'noindex',
    title: 'Excluir del índice',
    type: 'boolean',
    group: 'seo',
    initialValue: false,
    description:
      'Hoy todo el sitio ya está en noindex. Este checkbox no enciende la indexación: cuando el sitio se lance, esta página seguirá fuera del índice.',
  }),
  defineField({
    name: 'canonicalPath',
    title: 'Canonical',
    type: 'string',
    group: 'seo',
    description: 'Ruta canónica opcional, por ejemplo /blog/mi-articulo. Si se deja vacía, se usa la URL de la página.',
    validation: (rule) =>
      rule.custom((value) => {
        if (!value) return true;
        return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
          ? true
          : 'Empieza con / y sin dominio';
      }),
  }),
];

export const seoGroups = [
  { name: 'content', title: 'Contenido', default: true },
  { name: 'seo', title: 'SEO' },
];

export function imageWithAlt({
  name,
  title,
  required = false,
  group,
}: {
  name: string;
  title: string;
  required?: boolean;
  group?: string;
}) {
  return defineField({
    name,
    title,
    type: 'image',
    group,
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Texto alternativo',
        type: 'string',
        validation: (rule) =>
          required
            ? rule.required().error('El alt es obligatorio')
            : rule.required().warning('El alt es obligatorio en imágenes'),
      }),
    ],
    validation: required ? (rule) => rule.required() : undefined,
  });
}

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Pregunta',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Respuesta',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'question' },
  },
});

export const servicePlan = defineType({
  name: 'servicePlan',
  title: 'Plan de servicio',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Texto superior',
      type: 'string',
      description: 'El texto pequeño arriba del título, por ejemplo Cotiza. Déjalo vacío para ocultarlo.',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Texto del badge, por ejemplo Recomendado. Déjalo vacío para no mostrarlo.',
    }),
    defineField({
      name: 'price',
      title: 'Título',
      type: 'string',
      description: 'El texto grande de la card. Ejemplo: $8,000, Incluye: o Alcance:.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'period',
      title: 'Periodo',
      type: 'string',
      description: 'Opcional. Se pega al título. Ejemplo: /mes.',
    }),
    defineField({
      name: 'featured',
      title: 'Destacada',
      type: 'boolean',
      description: 'Resalta la card con borde y botón principal. El badge se controla en el campo Badge.',
      initialValue: false,
    }),
    defineField({
      name: 'includes',
      title: 'Incluye',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { name: 'name', price: 'price', badge: 'badge' },
    prepare: ({ name, price, badge }: { name?: string; price?: string; badge?: string }) => ({
      title: name || price || 'Plan',
      subtitle: [badge, price && name ? price : ''].filter(Boolean).join(' · '),
    }),
  },
});

export const titledBlock = defineType({
  name: 'titledBlock',
  title: 'Bloque con título',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
});

export const processStep = defineType({
  name: 'processStep',
  title: 'Paso de proceso',
  type: 'object',
  fields: [
    defineField({
      name: 'index',
      title: 'Índice',
      type: 'string',
      description: 'Ej. 01. Si se deja vacío, el front lo numera.',
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'index' },
  },
});

export const metric = defineType({
  name: 'metric',
  title: 'Métrica',
  type: 'object',
  fields: [
    defineField({
      name: 'valor',
      title: 'Valor',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Etiqueta',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'prefix', title: 'Prefijo', type: 'string' }),
    defineField({ name: 'suffix', title: 'Sufijo', type: 'string' }),
    defineField({ name: 'decimals', title: 'Decimales', type: 'number' }),
    defineField({ name: 'antes', title: 'Antes', type: 'string' }),
    defineField({ name: 'despues', title: 'Después', type: 'string' }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'valor' },
  },
});

export const sectionIntro = defineType({
  name: 'sectionIntro',
  title: 'Intro de sección',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'titleMuted', title: 'Título muted', type: 'string' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 4 }),
  ],
});

export const cta = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Etiqueta',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
});

export const faqCategory = defineType({
  name: 'faqCategory',
  title: 'Categoría FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Etiqueta',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Preguntas',
      type: 'array',
      of: [defineArrayMember({ type: 'faqItem' })],
    }),
  ],
  preview: {
    select: { title: 'label' },
  },
});

export const serviceBlurb = defineType({
  name: 'serviceBlurb',
  title: 'Blurb de servicio',
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
      name: 'description',
      title: 'Descripción para esta industria',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'service.nombre', subtitle: 'description' },
  },
});

type PreviewValue = { title?: string; subtitle?: string; media?: unknown };

/** Keeps a section in Studio while the site skips it. */
export function withVisibility<T extends ObjectDefinition>(type: T): T {
  const preview = type.preview as PreviewConfig | undefined;
  const hiddenField = defineField({
    name: 'hidden',
    title: 'Ocultar sección',
    type: 'boolean',
    initialValue: false,
    description: 'Sigue en Studio, pero no aparece en el sitio.',
  });

  return {
    ...type,
    fields: [hiddenField, ...(type.fields ?? [])],
    preview: {
      select: { ...(preview?.select ?? {}), hidden: 'hidden' },
      prepare: (selection: { hidden?: boolean; title?: string; subtitle?: string }) => {
        const prepared = (
          preview?.prepare ? preview.prepare(selection) : { title: selection.title, subtitle: selection.subtitle }
        ) as PreviewValue;
        if (!selection.hidden) return prepared;
        return {
          ...prepared,
          subtitle: prepared.subtitle ? `Oculta · ${prepared.subtitle}` : 'Oculta',
          media: EyeClosedIcon,
        };
      },
    },
  };
}
