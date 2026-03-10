// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'deployments',
  operation: 'write',
  tags: [],
  httpMethod: 'delete',
  httpPath: '/deployments/{deployment_owner}/{deployment_name}',
  operationId: 'deployments.delete',
};

export const tool: Tool = {
  name: 'delete_deployments',
  description:
    'Delete a deployment\n\nDeployment deletion has some restrictions:\n\n- You can only delete deployments that have been offline and unused for at least 15 minutes.\n\nExample cURL request:\n\n```command\ncurl -s -X DELETE \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/deployments/acme/my-app-image-generator\n```\n\nThe response will be an empty 204, indicating the deployment has been deleted.\n',
  inputSchema: {
    type: 'object',
    properties: {
      deployment_owner: {
        type: 'string',
      },
      deployment_name: {
        type: 'string',
      },
    },
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  await replicate.deployments.delete(body);
  return asTextContentResult('Successful tool call');
};

export default { metadata, tool, handler };
