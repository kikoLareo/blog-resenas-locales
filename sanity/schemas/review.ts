import { defineField, defineType } from 'sanity';

export const review = defineType({
  name: 'review',
  title: 'Reseña',
  type: 'document',
  icon: () => '⭐',
  groups: [
    {
      name: 'basic',
      title: 'Información básica',
    },
    {
      name: 'ratings',
      title: 'Puntuaciones',
    },
    {
      name: 'content',
      title: 'Contenido',
    },
    {
      name: 'media',
      title: 'Galería',
    },
    {
      name: 'seo',
      title: 'SEO/AEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título de la reseña',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required().min(10).max(100),
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
      name: 'venue',
      title: 'Local',
      type: 'reference',
      to: [{ type: 'venue' }],
      group: 'basic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'visitDate',
      title: 'Fecha de visita',
      type: 'date',
      group: 'basic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ratings',
      title: 'Puntuaciones',
      type: 'object',
      group: 'ratings',
      fields: [
        {
          name: 'food',
          title: 'Comida',
          type: 'number',
          validation: (rule) => rule.required().min(0).max(10).integer(),
          options: {
            layout: 'slider',
            range: { min: 0, max: 10, step: 1 },
          },
        },
        {
          name: 'service',
          title: 'Servicio',
          type: 'number',
          validation: (rule) => rule.required().min(0).max(10).integer(),
          options: {
            layout: 'slider',
            range: { min: 0, max: 10, step: 1 },
          },
        },
        {
          name: 'ambience',
          title: 'Ambiente',
          type: 'number',
          validation: (rule) => rule.required().min(0).max(10).integer(),
          options: {
            layout: 'slider',
            range: { min: 0, max: 10, step: 1 },
          },
        },
        {
          name: 'value',
          title: 'Relación calidad-precio',
          type: 'number',
          validation: (rule) => rule.required().min(0).max(10).integer(),
          options: {
            layout: 'slider',
            range: { min: 0, max: 10, step: 1 },
          },
        },
      ],
      validation: (rule) => rule.required(),
      options: {
        collapsible: false,
      },
    }),
    defineField({
      name: 'avgTicket',
      title: 'Ticket medio (€)',
      type: 'number',
      group: 'ratings',
      description: 'Precio promedio por persona',
      validation: (rule) => rule.min(0).max(500),
    }),
    defineField({
      name: 'highlights',
      title: 'Platos destacados',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
      validation: (rule) => rule.max(5),
      description: 'Máximo 5 platos o elementos destacados',
    }),
    defineField({
      name: 'pros',
      title: 'Puntos positivos',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
      validation: (rule) => rule.required().min(2).max(5),
      description: 'Entre 2 y 5 puntos positivos',
    }),
    defineField({
      name: 'cons',
      title: 'Puntos negativos',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
      validation: (rule) => rule.max(3),
      description: 'Máximo 3 puntos negativos (opcional)',
    }),
    defineField({
      name: 'tldr',
      title: 'TL;DR (Resumen AEO)',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) => 
        rule
          .required()
          .min(200) // ~50 palabras
          .max(300), // ~75 palabras
      description: 'Resumen de 50-75 palabras optimizado para asistentes de voz',
    }),
    defineField({
      name: 'faq',
      title: 'Preguntas frecuentes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Pregunta',
              type: 'string',
              validation: (rule) => rule.required().min(10).max(150),
            },
            {
              name: 'answer',
              title: 'Respuesta',
              type: 'text',
              rows: 2,
              validation: (rule) => 
                rule
                  .required()
                  .min(160) // ~40 palabras
                  .max(220), // ~55 palabras
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
      group: 'seo',
      validation: (rule) => rule.required().min(3).max(5),
      description: 'Entre 3 y 5 preguntas con respuestas de 40-55 palabras',
    }),
    defineField({
      name: 'body',
      title: 'Contenido de la reseña',
      type: 'array',
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
            { title: 'Numbered', value: 'number' },
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
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
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
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de fotos',
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
      validation: (rule) => rule.min(3).max(15),
      description: 'Entre 3 y 15 fotos de la experiencia',
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required(),
      initialValue: 'Blog de Reseñas Team',
    }),
    defineField({
      name: 'authorAvatar',
      title: 'Avatar del autor',
      type: 'image',
      group: 'basic',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'seo',
      validation: (rule) => rule.max(10),
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      group: 'basic',
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      venue: 'venue.title',
      visitDate: 'visitDate',
      media: 'gallery.0',
      food: 'ratings.food',
      service: 'ratings.service',
    },
    prepare({ title, venue, visitDate, media, food, service }) {
      const avgRating = food && service ? Math.round((food + service) / 2 * 10) / 10 : 'Sin puntuación';
      return {
        title,
        subtitle: `${venue || 'Sin local'} • ${visitDate || 'Sin fecha'} • ⭐ ${avgRating}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Fecha de visita (más reciente)',
      name: 'visitDateDesc',
      by: [{ field: 'visitDate', direction: 'desc' }],
    },
    {
      title: 'Fecha de publicación',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Título A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});
