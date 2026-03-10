// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'models',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/models',
  operationId: 'models.create',
};

export const tool: Tool = {
  name: 'create_models',
  description:
    'Create a model.\n\nExample cURL request:\n\n```console\ncurl -s -X POST \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  -H \'Content-Type: application/json\' \\\n  -d \'{"owner": "alice", "name": "hot-dog-detector", "description": "Detect hot dogs in images", "visibility": "public", "hardware": "cpu"}\' \\\n  https://api.replicate.com/v1/models\n```\n\nThe response will be a model object in the following format:\n\n```json\n{\n  "url": "https://replicate.com/alice/hot-dog-detector",\n  "owner": "alice",\n  "name": "hot-dog-detector",\n  "description": "Detect hot dogs in images",\n  "visibility": "public",\n  "github_url": null,\n  "paper_url": null,\n  "license_url": null,\n  "run_count": 0,\n  "cover_image_url": null,\n  "default_example": null,\n  "latest_version": null,\n}\n```\n\nNote that there is a limit of 1,000 models per account. For most purposes, we recommend using a single model and pushing new [versions](https://replicate.com/docs/how-does-replicate-work#versions) of the model as you make changes to it.\n',
  inputSchema: {
    type: 'object',
    properties: {
      hardware: {
        type: 'string',
        description:
          'The SKU for the hardware used to run the model. Possible values can be retrieved from the `hardware.list` endpoint.',
      },
      name: {
        type: 'string',
        description:
          'The name of the model. This must be unique among all models owned by the user or organization.',
      },
      owner: {
        type: 'string',
        description:
          'The name of the user or organization that will own the model. This must be the same as the user or organization that is making the API request. In other words, the API token used in the request must belong to this user or organization.',
      },
      visibility: {
        type: 'string',
        description:
          'Whether the model should be public or private. A public model can be viewed and run by anyone, whereas a private model can be viewed and run only by the user or organization members that own the model.',
        enum: ['public', 'private'],
      },
      cover_image_url: {
        type: 'string',
        description: "A URL for the model's cover image. This should be an image file.",
      },
      description: {
        type: 'string',
        description: 'A description of the model.',
      },
      github_url: {
        type: 'string',
        description: "A URL for the model's source code on GitHub.",
      },
      license_url: {
        type: 'string',
        description: "A URL for the model's license.",
      },
      paper_url: {
        type: 'string',
        description: "A URL for the model's paper.",
      },
    },
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  await replicate.models.create(body);
  return asTextContentResult('Successful tool call');
};

export default { metadata, tool, handler };
