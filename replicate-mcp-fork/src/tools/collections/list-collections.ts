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
  httpPath: '/collections',
  operationId: 'collections.list',
};

export const tool: Tool = {
  name: 'list_collections',
  description:
    'Example cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/collections\n```\n\nThe response will be a paginated JSON list of collection objects:\n\n```json\n{\n  "next": "null",\n  "previous": null,\n  "results": [\n    {\n      "name": "Super resolution",\n      "slug": "super-resolution",\n      "description": "Upscaling models that create high-quality images from low-quality images."\n    }\n  ]\n}\n```\n',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  await replicate.collections.list();
  return asTextContentResult('Successful tool call');
};

export default { metadata, tool, handler };
