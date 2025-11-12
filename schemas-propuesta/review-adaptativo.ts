import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'review',
  title: 'Reseña',
  type: 'document',
  fields: [
    // CAMPOS BÁSICOS (todos los tipos)
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
      title: 'Local/Establecimiento',
      type: 'reference',
      to: [{ type: 'venue' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'visitDate',
      title: 'Fecha de Visita/Experiencia',
      type: 'date',
      validation: (Rule) => Rule.required().max(new Date().toISOString().split('T')[0]),
    }),

    // NUEVO: Tipo de reseña
    defineField({
      name: 'reviewType',
      title: 'Tipo de Reseña',
      type: 'string',
      options: {
        list: [
          { title: '🍽️ Gastronomía', value: 'gastronomy' },
          { title: '🎭 Ocio & Entretenimiento', value: 'leisure' },
          { title: '⚽ Deportes & Fitness', value: 'sports' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'gastronomy'
    }),

    // RATINGS ADAPTATIVOS según tipo
    defineField({
      name: 'ratings',
      title: 'Puntuaciones',
      type: 'object',
      fields: [
        // GASTRONOMÍA
        {
          name: 'food',
          title: 'Comida/Producto',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(10).precision(1),
          description: 'Calidad de comida/producto principal',
          hidden: ({ parent }) => parent?.reviewType !== 'gastronomy',
        },
        {
          name: 'service',
          title: 'Servicio/Atención',
          type: 'number',
          validation: (Rule) => Rule.required().min(0).max(10).precision(1),
          description: 'Calidad del servicio/atención al cliente',
        },
        {
          name: 'ambience',
          title: 'Ambiente/Instalaciones',
          type: 'number',
          validation: (Rule) => Rule.required().min(0).max(10).precision(1),
          description: 'Ambiente general/calidad de instalaciones',
        },
        {
          name: 'value',
          title: 'Relación Calidad-Precio',
          type: 'number',
          validation: (Rule) => Rule.required().min(0).max(10).precision(1),
          description: 'Relación calidad-precio del servicio/producto',
        },

        // OCIO - Criterios específicos
        {
          name: 'entertainment',
          title: 'Entretenimiento/Diversión',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(10).precision(1),
          description: 'Nivel de entretenimiento y diversión',
          hidden: ({ parent }) => parent?.reviewType !== 'leisure',
        },
        {
          name: 'accessibility',
          title: 'Accesibilidad',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(10).precision(1),
          description: 'Facilidad de acceso y comodidades',
          hidden: ({ parent }) => parent?.reviewType !== 'leisure',
        },

        // DEPORTES - Criterios específicos  
        {
          name: 'facilities',
          title: 'Instalaciones/Equipamiento',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(10).precision(1),
          description: 'Calidad de instalaciones y equipamiento',
          hidden: ({ parent }) => parent?.reviewType !== 'sports',
        },
        {
          name: 'coaching',
          title: 'Entrenamiento/Instructores',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(10).precision(1),
          description: 'Calidad de instructores/entrenamiento',
          hidden: ({ parent }) => parent?.reviewType !== 'sports',
        },
        {
          name: 'cleanliness',
          title: 'Limpieza/Mantenimiento',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(10).precision(1),
          description: 'Limpieza y mantenimiento general',
          hidden: ({ parent }) => parent?.reviewType !== 'sports',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // COSTE ADAPTATIVO
    defineField({
      name: 'cost',
      title: 'Coste',
      type: 'object',
      fields: [
        {
          name: 'avgTicket',
          title: 'Ticket Medio por Persona (€)',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(500),
          description: 'Coste medio por persona',
          hidden: ({ parent }) => parent?.reviewType !== 'gastronomy',
        },
        {
          name: 'entryPrice',
          title: 'Precio de Entrada (€)',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(200),
          description: 'Precio de entrada/actividad',
          hidden: ({ parent }) => parent?.reviewType !== 'leisure',
        },
        {
          name: 'monthlyFee',
          title: 'Cuota Mensual (€)',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(300),
          description: 'Cuota mensual o precio por sesión',
          hidden: ({ parent }) => parent?.reviewType !== 'sports',
        },
      ],
    }),

    // HIGHLIGHTS ADAPTATIVOS
    defineField({
      name: 'highlights',
      title: 'Aspectos Destacados',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(8),
      description: ({ parent }) => {
        switch (parent?.reviewType) {
          case 'gastronomy': return 'Platos estrella, especialidades';
          case 'leisure': return 'Actividades, espectáculos destacados';  
          case 'sports': return 'Programas, clases, equipamiento destacado';
          default: return 'Aspectos más destacados';
        }
      },
    }),

    // Resto de campos comunes...
    defineField({
      name: 'pros',
      title: 'Aspectos Positivos',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(2).max(6),
      description: 'Puntos fuertes del establecimiento',
    }),
    defineField({
      name: 'cons',
      title: 'Aspectos Negativos',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(4),
      description: 'Puntos de mejora (opcional)',
    }),

    // ... resto de campos existentes (tldr, faq, body, gallery, etc.)
  ],
  preview: {
    select: {
      title: 'title',
      reviewType: 'reviewType',
      venue: 'venue.title',
      media: 'gallery.0'
    },
    prepare({ title, reviewType, venue, media }) {
      const typeIcon = {
        gastronomy: '🍽️',
        leisure: '🎭', 
        sports: '⚽'
      }[reviewType] || '📝';
      
      return {
        title: `${typeIcon} ${title}`,
        subtitle: venue ? `${venue}` : 'Sin venue asignado',
        media
      };
    }
  }
});