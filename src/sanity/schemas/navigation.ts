import { defineArrayMember, defineField, defineType } from 'sanity';

const PAGE_TYPES = [
  { type: 'homePage' },
  { type: 'aboutPage' },
  { type: 'contactPage' },
  { type: 'calendarPage' },
  { type: 'sitePage' },
  { type: 'servicesIndex' },
  { type: 'industriesIndex' },
  { type: 'blogIndex' },
  { type: 'casesIndex' },
  { type: 'service' },
  { type: 'industry' },
  { type: 'caseStudy' },
  { type: 'post' },
  { type: 'landingPage' },
  { type: 'legalPage' },
];

function pageFilter({ document }: { document?: { locale?: string } }) {
  const locale = document?.locale === 'en' ? 'en' : 'es';
  return {
    filter: `!(_id in path("drafts.**")) && coalesce(locale, select(_id match "*-en" => "en", "es")) == $locale`,
    params: { locale },
  };
}

function pageReferenceField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: 'reference',
    to: PAGE_TYPES,
    description:
      'Busca la página por nombre. Si después cambia el slug, este enlace se actualiza solo. En español solo aparecen páginas en español, y en inglés solo las de inglés.',
    options: { disableNew: true, filter: pageFilter },
  });
}

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
    pageReferenceField('page', 'Página'),
    defineField({
      name: 'href',
      title: 'Ruta manual',
      type: 'string',
      description: 'Solo si el destino no está en Studio: un ancla, un archivo o un sitio externo.',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { page?: { _ref?: string } } | undefined;
          if (!value && !parent?.page?._ref) return 'Elige una página o escribe una ruta manual';
          return true;
        }),
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
    {
      ...pageReferenceField('page', 'Página'),
      hidden: ({ parent }) => parent?.kind !== 'link',
    },
    defineField({
      name: 'href',
      title: 'Ruta manual',
      type: 'string',
      description: 'Solo si el destino no está en Studio.',
      hidden: ({ parent }) => parent?.kind !== 'link',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { kind?: string; page?: { _ref?: string } } | undefined;
          if (parent?.kind === 'link' && !value && !parent.page?._ref) return 'Elige una página o escribe una ruta manual';
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
    {
      ...pageReferenceField('indexPage', 'Página del enlace extra'),
      hidden: ({ parent }) => parent?.kind !== 'dropdown',
    },
    defineField({
      name: 'indexHref',
      title: 'Ruta manual del enlace extra',
      type: 'string',
      description: 'Solo si el destino no está en Studio.',
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
    pageReferenceField('ctaPage', 'Página del botón'),
    defineField({
      name: 'ctaHref',
      title: 'Ruta manual del botón',
      type: 'string',
      description: 'Solo si el destino no está en Studio.',
    }),
  ],
  preview: {
    select: { locale: 'locale' },
    prepare({ locale }) {
      return { title: 'Navbar', subtitle: locale === 'en' ? 'English' : 'Español' };
    },
  },
});
