import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'venue',
  title: 'Local/Venue',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre del Local',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(100),
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
      name: 'city',
      title: 'Ciudad',
      type: 'reference',
      to: [{ type: 'city' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Dirección',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postalCode',
      title: 'Código Postal',
      type: 'string',
      validation: (Rule) => Rule.regex(/^\d{5}$/, 'Debe ser un código postal de 5 dígitos'),
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
      validation: (Rule) => Rule.regex(/^[+]?[\d\s-()]{9,15}$/, 'Formato de teléfono inválido'),
    }),
    defineField({
      name: 'website',
      title: 'Sitio Web',
      type: 'url',
    }),
    defineField({
      name: 'geo',
      title: 'Ubicación GPS',
      type: 'geopoint',
    }),
    defineField({
      name: 'openingHours',
      title: 'Horarios de Apertura',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      options: {
        list: [
          { title: 'Lu-Vi 10:00-22:00', value: 'Mo-Fr 10:00-22:00' },
          { title: 'Sa-Do 11:00-23:00', value: 'Sa-Su 11:00-23:00' },
          { title: 'Ma-Do 12:00-24:00', value: 'Mo-Su 12:00-24:00' },
        ],
      },
    }),
    defineField({
      name: 'priceRange',
      title: 'Rango de Precios',
      type: 'string',
      options: {
        list: [
          { title: '€ - Económico (0-15€)', value: '€' },
          { title: '€€ - Moderado (15-30€)', value: '€€' },
          { title: '€€€ - Caro (30-50€)', value: '€€€' },
          { title: '€€€€ - Muy caro (50€+)', value: '€€€€' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'masterCategory',
      title: 'Categoría Maestra',
      type: 'string',
      description: 'Categorización principal para el ordenamiento del sitio',
      options: {
        list: [
          { title: 'Gastronomía', value: 'gastro' },
          { title: 'Ocio', value: 'ocio' },
          { title: 'Deportes', value: 'deportes' },
        ],
        layout: 'radio',
      },
      initialValue: 'gastro',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Imágenes',
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
              type: 'string',
              title: 'Texto alternativo',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Descripción',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(50).max(300),
    }),
    defineField({
      name: 'social',
      title: 'Redes Sociales',
      type: 'object',
      fields: [
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        },
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
        },
        {
          name: 'tiktok',
          title: 'TikTok',
          type: 'url',
        },
        {
          name: 'maps',
          title: 'Google Maps',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'schemaType',
      title: 'Tipo de Negocio (Schema.org)',
      type: 'string',
      options: {
        list: [
          { title: 'Restaurante', value: 'Restaurant' },
          { title: 'Café', value: 'CafeOrCoffeeShop' },
          { title: 'Bar/Pub', value: 'BarOrPub' },
          { title: 'Negocio Local', value: 'LocalBusiness' },
          { title: 'Panadería', value: 'Bakery' },
          { title: 'Comida Rápida', value: 'FastFoodRestaurant' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'Restaurant',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'address',
      media: 'images.0',
      city: 'city.title',
      priceRange: 'priceRange',
    },
    prepare(selection) {
      const { title, subtitle, media, city, priceRange } = selection;
      return {
        title,
        subtitle: `${city} • ${priceRange} • ${subtitle}`,
        media,
      };
    },
  },
});
