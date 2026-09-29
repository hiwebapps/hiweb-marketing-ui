import { BlockElementIcon } from '@sanity/icons/BlockElement';
import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe';
import { ImageIcon } from '@sanity/icons/Image';
import { RocketIcon } from '@sanity/icons/Rocket';
import { UsersIcon } from '@sanity/icons/Users';
import { defineArrayMember, defineField, defineType, type ArrayOfObjectsMember } from 'sanity';
import { imageWithAlt, withVisibility } from './shared';

const dialog = { options: { modal: { type: 'dialog' as const, width: 'medium' as const } } };

const badgeVariants = [
  { title: 'Lima', value: 'lime' },
  { title: 'Cian', value: 'cyan' },
  { title: 'Morado', value: 'purple' },
  { title: 'Naranja', value: 'orange' },
];

const pillarIcons = [
  { title: 'Usuarios', value: 'users' },
  { title: 'Globo', value: 'globe' },
  { title: 'Objetivo', value: 'target' },
  { title: 'Check', value: 'check' },
  { title: 'Capas', value: 'layers' },
  { title: 'Flujo', value: 'workflow' },
];

const pillarAccents = [
  { title: 'Morado', value: 'purple' },
  { title: 'Cian', value: 'cyan' },
  { title: 'Naranja', value: 'orange' },
  { title: 'Verde', value: 'green' },
];

function sectionPreview(subtitle: string, titleField = 'title') {
  return {
    select: { title: titleField },
    prepare: ({ title }: { title?: string }) => ({
      title: title || subtitle,
      subtitle,
    }),
  };
}

export const aboutHero = defineType({
  name: 'aboutHero',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  fields: [
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
              options: { list: badgeVariants },
              initialValue: 'lime',
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'variant' } },
        }),
      ],
    }),
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    imageWithAlt({ name: 'image', title: 'Imagen' }),
    defineField({
      name: 'imagePosition',
      title: 'Posición de la imagen',
      type: 'string',
      initialValue: 'center 28%',
    }),
    defineField({ name: 'ctaLabel', title: 'Texto del botón', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'URL del botón', type: 'string', initialValue: '/contacto' }),
  ],
  preview: sectionPreview('Sección Hero'),
});

export const aboutHistory = defineType({
  name: 'aboutHistory',
  title: 'Historia',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string', initialValue: 'Historia' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 4 }),
    defineField({
      name: 'columns',
      title: 'Columnas',
      type: 'array',
      validation: (rule) => rule.max(2),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string' }),
            defineField({
              name: 'paragraphs',
              title: 'Párrafos',
              type: 'array',
              of: [defineArrayMember({ type: 'text' })],
            }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
  ],
  preview: sectionPreview('Sección Historia'),
});

export const aboutPillars = defineType({
  name: 'aboutPillars',
  title: 'Diferenciadores',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string', initialValue: 'Diferenciadores' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({
      name: 'pillars',
      title: 'Pilares',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
            defineField({ name: 'icon', title: 'Icono', type: 'string', options: { list: pillarIcons } }),
            defineField({ name: 'accent', title: 'Color', type: 'string', options: { list: pillarAccents } }),
            defineField({ name: 'href', title: 'Ruta', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        }),
      ],
    }),
  ],
  preview: sectionPreview('Sección Diferenciadores'),
});

export const aboutProcess = defineType({
  name: 'aboutProcess',
  title: 'Proceso',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({
      name: 'phases',
      title: 'Fases',
      type: 'array',
      description: 'Si está vacío, la página usa las fases de la Home.',
      of: [defineArrayMember({ type: 'processStep' })],
    }),
  ],
  preview: sectionPreview('Sección Proceso'),
});

export const aboutTeam = defineType({
  name: 'aboutTeam',
  title: 'Equipo',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string', initialValue: 'Equipo' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'ctaLabel', title: 'Texto del botón', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'URL del botón', type: 'string', initialValue: '/contacto' }),
    defineField({ name: 'filterLabel', title: 'Etiqueta de los filtros', type: 'string' }),
    defineField({
      name: 'filters',
      title: 'Filtros',
      type: 'array',
      description: 'Las personas se editan en Equipo. Aquí solo el texto de los filtros.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'id',
              title: 'Id',
              type: 'string',
              options: {
                list: [
                  { title: 'Todos', value: 'all' },
                  { title: 'Web', value: 'web' },
                  { title: 'Redes', value: 'redes' },
                  { title: 'Diseño', value: 'diseno' },
                ],
              },
            }),
            defineField({ name: 'label', title: 'Texto', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'id' } },
        }),
      ],
    }),
  ],
  preview: sectionPreview('Sección Equipo'),
});

export const aboutMap = defineType({
  name: 'aboutMap',
  title: 'Mapa',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string', initialValue: 'Mapa global' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'sectionLabel', title: 'Nombre de la sección', type: 'string' }),
    defineField({ name: 'globeLabel', title: 'Descripción del globo', type: 'string' }),
    defineField({ name: 'ctaLabel', title: 'Texto del botón', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'URL del botón', type: 'string', initialValue: '/contacto' }),
  ],
  preview: sectionPreview('Sección Mapa'),
});

export const aboutCta = defineType({
  name: 'aboutCta',
  title: 'Cierre',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'ctaLabel', title: 'Texto del botón', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'URL del botón', type: 'string', initialValue: '/contacto' }),
  ],
  preview: sectionPreview('Sección Cierre'),
});

export const aboutSectionMembers: ArrayOfObjectsMember[] = [
  defineArrayMember({ type: 'aboutHero', ...dialog }),
  defineArrayMember({ type: 'aboutHistory', ...dialog }),
  defineArrayMember({ type: 'aboutPillars', ...dialog }),
  defineArrayMember({ type: 'aboutProcess', ...dialog }),
  defineArrayMember({ type: 'aboutTeam', ...dialog }),
  defineArrayMember({ type: 'aboutMap', ...dialog }),
  defineArrayMember({ type: 'aboutCta', ...dialog }),
];

export const aboutSectionTypes = [
  aboutHero,
  aboutHistory,
  aboutPillars,
  aboutProcess,
  aboutTeam,
  aboutMap,
  aboutCta,
].map(withVisibility);
