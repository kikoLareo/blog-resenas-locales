import { defineField, defineType } from 'sanity';

export const offer = defineType({
  name: 'offer',
  title: 'Ofertas & Menús',
  type: 'document',
  icon: () => '💰',
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
      title: 'Título de la oferta',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required().min(20).max(120),
      description: 'Ej: "Menús del día en Malasaña: 10 opciones bajo 15€"',
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
      name: 'offerType',
      title: 'Tipo de oferta',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Menú del día', value: 'menu-dia' },
          { title: 'Brunch', value: 'brunch' },
          { title: 'Menú degustación', value: 'degustacion' },
          { title: 'Happy hour', value: 'happy-hour' },
          { title: 'Descuento especial', value: 'descuento' },
          { title: 'Promoción temporal', value: 'promocion' },
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
      name: 'neighborhood',
      title: 'Barrio específico',
      type: 'string',
      group: 'basic',
      description: 'Barrio si la oferta es específica de una zona',
    }),
    defineField({
      name: 'priceRange',
      title: 'Rango de precios',
      type: 'object',
      group: 'basic',
      fields: [
        {
          name: 'min',
          title: 'Precio mínimo',
          type: 'number',
          validation: (rule) => rule.required().min(0),
        },
        {
          name: 'max',
          title: 'Precio máximo',
          type: 'number',
          validation: (rule) => rule.required().min(0),
        },
        {
          name: 'currency',
          title: 'Moneda',
          type: 'string',
          initialValue: 'EUR',
          options: {
            list: [
              { title: 'Euro (€)', value: 'EUR' },
              { title: 'Dólar ($)', value: 'USD' },
            ],
          },
        },
      ],
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
      name: 'venuesWithOffers',
      title: 'Locales con ofertas',
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
              name: 'offerTitle',
              title: 'Título de la oferta',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'Nombre específico de la oferta en este local',
            },
            {
              name: 'price',
              title: 'Precio',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            },
            {
              name: 'originalPrice',
              title: 'Precio original',
              type: 'number',
              description: 'Solo si hay descuento',
            },
            {
              name: 'description',
              title: 'Descripción de la oferta',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            },
            {
              name: 'includes',
              title: 'Qué incluye',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Elementos incluidos en la oferta',
            },
            {
              name: 'conditions',
              title: 'Condiciones',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Condiciones específicas de la oferta',
            },
            {
              name: 'schedule',
              title: 'Horario de la oferta',
              type: 'object',
              fields: [
                {
                  name: 'days',
                  title: 'Días',
                  type: 'array',
                  of: [{ type: 'string' }],
                  options: {
                    list: [
                      'Lunes', 'Martes', 'Miércoles', 'Jueves',
                      'Viernes', 'Sábado', 'Domingo'
                    ],
                    layout: 'tags',
                  },
                },
                {
                  name: 'timeStart',
                  title: 'Hora inicio',
                  type: 'string',
                  description: 'Formato: HH:MM',
                },
                {
                  name: 'timeEnd',
                  title: 'Hora fin',
                  type: 'string',
                  description: 'Formato: HH:MM',
                },
              ],
            },
            {
              name: 'highlight',
              title: 'Destacar',
              type: 'boolean',
              initialValue: false,
              description: 'Destacar esta oferta',
            },
            {
              name: 'image',
              title: 'Imagen de la oferta',
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
              venue: 'venue.title',
              offerTitle: 'offerTitle',
              price: 'price',
              highlight: 'highlight',
            },
            prepare({ venue, offerTitle, price, highlight }) {
              return {
                title: `${highlight ? '⭐ ' : ''}${venue || 'Local sin nombre'}`,
                subtitle: `${offerTitle} - ${price}€`,
              };
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(3).max(20),
    }),
    defineField({
      name: 'validFrom',
      title: 'Válido desde',
      type: 'date',
      group: 'basic',
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'validUntil',
      title: 'Válido hasta',
      type: 'date',
      group: 'basic',
      validation: (rule) => rule.required(),
      description: 'Fecha de expiración de la oferta',
    }),
    defineField({
      name: 'recurring',
      title: 'Oferta recurrente',
      type: 'object',
      group: 'basic',
      fields: [
        {
          name: 'isRecurring',
          title: 'Es recurrente',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'frequency',
          title: 'Frecuencia',
          type: 'string',
          options: {
            list: [
              { title: 'Diaria', value: 'daily' },
              { title: 'Semanal', value: 'weekly' },
              { title: 'Mensual', value: 'monthly' },
            ],
          },
          hidden: ({ parent }) => !parent?.isRecurring,
        },
      ],
    }),
    defineField({
      name: 'generalConditions',
      title: 'Condiciones generales',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: 'Condiciones que aplican a todas las ofertas',
    }),
    defineField({
      name: 'conclusion',
      title: 'Conclusión',
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
      description: 'Conclusión y recomendaciones finales',
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
          name: 'clicks',
          title: 'Clicks',
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
      offerType: 'offerType',
      city: 'city.title',
      priceRange: 'priceRange',
      validUntil: 'validUntil',
      media: 'heroImage',
    },
    prepare({ title, offerType, city, priceRange, validUntil, media }) {
      const typeEmoji = {
        'menu-dia': '🍽️',
        'brunch': '🥐',
        'degustacion': '👨‍🍳',
        'happy-hour': '🍻',
        'descuento': '💸',
        'promocion': '🎯',
      };

      const isExpiringSoon = validUntil && new Date(validUntil) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const expiredFlag = isExpiringSoon ? '⏰ ' : '';

      return {
        title: `${expiredFlag}${title || 'Oferta sin título'}`,
        subtitle: `${typeEmoji[offerType as keyof typeof typeEmoji] || ''} ${offerType} • ${city} • ${priceRange?.min}-${priceRange?.max}€`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Expira pronto',
      name: 'validUntilAsc',
      by: [{ field: 'validUntil', direction: 'asc' }],
    },
    {
      title: 'Más reciente',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Por ciudad',
      name: 'cityAsc',
      by: [{ field: 'city.title', direction: 'asc' }],
    },
  ],
});
