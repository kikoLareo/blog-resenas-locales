import { defineField, defineType } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Crónica/Post',
  type: 'document',
  icon: () => '📝',
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
      name: 'media',
      title: 'Imágenes',
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
      title: 'Título del post',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required().min(10).max(100),
      description: 'Título principal del artículo o crónica',
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
      description: 'Resumen del post para listados y SEO (100-200 caracteres)',
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen principal',
      type: 'image',
      group: 'media',
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
      name: 'body',
      title: 'Contenido del post',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
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
              { title: 'Code', value: 'code' },
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
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      group: 'basic',
      validation: (rule) => rule.required().min(1).max(3),
      description: 'Entre 1 y 3 categorías',
    }),
    defineField({
      name: 'relatedVenues',
      title: 'Locales relacionados',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'venue' }] }],
      group: 'basic',
      validation: (rule) => rule.max(5),
      description: 'Locales mencionados en el post (opcional, máximo 5)',
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
      description: 'Etiquetas para SEO y organización',
    }),
    defineField({
      name: 'hasFaq',
      title: '¿Incluir FAQ?',
      type: 'boolean',
      group: 'seo',
      initialValue: false,
      description: 'Activar para incluir sección de preguntas frecuentes',
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
              rows: 3,
              validation: (rule) => 
                rule
                  .required()
                  .min(160) // ~40 palabras
                  .max(300), // ~75 palabras
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
      validation: (rule) => 
        rule.custom((faq, context) => {
          const hasFaq = context.document?.hasFaq;
          if (hasFaq && (!faq || faq.length === 0)) {
            return 'Debes agregar al menos una pregunta si tienes FAQ activado';
          }
          if (hasFaq && faq && faq.length > 8) {
            return 'Máximo 8 preguntas en el FAQ';
          }
          return true;
        }),
      description: 'Solo se muestra si tienes FAQ activado',
      hidden: ({ document }) => !document?.hasFaq,
    }),
    defineField({
      name: 'tldr',
      title: 'TL;DR (Resumen AEO)',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) => 
        rule
          .min(200) // ~50 palabras
          .max(350), // ~85 palabras
      description: 'Resumen de 50-85 palabras optimizado para asistentes de voz (opcional)',
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
      name: 'readingTime',
      title: 'Tiempo de lectura (minutos)',
      type: 'number',
      group: 'basic',
      validation: (rule) => rule.min(1).max(30).integer(),
      description: 'Tiempo estimado de lectura en minutos',
    }),
    defineField({
      name: 'featured',
      title: 'Post destacado',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Marcar como post destacado para homepage',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      group: 'settings',
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Última actualización',
      type: 'datetime',
      group: 'settings',
      description: 'Se actualiza automáticamente al guardar',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      publishedAt: 'publishedAt',
      media: 'heroImage',
      featured: 'featured',
      hasFaq: 'hasFaq',
    },
    prepare({ title, author, publishedAt, media, featured, hasFaq }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('es-ES') : 'Sin fecha';
      const badges = [];
      if (featured) badges.push('⭐');
      if (hasFaq) badges.push('❓');
      
      return {
        title: `${badges.join(' ')} ${title}`,
        subtitle: `${author || 'Sin autor'} • ${date}`,
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
      title: 'Posts destacados primero',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'publishedAt', direction: 'desc' },
      ],
    },
    {
      title: 'Título A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});