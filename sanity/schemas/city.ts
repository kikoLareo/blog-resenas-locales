import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'city',
  title: 'Ciudad',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre de la Ciudad',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(50),
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
      name: 'region',
      title: 'Región/Provincia',
      type: 'string',
      initialValue: 'Galicia',
      validation: (Rule) => Rule.required(),
      description: 'Provincia o comunidad autónoma',
    }),
    defineField({
      name: 'geo',
      title: 'Ubicación GPS',
      type: 'geopoint',
      description: 'Coordenadas del centro de la ciudad',
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen Principal',
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
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 4,
      description: 'Descripción de la ciudad para SEO y presentación',
    }),
    defineField({
      name: 'featured',
      title: 'Ciudad Destacada',
      type: 'boolean',
      initialValue: false,
      description: 'Mostrar en homepage y secciones principales',
    }),
    defineField({
      name: 'population',
      title: 'Población',
      type: 'number',
      description: 'Número de habitantes (opcional)',
    }),
    defineField({
      name: 'website',
      title: 'Web Oficial',
      type: 'url',
      description: 'Página web del ayuntamiento o turismo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'region',
      media: 'heroImage',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title,
        subtitle: subtitle || 'Galicia',
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Nombre A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Población (mayor)',
      name: 'populationDesc',
      by: [{ field: 'population', direction: 'desc' }],
    },
  ],
});
