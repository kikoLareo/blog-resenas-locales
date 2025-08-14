import { defineField, defineType } from 'sanity';

export const venue = defineType({
  name: 'venue',
  title: 'Local',
  type: 'document',
  icon: () => '🏪',
  groups: [
    {
      name: 'basic',
      title: 'Información básica',
    },
    {
      name: 'location',
      title: 'Ubicación',
    },
    {
      name: 'contact',
      title: 'Contacto',
    },
    {
      name: 'media',
      title: 'Imágenes',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre del local',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required().min(2).max(100),
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
      name: 'city',
      title: 'Ciudad',
      type: 'reference',
      to: [{ type: 'city' }],
      group: 'location',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Dirección',
      type: 'string',
      group: 'location',
      validation: (rule) => rule.required().min(5),
    }),
    defineField({
      name: 'postalCode',
      title: 'Código postal',
      type: 'string',
      group: 'location',
      validation: (rule) => rule.regex(/^\d{5}$/, 'Debe ser un código postal válido (5 dígitos)'),
    }),
    defineField({
      name: 'geo',
      title: 'Coordenadas GPS',
      type: 'object',
      group: 'location',
      fields: [
        {
          name: 'lat',
          title: 'Latitud',
          type: 'number',
          validation: (rule) => rule.required().min(-90).max(90),
        },
        {
          name: 'lng',
          title: 'Longitud',
          type: 'number',
          validation: (rule) => rule.required().min(-180).max(180),
        },
      ],
      options: {
        collapsible: true,
      },
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.regex(/^(\+34|0034|34)?[6789]\d{8}$/, 'Formato de teléfono español válido'),
    }),
    defineField({
      name: 'website',
      title: 'Sitio web',
      type: 'url',
      group: 'contact',
    }),
    defineField({
      name: 'openingHours',
      title: 'Horarios de apertura',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'contact',
      description: 'Formato: "Mo-Fr 10:00-22:00", "Sa 10:00-24:00"',
      validation: (rule) => rule.max(7),
    }),
    defineField({
      name: 'priceRange',
      title: 'Rango de precios',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Económico (€)', value: '€' },
          { title: 'Moderado (€€)', value: '€€' },
          { title: 'Caro (€€€)', value: '€€€' },
          { title: 'Muy caro (€€€€)', value: '€€€€' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      group: 'basic',
      validation: (rule) => rule.required().min(1).max(3),
    }),
    defineField({
      name: 'schemaType',
      title: 'Tipo de negocio (Schema.org)',
      type: 'string',
      group: 'seo',
      options: {
        list: [
          { title: 'Restaurante', value: 'Restaurant' },
          { title: 'Cafetería', value: 'CafeOrCoffeeShop' },
          { title: 'Bar/Pub', value: 'BarOrPub' },
          { title: 'Negocio local', value: 'LocalBusiness' },
        ],
        layout: 'radio',
      },
      initialValue: 'Restaurant',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Galería de imágenes',
      type: 'array',
      of: [
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
      group: 'media',
      validation: (rule) => rule.required().min(1).max(10),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 4,
      group: 'basic',
      description: 'Descripción del local para SEO y presentación',
    }),
    defineField({
      name: 'social',
      title: 'Redes sociales',
      type: 'object',
      group: 'contact',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
          validation: (rule) => rule.uri({ scheme: ['https'] }),
        },
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
          validation: (rule) => rule.uri({ scheme: ['https'] }),
        },
        {
          name: 'tiktok',
          title: 'TikTok',
          type: 'url',
          validation: (rule) => rule.uri({ scheme: ['https'] }),
        },
        {
          name: 'maps',
          title: 'Google Maps',
          type: 'url',
          validation: (rule) => rule.uri({ scheme: ['https'] }),
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      city: 'city.title',
      priceRange: 'priceRange',
      media: 'images.0',
    },
    prepare({ title, city, priceRange, media }) {
      return {
        title,
        subtitle: `${city || 'Sin ciudad'} • ${priceRange || 'Sin precio'}`,
        media,
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
      title: 'Ciudad',
      name: 'cityAsc',
      by: [{ field: 'city.title', direction: 'asc' }],
    },
  ],
});
