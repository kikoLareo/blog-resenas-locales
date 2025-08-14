import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      // Reseñas
      S.listItem()
        .title('Reseñas')
        .icon(() => '⭐')
        .child(
          S.documentTypeList('review')
            .title('Todas las Reseñas')
            .filter('_type == "review"')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),

      // Locales/Venues
      S.listItem()
        .title('Locales')
        .icon(() => '🏪')
        .child(
          S.documentTypeList('venue')
            .title('Todos los Locales')
            .filter('_type == "venue"')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      // Posts/Crónicas
      S.listItem()
        .title('Crónicas')
        .icon(() => '📝')
        .child(
          S.documentTypeList('post')
            .title('Todas las Crónicas')
            .filter('_type == "post"')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),

      S.divider(),

      // Configuración
      S.listItem()
        .title('Configuración')
        .icon(() => '⚙️')
        .child(
          S.list()
            .title('Configuración')
            .items([
              S.listItem()
                .title('Ciudades')
                .icon(() => '🏙️')
                .child(
                  S.documentTypeList('city')
                    .title('Ciudades')
                    .defaultOrdering([{ field: 'title', direction: 'asc' }])
                ),
              S.listItem()
                .title('Categorías')
                .icon(() => '🏷️')
                .child(
                  S.documentTypeList('category')
                    .title('Categorías')
                    .defaultOrdering([{ field: 'title', direction: 'asc' }])
                ),
            ])
        ),
    ]);