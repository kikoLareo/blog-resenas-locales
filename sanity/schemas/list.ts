import { defineField, defineType } from 'sanity';

export const list = defineType({
  name: 'list',
  title: 'Lista & Ranking',
  type: 'document',
  icon: () => '📋',
  groups: [
    {
      name: 'basic',
      title: 'Información básica',
    },
    {
      name: 'content',
      title: 'Contenido',
    },
    {
      name: 'venues',
      title: 'Locales',
    },
    {
      name: 'seo',
      title: 'SEO/AEO',
    },
    {
      name: 'settings',
      title: 'Configuración',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título de la lista',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required().min(20).max(120),
      description: 'Ej: "10 mejores tortillas en Madrid (2025)"',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Extracto',
      type: 'text',
      rows: 3,
      group: 'basic',
      validation: (rule) => rule.required().min(120).max(200),
      description: 'Resumen para listados y SEO (120-200 caracteres)',
    }),
    defineField({
      name: 'listType',
      title: 'Tipo de lista',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Top por Plato', value: 'top-dish' },
          { title: 'Comparativa de Barrios', value: 'neighborhood-comparison' },
          { title: 'Por Rango de Precio', value: 'price-range' },
          { title: 'Por Ocasión', value: 'occasion' },
          { title: 'Mejores de la Ciudad', value: 'city-best' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dish',
      title: 'Plato específico',
      type: 'string',
      group: 'basic',
      description: 'Ej: "tortilla española", "pulpo a la gallega"',
      hidden: ({ document }) => document?.listType !== 'top-dish',
    }),
    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'reference',
      to: [{ type: 'city' }],
      group: 'basic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'neighborhoods',
      title: 'Barrios incluidos',
      type: 'array',
      group: 'basic',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      hidden: ({ document }) => document?.listType === 'neighborhood-comparison',
    }),
    defineField({
      name: 'priceRange',
      title: 'Rango de precio',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Económico (0-15€)', value: 'budget' },
          { title: 'Moderado (15-30€)', value: 'moderate' },
          { title: 'Caro (30-50€)', value: 'expensive' },
          { title: 'Lujo (50€+)', value: 'luxury' },
        ],
      },
      hidden: ({ document }) => document?.listType !== 'price-range',
    }),
    defineField({
      name: 'occasion',
      title: 'Ocasión',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Romántico', value: 'romantic' },
          { title: 'Familiar', value: 'family' },
          { title: 'Negocios', value: 'business' },
          { title: 'Celebraciones', value: 'celebration' },
          { title: 'Con amigos', value: 'friends' },
        ],
      },
      hidden: ({ document }) => document?.listType !== 'occasion',
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen principal',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (rule) => rule.required(),
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introduction',
      title: 'Introducción',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'criteria',
      title: 'Criterios de selección',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      validation: (rule) => rule.required().min(3).max(8),
      description: 'Factores considerados para el ranking',
    }),
    defineField({
      name: 'rankedVenues',
      title: 'Locales en ranking',
      type: 'array',
      group: 'venues',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'position',
              title: 'Posición',
              type: 'number',
              validation: (rule) => rule.required().min(1).max(50),
            },
            {
              name: 'venue',
              title: 'Local',
              type: 'reference',
              to: [{ type: 'venue' }],
              validation: (rule) => rule.required(),
            },
            {
              name: 'score',
              title: 'Puntuación',
              type: 'number',
              validation: (rule) => rule.min(0).max(10).precision(1),
              description: 'Puntuación específica para este ranking',
            },
            {
              name: 'highlight',
              title: 'Destacar',
              type: 'string',
              description: 'Qué hace especial a este local',
              validation: (rule) => rule.max(100),
            },
            {
              name: 'bestDish',
              title: 'Plato recomendado',
              type: 'string',
              description: 'Plato específico recomendado',
            },
            {
              name: 'priceNote',
              title: 'Nota de precio',
              type: 'string',
              description: 'Precio específico o rango para el plato',
            },
            {
              name: 'specialNote',
              title: 'Nota especial',
              type: 'text',
              rows: 2,
              description: 'Comentario específico para este ranking',
            },
          ],
          preview: {
            select: {
              position: 'position',
              venue: 'venue.title',
              score: 'score',
              highlight: 'highlight',
            },
            prepare({ position, venue, score, highlight }) {
              return {
                title: `#${position} ${venue || 'Local sin nombre'}`,
                subtitle: `${score ? `⭐ ${score}` : ''} ${highlight || ''}`,
              };
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(5).max(25),
    }),
    defineField({
      name: 'comparisonTable',
      title: 'Tabla comparativa',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'enabled',
          title: 'Mostrar tabla',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'columns',
          title: 'Columnas',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'key',
                  title: 'Clave',
                  type: 'string',
                  validation: (rule) => rule.required(),
                },
                {
                  name: 'label',
                  title: 'Etiqueta',
                  type: 'string',
                  validation: (rule) => rule.required(),
                },
                {
                  name: 'type',
                  title: 'Tipo',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Texto', value: 'text' },
                      { title: 'Precio', value: 'price' },
                      { title: 'Rating', value: 'rating' },
                      { title: 'Booleano', value: 'boolean' },
                    ],
                  },
                  initialValue: 'text',
                },
              ],
            },
          ],
          initialValue: [
            { key: 'price', label: 'Precio', type: 'price' },
            { key: 'rating', label: 'Rating', type: 'rating' },
            { key: 'terrace', label: 'Terraza', type: 'boolean' },
            { key: 'reservation', label: 'Reserva', type: 'boolean' },
          ],
        },
      ],
    }),
    defineField({
      name: 'verdict',
      title: 'Veredicto final',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
      ],
      validation: (rule) => rule.required(),
      description: 'Conclusión y recomendación final',
    }),
    defineField({
      name: 'faq',
      title: 'Preguntas frecuentes',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Pregunta',
              type: 'string',
              validation: (rule) => rule.required().min(10).max(120),
            },
            {
              name: 'answer',
              title: 'Respuesta',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required().min(40).max(200),
            },
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer',
            },
          },
        },
      ],
      validation: (rule) => rule.min(3).max(6),
    }),
    defineField({
      name: 'relatedGuides',
      title: 'Guías relacionadas',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'reference',
          to: [{ type: 'guide' }],
        },
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Título SEO',
      type: 'string',
      group: 'seo',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta descripción',
      type: 'text',
      rows: 2,
      group: 'seo',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'seoKeywords',
      title: 'Keywords',
      type: 'array',
      group: 'seo',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (rule) => rule.max(10),
    }),
    defineField({
      name: 'stats',
      title: 'Estadísticas',
      type: 'object',
      group: 'settings',
      fields: [
        {
          name: 'views',
          title: 'Visualizaciones',
          type: 'number',
          initialValue: 0,
        },
        {
          name: 'shares',
          title: 'Compartidos',
          type: 'number',
          initialValue: 0,
        },
        {
          name: 'bookmarks',
          title: 'Guardados',
          type: 'number',
          initialValue: 0,
        },
      ],
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Última actualización',
      type: 'datetime',
      group: 'settings',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      title: 'Destacar',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'published',
      title: 'Publicado',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      group: 'settings',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      city: 'city.title',
      listType: 'listType',
      media: 'heroImage',
      venues: 'rankedVenues',
    },
    prepare({ title, city, listType, media, venues }) {
      const venueCount = venues?.length || 0;
      
      const typeLabels = {
        'top-dish': '🍽️ Top Plato',
        'neighborhood-comparison': '📍 Barrios',
        'price-range': '💰 Precio',
        'occasion': '🎉 Ocasión',
        'city-best': '⭐ Mejores',
      };

      return {
        title: title || 'Lista sin título',
        subtitle: `${typeLabels[listType as keyof typeof typeLabels] || listType} • ${city} • ${venueCount} locales`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Más reciente',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Última actualización',
      name: 'lastUpdatedDesc',
      by: [{ field: 'lastUpdated', direction: 'desc' }],
    },
    {
      title: 'Por ciudad',
      name: 'cityAsc',
      by: [{ field: 'city.title', direction: 'asc' }],
    },
  ],
});
