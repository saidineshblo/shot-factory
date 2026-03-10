"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'models',
    operation: 'write',
    tags: [],
    httpMethod: 'delete',
    httpPath: '/models/{model_owner}/{model_name}',
    operationId: 'models.delete',
};
exports.tool = {
    name: 'delete_models',
    description: 'Delete a model\n\nModel deletion has some restrictions:\n\n- You can only delete models you own.\n- You can only delete private models.\n- You can only delete models that have no versions associated with them. Currently you\'ll need to [delete the model\'s versions](#models.versions.delete) before you can delete the model itself.\n\nExample cURL request:\n\n```command\ncurl -s -X DELETE \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/models/replicate/hello-world\n```\n\nThe response will be an empty 204, indicating the model has been deleted.\n',
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
const handler = async (replicate, args) => {
    const body = args;
    await replicate.models.delete(body);
    return (0, types_1.asTextContentResult)('Successful tool call');
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=delete-models.js.map