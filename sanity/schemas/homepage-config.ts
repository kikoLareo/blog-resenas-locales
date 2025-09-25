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
                  { title: 'Top Rated', value: 'topRated' },
                  { title: 'Categorías', value: 'categories' },
                  { title: 'Newsletter', value: 'newsletter' },
                ]
              }
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
              type: 'string'
            },
            {
              name: 'config',
              title: 'Configuración',
              type: 'object',
              fields: [
                {
                  name: 'itemCount',
                  title: 'Número de elementos',
                  type: 'number',
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
              title: 'type',
              enabled: 'enabled'
            },
            prepare({ title, enabled }) {
              return {
                title: title?.toUpperCase(),
                subtitle: enabled ? 'Habilitado' : 'Deshabilitado'
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
      title: 'title'
    }
  }
})
