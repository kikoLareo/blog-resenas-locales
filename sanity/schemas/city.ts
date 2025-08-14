import { defineField, defineType } from 'sanity';

export const city = defineType({
  name: 'city',
  title: 'Ciudad',
  type: 'document',
  icon: () => '🏙️',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre de la ciudad',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Región/Provincia',
      type: 'string',
      description: 'Ej: Galicia, Madrid, Cataluña',
    }),
    defineField({
      name: 'geo',
      title: 'Ubicación geográfica',
      type: 'object',
      fields: [
        {
          name: 'lat',
          title: 'Latitud',
          type: 'number',
          validation: (rule) => rule.required().min(-90).max(90),
        },
        {
          name: 'lng',
          title: 'Longitud',
          type: 'number',
          validation: (rule) => rule.required().min(-180).max(180),
        },
      ],
      options: {
        collapsible: true,
      },
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen principal',
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
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      description: 'Breve descripción de la ciudad para SEO',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      region: 'region',
      media: 'heroImage',
    },
    prepare({ title, region, media }) {
      return {
        title,
        subtitle: region || 'Sin región',
        media,
      };
    },
  },
});
