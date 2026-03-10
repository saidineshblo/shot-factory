// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'files',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/files/{file_id}',
  operationId: 'files.get',
};

export const tool: Tool = {
  name: 'get_files',
  description:
    'Get the details of a file.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Token $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/files/cneqzikepnug6xezperrr4z55o\n```\n',
  inputSchema: {
    type: 'object',
    properties: {
      file_id: {
        type: 'string',
      },
    },
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await replicate.files.get(body));
};

export default { metadata, tool, handler };
