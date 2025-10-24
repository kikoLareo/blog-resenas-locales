import type { StructureBuilder } from 'sanity/structure';

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
                .title('Reseñas')
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
                .title('Crónicas/Posts')
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

              // Guías Gastronómicas
              S.listItem()
                .title('Guías Gastronómicas')
                .icon(() => '🗺️')
                .child(
                  S.list()
                    .title('Guías Gastronómicas')
                    .items([
                      S.listItem()
                        .title('🌟 Guías Destacadas')
                        .child(
                          S.documentTypeList('guide')
                            .title('Guías Destacadas')
                            .filter('_type == "guide" && featured == true')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('🗺️ Todas las Guías')
                        .child(
                          S.documentTypeList('guide')
                            .title('Todas las Guías')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('🏙️ Guías por Barrio')
                        .child(
                          S.documentTypeList('guide')
                            .title('Guías por Barrio')
                            .filter('_type == "guide" && type == "neighborhood"')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('💰 Guías Económicas')
                        .child(
                          S.documentTypeList('guide')
                            .title('Guías Económicas')
                            .filter('_type == "guide" && type == "budget"')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                    ])
                ),

              // Listas y Rankings
              S.listItem()
                .title('Listas y Rankings')
                .icon(() => '📋')
                .child(
                  S.list()
                    .title('Listas y Rankings')
                    .items([
                      S.listItem()
                        .title('⭐ Listas Destacadas')
                        .child(
                          S.documentTypeList('list')
                            .title('Listas Destacadas')
                            .filter('_type == "list" && featured == true')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('📋 Todas las Listas')
                        .child(
                          S.documentTypeList('list')
                            .title('Todas las Listas')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('🍽️ Rankings por Plato')
                        .child(
                          S.documentTypeList('list')
                            .title('Rankings por Plato')
                            .filter('_type == "list" && listType == "top-dish"')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                    ])
                ),

              // Recetas
              S.listItem()
                .title('Recetas')
                .icon(() => '👨‍🍳')
                .child(
                  S.list()
                    .title('Recetas')
                    .items([
                      S.listItem()
                        .title('🌟 Recetas Destacadas')
                        .child(
                          S.documentTypeList('recipe')
                            .title('Recetas Destacadas')
                            .filter('_type == "recipe" && featured == true')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('👨‍🍳 Todas las Recetas')
                        .child(
                          S.documentTypeList('recipe')
                            .title('Todas las Recetas')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('🇪🇸 Recetas Tradicionales')
                        .child(
                          S.documentTypeList('recipe')
                            .title('Recetas Tradicionales')
                            .filter('_type == "recipe" && recipeType == "tradicional"')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                    ])
                ),

              // Guías de Platos
              S.listItem()
                .title('Guías de Platos')
                .icon(() => '🍽️')
                .child(
                  S.documentTypeList('dish-guide')
                    .title('Guías de Platos')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),

              // Noticias y Tendencias
              S.listItem()
                .title('Noticias')
                .icon(() => '📰')
                .child(
                  S.list()
                    .title('Noticias')
                    .items([
                      S.listItem()
                        .title('🌟 Noticias Destacadas')
                        .child(
                          S.documentTypeList('news')
                            .title('Noticias Destacadas')
                            .filter('_type == "news" && featured == true')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('📰 Todas las Noticias')
                        .child(
                          S.documentTypeList('news')
                            .title('Todas las Noticias')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('📈 Tendencias')
                        .child(
                          S.documentTypeList('news')
                            .title('Tendencias Gastronómicas')
                            .filter('_type == "news" && category == "tendencias"')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                    ])
                ),

              // Ofertas
              S.listItem()
                .title('Ofertas')
                .icon(() => '🎁')
                .child(
                  S.list()
                    .title('Ofertas')
                    .items([
                      S.listItem()
                        .title('🔥 Ofertas Activas')
                        .child(
                          S.documentTypeList('offer')
                            .title('Ofertas Activas')
                            .filter('_type == "offer" && validUntil > now()')
                            .defaultOrdering([{ field: 'validUntil', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('⭐ Ofertas Destacadas')
                        .child(
                          S.documentTypeList('offer')
                            .title('Ofertas Destacadas')
                            .filter('_type == "offer" && featured == true')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('🎁 Todas las Ofertas')
                        .child(
                          S.documentTypeList('offer')
                            .title('Todas las Ofertas')
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
                .title('Locales')
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
                            .child((cityId: string) =>
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
                .title('Ciudades')
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
                .title('Categorías')
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

      // Configuración de Homepage
      S.listItem()
        .title('🎨 Configuración de Homepage')
        .icon(() => '🎨')
        .child(
          S.document()
            .schemaType('homepageConfig')
            .documentId('homepage-config')
            .title('Configuración de Homepage')
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
                    .canHandleIntent((_name: string, params: { type?: string }) => params.type === 'review')
                ),
              S.listItem()
                .title('📝 Nuevo Post')
                .child(
                  S.documentTypeList('post')
                    .title('Nuevo Post')
                    .canHandleIntent((_name: string, params: { type?: string }) => params.type === 'post')
                ),
              S.listItem()
                .title('🗺️ Nueva Guía')
                .child(
                  S.documentTypeList('guide')
                    .title('Nueva Guía')
                    .canHandleIntent((_name: string, params: { type?: string }) => params.type === 'guide')
                ),
              S.listItem()
                .title('📋 Nueva Lista')
                .child(
                  S.documentTypeList('list')
                    .title('Nueva Lista')
                    .canHandleIntent((_name: string, params: { type?: string }) => params.type === 'list')
                ),
              S.listItem()
                .title('👨‍🍳 Nueva Receta')
                .child(
                  S.documentTypeList('recipe')
                    .title('Nueva Receta')
                    .canHandleIntent((_name: string, params: { type?: string }) => params.type === 'recipe')
                ),
              S.listItem()
                .title('🍽️ Nueva Guía de Plato')
                .child(
                  S.documentTypeList('dish-guide')
                    .title('Nueva Guía de Plato')
                    .canHandleIntent((_name: string, params: { type?: string }) => params.type === 'dish-guide')
                ),
              S.listItem()
                .title('📰 Nueva Noticia')
                .child(
                  S.documentTypeList('news')
                    .title('Nueva Noticia')
                    .canHandleIntent((_name: string, params: { type?: string }) => params.type === 'news')
                ),
              S.listItem()
                .title('🎁 Nueva Oferta')
                .child(
                  S.documentTypeList('offer')
                    .title('Nueva Oferta')
                    .canHandleIntent((_name: string, params: { type?: string }) => params.type === 'offer')
                ),
              S.divider(),
              S.listItem()
                .title('🏪 Nuevo Local')
                .child(
                  S.documentTypeList('venue')
                    .title('Nuevo Local')
                    .canHandleIntent((_name: string, params: { type?: string }) => params.type === 'venue')
                ),
              S.listItem()
                .title('🏙️ Nueva Ciudad')
                .child(
                  S.documentTypeList('city')
                    .title('Nueva Ciudad')
                    .canHandleIntent((_name: string, params: { type?: string }) => params.type === 'city')
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