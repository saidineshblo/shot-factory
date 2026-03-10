"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'models.readme',
    operation: 'read',
    tags: [],
    httpMethod: 'get',
    httpPath: '/models/{model_owner}/{model_name}/readme',
    operationId: 'models.readme.get',
};
exports.tool = {
    name: 'get_models_readme',
    description: 'Get the README content for a model.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/models/replicate/hello-world/readme\n```\n\nThe response will be the README content as plain text in Markdown format:\n\n```\n# Hello World Model\n\nThis is an example model that...\n```\n',
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
    return (0, types_1.asTextContentResult)(await replicate.models.readme.get(body));
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=get-models-readme.js.map