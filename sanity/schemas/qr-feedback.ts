import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'qrFeedback',
  title: 'Feedback QR',
  type: 'document',
  fields: [
    defineField({
      name: 'venue',
      title: 'Local',
      type: 'reference',
      to: [{ type: 'venue' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'qrCode',
      title: 'Código QR',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
    }),
    defineField({
      name: 'visitDate',
      title: 'Fecha de visita',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'visitTime',
      title: 'Hora de visita',
      type: 'string',
    }),
    defineField({
      name: 'partySize',
      title: 'Número de personas',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'occasion',
      title: 'Ocasión',
      type: 'string',
      options: {
        list: [
          { title: 'Comida casual', value: 'casual' },
          { title: 'Comida de negocios', value: 'business' },
          { title: 'Cita romántica', value: 'date' },
          { title: 'Comida familiar', value: 'family' },
          { title: 'Celebración', value: 'celebration' },
          { title: 'Otra', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'specialRequests',
      title: 'Solicitudes especiales',
      type: 'text',
    }),
    defineField({
      name: 'rating',
      title: 'Tipo de visitante',
      type: 'string',
      options: {
        list: [
          { title: 'Primera vez', value: 'first-time' },
          { title: 'Visitante ocasional', value: 'occasional' },
          { title: 'Cliente regular', value: 'regular' },
          { title: 'Cliente frecuente', value: 'frequent' },
        ],
      },
    }),
    defineField({
      name: 'feedback',
      title: 'Comentarios',
      type: 'text',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Fecha de envío',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Pendiente', value: 'pending' },
          { title: 'Procesado', value: 'processed' },
          { title: 'Archivado', value: 'archived' },
        ],
      },
      initialValue: 'pending',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      venue: 'venue.title',
      visitDate: 'visitDate',
      partySize: 'partySize',
      status: 'status',
    },
    prepare(selection) {
      const { title, venue, visitDate, partySize, status } = selection
      const statusEmojis = {
        pending: '⏳',
        processed: '✅',
        archived: '📁',
      }
      const statusEmoji = statusEmojis[status as keyof typeof statusEmojis] || '❓'
      
      return {
        title: `${title} - ${venue}`,
        subtitle: `${visitDate} • ${partySize} personas • ${statusEmoji} ${status}`,
      }
    },
  },
})

