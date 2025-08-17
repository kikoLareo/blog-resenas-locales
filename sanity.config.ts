"use client";

/** Studio principal: unificado con nuestros esquemas (venue/review/city/post/category) y estructura custom */
import { defineConfig } from 'sanity';
import { structure } from './sanity/desk/structure';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { colorInput } from '@sanity/color-input';

import { apiVersion, dataset, projectId } from './sanity/env';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({ structure }),
    colorInput(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});