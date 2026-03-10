// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'collections',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/collections/{collection_slug}',
  operationId: 'collections.get',
};

export const tool: Tool = {
  name: 'get_collections',
  description:
    'Example cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/collections/super-resolution\n```\n\nThe response will be a collection object with a nested list of the models in that collection:\n\n```json\n{\n  "name": "Super resolution",\n  "slug": "super-resolution",\n  "description": "Upscaling models that create high-quality images from low-quality images.",\n  "models": [...]\n}\n```\n',
  inputSchema: {
    type: 'object',
    properties: {
      collection_slug: {
        type: 'string',
      },
    },
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  await replicate.collections.get(body);
  return asTextContentResult('Successful tool call');
};

export default { metadata, tool, handler };
