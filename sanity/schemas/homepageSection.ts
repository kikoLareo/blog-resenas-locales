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
      description: 'Nombre identificativo de la sección (ej: "Hero Principal", "Mejores Reseñas")'
    }),
    defineField({
      name: 'sectionType',
      title: 'Tipo de Sección',
      type: 'string',
      options: {
        list: [
          { title: 'Hero Principal', value: 'hero' },
          { title: 'Hero Clásico (Carousel)', value: 'hero-v3' },
          { title: 'Poster Clásico', value: 'poster' },
          { title: 'Poster Moderno', value: 'poster-v2' },
          { title: 'Banner Horizontal', value: 'banner' },
          { title: 'Cards Cuadrados', value: 'card-square' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'enabled',
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
      name: 'config',
      title: 'Configuración de la Sección',
      type: 'object',
      fields: [
        {
          name: 'displayTitle',
          title: 'Título Mostrado',
          type: 'string',
          description: 'Título que se muestra al usuario'
        },
        {
          name: 'subtitle',
          title: 'Subtítulo',
          type: 'text',
          rows: 2,
          description: 'Texto descriptivo bajo el título'
        },
        {
          name: 'contentTypes',
          title: 'Tipos de Contenido',
          type: 'array',
          of: [{
            type: 'string',
            options: {
              list: [
                { title: 'Locales', value: 'venue' },
                { title: 'Reseñas', value: 'review' },
                { title: 'Categorías', value: 'category' },
                { title: 'Ciudades', value: 'city' }
              ]
            }
          }],
          validation: Rule => Rule.required().min(1),
          description: 'Tipos de contenido que pueden aparecer en esta sección'
        },
        {
          name: 'selectedItems',
          title: 'Elementos Seleccionados',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'type',
                title: 'Tipo',
                type: 'string',
                options: {
                  list: [
                    { title: 'Local', value: 'venue' },
                    { title: 'Reseña', value: 'review' },
                    { title: 'Categoría', value: 'category' },
                    { title: 'Ciudad', value: 'city' }
                  ]
                },
                validation: Rule => Rule.required()
              },
              {
                name: 'id',
                title: 'ID del Elemento',
                type: 'string',
                validation: Rule => Rule.required(),
                description: 'ID del elemento en Sanity'
              },
              {
                name: 'title',
                title: 'Título',
                type: 'string',
                description: 'Título del elemento (se rellena automáticamente)'
              }
            ],
            preview: {
              select: {
                title: 'title',
                type: 'type'
              },
              prepare({ title, type }) {
                return {
                  title: title || 'Sin título',
                  subtitle: type
                }
              }
            }
          }],
          description: 'Lista específica de elementos a mostrar en esta sección'
        }
      ]
    }),

  ],
  preview: {
    select: {
      title: 'title',
      sectionType: 'sectionType',
      order: 'order',
      enabled: 'enabled'
    },
    prepare({ title, sectionType, order, enabled }) {
      return {
        title: `${order}. ${title}`,
        subtitle: `${sectionType} - ${enabled ? '✅ Activa' : '❌ Inactiva'}`,
        media: enabled ? '✅' : '❌'
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
