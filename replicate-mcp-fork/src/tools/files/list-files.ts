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
  httpPath: '/files',
  operationId: 'files.list',
};

export const tool: Tool = {
  name: 'list_files',
  description:
    'Get a paginated list of all files created by the user or organization associated with the provided API token.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Token $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/files\n```\n\nThe response will be a paginated JSON array of file objects, sorted with the most recent file first.\n',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  return asTextContentResult(await replicate.files.list());
};

export default { metadata, tool, handler };
