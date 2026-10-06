import { DocumentIcon } from '@sanity/icons/Document';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { seoFields } from './shared';

const FIELD_KINDS = [
  { title: 'Servicio', value: 'services' },
  { title: 'Nombre', value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'Teléfono', value: 'phone' },
  { title: 'Empresa', value: 'company' },
  { title: 'Sitio web', value: 'website' },
];

export const calendarPage = defineType({
  name: 'calendarPage',
  title: 'Calendario',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content', title: 'Banner', default: true },
    { name: 'fields', title: 'Campos' },
    { name: 'services', title: 'Servicios' },
    { name: 'labels', title: 'Textos' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'locale',
      title: 'Idioma',
      type: 'string',
      group: 'content',
      hidden: true,
      options: {
        list: [
          { title: 'Español', value: 'es' },
          { title: 'English', value: 'en' },
        ],
      },
      initialValue: 'es',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Nombre de la página',
      type: 'string',
      group: 'content',
      description: 'Se usa en el título del navegador y en la miga de pan.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bannerTitle',
      title: 'Título del banner',
      type: 'string',
      group: 'content',
      description: 'Primera línea del banner.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bannerSubtitle',
      title: 'Segunda línea del banner',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'fields',
      title: 'Campos',
      type: 'array',
      group: 'fields',
      description: 'Etiqueta y placeholder de cada campo. El orden en la página no cambia.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'calendarField',
          fields: [
            defineField({
              name: 'kind',
              title: 'Tipo',
              type: 'string',
              options: { list: FIELD_KINDS, layout: 'dropdown' },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Etiqueta',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
              hidden: ({ parent }) => parent?.kind === 'services',
            }),
            defineField({
              name: 'hint',
              title: 'Ayuda',
              type: 'string',
              description: 'Texto corto bajo la etiqueta. Úsalo en Servicio.',
            }),
          ],
          preview: {
            select: { title: 'label', kind: 'kind' },
            prepare: ({ title, kind }) => ({
              title: title || 'Campo',
              subtitle: FIELD_KINDS.find((item) => item.value === kind)?.title ?? kind,
            }),
          },
        }),
      ],
      validation: (rule) =>
        rule.custom((fields) => {
          if (!Array.isArray(fields)) return true;
          const kinds = fields.map((field) => (field as { kind?: string }).kind).filter(Boolean);
          const duplicate = kinds.find((kind, index) => kinds.indexOf(kind) !== index);
          if (duplicate) return 'Cada tipo de campo solo puede usarse una vez.';
          return true;
        }),
    }),
    defineField({
      name: 'services',
      title: 'Servicios',
      type: 'array',
      group: 'services',
      description: 'Opciones del calendario. Arrastra para ordenarlas.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'calendarService',
          fields: [
            defineField({
              name: 'label',
              title: 'Nombre',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'serviceId',
              title: 'Identificador',
              type: 'string',
              description: 'No lo cambies si ya hay citas con este servicio.',
            }),
            defineField({
              name: 'asksForWebsite',
              title: 'Pedir sitio web',
              type: 'boolean',
              description: 'Muestra el campo de sitio web cuando eligen esta opción.',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'label', website: 'asksForWebsite' },
            prepare: ({ title, website }) => ({
              title: title || 'Servicio',
              subtitle: website ? 'Pide sitio web' : '',
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'servicesError',
      title: 'Error si no eligen servicio',
      type: 'string',
      group: 'services',
    }),
    defineField({
      name: 'servicesEmpty',
      title: 'Texto si no hay servicios',
      type: 'string',
      group: 'services',
    }),
    defineField({
      name: 'weekdays',
      title: 'Días de la semana',
      type: 'array',
      group: 'labels',
      description: 'Siete etiquetas, de lunes a domingo.',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.length(7).error('Escribe las siete etiquetas, de lunes a domingo.'),
    }),
    defineField({
      name: 'previousLabel',
      title: 'Mes anterior',
      type: 'string',
      group: 'labels',
    }),
    defineField({
      name: 'nextLabel',
      title: 'Mes siguiente',
      type: 'string',
      group: 'labels',
    }),
    defineField({
      name: 'scheduleLabel',
      title: 'Título de horarios',
      type: 'string',
      group: 'labels',
    }),
    defineField({
      name: 'scheduleHint',
      title: 'Ayuda de horarios',
      type: 'text',
      rows: 2,
      group: 'labels',
    }),
    defineField({
      name: 'loadingLabel',
      title: 'Cargando horarios',
      type: 'string',
      group: 'labels',
    }),
    defineField({
      name: 'fullDayLabel',
      title: 'Día sin horarios',
      type: 'string',
      group: 'labels',
    }),
    defineField({
      name: 'confirmLabel',
      title: 'Botón de confirmar',
      type: 'string',
      group: 'labels',
    }),
    defineField({
      name: 'pendingLabel',
      title: 'Botón mientras reserva',
      type: 'string',
      group: 'labels',
    }),
    defineField({
      name: 'confirmedLabel',
      title: 'Cita confirmada',
      type: 'string',
      group: 'labels',
    }),
    defineField({
      name: 'cancelledLabel',
      title: 'Cita cancelada',
      type: 'string',
      group: 'labels',
    }),
    defineField({
      name: 'timezoneNote',
      title: 'Nota de confirmación',
      type: 'string',
      group: 'labels',
      description: 'Usa {email} donde va el correo de quien reservó.',
    }),
    defineField({
      name: 'cancelLabel',
      title: 'Botón de cancelar',
      type: 'string',
      group: 'labels',
    }),
    defineField({
      name: 'cancellingLabel',
      title: 'Botón mientras cancela',
      type: 'string',
      group: 'labels',
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: 'title', locale: 'locale' },
    prepare: ({ title, locale }) => ({
      title: title || 'Calendario',
      subtitle: locale === 'en' ? '/en/calendario' : '/calendario',
    }),
  },
});
