import { HelpCircleIcon } from '@sanity/icons/HelpCircle';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'Preguntas frecuentes (FAQ)',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título (opcional)',
      type: 'string',
      initialValue: 'Preguntas frecuentes',
    }),
    defineField({
      name: 'description',
      title: 'Descripción (opcional)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'items',
      title: 'Preguntas y respuestas',
      type: 'array',
      of: [defineArrayMember({ type: 'faqItem' })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: title || 'Preguntas frecuentes',
        subtitle: `${count} pregunta${count === 1 ? '' : 's'}`,
        media: HelpCircleIcon,
      };
    },
  },
});
