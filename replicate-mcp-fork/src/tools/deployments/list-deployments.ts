// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'deployments',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/deployments',
  operationId: 'deployments.list',
};

export const tool: Tool = {
  name: 'list_deployments',
  description:
    'Get a list of deployments associated with the current account, including the latest release configuration for each deployment.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/deployments\n```\n\nThe response will be a paginated JSON array of deployment objects, sorted with the most recent deployment first:\n\n```json\n{\n  "next": "http://api.replicate.com/v1/deployments?cursor=cD0yMDIzLTA2LTA2KzIzJTNBNDAlM0EwOC45NjMwMDAlMkIwMCUzQTAw",\n  "previous": null,\n  "results": [\n    {\n      "owner": "replicate",\n      "name": "my-app-image-generator",\n      "current_release": {\n        "number": 1,\n        "model": "stability-ai/sdxl",\n        "version": "da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf",\n        "created_at": "2024-02-15T16:32:57.018467Z",\n        "created_by": {\n          "type": "organization",\n          "username": "acme",\n          "name": "Acme Corp, Inc.",\n          "avatar_url": "https://cdn.replicate.com/avatars/acme.png",\n          "github_url": "https://github.com/acme"\n        },\n        "configuration": {\n          "hardware": "gpu-t4",\n          "min_instances": 1,\n          "max_instances": 5\n        }\n      }\n    }\n  ]\n}\n```\n',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  return asTextContentResult(await replicate.deployments.list());
};

export default { metadata, tool, handler };
