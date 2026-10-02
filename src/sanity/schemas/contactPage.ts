import { DocumentIcon } from '@sanity/icons/Document';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { seoFields } from './shared';

const FIELD_KINDS = [
  { title: 'Nombre', value: 'firstName' },
  { title: 'Apellido', value: 'lastName' },
  { title: 'Email', value: 'email' },
  { title: 'Celular', value: 'phone' },
  { title: 'Sitio web', value: 'website' },
  { title: 'Servicio de interés', value: 'services' },
  { title: 'Presupuesto', value: 'budget' },
  { title: 'Proyecto', value: 'project' },
];

const WIDE_KINDS = ['services', 'budget', 'project'];

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contacto',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content', title: 'Banner', default: true },
    { name: 'fields', title: 'Campos' },
    { name: 'services', title: 'Servicios' },
    { name: 'budget', title: 'Presupuesto' },
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
      title: 'Nombre interno',
      type: 'string',
      group: 'content',
      initialValue: 'Contacto',
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
      name: 'submitLabel',
      title: 'Botón de envío',
      type: 'string',
      group: 'content',
      initialValue: 'Enviar mensaje',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fields',
      title: 'Campos',
      type: 'array',
      group: 'fields',
      description:
        'Arrastra para cambiar el orden. El campo de proyecto se muestra en la columna derecha. Cada tipo solo puede usarse una vez.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contactField',
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
              hidden: ({ parent }) => WIDE_KINDS.includes(parent?.kind) && parent?.kind !== 'project',
            }),
            defineField({
              name: 'hint',
              title: 'Ayuda',
              type: 'string',
              description: 'Texto corto bajo la etiqueta. Úsalo en Servicio de interés.',
            }),
            defineField({
              name: 'required',
              title: 'Obligatorio',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'width',
              title: 'Ancho',
              type: 'string',
              options: {
                list: [
                  { title: 'Media columna', value: 'half' },
                  { title: 'Columna completa', value: 'full' },
                ],
                layout: 'radio',
              },
              initialValue: 'half',
              hidden: ({ parent }) => WIDE_KINDS.includes(parent?.kind),
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
      title: 'Servicios de interés',
      type: 'array',
      group: 'services',
      description: 'Opciones que se pueden elegir en el formulario. Arrastra para ordenarlas.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contactService',
          fields: [
            defineField({
              name: 'label',
              title: 'Nombre',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label' },
          },
        }),
      ],
    }),
    defineField({
      name: 'servicesError',
      title: 'Error si no eligen servicio',
      type: 'string',
      group: 'services',
      initialValue: 'Elige al menos un servicio.',
    }),
    defineField({
      name: 'budgets',
      title: 'Opciones de presupuesto',
      type: 'array',
      group: 'budget',
      description: 'En MXN. Marca una como personalizada para que escriban el monto.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contactBudget',
          fields: [
            defineField({
              name: 'label',
              title: 'Etiqueta',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'custom',
              title: 'Personalizado',
              type: 'boolean',
              description: 'Muestra un campo para escribir el monto.',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'label', custom: 'custom' },
            prepare: ({ title, custom }) => ({
              title: title || 'Presupuesto',
              subtitle: custom ? 'Escribe el monto' : 'Opción fija',
            }),
          },
        }),
      ],
      validation: (rule) =>
        rule.custom((items) => {
          if (!Array.isArray(items)) return true;
          const custom = items.filter((item) => (item as { custom?: boolean }).custom).length;
          if (custom > 1) return 'Solo una opción puede ser personalizada.';
          return true;
        }),
    }),
    defineField({
      name: 'amountLabel',
      title: 'Etiqueta del monto',
      type: 'string',
      group: 'budget',
      initialValue: 'Monto',
    }),
    defineField({
      name: 'amountPlaceholder',
      title: 'Placeholder del monto',
      type: 'string',
      group: 'budget',
      initialValue: 'Escribe cuánto',
    }),
    defineField({
      name: 'budgetError',
      title: 'Error si no eligen presupuesto',
      type: 'string',
      group: 'budget',
      initialValue: 'Elige un presupuesto.',
    }),
    defineField({
      name: 'customBudgetError',
      title: 'Error si falta el monto',
      type: 'string',
      group: 'budget',
      initialValue: 'Escribe el monto en MXN.',
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title: title || 'Contacto', subtitle: '/contacto' }),
  },
});
