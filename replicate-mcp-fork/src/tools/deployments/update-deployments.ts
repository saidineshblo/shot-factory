// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'deployments',
  operation: 'write',
  tags: [],
  httpMethod: 'patch',
  httpPath: '/deployments/{deployment_owner}/{deployment_name}',
  operationId: 'deployments.update',
};

export const tool: Tool = {
  name: 'update_deployments',
  description:
    'Update properties of an existing deployment, including hardware, min/max instances, and the deployment\'s underlying model [version](https://replicate.com/docs/how-does-replicate-work#versions).\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -X PATCH \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"min_instances": 3, "max_instances": 10}\' \\\n  https://api.replicate.com/v1/deployments/acme/my-app-image-generator\n```\n\nThe response will be a JSON object describing the deployment:\n\n```json\n{\n  "owner": "acme",\n  "name": "my-app-image-generator",\n  "current_release": {\n    "number": 2,\n    "model": "stability-ai/sdxl",\n    "version": "da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf",\n    "created_at": "2024-02-15T16:32:57.018467Z",\n    "created_by": {\n      "type": "organization",\n      "username": "acme",\n      "name": "Acme Corp, Inc.",\n      "avatar_url": "https://cdn.replicate.com/avatars/acme.png",\n      "github_url": "https://github.com/acme"\n    },\n    "configuration": {\n      "hardware": "gpu-t4",\n      "min_instances": 3,\n      "max_instances": 10\n    }\n  }\n}\n```\n\nUpdating any deployment properties will increment the `number` field of the `current_release`.\n',
  inputSchema: {
    type: 'object',
    properties: {
      deployment_owner: {
        type: 'string',
      },
      deployment_name: {
        type: 'string',
      },
      hardware: {
        type: 'string',
        description:
          'The SKU for the hardware used to run the model. Possible values can be retrieved from the `hardware.list` endpoint.',
      },
      max_instances: {
        type: 'integer',
        description: 'The maximum number of instances for scaling.',
      },
      min_instances: {
        type: 'integer',
        description: 'The minimum number of instances for scaling.',
      },
      version: {
        type: 'string',
        description: 'The ID of the model version that you want to deploy',
      },
    },
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await replicate.deployments.update(body));
};

export default { metadata, tool, handler };
