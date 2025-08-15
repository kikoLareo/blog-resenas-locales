import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'review',
  title: 'Reseña',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título de la Reseña',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(120),
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
      name: 'venue',
      title: 'Local',
      type: 'reference',
      to: [{ type: 'venue' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'visitDate',
      title: 'Fecha de Visita',
      type: 'date',
      validation: (Rule) => Rule.required().max(new Date().toISOString().split('T')[0]),
    }),
    defineField({
      name: 'ratings',
      title: 'Puntuaciones',
      type: 'object',
      fields: [
        {
          name: 'food',
          title: 'Comida',
          type: 'number',
          validation: (Rule) => Rule.required().min(0).max(10).precision(1),
          description: 'Puntuación de 0 a 10',
        },
        {
          name: 'service',
          title: 'Servicio',
          type: 'number',
          validation: (Rule) => Rule.required().min(0).max(10).precision(1),
          description: 'Puntuación de 0 a 10',
        },
        {
          name: 'ambience',
          title: 'Ambiente',
          type: 'number',
          validation: (Rule) => Rule.required().min(0).max(10).precision(1),
          description: 'Puntuación de 0 a 10',
        },
        {
          name: 'value',
          title: 'Relación Calidad-Precio',
          type: 'number',
          validation: (Rule) => Rule.required().min(0).max(10).precision(1),
          description: 'Puntuación de 0 a 10',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avgTicket',
      title: 'Ticket Medio (€)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(500),
      description: 'Coste medio por persona en euros',
    }),
    defineField({
      name: 'highlights',
      title: 'Platos Estrella',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(8),
      description: 'Mejores platos probados',
    }),
    defineField({
      name: 'pros',
      title: 'Aspectos Positivos',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(2).max(6),
      description: 'Puntos fuertes del local',
    }),
    defineField({
      name: 'cons',
      title: 'Aspectos Negativos',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(4),
      description: 'Puntos de mejora (opcional)',
    }),
    defineField({
      name: 'tldr',
      title: 'TL;DR (Resumen Ejecutivo)',
      type: 'text',
      rows: 3,
      validation: (Rule) => 
        Rule.required()
          .min(50)
          .max(75)
          .custom((value) => {
            if (value) {
              const text = String(value);
              const wordCount = text.split(/\s+/).length;
              if (wordCount < 8 || wordCount > 18) {
                return 'El TL;DR debe tener entre 8 y 18 palabras (50-75 caracteres)';
              }
            }
            return true;
          }),
      description: 'Resumen de 50-75 caracteres optimizado para AEO/respuestas de voz',
    }),
    defineField({
      name: 'faq',
      title: 'FAQ (Preguntas Frecuentes)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Pregunta',
              type: 'string',
              validation: (Rule) => Rule.required().min(10).max(120),
            },
            {
              name: 'answer',
              title: 'Respuesta',
              type: 'text',
              rows: 2,
              validation: (Rule) => 
                Rule.required()
                  .min(40)
                  .max(55)
                  .custom((value) => {
                    if (value) {
                      const text = String(value);
                      const wordCount = text.split(/\s+/).length;
                      if (wordCount < 8 || wordCount > 12) {
                        return 'La respuesta debe tener entre 8-12 palabras (40-55 caracteres)';
                      }
                    }
                    return true;
                  }),
              description: 'Respuesta concisa de 40-55 caracteres para featured snippets',
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
      validation: (Rule) => Rule.required().min(3).max(5),
      description: '3-5 preguntas con respuestas optimizadas para SEO/AEO',
    }),
    defineField({
      name: 'body',
      title: 'Contenido de la Reseña',
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
                    validation: (Rule) => Rule.required(),
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de Imágenes',
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
      validation: (Rule) => Rule.min(3).max(15),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      initialValue: 'Foodie Galicia',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorAvatar',
      title: 'Avatar del Autor',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.max(8),
      description: 'Etiquetas para categorización y SEO',
    }),
    defineField({
      name: 'featured',
      title: 'Reseña Destacada',
      type: 'boolean',
      initialValue: false,
      description: 'Mostrar en homepage y secciones destacadas',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de Publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      venue: 'venue.title',
      visitDate: 'visitDate',
      media: 'gallery.0',
      ratings: 'ratings',
    },
    prepare(selection) {
      const { title, venue, visitDate, media, ratings } = selection;
      const avgRating = ratings 
        ? ((ratings.food + ratings.service + ratings.ambience + ratings.value) / 4).toFixed(1)
        : 'N/A';
      
      return {
        title,
        subtitle: `${venue} • ${visitDate} • ⭐ ${avgRating}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Fecha de publicación (más reciente)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Fecha de visita (más reciente)',
      name: 'visitDateDesc',
      by: [{ field: 'visitDate', direction: 'desc' }],
    },
    {
      title: 'Puntuación (mejor)',
      name: 'ratingDesc',
      by: [{ field: 'ratings.food', direction: 'desc' }],
    },
  ],
});
