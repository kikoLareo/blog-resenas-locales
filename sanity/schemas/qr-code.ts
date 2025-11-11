import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'qrCode',
  title: 'Código QR',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
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
      name: 'code',
      title: 'Código único',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'isActive',
      title: 'Activo',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'expiresAt',
      title: 'Fecha de expiración',
      type: 'datetime',
      description: 'Dejar vacío para que no expire',
    }),
    defineField({
      name: 'maxUses',
      title: 'Usos máximos',
      type: 'number',
      description: 'Dejar vacío para uso ilimitado',
    }),
    defineField({
      name: 'currentUses',
      title: 'Usos actuales',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'lastUsedAt',
      title: 'Último uso',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      description: 'Descripción opcional del código QR',
    }),
    // Campos para QR de onboarding (un solo uso)
    defineField({
      name: 'isOnboarding',
      title: 'Es QR de onboarding',
      type: 'boolean',
      initialValue: false,
      description: 'Si es true, este QR es para registro de nuevo local (un solo uso)',
    }),
    defineField({
      name: 'isUsed',
      title: 'Usado',
      type: 'boolean',
      initialValue: false,
      readOnly: true,
      description: 'Marca si el QR de onboarding ya fue utilizado',
    }),
    defineField({
      name: 'usedAt',
      title: 'Fecha de uso',
      type: 'datetime',
      readOnly: true,
      description: 'Cuándo se usó el QR de onboarding',
    }),
    defineField({
      name: 'submission',
      title: 'Solicitud asociada',
      type: 'reference',
      to: [{ type: 'venueSubmission' }],
      readOnly: true,
      description: 'Referencia a la solicitud de local creada',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      venue: 'venue.title',
      isActive: 'isActive',
      currentUses: 'currentUses',
      maxUses: 'maxUses',
    },
    prepare(selection) {
      const { title, venue, isActive, currentUses, maxUses } = selection
      const status = isActive ? '✅ Activo' : '❌ Inactivo'
      const uses = maxUses ? `${currentUses}/${maxUses}` : `${currentUses}`
      return {
        title: title,
        subtitle: `${venue} • ${status} • ${uses} usos`,
      }
    },
  },
})

