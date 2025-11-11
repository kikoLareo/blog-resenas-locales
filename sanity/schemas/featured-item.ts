import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'featuredItem',
  title: 'Elemento Destacado (Carrusel)',
  type: 'document',
  icon: () => '⭐',
  groups: [
    {
      name: 'content',
      title: 'Contenido',
    },
    {
      name: 'customization',
      title: 'Personalización',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'settings',
      title: 'Configuración',
    },
  ],
  
  fields: [
    // Configuración básica
    defineField({
      name: 'title',
      title: 'Título Interno',
      type: 'string',
      group: 'content',
      description: 'Solo para identificación en el admin',
      validation: (Rule) => Rule.required().max(100),
    }),
    
    defineField({
      name: 'type',
      title: 'Tipo de Elemento',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Reseña', value: 'review' },
          { title: 'Local/Restaurante', value: 'venue' },
          { title: 'Categoría', value: 'category' },
          { title: 'Colección', value: 'collection' },
          { title: 'Guía', value: 'guide' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // Referencias a contenido existente
    defineField({
      name: 'reviewRef',
      title: 'Reseña',
      type: 'reference',
      to: [{ type: 'review' }],
      group: 'content',
      hidden: ({ document }) => document?.type !== 'review',
      validation: (Rule) => 
        Rule.custom((value, context) => {
          const type = context.document?.type;
          if (type === 'review' && !value) {
            return 'Selecciona una reseña';
          }
          return true;
        }),
    }),

    defineField({
      name: 'venueRef',
      title: 'Local',
      type: 'reference',
      to: [{ type: 'venue' }],
      group: 'content',
      hidden: ({ document }) => document?.type !== 'venue',
      validation: (Rule) => 
        Rule.custom((value, context) => {
          const type = context.document?.type;
          if (type === 'venue' && !value) {
            return 'Selecciona un local';
          }
          return true;
        }),
    }),

    defineField({
      name: 'categoryRef',
      title: 'Categoría',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'content',
      hidden: ({ document }) => document?.type !== 'category',
      validation: (Rule) => 
        Rule.custom((value, context) => {
          const type = context.document?.type;
          if (type === 'category' && !value) {
            return 'Selecciona una categoría';
          }
          return true;
        }),
    }),

    // Personalización de contenido
    defineField({
      name: 'customTitle',
      title: 'Título Personalizado (Opcional)',
      type: 'string',
      group: 'customization',
      description: 'Si se deja vacío, se usará el título del elemento original. Máximo 80 caracteres para mejor SEO.',
      validation: (Rule) => Rule.max(80),
    }),

    defineField({
      name: 'customSubtitle',
      title: 'Subtítulo Personalizado (Opcional)',
      type: 'string',
      group: 'customization',
      description: 'Subtítulo que aparecerá debajo del título principal',
      validation: (Rule) => Rule.max(120),
    }),

    defineField({
      name: 'customDescription',
      title: 'Descripción Personalizada (Opcional)',
      type: 'text',
      rows: 3,
      group: 'customization',
      description: 'Si se deja vacía, se usará la descripción original. Máximo 200 caracteres.',
      validation: (Rule) => Rule.max(200),
    }),

    defineField({
      name: 'customImage',
      title: 'Imagen Personalizada (Opcional)',
      type: 'image',
      group: 'customization',
      description: 'Si no se sube, se usará la imagen principal del elemento. Recomendado: 1920x1080px',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    defineField({
      name: 'customCTA',
      title: 'Texto del Botón Personalizado (Opcional)',
      type: 'string',
      group: 'customization',
      description: 'Si se deja vacío, se usará el texto por defecto según el tipo',
      validation: (Rule) => Rule.max(50),
    }),

    defineField({
      name: 'customUrl',
      title: 'URL Personalizada (Opcional)',
      type: 'url',
      group: 'customization',
      description: 'URL externa personalizada. Si se deja vacía, se usará la URL del elemento referenciado.',
      validation: (Rule) => Rule.uri({
        allowRelative: false,
        scheme: ['http', 'https']
      }),
    }),

    // SEO específico del carrusel
    defineField({
      name: 'seoTitle',
      title: 'Título SEO para Carrusel',
      type: 'string',
      group: 'seo',
      description: 'Título optimizado para aparecer en el carrusel (máximo 60 caracteres)',
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: 'seoDescription',
      title: 'Descripción SEO para Carrusel',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Descripción optimizada para SEO en el carrusel (máximo 160 caracteres)',
      validation: (Rule) => Rule.max(160),
    }),

    defineField({
      name: 'seoKeywords',
      title: 'Palabras Clave SEO',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'seo',
      description: 'Palabras clave específicas para este elemento en el carrusel',
      validation: (Rule) => Rule.max(10),
    }),

    // Configuración y control
    defineField({
      name: 'isActive',
      title: 'Activo en Carrusel',
      type: 'boolean',
      group: 'settings',
      description: 'Determina si este elemento aparece en el carrusel',
      initialValue: true,
    }),

    defineField({
      name: 'order',
      title: 'Orden de Aparición',
      type: 'number',
      group: 'settings',
      description: 'Número menor aparece primero (1, 2, 3...)',
      validation: (Rule) => Rule.required().min(1),
      initialValue: 1,
    }),

    defineField({
      name: 'publishDate',
      title: 'Fecha de Publicación',
      type: 'datetime',
      group: 'settings',
      description: 'El elemento se mostrará a partir de esta fecha',
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'expiryDate',
      title: 'Fecha de Caducidad (Opcional)',
      type: 'datetime',
      group: 'settings',
      description: 'El elemento se ocultará automáticamente después de esta fecha',
    }),

    // Analytics y tracking
    defineField({
      name: 'trackingId',
      title: 'ID de Seguimiento',
      type: 'string',
      group: 'settings',
      description: 'ID único para analytics (se genera automáticamente)',
      readOnly: true,
    }),

    // Contenido para colecciones y guías personalizadas
    defineField({
      name: 'customContent',
      title: 'Contenido Personalizado',
      type: 'object',
      group: 'customization',
      hidden: ({ document }) => !['collection', 'guide'].includes(document?.type as string),
      fields: [
        {
          name: 'itemCount',
          title: 'Número de Elementos',
          type: 'number',
          hidden: ({ parent }) => parent?.type !== 'collection',
        },
        {
          name: 'readTime',
          title: 'Tiempo de Lectura',
          type: 'string',
          description: 'Ej: "5 min", "15 min"',
        },
        {
          name: 'difficulty',
          title: 'Dificultad',
          type: 'string',
          options: {
            list: [
              { title: 'Fácil', value: 'easy' },
              { title: 'Medio', value: 'medium' },
              { title: 'Difícil', value: 'hard' },
            ],
          },
          hidden: ({ parent }) => parent?.type !== 'guide',
        },
        {
          name: 'stops',
          title: 'Número de Paradas',
          type: 'number',
          hidden: ({ parent }) => parent?.type !== 'guide',
        },
      ],
    }),

    // AI Recommendations (para futuro desarrollo)
    defineField({
      name: 'aiSuggestions',
      title: 'Sugerencias de IA',
      type: 'object',
      group: 'seo',
      readOnly: true,
      description: 'Sugerencias automáticas de la IA para mejorar SEO y engagement',
      fields: [
        {
          name: 'titleSuggestions',
          title: 'Sugerencias de Título',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'descriptionSuggestions',
          title: 'Sugerencias de Descripción',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'keywordSuggestions',
          title: 'Palabras Clave Sugeridas',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'optimizationScore',
          title: 'Puntuación de Optimización',
          type: 'number',
          description: 'Score de 0-100 basado en SEO y engagement',
        },
        {
          name: 'lastUpdated',
          title: 'Última Actualización',
          type: 'datetime',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      customTitle: 'customTitle',
      type: 'type',
      isActive: 'isActive',
      order: 'order',
      image: 'customImage',
    },
    prepare({ title, customTitle, type, isActive, order, image }) {
      const displayTitle = customTitle || title;
      const status = isActive ? '🟢' : '🔴';
      const typeEmoji: Record<string, string> = {
        review: '⭐',
        venue: '🏪',
        category: '🏷️',
        collection: '📚',
        guide: '🗺️',
      };
      const emoji = typeEmoji[type as string] || '📄';

      return {
        title: `${status} ${emoji} ${displayTitle}`,
        subtitle: `${type.toUpperCase()} - Orden: ${order}`,
        media: image,
      };
    },
  },
});
