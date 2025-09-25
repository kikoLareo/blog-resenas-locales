import { defineType, defineField } from 'sanity';

export const homepageSection = defineType({
  name: 'homepageSection',
  title: 'Sección de Página Principal',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título de la Sección',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Nombre identificativo de la sección (ej: "Hero", "Trending", "Top Rated")'
    }),
    defineField({
      name: 'sectionType',
      title: 'Tipo de Sección',
      type: 'string',
      options: {
        list: [
          { title: 'Hero Principal', value: 'hero' },
          { title: 'Reseñas Trending', value: 'trending' },
          { title: 'Mejor Valoradas', value: 'topRated' },
          { title: 'Newsletter CTA', value: 'newsletter' },
          { title: 'Sección Personalizada', value: 'custom' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isEnabled',
      title: 'Sección Activa',
      type: 'boolean',
      initialValue: true,
      description: 'Desactiva esta sección para ocultarla del homepage'
    }),
    defineField({
      name: 'order',
      title: 'Orden de Aparición',
      type: 'number',
      validation: Rule => Rule.required().min(0),
      description: 'Número que determina el orden (0 = primero, 1 = segundo, etc.)'
    }),
    defineField({
      name: 'displayTitle',
      title: 'Título Mostrado',
      type: 'string',
      description: 'Título que se muestra al usuario (opcional, algunos tipos no lo usan)'
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'text',
      rows: 2,
      description: 'Texto descriptivo bajo el título'
    }),
    defineField({
      name: 'maxItems',
      title: 'Máximo de Elementos',
      type: 'number',
      initialValue: 6,
      description: 'Número máximo de elementos a mostrar en esta sección'
    }),
    defineField({
      name: 'contentSource',
      title: 'Fuente del Contenido',
      type: 'string',
      options: {
        list: [
          { title: 'Automático (por rating/fecha)', value: 'auto' },
          { title: 'Selección Manual', value: 'manual' },
          { title: 'Contenido Destacado', value: 'featured' }
        ]
      },
      initialValue: 'auto',
      hidden: ({ document }) => {
        const sectionType = document?.sectionType as string;
        return !['trending', 'topRated', 'custom'].includes(sectionType);
      }
    }),
    defineField({
      name: 'manualContent',
      title: 'Contenido Seleccionado',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'review' },
            { type: 'venue' },
            { type: 'post' }
          ]
        }
      ],
      hidden: ({ document }) => {
        const contentSource = document?.contentSource as string;
        return contentSource !== 'manual';
      }
    }),
    defineField({
      name: 'filterCriteria',
      title: 'Criterios de Filtrado',
      type: 'object',
      fields: [
        {
          name: 'cities',
          title: 'Filtrar por Ciudades',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'city' }] }]
        },
        {
          name: 'categories',
          title: 'Filtrar por Categorías',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'category' }] }]
        },
        {
          name: 'minRating',
          title: 'Rating Mínimo',
          type: 'number',
          validation: Rule => Rule.min(0).max(5)
        }
      ],
      hidden: ({ document }) => {
        const contentSource = document?.contentSource as string;
        return contentSource !== 'auto';
      }
    }),
    defineField({
      name: 'styling',
      title: 'Configuración Visual',
      type: 'object',
      fields: [
        {
          name: 'backgroundColor',
          title: 'Color de Fondo',
          type: 'string',
          options: {
            list: [
              { title: 'Blanco', value: 'white' },
              { title: 'Gris Claro', value: 'gray-50' },
              { title: 'Gris Medio', value: 'gray-100' }
            ]
          },
          initialValue: 'white'
        },
        {
          name: 'layout',
          title: 'Diseño de la Sección',
          type: 'string',
          options: {
            list: [
              { title: 'Grid 2 Columnas', value: 'grid-2' },
              { title: 'Grid 3 Columnas', value: 'grid-3' },
              { title: 'Lista Vertical', value: 'list' },
              { title: 'Carrusel', value: 'carousel' }
            ]
          },
          initialValue: 'grid-3'
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      sectionType: 'sectionType',
      order: 'order',
      isEnabled: 'isEnabled'
    },
    prepare({ title, sectionType, order, isEnabled }) {
      return {
        title: `${order}. ${title}`,
        subtitle: `${sectionType} - ${isEnabled ? '✅ Activa' : '❌ Inactiva'}`,
        media: isEnabled ? '✅' : '❌'
      }
    }
  },
  orderings: [
    {
      title: 'Por Orden',
      name: 'order',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]
});
