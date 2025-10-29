import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'venueSubmission',
  title: 'Solicitud de Local',
  type: 'document',
  fields: [
    // Estado y metadata
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: '⏳ Pendiente', value: 'pending' },
          { title: '✅ Aprobado', value: 'approved' },
          { title: '❌ Rechazado', value: 'rejected' },
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'qrCode',
      title: 'Código QR',
      type: 'reference',
      to: [{ type: 'qrCode' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Fecha de envío',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'submittedBy',
      title: 'Enviado por',
      type: 'string',
      description: 'Nombre del propietario/contacto',
      validation: (Rule) => Rule.required(),
    }),

    // Datos del local
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
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(50).max(500),
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
      name: 'city',
      title: 'Ciudad',
      type: 'reference',
      to: [{ type: 'city' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      validation: (Rule) => Rule.required().min(1),
    }),

    // Información de contacto
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/^[+]?[\d\s-()]{9,15}$/, 'Formato de teléfono inválido'),
    }),
    defineField({
      name: 'email',
      title: 'Email de contacto',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'website',
      title: 'Sitio web',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    }),

    // Información adicional
    defineField({
      name: 'priceRange',
      title: 'Rango de precios',
      type: 'string',
      options: {
        list: [
          { title: '€ - Económico', value: '€' },
          { title: '€€ - Moderado', value: '€€' },
          { title: '€€€ - Caro', value: '€€€' },
          { title: '€€€€ - Muy Caro', value: '€€€€' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'openingHours',
      title: 'Horarios de apertura',
      type: 'object',
      fields: [
        {
          name: 'monday',
          title: 'Lunes',
          type: 'string',
          description: 'Ej: 12:00-16:00, 20:00-23:00 o "Cerrado"',
        },
        {
          name: 'tuesday',
          title: 'Martes',
          type: 'string',
        },
        {
          name: 'wednesday',
          title: 'Miércoles',
          type: 'string',
        },
        {
          name: 'thursday',
          title: 'Jueves',
          type: 'string',
        },
        {
          name: 'friday',
          title: 'Viernes',
          type: 'string',
        },
        {
          name: 'saturday',
          title: 'Sábado',
          type: 'string',
        },
        {
          name: 'sunday',
          title: 'Domingo',
          type: 'string',
        },
      ],
    }),

    // Geolocalización
    defineField({
      name: 'geo',
      title: 'Ubicación',
      type: 'geopoint',
      description: 'Ubicación exacta del local en el mapa',
      validation: (Rule) => Rule.required(),
    }),

    // Imágenes
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
              title: 'Texto alternativo',
              type: 'string',
            },
            {
              name: 'caption',
              title: 'Descripción',
              type: 'string',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(10),
    }),

    // Proceso de aprobación
    defineField({
      name: 'approvedAt',
      title: 'Fecha de aprobación',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'approvedBy',
      title: 'Aprobado por',
      type: 'string',
      description: 'Usuario que aprobó la solicitud',
      readOnly: true,
    }),
    defineField({
      name: 'rejectionReason',
      title: 'Razón de rechazo',
      type: 'text',
      description: 'Explicar por qué se rechazó la solicitud',
    }),
    defineField({
      name: 'createdVenue',
      title: 'Local creado',
      type: 'reference',
      to: [{ type: 'venue' }],
      description: 'Referencia al venue creado tras la aprobación',
      readOnly: true,
    }),

    // Notas internas
    defineField({
      name: 'internalNotes',
      title: 'Notas internas',
      type: 'text',
      description: 'Notas solo visibles para administradores',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      submittedBy: 'submittedBy',
      submittedAt: 'submittedAt',
      city: 'city.title',
    },
    prepare(selection) {
      const { title, status, submittedBy, submittedAt, city } = selection;
      const statusEmoji = {
        pending: '⏳',
        approved: '✅',
        rejected: '❌',
      }[status as string] || '❓';
      
      const date = submittedAt ? new Date(submittedAt).toLocaleDateString('es-ES') : '';
      
      return {
        title: `${statusEmoji} ${title}`,
        subtitle: `${city || 'Sin ciudad'} • ${submittedBy} • ${date}`,
      };
    },
  },
  orderings: [
    {
      title: 'Más recientes',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: 'Estado',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],
});
