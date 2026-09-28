import { defineArrayMember, defineField, defineType } from 'sanity';

const navIcons = [
  { title: 'Actividad', value: 'activity' },
  { title: 'Objetivo', value: 'target' },
  { title: 'Chispa', value: 'spark' },
  { title: 'Usuarios', value: 'users' },
  { title: 'Video', value: 'video' },
  { title: 'Insignia', value: 'badge' },
  { title: 'Foco', value: 'focus' },
  { title: 'Código', value: 'code' },
  { title: 'Caja', value: 'box' },
  { title: 'Cuadrícula', value: 'grid' },
  { title: 'Libro', value: 'book' },
  { title: 'Correo', value: 'mail' },
  { title: 'Fábrica', value: 'factory' },
  { title: 'Salud', value: 'heart' },
  { title: 'Edificio', value: 'building' },
  { title: 'Avión', value: 'plane' },
  { title: 'Restaurante', value: 'utensils' },
  { title: 'App', value: 'app' },
];

export const navLink = defineType({
  name: 'navLink',
  title: 'Enlace',
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
      type: 'string',
    }),
    defineField({
      name: 'href',
      title: 'Ruta',
      type: 'string',
      description: 'Ruta del sitio, por ejemplo /servicios/seo o /en/industrias/salud.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icono',
      type: 'string',
      options: { list: navIcons },
      initialValue: 'grid',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
});

export const navGroup = defineType({
  name: 'navGroup',
  title: 'Columna',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Título de la columna',
      type: 'string',
      description: 'Opcional. Si lo dejas vacío, la columna no muestra título.',
    }),
    defineField({
      name: 'links',
      title: 'Enlaces',
      type: 'array',
      of: [defineArrayMember({ type: 'navLink' })],
    }),
  ],
  preview: {
    select: { title: 'heading', links: 'links' },
    prepare({ title, links }) {
      const count = Array.isArray(links) ? links.length : 0;
      return { title, subtitle: `${count} enlaces` };
    },
  },
});

export const navBarItem = defineType({
  name: 'navBarItem',
  title: 'Ítem de la barra',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Texto',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Tipo',
      description: 'Enlace abre una página. Dropdown abre un menú con columnas.',
      type: 'string',
      options: {
        list: [
          { title: 'Enlace', value: 'link' },
          { title: 'Dropdown', value: 'dropdown' },
        ],
        layout: 'radio',
      },
      initialValue: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Ruta',
      type: 'string',
      description: 'A dónde lleva el enlace, por ejemplo /nosotros.',
      hidden: ({ parent }) => parent?.kind !== 'link',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { kind?: string } | undefined;
          if (parent?.kind === 'link' && !value) return 'La ruta es obligatoria';
          return true;
        }),
    }),
    defineField({
      name: 'columns',
      title: 'Columnas',
      description: 'Agrega una columna por cada bloque del menú. Dentro de cada columna, agrega y arrastra los enlaces.',
      type: 'array',
      hidden: ({ parent }) => parent?.kind !== 'dropdown',
      of: [defineArrayMember({ type: 'navGroup' })],
    }),
    defineField({
      name: 'indexLabel',
      title: 'Enlace extra en móvil',
      description: 'Opcional. En el celular aparece arriba de la lista, por ejemplo Todas las industrias.',
      type: 'string',
      hidden: ({ parent }) => parent?.kind !== 'dropdown',
    }),
    defineField({
      name: 'indexHref',
      title: 'Ruta del enlace extra',
      type: 'string',
      hidden: ({ parent }) => parent?.kind !== 'dropdown',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      kind: 'kind',
      href: 'href',
      columns: 'columns',
    },
    prepare({ title, kind, href, columns }) {
      const count = Array.isArray(columns) ? columns.length : 0;
      const subtitle = kind === 'dropdown' ? `Dropdown · ${count} ${count === 1 ? 'columna' : 'columnas'}` : href;
      return { title, subtitle };
    },
  },
});

export const navigation = defineType({
  name: 'navigation',
  title: 'Navbar',
  type: 'document',
  fields: [
    defineField({
      name: 'locale',
      title: 'Idioma',
      type: 'string',
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
      name: 'bar',
      title: 'Barra',
      description: 'Abre Industrias o Servicios para editar los enlaces de ese menú.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'navBarItem',
          options: { modal: { type: 'dialog', width: 'large' } },
        }),
      ],
    }),
    defineField({ name: 'ctaLabel', title: 'Texto del botón', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'Ruta del botón', type: 'string' }),
  ],
  preview: {
    select: { locale: 'locale' },
    prepare({ locale }) {
      return { title: 'Navbar', subtitle: locale === 'en' ? 'English' : 'Español' };
    },
  },
});
