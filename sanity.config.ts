/**
 * This configuration is used to for the Sanity Studio that's mounted on the `\studio` route
 */
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

// Import schemas
import { schemaTypes } from './sanity/schemas';
import { structure } from './sanity/desk/structure';

// Define the actions that should be available for singleton documents
const singletonActions = new Set(['publish', 'discardChanges', 'restore']);

// Define the singleton document types
const singletonTypes = new Set(['settings']);

export default defineConfig({
  name: 'blog-resenas-locales',
  title: 'Blog de Reseñas de Locales',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
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
  },
  tools: (prev) => {
    // Show the vision tool only in development
    if (process.env.NODE_ENV === 'development') {
      return prev;
    }
    return prev.filter((tool) => tool.name !== 'vision');
  },
});
