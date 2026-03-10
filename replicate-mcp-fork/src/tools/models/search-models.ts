// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'models',
  operation: 'write',
  tags: [],
  httpMethod: 'query',
  httpPath: '/models',
  operationId: 'models.search',
};

export const tool: Tool = {
  name: 'search_models',
  description:
    'Get a list of public models matching a search query.\n\nExample cURL request:\n\n```console\ncurl -s -X QUERY \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  -H "Content-Type: text/plain" \\\n  -d "hello" \\\n  https://api.replicate.com/v1/models\n```\n\nThe response will be a paginated JSON object containing an array of model objects.\n\nSee the [`models.get`](#models.get) docs for more details about the model object.\n',
  inputSchema: {
    type: 'object',
    properties: {
      body: {
        type: 'string',
        description: 'The search query',
      },
    },
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  await replicate.models.search(body);
  return asTextContentResult('Successful tool call');
};

export default { metadata, tool, handler };
