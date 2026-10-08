import { defineArrayMember, defineField, defineType } from 'sanity';

export const footerLink = defineType({
  name: 'footerLink',
  title: 'Enlace',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Texto',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Ruta',
      type: 'string',
      description: 'Página o enlace. Ejemplos: /nosotros, /en/blogs, mailto:hola@hiweb.marketing, tel:+529991234567.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
});

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
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
      name: 'brandMark',
      title: 'Icono',
      type: 'image',
      description: 'El isotipo arriba del título. Si lo dejas vacío, se usa el icono de Hiweb.',
      options: { hotspot: false, accept: 'image/svg+xml,image/png,image/webp' },
    }),
    defineField({
      name: 'brand',
      title: 'Marca',
      type: 'string',
      description: 'No se muestra. Arriba del título va el icono.',
      hidden: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'text',
      rows: 3,
      description: 'El texto grande del footer.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'emailPlaceholder',
      title: 'Texto del campo de email',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'menuHeading',
      title: 'Título de la columna de menú',
      type: 'string',
    }),
    defineField({
      name: 'menuLinks',
      title: 'Enlaces del menú',
      description: 'Arrastra para cambiar el orden. Quita un enlace para que deje de aparecer.',
      type: 'array',
      of: [defineArrayMember({ type: 'footerLink' })],
    }),
    defineField({
      name: 'contactHeading',
      title: 'Título de la columna de contacto',
      type: 'string',
    }),
    defineField({
      name: 'contactLinks',
      title: 'Enlaces de contacto',
      description: 'Teléfono, email, WhatsApp u otros. El orden de esta lista es el orden en el sitio.',
      type: 'array',
      of: [defineArrayMember({ type: 'footerLink' })],
    }),
    defineField({
      name: 'locations',
      title: 'Ciudades',
      type: 'string',
      description: 'La línea de ciudades, por ejemplo Mérida · Cancún · Monterrey.',
    }),
    defineField({
      name: 'legalName',
      title: 'Nombre en el copyright',
      type: 'string',
    }),
    defineField({
      name: 'legalLinks',
      title: 'Enlaces legales',
      description: 'Arrastra para cambiar el orden. Quita un enlace para que deje de aparecer.',
      type: 'array',
      of: [defineArrayMember({ type: 'footerLink' })],
    }),
    defineField({
      name: 'backToTop',
      title: 'Texto de volver arriba',
      type: 'string',
    }),
  ],
  preview: {
    select: { locale: 'locale' },
    prepare({ locale }) {
      return { title: 'Footer', subtitle: locale === 'en' ? 'English' : 'Español' };
    },
  },
});
