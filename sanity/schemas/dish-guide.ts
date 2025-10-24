import { defineField, defineType } from 'sanity';

export const dishGuide = defineType({
  name: 'dish-guide',
  title: 'Guía de Plato',
  type: 'document',
  icon: () => '🍽️',
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
      title: 'Dónde probarlo',
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
      title: 'Título de la guía',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required().min(20).max(120),
      description: 'Ej: "Qué es la zorza y dónde comerla en A Coruña"',
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
      name: 'dishName',
      title: 'Nombre del plato',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required().min(2).max(50),
      description: 'Nombre específico del plato',
    }),
    defineField({
      name: 'excerpt',
      title: 'Extracto',
      type: 'text',
      rows: 3,
      group: 'basic',
      validation: (rule) => rule.required().min(100).max(200),
      description: 'Resumen para listados y SEO',
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen principal',
      type: 'image',
      group: 'basic',
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
      name: 'origin',
      title: 'Origen e historia',
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
      description: 'Historia y origen del plato',
    }),
    defineField({
      name: 'description',
      title: 'Qué es y características',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
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
      description: 'Descripción detallada del plato',
    }),
    defineField({
      name: 'howToEat',
      title: 'Cómo se come/pide',
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
      description: 'Instrucciones sobre cómo comer o pedir el plato',
    }),
    defineField({
      name: 'variations',
      title: 'Variantes regionales',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'region',
              title: 'Región',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'name',
              title: 'Nombre de la variante',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'description',
              title: 'Descripción',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            },
            {
              name: 'image',
              title: 'Imagen',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Texto alternativo',
                  type: 'string',
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'region',
              media: 'image',
            },
          },
        },
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredientes principales',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      validation: (rule) => rule.required().min(3).max(15),
      description: 'Ingredientes típicos del plato',
    }),
    defineField({
      name: 'seasonality',
      title: 'Temporalidad',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'hasSeason',
          title: 'Tiene temporada específica',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'season',
          title: 'Temporada',
          type: 'string',
          options: {
            list: [
              { title: 'Primavera', value: 'spring' },
              { title: 'Verano', value: 'summer' },
              { title: 'Otoño', value: 'autumn' },
              { title: 'Invierno', value: 'winter' },
            ],
          },
          hidden: ({ parent }) => !parent?.hasSeason,
        },
        {
          name: 'months',
          title: 'Meses específicos',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
              'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ],
            layout: 'tags',
          },
          hidden: ({ parent }) => !parent?.hasSeason,
        },
        {
          name: 'note',
          title: 'Nota sobre temporalidad',
          type: 'string',
          hidden: ({ parent }) => !parent?.hasSeason,
        },
      ],
    }),
    defineField({
      name: 'bestVenues',
      title: 'Mejores sitios para probarlo',
      type: 'array',
      group: 'venues',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'venue',
              title: 'Local',
              type: 'reference',
              to: [{ type: 'venue' }],
              validation: (rule) => rule.required(),
            },
            {
              name: 'position',
              title: 'Posición en ranking',
              type: 'number',
              validation: (rule) => rule.min(1).max(10),
            },
            {
              name: 'specialNote',
              title: 'Nota especial',
              type: 'string',
              description: 'Qué hace especial este sitio para este plato',
            },
            {
              name: 'price',
              title: 'Precio aproximado',
              type: 'string',
              description: 'Precio específico para este plato',
            },
          ],
          preview: {
            select: {
              venue: 'venue.title',
              position: 'position',
              note: 'specialNote',
            },
            prepare({ venue, position, note }) {
              return {
                title: `#${position || '?'} ${venue || 'Local sin nombre'}`,
                subtitle: note || '',
              };
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(3).max(10),
    }),
    defineField({
      name: 'relatedRecipes',
      title: 'Recetas relacionadas',
      type: 'array',
      group: 'venues',
      of: [
        {
          type: 'reference',
          to: [{ type: 'recipe' }],
        },
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'relatedLists',
      title: 'Listas relacionadas',
      type: 'array',
      group: 'venues',
      of: [
        {
          type: 'reference',
          to: [{ type: 'list' }],
        },
      ],
      validation: (rule) => rule.max(3),
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
      dishName: 'dishName',
      venues: 'bestVenues',
      media: 'heroImage',
    },
    prepare({ title, dishName, venues, media }) {
      const venueCount = venues?.length || 0;
      
      return {
        title: title || dishName || 'Guía sin título',
        subtitle: `🍽️ ${dishName} • ${venueCount} sitios recomendados`,
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
      title: 'Por plato',
      name: 'dishNameAsc',
      by: [{ field: 'dishName', direction: 'asc' }],
    },
  ],
});
