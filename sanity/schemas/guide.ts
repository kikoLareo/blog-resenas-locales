import { defineField, defineType } from 'sanity';

export const guide = defineType({
  name: 'guide',
  title: 'Guía & Ruta',
  type: 'document',
  icon: () => '🗺️',
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
      title: 'Título de la guía',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required().min(20).max(120),
      description: 'Ej: "Dónde comer en Malasaña 2025 (mapa + 25 sitios)"',
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
      name: 'type',
      title: 'Tipo de guía',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Guía de Barrio', value: 'neighborhood' },
          { title: 'Ruta Temática', value: 'thematic' },
          { title: 'Por Presupuesto', value: 'budget' },
          { title: 'Por Ocasión', value: 'occasion' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
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
      name: 'neighborhood',
      title: 'Barrio específico',
      type: 'string',
      group: 'basic',
      description: 'Solo para guías de barrio específico',
      hidden: ({ document }) => document?.type !== 'neighborhood',
    }),
    defineField({
      name: 'theme',
      title: 'Tema de la ruta',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Con niños', value: 'con-ninos' },
          { title: 'En grupo', value: 'grupos' },
          { title: 'Económico', value: 'barato' },
          { title: 'Brunch', value: 'brunch' },
          { title: 'Nocturno', value: 'noche' },
          { title: 'Romántico', value: 'romantico' },
          { title: 'Negocios', value: 'negocios' },
          { title: 'Celebraciones', value: 'celebraciones' },
        ],
      },
      hidden: ({ document }) => document?.type === 'neighborhood',
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
        {
          name: 'caption',
          title: 'Pie de foto',
          type: 'string',
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
      name: 'sections',
      title: 'Secciones de la guía',
      type: 'array',
      group: 'venues',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Título de la sección',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'description',
              title: 'Descripción',
              type: 'text',
              rows: 2,
            },
            {
              name: 'venues',
              title: 'Locales',
              type: 'array',
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
                      validation: (rule) => rule.min(1).max(50),
                    },
                    {
                      name: 'highlight',
                      title: 'Destacar',
                      type: 'boolean',
                      initialValue: false,
                    },
                    {
                      name: 'note',
                      title: 'Nota especial',
                      type: 'string',
                      description: 'Comentario específico para este local en la guía',
                    },
                  ],
                  preview: {
                    select: {
                      title: 'venue.title',
                      position: 'position',
                      highlight: 'highlight',
                    },
                    prepare({ title, position, highlight }) {
                      return {
                        title: title || 'Local sin título',
                        subtitle: `#${position}${highlight ? ' ⭐' : ''}`,
                      };
                    },
                  },
                },
              ],
              validation: (rule) => rule.min(3).max(15),
            },
          ],
          preview: {
            select: {
              title: 'sectionTitle',
              venues: 'venues',
            },
            prepare({ title, venues }) {
              const venueCount = venues?.length || 0;
              return {
                title: title || 'Sección sin título',
                subtitle: `${venueCount} locales`,
              };
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1).max(6),
    }),
    defineField({
      name: 'mapData',
      title: 'Configuración del mapa',
      type: 'object',
      group: 'venues',
      fields: [
        {
          name: 'center',
          title: 'Centro del mapa',
          type: 'geopoint',
          validation: (rule) => rule.required(),
        },
        {
          name: 'zoom',
          title: 'Nivel de zoom',
          type: 'number',
          initialValue: 14,
          validation: (rule) => rule.min(10).max(18),
        },
        {
          name: 'showFilters',
          title: 'Mostrar filtros',
          type: 'boolean',
          initialValue: true,
        },
      ],
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
              rows: 3,
              validation: (rule) => rule.required().min(50).max(300),
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
      validation: (rule) => rule.min(3).max(8),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Título SEO',
      type: 'string',
      group: 'seo',
      validation: (rule) => rule.max(60),
      description: 'Si está vacío, se usará el título principal',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta descripción',
      type: 'text',
      rows: 2,
      group: 'seo',
      validation: (rule) => rule.max(160),
      description: 'Si está vacía, se usará el extracto',
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
      name: 'nextReview',
      title: 'Próxima revisión',
      type: 'date',
      group: 'settings',
      description: 'Fecha planificada para la próxima actualización',
    }),
    defineField({
      name: 'featured',
      title: 'Destacar',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Mostrar en homepage y secciones destacadas',
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
      type: 'type',
      media: 'heroImage',
      venuesCount: 'sections',
    },
    prepare({ title, city, type, media, venuesCount }) {
      const totalVenues = venuesCount?.reduce((acc: number, section: any) => {
        return acc + (section.venues?.length || 0);
      }, 0) || 0;
      
      const typeLabels = {
        neighborhood: '📍 Barrio',
        thematic: '🎯 Temática',
        budget: '💰 Presupuesto',
        occasion: '🎉 Ocasión',
      };

      return {
        title: title || 'Guía sin título',
        subtitle: `${typeLabels[type as keyof typeof typeLabels] || type} • ${city} • ${totalVenues} locales`,
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
