import { ImagesIcon } from '@sanity/icons/Images';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { InstagramSyncInput } from '../components/InstagramSyncInput';
import { instagramPhonePost } from './blocks/instagramPhone';
import { imageWithAlt } from './shared';

export const socialBrand = defineType({
  name: 'socialBrand',
  title: 'Perfil de Instagram / Redes',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre de la Marca',
      type: 'string',
      description: 'Nombre comercial del cliente (ej. El Secreto, Gaios, Paulo’s Pizza)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'handle',
      title: 'Usuario de Instagram',
      type: 'string',
      description: 'Usuario sin @ (ej. el.secretomx, gaios.mx). Haz clic en Sincronizar para auto-llenar los datos.',
      components: {
        input: InstagramSyncInput,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cutoffDate',
      title: 'Fecha de fin de gestión (Filtro de fecha para sincronizar)',
      type: 'date',
      description: 'Opcional. Si el cliente ya no trabaja con la agencia, indica la fecha límite. Al sincronizar, se ignorará el contenido posterior a esta fecha y se buscarán las publicaciones creadas durante el servicio.',
    }),
    defineField({
      name: 'customPostUrls',
      title: 'Enlaces directos de publicaciones o reels',
      type: 'array',
      of: [defineArrayMember({ type: 'url' })],
      description: 'Opcional. Si prefieres seleccionar manualmente publicaciones específicas que produjo Hiweb, pega aquí los enlaces de Instagram (ej. https://www.instagram.com/p/... o /reel/...).',
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      description: 'Subtítulo en la biografía (ej. Boutique de Moda, Restaurante / Desayunos, Retail)',
    }),
    defineField({
      name: 'industry',
      title: 'Industria',
      type: 'reference',
      to: [{ type: 'industry' }],
      description: 'Para los filtros por sector en la página de servicios de Redes Sociales.',
    }),
    defineField({
      name: 'caseStudy',
      title: 'Caso de Éxito Asociado',
      type: 'reference',
      to: [{ type: 'caseStudy' }],
      description: 'Enlaza este perfil con su caso de éxito para que aparezca el botón "Ver caso de éxito" en el feed de servicios.',
    }),
    imageWithAlt({
      name: 'avatar',
      title: 'Foto de perfil (Avatar)',
    }),
    defineField({
      name: 'bio',
      title: 'Biografía',
      type: 'text',
      rows: 3,
      description: 'Texto de la biografía de Instagram.',
    }),
    defineField({
      name: 'linkText',
      title: 'Texto del enlace en Bio',
      type: 'string',
      description: 'Ej. menu.gaios.mx o Ubicación 📍',
    }),
    defineField({
      name: 'linkUrl',
      title: 'URL del enlace en Bio',
      type: 'url',
      description: 'URL web al que apunta la biografía.',
    }),
    defineField({
      name: 'stats',
      title: 'Cifras del Perfil',
      type: 'object',
      fields: [
        defineField({ name: 'posts', title: 'Publicaciones', type: 'string', initialValue: '0' }),
        defineField({ name: 'followers', title: 'Seguidores', type: 'string', initialValue: '0' }),
        defineField({ name: 'following', title: 'Seguidos', type: 'string', initialValue: '0' }),
      ],
      options: { columns: 3 },
    }),
    defineField({
      name: 'highlights',
      title: 'Historias Destacadas (Highlights)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'cover', title: 'Portada (Círculo)', type: 'image', options: { hotspot: true } }),
          ],
          preview: {
            select: { title: 'title', media: 'cover' },
          },
        }),
      ],
    }),
    defineField({
      name: 'posts',
      title: 'Publicaciones del Feed',
      type: 'array',
      description: 'Arrastra para ordenar. Muestra las publicaciones en la cuadrícula del celular y en la sección de servicios.',
      of: [defineArrayMember({ type: 'instagramPhonePost' })],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'handle',
      media: 'avatar',
    },
    prepare: ({ title, subtitle, media }) => ({
      title: title || 'Sin nombre',
      subtitle: subtitle ? `@${subtitle}` : 'Sin usuario',
      media,
    }),
  },
});
