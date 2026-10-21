import { MobileDeviceIcon } from '@sanity/icons/MobileDevice';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { headingTitleField, headingWidthField, imageWithAlt } from '../shared';

const postKinds = [
  { title: 'Foto', value: 'photo' },
  { title: 'Carrusel', value: 'carousel' },
  { title: 'Reel', value: 'reel' },
];

export const instagramPhonePost = defineType({
  name: 'instagramPhonePost',
  title: 'Publicación',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Tipo',
      type: 'string',
      options: { list: postKinds, layout: 'radio' },
      initialValue: 'photo',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.kind !== 'photo',
      fields: [defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' })],
      validation: (rule) =>
        rule.custom((image, context) => {
          const kind = (context.parent as { kind?: string } | undefined)?.kind;
          if (kind === 'photo' && !image) return 'Sube la foto';
          return true;
        }),
    }),
    defineField({
      name: 'slides',
      title: 'Fotos del carrusel',
      type: 'array',
      description: 'El orden de esta lista es el orden del carrusel.',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [
        defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
      ] })],
      hidden: ({ parent }) => parent?.kind !== 'carousel',
      validation: (rule) =>
        rule.custom((slides, context) => {
          const kind = (context.parent as { kind?: string } | undefined)?.kind;
          if (kind !== 'carousel') return true;
          if (!Array.isArray(slides) || slides.length < 2) return 'Un carrusel lleva al menos 2 fotos';
          return true;
        }),
    }),
    defineField({
      name: 'poster',
      title: 'Portada del reel',
      type: 'image',
      description: 'La miniatura de la cuadrícula.',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.kind !== 'reel',
      fields: [defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' })],
    }),
    defineField({
      name: 'video',
      title: 'Reel',
      type: 'file',
      description: 'MP4 o WebM, corto. Se reproduce al abrir la publicación.',
      options: { accept: 'video/mp4,video/webm' },
      hidden: ({ parent }) => parent?.kind !== 'reel',
    }),
    defineField({
      name: 'caption',
      title: 'Pie de foto',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { kind: 'kind', caption: 'caption', image: 'image', poster: 'poster', slide: 'slides.0' },
    prepare: ({ kind, caption, image, poster, slide }) => ({
      title: caption || (kind === 'carousel' ? 'Carrusel' : kind === 'reel' ? 'Reel' : 'Foto'),
      subtitle: kind === 'carousel' ? 'Carrusel' : kind === 'reel' ? 'Reel' : 'Foto',
      media: kind === 'reel' ? poster : kind === 'carousel' ? slide : image,
    }),
  },
});

export const instagramPhone = defineType({
  name: 'instagramPhone',
  title: 'Perfil de Instagram',
  type: 'object',
  icon: MobileDeviceIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Badge', type: 'string' }),
    headingTitleField(),
    headingWidthField(),
    defineField({ name: 'description', title: 'Párrafo', type: 'text', rows: 3 }),
    defineField({
      name: 'tone',
      title: 'Fondo',
      type: 'string',
      options: {
        list: [
          { title: 'Canvas', value: 'canvas' },
          { title: 'Surface', value: 'surface' },
        ],
        layout: 'radio',
      },
      initialValue: 'canvas',
    }),
    defineField({
      name: 'brandId',
      title: 'Identificador de Marca / Caso',
      type: 'string',
      description:
        'Opcional (ej: gaios, el-secreto, paulos-pizza, zapateria-la-peninsula, peninsula-project, happy-store). Si se deja vacío, toma automáticamente la marca del caso de éxito actual.',
    }),
    defineField({
      name: 'username',
      title: 'Usuario',
      type: 'string',
    }),
    defineField({
      name: 'displayName',
      title: 'Nombre',
      type: 'string',
      description: 'Va debajo de la foto, en negrita. Es distinto del usuario.',
    }),
    defineField({
      name: 'bio',
      title: 'Biografía',
      type: 'text',
      rows: 3,
    }),
    imageWithAlt({ name: 'avatar', title: 'Foto de perfil' }),
    defineField({
      name: 'stats',
      title: 'Cifras',
      type: 'array',
      description: 'Hasta 3. Van a la derecha de la foto de perfil.',
      validation: (rule) => rule.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Número', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'label', title: 'Etiqueta', type: 'string', validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
    defineField({
      name: 'posts',
      title: 'Publicaciones',
      type: 'array',
      description: 'Arrastra para cambiar el orden. El feed las muestra de izquierda a derecha y de arriba hacia abajo.',
      of: [defineArrayMember({ type: 'instagramPhonePost' })],
    }),
  ],
  preview: {
    select: { title: 'title', username: 'username' },
    prepare: ({ title, username }: { title?: string; username?: string }) => ({
      title: title || username || 'Perfil de Instagram',
      subtitle: 'Celular',
    }),
  },
});
