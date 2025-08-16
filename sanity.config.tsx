/**
 * This configuration is used to for the Sanity Studio that's mounted on the `\studio` route
 */
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { colorInput } from '@sanity/color-input';
// import { orderableDocumentListPlugin } from '@sanity/orderable-document-list';

// Import schemas
import { schemaTypes } from './sanity/schemas';
import { structure } from './sanity/desk/structure';

// Define the actions that should be available for singleton documents
const singletonActions = new Set(['publish', 'discardChanges', 'restore']);

// Define the singleton document types
const singletonTypes = new Set(['settings']);

type DocWithSlug = { slug?: { current?: string } } & Record<string, unknown>;
	export default defineConfig({
  name: 'blog-resenas-locales',
  title: 'Blog de Reseñas de Locales',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  
  plugins: [
    structureTool({
      structure,
      defaultDocumentNode: (S, { schemaType }) => {
        // Personalizar vista por defecto según el tipo de documento
        switch (schemaType) {
          case 'review':
            return S.document().views([
              S.view.form(),
              S.view
                .component(() => 
                  <div style={{ padding: '20px' }}>
                    <h3>Vista previa de la reseña</h3>
                    <p>Aquí se mostraría una vista previa de cómo se ve la reseña en el sitio web.</p>
                  </div>
                )
                .title('Vista previa')
                .icon(() => '👁️'),
            ]);
          case 'venue':
            return S.document().views([
              S.view.form(),
              S.view
                .component(() => 
                  <div style={{ padding: '20px' }}>
                    <h3>Vista previa del local</h3>
                    <p>Aquí se mostraría una vista previa de la página del local.</p>
                  </div>
                )
                .title('Vista previa')
                .icon(() => '👁️'),
            ]);
          case 'post':
            return S.document().views([
              S.view.form(),
              S.view
                .component(() => 
                  <div style={{ padding: '20px' }}>
                    <h3>Vista previa del post</h3>
                    <p>Aquí se mostraría una vista previa del artículo/crónica.</p>
                  </div>
                )
                .title('Vista previa')
                .icon(() => '👁️'),
            ]);
          default:
            return S.document().views([S.view.form()]);
        }
      },
    }),
    
    // Plugin para manejar colores
    colorInput(),
    
    // Plugin para ordenar documentos (opcional)
    // orderableDocumentListPlugin({
    //   type: 'category',
    //   title: 'Ordenar Categorías',
    // }),
    
    // Plugin Vision para desarrollo
    visionTool({
      defaultApiVersion: '2024-01-01',
    }),
  ],
  
  schema: {
    types: schemaTypes,
    // Filter out singleton types from the global "New document" menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  
  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` list defined above
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
        
    // Configurar campos computados y validaciones
    productionUrl: async (prev, { document }) => {
      // URL base del sitio (reemplazar con tu dominio real)
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const d = (document || {}) as DocWithSlug;
      if (!d.slug?.current) return prev;
      
      switch ((document as any)._type) {
        case 'review':
          // TODO: En producción necesitará city.slug/venue.slug
          return `${baseUrl}/${d.slug?.current}`;
        case 'venue':
          // TODO: En producción necesitará city.slug
          return `${baseUrl}/${d.slug?.current}`;
        case 'post':
          return `${baseUrl}/blog/${d.slug?.current}`;
        case 'city':
          return `${baseUrl}/${d.slug?.current}`;
        case 'category':
          return `${baseUrl}/categorias/${d.slug?.current}`;
        default:
          return prev;
      }
    },
  },
  
  tools: (prev) => {
    // Show the vision tool only in development
    if (process.env.NODE_ENV === 'development') {
      return prev;
    }
    return prev.filter((tool) => tool.name !== 'vision');
  },
  
  // Configuraciones adicionales del Studio
  studio: {
    components: {
      // Personalizar el logo del Studio
      logo: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🍽️</span>
          <span style={{ fontWeight: 'bold', color: '#1f2937' }}>
            Reseñas Locales
          </span>
        </div>
      ),
    },
  },
  
  // Configurar la búsqueda: usar la configuración por defecto por compatibilidad
  // search: {},
  
  // Configurar la API
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: process.env.NODE_ENV === 'production',
    stega: {
      enabled: process.env.NODE_ENV === 'development',
    },
  },
});
