import { defineArrayMember, defineField, defineType, type ReferenceFilterResolver } from 'sanity';
import { imageWithAlt } from './shared';

type SectionWithLocale = { _key?: string; memberLocale?: string };

/** Limits a person picker to the language chosen on the Equipo section. */
export const personLocaleFilter: ReferenceFilterResolver = ({ document, parentPath }) => {
  const sections = (document.sections as SectionWithLocale[] | undefined) ?? [];
  const section = sections.find((item) =>
    parentPath.some(
      (part) => part && typeof part === 'object' && '_key' in part && part._key === item._key,
    ),
  );
  const locale = section?.memberLocale === 'en' ? 'en' : 'es';
  return {
    filter: `!(_id in path("drafts.**")) && (
      coalesce(locale, "es") == $locale ||
      (
        $locale == "en" &&
        coalesce(locale, "es") == "es" &&
        count(*[_type == "person" && !(_id in path("drafts.**")) && coalesce(locale, "es") == "en"]) == 0
      )
    )`,
    params: { locale },
  };
}

export function personReferenceMember() {
  return defineArrayMember({
    type: 'reference',
    to: [{ type: 'person' }],
    options: { disableNew: true, filter: personLocaleFilter },
  });
}

export const person = defineType({
  name: 'person',
  title: 'Persona',
  type: 'document',
  fields: [
    defineField({
      name: 'locale',
      title: 'Idioma',
      type: 'string',
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
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Cargo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
    }),
    imageWithAlt({ name: 'photo', title: 'Foto' }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Web', value: 'web' },
          { title: 'Redes', value: 'redes' },
          { title: 'Diseño', value: 'diseno' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'accent',
      title: 'Acento',
      type: 'string',
      options: {
        list: [
          { title: 'Cyan', value: 'cyan' },
          { title: 'Purple', value: 'purple' },
          { title: 'Orange', value: 'orange' },
          { title: 'Lime', value: 'lime' },
        ],
      },
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'socials',
      title: 'Redes',
      type: 'object',
      fields: [
        defineField({ name: 'tiktok', title: 'TikTok', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Orden',
      name: 'ordenAsc',
      by: [{ field: 'orden', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', role: 'role', locale: 'locale', media: 'photo' },
    prepare: ({ title, role, locale, media }) => ({
      title: title || 'Persona',
      subtitle: [locale === 'en' ? 'English' : 'Español', role].filter(Boolean).join(' · '),
      media,
    }),
  },
});
