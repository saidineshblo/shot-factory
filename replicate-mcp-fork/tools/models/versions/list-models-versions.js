"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'models.versions',
    operation: 'read',
    tags: [],
    httpMethod: 'get',
    httpPath: '/models/{model_owner}/{model_name}/versions',
    operationId: 'models.versions.list',
};
exports.tool = {
    name: 'list_models_versions',
    description: 'Example cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/models/replicate/hello-world/versions\n```\n\nThe response will be a JSON array of model version objects, sorted with the most recent version first:\n\n```json\n{\n  "next": null,\n  "previous": null,\n  "results": [\n    {\n      "id": "5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa",\n      "created_at": "2022-04-26T19:29:04.418669Z",\n      "cog_version": "0.3.0",\n      "openapi_schema": {...}\n    }\n  ]\n}\n```\n',
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
    await replicate.models.versions.list(body);
    return (0, types_1.asTextContentResult)('Successful tool call');
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=list-models-versions.js.map