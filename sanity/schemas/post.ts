import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Crónica/Artículo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(100),
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
      name: 'excerpt',
      title: 'Extracto',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(100).max(300),
      description: 'Resumen del artículo para SEO y preview cards',
    }),
    defineField({
      name: 'cover',
      title: 'Imagen de Portada',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'faq',
      title: 'FAQ (Opcional)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Pregunta',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'answer',
              title: 'Respuesta',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.max(8),
      description: 'Preguntas frecuentes para featured snippets',
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
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
                    validation: (Rule) => Rule.required(),
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                    initialValue: false,
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
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              title: 'Pie de foto',
              type: 'string',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.max(10),
    }),
    defineField({
      name: 'category',
      title: 'Categoría Principal',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'relatedVenues',
      title: 'Locales Relacionados',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'venue' }],
        },
      ],
      validation: (Rule) => Rule.max(5),
      description: 'Locales mencionados en el artículo',
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
      name: 'featured',
      title: 'Artículo Destacado',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de Publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Título SEO',
      type: 'string',
      validation: (Rule) => Rule.max(60),
      description: 'Título optimizado para buscadores (máx. 60 caracteres)',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(160),
      description: 'Descripción para buscadores (máx. 160 caracteres)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'cover',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const { title, subtitle, media, publishedAt } = selection;
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('es-ES') : 'Sin fecha';
      
      return {
        title,
        subtitle: `${date} • ${subtitle ? subtitle.slice(0, 60) + '...' : 'Sin extracto'}`,
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
      title: 'Título A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});