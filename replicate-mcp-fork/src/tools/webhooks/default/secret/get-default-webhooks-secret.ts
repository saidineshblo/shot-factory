// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'webhooks.default.secret',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/webhooks/default/secret',
  operationId: 'webhooks.default.secret.get',
};

export const tool: Tool = {
  name: 'get_default_webhooks_secret',
  description:
    'Get the signing secret for the default webhook endpoint. This is used to verify that webhook requests are coming from Replicate.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/webhooks/default/secret\n```\n\nThe response will be a JSON object with a `key` property:\n\n```json\n{\n  "key": "..."\n}\n```\n',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  return asTextContentResult(await replicate.webhooks.default.secret.get());
};

export default { metadata, tool, handler };
