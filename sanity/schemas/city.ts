import { defineField, defineType } from 'sanity';

export const city = defineType({
  name: 'city',
  title: 'Ciudad',
  type: 'document',
  icon: () => '🏙️',
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
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'display',
      title: 'Visualización',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre de la ciudad',
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
      name: 'region',
      title: 'Región/Provincia',
      type: 'string',
      group: 'location',
      options: {
        list: [
          { title: 'Andalucía', value: 'andalucia' },
          { title: 'Aragón', value: 'aragon' },
          { title: 'Asturias', value: 'asturias' },
          { title: 'Cantabria', value: 'cantabria' },
          { title: 'Castilla-La Mancha', value: 'castilla-la-mancha' },
          { title: 'Castilla y León', value: 'castilla-y-leon' },
          { title: 'Cataluña', value: 'cataluna' },
          { title: 'Comunidad de Madrid', value: 'madrid' },
          { title: 'Comunidad Valenciana', value: 'valencia' },
          { title: 'Extremadura', value: 'extremadura' },
          { title: 'Galicia', value: 'galicia' },
          { title: 'Islas Baleares', value: 'baleares' },
          { title: 'Islas Canarias', value: 'canarias' },
          { title: 'La Rioja', value: 'la-rioja' },
          { title: 'Navarra', value: 'navarra' },
          { title: 'País Vasco', value: 'pais-vasco' },
          { title: 'Murcia', value: 'murcia' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
      description: 'Región o comunidad autónoma donde se encuentra la ciudad',
    }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'string',
      group: 'location',
      initialValue: 'España',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'geo',
      title: 'Ubicación geográfica',
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
      validation: (rule) => rule.required(),
      options: {
        collapsible: true,
      },
      description: 'Coordenadas GPS del centro de la ciudad',
    }),
    defineField({
      name: 'population',
      title: 'Población',
      type: 'number',
      group: 'basic',
      validation: (rule) => rule.min(0).integer(),
      description: 'Número de habitantes (opcional)',
    }),
    defineField({
      name: 'postalCodes',
      title: 'Códigos postales',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'location',
      validation: (rule) => rule.max(20),
      description: 'Códigos postales principales de la ciudad',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 4,
      group: 'basic',
      validation: (rule) => rule.required().min(100).max(300),
      description: 'Descripción de la ciudad para SEO y presentación (100-300 caracteres)',
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen principal',
      type: 'image',
      group: 'display',
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
      description: 'Imagen representativa de la ciudad',
    }),
    defineField({
      name: 'gallery',
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
      group: 'display',
      validation: (rule) => rule.max(8),
      description: 'Imágenes adicionales de la ciudad (máximo 8)',
    }),
    defineField({
      name: 'highlights',
      title: 'Lugares destacados',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'basic',
      validation: (rule) => rule.max(5),
      description: 'Lugares o características destacadas de la ciudad (máximo 5)',
    }),
    defineField({
      name: 'cuisineSpecialties',
      title: 'Especialidades gastronómicas',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'basic',
      validation: (rule) => rule.max(8),
      description: 'Platos típicos o especialidades gastronómicas de la ciudad',
    }),
    defineField({
      name: 'featured',
      title: 'Ciudad destacada',
      type: 'boolean',
      group: 'display',
      initialValue: false,
      description: 'Mostrar como ciudad destacada en homepage',
    }),
    defineField({
      name: 'order',
      title: 'Orden de visualización',
      type: 'number',
      group: 'display',
      validation: (rule) => rule.min(0).integer(),
      description: 'Orden para mostrar las ciudades (menor número = primero)',
    }),
    defineField({
      name: 'seoTitle',
      title: 'Título SEO',
      type: 'string',
      group: 'seo',
      validation: (rule) => rule.max(60),
      description: 'Título optimizado para SEO (máximo 60 caracteres)',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta descripción',
      type: 'text',
      rows: 2,
      group: 'seo',
      validation: (rule) => rule.max(160),
      description: 'Meta descripción para SEO (máximo 160 caracteres)',
    }),
    defineField({
      name: 'timezone',
      title: 'Zona horaria',
      type: 'string',
      group: 'location',
      initialValue: 'Europe/Madrid',
      options: {
        list: [
          { title: 'Madrid (Europe/Madrid)', value: 'Europe/Madrid' },
          { title: 'Canarias (Atlantic/Canary)', value: 'Atlantic/Canary' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      region: 'region',
      population: 'population',
      featured: 'featured',
      media: 'heroImage',
    },
    prepare({ title, region, population, featured, media }) {
      const badges = [];
      if (featured) badges.push('⭐');
      
      const populationText = population 
        ? ` • ${population.toLocaleString('es-ES')} hab.`
        : '';
      
      return {
        title: `${title}${badges.length ? ' ' + badges.join(' ') : ''}`,
        subtitle: `${region || 'Sin región'}${populationText}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Orden personalizado',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Destacadas primero',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'Población (mayor a menor)',
      name: 'populationDesc',
      by: [{ field: 'population', direction: 'desc' }],
    },
    {
      title: 'Nombre A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Por región',
      name: 'regionAsc',
      by: [
        { field: 'region', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
});
