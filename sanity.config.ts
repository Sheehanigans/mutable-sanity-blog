import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './sanity/schemas'
import { apiVersion, dataset, projectId } from './sanity/env'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'Blog Studio',
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion }),
    codeInput(),
  ],
  schema: {
    types: schemaTypes,
  },
})
