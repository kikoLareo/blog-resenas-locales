import { StructureBuilder } from 'sanity/structure';

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenido')
    .items([
      // Sección de Contenido Principal
      S.listItem()
        .title('📝 Contenido Principal')
        .child(
          S.list()
            .title('Contenido Principal')
            .items([
              // Reseñas
              S.listItem()
                .title('⭐ Reseñas')
                .icon(() => '⭐')
                .child(
                  S.documentTypeList('review')
                    .title('Reseñas')
                    .defaultOrdering([{ field: 'visitDate', direction: 'desc' }])
                    .filter('_type == "review"')
                    .child((documentId) =>
                      S.document()
                        .documentId(documentId)
                        .schemaType('review')
                    )
                ),
              
              // Posts/Crónicas
              S.listItem()
                .title('📝 Crónicas/Posts')
                .icon(() => '📝')
                .child(
                  S.list()
                    .title('Posts')
                    .items([
                      S.listItem()
                        .title('📌 Posts Destacados')
                        .child(
                          S.documentTypeList('post')
                            .title('Posts Destacados')
                            .filter('_type == "post" && featured == true')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('📄 Todos los Posts')
                        .child(
                          S.documentTypeList('post')
                            .title('Todos los Posts')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('❓ Posts con FAQ')
                        .child(
                          S.documentTypeList('post')
                            .title('Posts con FAQ')
                            .filter('_type == "post" && hasFaq == true')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                    ])
                ),
            ])
        ),

      // Divisor
      S.divider(),

      // Sección de Locales y Ubicaciones
      S.listItem()
        .title('🏪 Locales y Ubicaciones')
        .child(
          S.list()
            .title('Locales y Ubicaciones')
            .items([
              // Locales
              S.listItem()
                .title('🏪 Locales')
                .icon(() => '🏪')
                .child(
                  S.list()
                    .title('Locales')
                    .items([
                      S.listItem()
                        .title('🏪 Todos los Locales')
                        .child(
                          S.documentTypeList('venue')
                            .title('Todos los Locales')
                            .defaultOrdering([{ field: 'title', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('🏙️ Por Ciudad')
                        .child(
                          S.documentTypeList('city')
                            .title('Ciudades')
                            .child((cityId) =>
                              S.documentList()
                                .title('Locales en esta ciudad')
                                .filter('_type == "venue" && city._ref == $cityId')
                                .params({ cityId })
                                .defaultOrdering([{ field: 'title', direction: 'asc' }])
                            )
                        ),
                      S.listItem()
                        .title('💰 Por Rango de Precio')
                        .child(
                          S.list()
                            .title('Por Rango de Precio')
                            .items([
                              S.listItem()
                                .title('€ Económico')
                                .child(
                                  S.documentTypeList('venue')
                                    .title('Locales Económicos')
                                    .filter('_type == "venue" && priceRange == "€"')
                                ),
                              S.listItem()
                                .title('€€ Moderado')
                                .child(
                                  S.documentTypeList('venue')
                                    .title('Locales Moderados')
                                    .filter('_type == "venue" && priceRange == "€€"')
                                ),
                              S.listItem()
                                .title('€€€ Caro')
                                .child(
                                  S.documentTypeList('venue')
                                    .title('Locales Caros')
                                    .filter('_type == "venue" && priceRange == "€€€"')
                                ),
                              S.listItem()
                                .title('€€€€ Muy Caro')
                                .child(
                                  S.documentTypeList('venue')
                                    .title('Locales Muy Caros')
                                    .filter('_type == "venue" && priceRange == "€€€€"')
                                ),
                            ])
                        ),
                    ])
                ),

              // Ciudades
              S.listItem()
                .title('🏙️ Ciudades')
                .icon(() => '🏙️')
                .child(
                  S.documentTypeList('city')
                    .title('Ciudades')
                    .defaultOrdering([{ field: 'title', direction: 'asc' }])
                ),
            ])
        ),

      // Divisor
      S.divider(),

      // Sección de Taxonomías
      S.listItem()
        .title('🏷️ Categorías y Clasificación')
        .child(
          S.list()
            .title('Categorías y Clasificación')
            .items([
              // Categorías
              S.listItem()
                .title('🏷️ Categorías')
                .icon(() => '🏷️')
                .child(
                  S.list()
                    .title('Categorías')
                    .items([
                      S.listItem()
                        .title('⭐ Categorías Destacadas')
                        .child(
                          S.documentTypeList('category')
                            .title('Categorías Destacadas')
                            .filter('_type == "category" && featured == true')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('🏷️ Todas las Categorías')
                        .child(
                          S.documentTypeList('category')
                            .title('Todas las Categorías')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                    ])
                ),
            ])
        ),

      // Divisor
      S.divider(),

      // Sección de Análisis y Reportes
      S.listItem()
        .title('📊 Análisis y Reportes')
        .child(
          S.list()
            .title('Análisis y Reportes')
            .items([
              S.listItem()
                .title('🌟 Mejores Valoradas')
                .child(
                  S.documentTypeList('review')
                    .title('Reseñas Mejor Valoradas')
                    .filter('_type == "review" && ratings.food >= 8')
                    .defaultOrdering([{ field: 'ratings.food', direction: 'desc' }])
                ),
              S.listItem()
                .title('📅 Publicaciones Recientes')
                .child(
                  S.list()
                    .title('Publicaciones Recientes')
                    .items([
                      S.listItem()
                        .title('⭐ Reseñas (Últimos 30 días)')
                        .child(
                          S.documentTypeList('review')
                            .title('Reseñas Recientes')
                            .filter('_type == "review" && publishedAt > dateTime(now()) - 60*60*24*30')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('📝 Posts (Últimos 30 días)')
                        .child(
                          S.documentTypeList('post')
                            .title('Posts Recientes')
                            .filter('_type == "post" && publishedAt > dateTime(now()) - 60*60*24*30')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                    ])
                ),
              S.listItem()
                .title('📋 Sin Reseñas')
                .child(
                  S.documentList()
                    .title('Locales sin Reseñas')
                    .filter('_type == "venue" && !(_id in path("drafts.**")) && !defined(*[_type == "review" && venue._ref == ^._id][0])')
                    .defaultOrdering([{ field: 'title', direction: 'asc' }])
                ),
            ])
        ),

      // Divisor
      S.divider(),

      // Acceso rápido a crear contenido
      S.listItem()
        .title('➕ Crear Nuevo')
        .child(
          S.list()
            .title('Crear Nuevo Contenido')
            .items([
              S.listItem()
                .title('⭐ Nueva Reseña')
                .child(
                  S.documentTypeList('review')
                    .title('Nueva Reseña')
                    .canHandleIntent((_name, params) => params.type === 'review')
                ),
              S.listItem()
                .title('📝 Nuevo Post')
                .child(
                  S.documentTypeList('post')
                    .title('Nuevo Post')
                    .canHandleIntent((_name, params) => params.type === 'post')
                ),
              S.listItem()
                .title('🏪 Nuevo Local')
                .child(
                  S.documentTypeList('venue')
                    .title('Nuevo Local')
                    .canHandleIntent((_name, params) => params.type === 'venue')
                ),
              S.listItem()
                .title('🏙️ Nueva Ciudad')
                .child(
                  S.documentTypeList('city')
                    .title('Nueva Ciudad')
                    .canHandleIntent((_name, params) => params.type === 'city')
                ),
              S.listItem()
                .title('🏷️ Nueva Categoría')
                .child(
                  S.documentTypeList('category')
                    .title('Nueva Categoría')
                    .canHandleIntent((_name, params) => params.type === 'category')
                ),
            ])
        ),
    ]);