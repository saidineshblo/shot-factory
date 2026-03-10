// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'trainings',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/trainings/{training_id}/cancel',
  operationId: 'trainings.cancel',
};

export const tool: Tool = {
  name: 'cancel_trainings',
  description: 'Cancel a training',
  inputSchema: {
    type: 'object',
    properties: {
      training_id: {
        type: 'string',
      },
    },
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await replicate.trainings.cancel(body));
};

export default { metadata, tool, handler };
