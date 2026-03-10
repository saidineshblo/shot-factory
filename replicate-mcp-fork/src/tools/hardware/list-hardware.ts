// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'hardware',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/hardware',
  operationId: 'hardware.list',
};

export const tool: Tool = {
  name: 'list_hardware',
  description:
    'Example cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/hardware\n```\n\nThe response will be a JSON array of hardware objects:\n\n```json\n[\n    {"name": "CPU", "sku": "cpu"},\n    {"name": "Nvidia T4 GPU", "sku": "gpu-t4"},\n    {"name": "Nvidia A40 GPU", "sku": "gpu-a40-small"},\n    {"name": "Nvidia A40 (Large) GPU", "sku": "gpu-a40-large"},\n]\n```\n',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  return asTextContentResult(await replicate.hardware.list());
};

export default { metadata, tool, handler };
