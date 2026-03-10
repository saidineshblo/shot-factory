// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'models.examples',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/models/{model_owner}/{model_name}/examples',
  operationId: 'models.examples.list',
};

export const tool: Tool = {
  name: 'list_models_examples',
  description:
    'List [example predictions](https://replicate.com/docs/topics/models/publish-a-model#what-are-examples) made using the model.\nThese are predictions that were saved by the model author as illustrative examples of the model\'s capabilities.\n\nIf you want all the examples for a model, use this operation.\n\nIf you just want the model\'s default example, you can use the [`models.get`](#models.get) operation instead, which includes a `default_example` object.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/models/replicate/hello-world/examples\n```\n\nThe response will be a pagination object containing a list of example predictions:\n\n```json\n{\n  "next": "https://api.replicate.com/v1/models/replicate/hello-world/examples?cursor=...",\n  "previous": "https://api.replicate.com/v1/models/replicate/hello-world/examples?cursor=...",\n  "results": [...]\n}\n```\n\nEach item in the `results` list is a [prediction object](#predictions.get).\n',
  inputSchema: {
    type: 'object',
    properties: {
      model_owner: {
        type: 'string',
      },
      model_name: {
        type: 'string',
      },
    },
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  await replicate.models.examples.list(body);
  return asTextContentResult('Successful tool call');
};

export default { metadata, tool, handler };
