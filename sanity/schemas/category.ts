import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre de la Categoría',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(50),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      description: 'Descripción de la categoría para SEO',
    }),
    defineField({
      name: 'icon',
      title: 'Icono/Emoji',
      type: 'string',
      validation: (Rule) => Rule.max(10),
      description: 'Emoji o icono representativo (ej: 🍕, 🍣, ☕)',
    }),
    defineField({
      name: 'color',
      title: 'Color Representativo',
      type: 'string',
      options: {
        list: [
          { title: 'Rojo', value: 'red' },
          { title: 'Azul', value: 'blue' },
          { title: 'Verde', value: 'green' },
          { title: 'Naranja', value: 'orange' },
          { title: 'Púrpura', value: 'purple' },
          { title: 'Rosa', value: 'pink' },
          { title: 'Amarillo', value: 'yellow' },
          { title: 'Gris', value: 'gray' },
        ],
        layout: 'radio',
      },
      initialValue: 'red',
    }),
    defineField({
      name: 'featured',
      title: 'Categoría Destacada',
      type: 'boolean',
      initialValue: false,
      description: 'Mostrar en homepage y navegación principal',
    }),
    defineField({
      name: 'seoTitle',
      title: 'Título SEO',
      type: 'string',
      validation: (Rule) => Rule.max(60),
      description: 'Título optimizado para buscadores',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(160),
      description: 'Descripción para buscadores (máx. 160 caracteres)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      icon: 'icon',
      featured: 'featured',
    },
    prepare(selection) {
      const { title, subtitle, icon, featured } = selection;
      return {
        title: `${icon || '🏷️'} ${title}`,
        subtitle: `${featured ? '⭐ DESTACADA • ' : ''}${subtitle || 'Sin descripción'}`,
      };
    },
  },
  orderings: [
    {
      title: 'Nombre A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Destacadas primero',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
});
