import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Ajustes del sitio',
  type: 'document',
  fields: [
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description:
        'Icono de la pestaña del navegador en todas las páginas. PNG o SVG, cuadrado. Si lo dejas vacío, el sitio sigue con el icono que ya trae. Entra al sitio público en el próximo deploy.',
      options: { accept: 'image/png,image/svg+xml' },
    }),
    defineField({
      name: 'name',
      title: 'Nombre corto',
      type: 'string',
      description: 'La marca corta. Sale en el wordmark grande del footer.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'legalName',
      title: 'Nombre legal',
      type: 'string',
      description: 'Nombre de la organización en los datos para buscadores y como editor de los artículos.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      rows: 3,
      description: 'Descripción de respaldo cuando una página no tiene la suya en su grupo SEO.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Correo del banner de Contacto y destino del formulario.',
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
      description: 'Número visible en el banner de Contacto.',
    }),
    defineField({
      name: 'phoneHref',
      title: 'Teléfono (href)',
      type: 'string',
      description: 'Enlace del teléfono, por ejemplo tel:+529991234567.',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'url',
      description: 'Enlace wa.me. Si está definido, aparece en el banner de Contacto.',
    }),
    defineField({
      name: 'locales',
      title: 'Ciudades / bases',
      type: 'array',
      description: 'Sedes de la organización. El pie usa su propio campo Ciudades.',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'socials',
      title: 'Redes',
      type: 'array',
      description: 'Iconos del pie, en todas las páginas. El orden de la lista es el orden en el sitio.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Nombre', type: 'string' }),
            defineField({ name: 'href', title: 'URL', type: 'url' }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'legalName', subtitle: 'tagline' },
  },
});
