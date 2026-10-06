import { DocumentIcon } from '@sanity/icons/Document';
import { defineField, defineType } from 'sanity';
import { seoFields } from './shared';

/** File-based pages that are not landings: diagnóstico. */
export const sitePage = defineType({
  name: 'sitePage',
  title: 'Página',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content', title: 'Contenido', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Etiqueta',
      type: 'string',
      group: 'content',
      description: 'Texto corto encima del título.',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Ruta',
      type: 'slug',
      group: 'content',
      readOnly: true,
      description: 'La ruta ya está publicada. No se cambia desde aquí.',
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return { title: title || 'Página', subtitle: slug ? `/${slug}` : '' };
    },
  },
});
