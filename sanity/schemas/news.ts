import { defineField, defineType } from 'sanity';

export const news = defineType({
  name: 'news',
  title: 'Novedades & Tendencias',
  type: 'document',
  icon: () => '📰',
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
      title: 'Título de la noticia',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required().min(20).max(120),
      description: 'Ej: "Nuevas aperturas en Madrid – Septiembre 2025"',
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
      validation: (rule) => rule.required().min(100).max(200),
      description: 'Resumen para listados y SEO',
    }),
    defineField({
      name: 'newsType',
      title: 'Tipo de noticia',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Aperturas', value: 'aperturas' },
          { title: 'Pop-ups', value: 'pop-ups' },
          { title: 'Temporada', value: 'temporada' },
          { title: 'Eventos', value: 'eventos' },
          { title: 'Tendencias', value: 'tendencias' },
          { title: 'Cierres', value: 'cierres' },
        ],
        layout: 'dropdown',
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
      name: 'content',
      title: 'Contenido de la noticia',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: (rule) => rule.required(),
                  },
                  {
                    title: 'Abrir en nueva pestaña',
                    name: 'blank',
                    type: 'boolean',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
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
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'venues',
      title: 'Locales mencionados',
      type: 'array',
      group: 'content',
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
              name: 'status',
              title: 'Estado',
              type: 'string',
              options: {
                list: [
                  { title: 'Próxima apertura', value: 'opening-soon' },
                  { title: 'Recién abierto', value: 'newly-opened' },
                  { title: 'Pop-up temporal', value: 'popup' },
                  { title: 'Cierre temporal', value: 'temporary-closure' },
                  { title: 'Cerrado definitivamente', value: 'closed' },
                  { title: 'Renovación', value: 'renovation' },
                ],
              },
            },
            {
              name: 'note',
              title: 'Nota específica',
              type: 'string',
              description: 'Información específica sobre este local en la noticia',
            },
            {
              name: 'openingDate',
              title: 'Fecha de apertura',
              type: 'date',
              hidden: ({ parent }) => !['opening-soon', 'newly-opened'].includes(parent?.status),
            },
            {
              name: 'closingDate',
              title: 'Fecha de cierre',
              type: 'date',
              hidden: ({ parent }) => !['popup', 'temporary-closure', 'closed'].includes(parent?.status),
            },
          ],
          preview: {
            select: {
              venue: 'venue.title',
              status: 'status',
              note: 'note',
            },
            prepare({ venue, status, note }) {
              const statusEmoji = {
                'opening-soon': '🔜',
                'newly-opened': '🆕',
                'popup': '⏰',
                'temporary-closure': '⏸️',
                'closed': '❌',
                'renovation': '🔧',
              };
              
              return {
                title: `${statusEmoji[status as keyof typeof statusEmoji] || ''} ${venue || 'Local sin nombre'}`,
                subtitle: note || status,
              };
            },
          },
        },
      ],
      validation: (rule) => rule.min(1).max(15),
    }),
    defineField({
      name: 'eventDate',
      title: 'Fecha del evento',
      type: 'date',
      group: 'basic',
      description: 'Fecha específica si es un evento',
      hidden: ({ document }) => document?.newsType !== 'eventos',
    }),
    defineField({
      name: 'eventTime',
      title: 'Hora del evento',
      type: 'string',
      group: 'basic',
      description: 'Hora específica del evento',
      hidden: ({ document }) => document?.newsType !== 'eventos',
    }),
    defineField({
      name: 'location',
      title: 'Ubicación del evento',
      type: 'string',
      group: 'basic',
      description: 'Dirección específica del evento',
      hidden: ({ document }) => document?.newsType !== 'eventos',
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      group: 'basic',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'relatedNews',
      title: 'Noticias relacionadas',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'reference',
          to: [{ type: 'news' }],
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
      name: 'keywords',
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
      name: 'featured',
      title: 'Noticia destacada',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Mostrar en homepage y secciones destacadas',
    }),
    defineField({
      name: 'urgent',
      title: 'Urgente',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Noticia de última hora',
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
    defineField({
      name: 'expiresAt',
      title: 'Fecha de expiración',
      type: 'date',
      group: 'settings',
      description: 'Fecha después de la cual la noticia ya no es relevante',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      newsType: 'newsType',
      city: 'city.title',
      featured: 'featured',
      urgent: 'urgent',
      media: 'heroImage',
    },
    prepare({ title, newsType, city, featured, urgent, media }) {
      const typeEmoji = {
        aperturas: '🆕',
        'pop-ups': '⏰',
        temporada: '🍂',
        eventos: '🎉',
        tendencias: '📈',
        cierres: '🔒',
      };

      const badges = [];
      if (urgent) badges.push('🚨');
      if (featured) badges.push('⭐');

      return {
        title: `${badges.join(' ')} ${title || 'Noticia sin título'}`,
        subtitle: `${typeEmoji[newsType as keyof typeof typeEmoji] || ''} ${newsType} • ${city}`,
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
      title: 'Por urgencia',
      name: 'urgentFirst',
      by: [
        { field: 'urgent', direction: 'desc' },
        { field: 'publishedAt', direction: 'desc' },
      ],
    },
    {
      title: 'Por ciudad',
      name: 'cityAsc',
      by: [{ field: 'city.title', direction: 'asc' }],
    },
  ],
});
