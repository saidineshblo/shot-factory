// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'models',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/models',
  operationId: 'models.list',
};

export const tool: Tool = {
  name: 'list_models',
  description:
    'Get a paginated list of public models.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/models\n```\n\nThe response will be a pagination object containing a list of model objects.\n\nSee the [`models.get`](#models.get) docs for more details about the model object.\n',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  return asTextContentResult(await replicate.models.list());
};

export default { metadata, tool, handler };
