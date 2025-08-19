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

