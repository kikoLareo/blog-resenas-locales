// Esquema para gestión de homepage estática
import { defineType, defineField } from 'sanity'

export const homepageConfig = defineType({
  name: 'homepageConfig',
  title: 'Configuración de Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título de configuración',
      type: 'string',
      initialValue: 'Homepage Principal'
    }),
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'id',
              title: 'ID',
              type: 'string',
              validation: (Rule) => Rule.required(),
              readOnly: true,
              initialValue: () => `section_${Date.now()}`
            },
            {
              name: 'type',
              title: 'Tipo de sección',
              type: 'string',
              options: {
                list: [
                  { title: 'Hero Principal', value: 'hero' },
                  { title: 'Reseñas Destacadas', value: 'featured' },
                  { title: 'Trending', value: 'trending' },
                  { title: 'Categorías', value: 'categories' },
                  { title: 'Newsletter', value: 'newsletter' },
                ]
              },
              validation: (Rule) => Rule.required()
            },
            {
              name: 'enabled',
              title: 'Habilitado',
              type: 'boolean',
              initialValue: true
            },
            {
              name: 'title',
              title: 'Título personalizado',
              type: 'string',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'order',
              title: 'Orden',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
              initialValue: 1
            },
            {
              name: 'config',
              title: 'Configuración',
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Título visible',
                  type: 'string'
                },
                {
                  name: 'subtitle',
                  title: 'Subtítulo',
                  type: 'text',
                  rows: 2
                },
                {
                  name: 'itemCount',
                  title: 'Número de elementos',
                  type: 'number',
                  validation: (Rule) => Rule.min(1).max(12),
                  initialValue: 6
                },
                {
                  name: 'layout',
                  title: 'Layout',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Grid', value: 'grid' },
                      { title: 'Carousel', value: 'carousel' },
                      { title: 'Lista', value: 'list' }
                    ]
                  },
                  initialValue: 'grid'
                },
                {
                  name: 'showImages',
                  title: 'Mostrar imágenes',
                  type: 'boolean',
                  initialValue: true
                }
              ]
            }
          ],
          preview: {
            select: {
              title: 'title',
              type: 'type',
              enabled: 'enabled'
            },
            prepare({ title, type, enabled }) {
              return {
                title: title || 'Sección sin título',
                subtitle: `${type} - ${enabled ? 'Habilitado' : 'Deshabilitado'}`
              }
            }
          }
        }
      ]
    }),
    defineField({
      name: 'lastModified',
      title: 'Última modificación',
      type: 'datetime',
      readOnly: true
    })
  ],
  preview: {
    select: {
      title: 'title',
      sections: 'sections'
    },
    prepare({ title, sections }) {
      return {
        title: title || 'Configuración de Homepage',
        subtitle: `${sections?.length || 0} secciones configuradas`
      }
    }
  }
})
