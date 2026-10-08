import { ImagesIcon } from '@sanity/icons/Images';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const ctaBackdrop = defineType({
  name: 'ctaBackdrop',
  title: 'Cierre',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Imágenes de fondo',
      type: 'array',
      description:
        'Las fotos del marquee del cierre, en todas las páginas. El orden de la lista es el orden en el sitio, de arriba a abajo. Si la lista queda vacía, se usan las fotos actuales. El texto de esta sección se edita en cada página.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              description: 'Las fotos son decorativas. El alt puede quedar vacío.',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Cierre', subtitle: 'Imágenes de fondo' };
    },
  },
});
