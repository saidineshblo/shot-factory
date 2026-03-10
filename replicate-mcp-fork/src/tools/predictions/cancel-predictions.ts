// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'predictions',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/predictions/{prediction_id}/cancel',
  operationId: 'predictions.cancel',
};

export const tool: Tool = {
  name: 'cancel_predictions',
  description:
    'Cancel a prediction that is currently running.\n\nExample cURL request that creates a prediction and then cancels it:\n\n```console\n# First, create a prediction\nPREDICTION_ID=$(curl -s -X POST \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "input": {\n      "prompt": "a video that may take a while to generate"\n    }\n  }\' \\\n  https://api.replicate.com/v1/models/minimax/video-01/predictions | jq -r \'.id\')\n\n# Echo the prediction ID\necho "Created prediction with ID: $PREDICTION_ID"\n\n# Cancel the prediction\ncurl -s -X POST \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/predictions/$PREDICTION_ID/cancel\n```\n',
  inputSchema: {
    type: 'object',
    properties: {
      prediction_id: {
        type: 'string',
      },
    },
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await replicate.predictions.cancel(body));
};

export default { metadata, tool, handler };
