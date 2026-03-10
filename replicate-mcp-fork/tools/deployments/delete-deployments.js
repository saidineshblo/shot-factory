"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'deployments',
    operation: 'write',
    tags: [],
    httpMethod: 'delete',
    httpPath: '/deployments/{deployment_owner}/{deployment_name}',
    operationId: 'deployments.delete',
};
exports.tool = {
    name: 'delete_deployments',
    description: 'Delete a deployment\n\nDeployment deletion has some restrictions:\n\n- You can only delete deployments that have been offline and unused for at least 15 minutes.\n\nExample cURL request:\n\n```command\ncurl -s -X DELETE \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/deployments/acme/my-app-image-generator\n```\n\nThe response will be an empty 204, indicating the deployment has been deleted.\n',
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
const handler = async (replicate, args) => {
    const body = args;
    await replicate.deployments.delete(body);
    return (0, types_1.asTextContentResult)('Successful tool call');
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=delete-deployments.js.map