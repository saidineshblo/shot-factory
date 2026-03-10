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
    httpPath: '/models/{model_owner}/{model_name}/versions/{version_id}',
    operationId: 'models.versions.get',
};
exports.tool = {
    name: 'get_models_versions',
    description: 'Example cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/models/replicate/hello-world/versions/5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa\n```\n\nThe response will be the version object:\n\n```json\n{\n  "id": "5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa",\n  "created_at": "2022-04-26T19:29:04.418669Z",\n  "cog_version": "0.3.0",\n  "openapi_schema": {...}\n}\n```\n\nEvery model describes its inputs and outputs with [OpenAPI Schema Objects](https://spec.openapis.org/oas/latest.html#schemaObject) in the `openapi_schema` property.\n\nThe `openapi_schema.components.schemas.Input` property for the [replicate/hello-world](https://replicate.com/replicate/hello-world) model looks like this:\n\n```json\n{\n  "type": "object",\n  "title": "Input",\n  "required": [\n    "text"\n  ],\n  "properties": {\n    "text": {\n      "x-order": 0,\n      "type": "string",\n      "title": "Text",\n      "description": "Text to prefix with \'hello \'"\n    }\n  }\n}\n```\n\nThe `openapi_schema.components.schemas.Output` property for the [replicate/hello-world](https://replicate.com/replicate/hello-world) model looks like this:\n\n```json\n{\n  "type": "string",\n  "title": "Output"\n}\n```\n\nFor more details, see the docs on [Cog\'s supported input and output types](https://github.com/replicate/cog/blob/75b7802219e7cd4cee845e34c4c22139558615d4/docs/python.md#input-and-output-types)\n',
    inputSchema: {
        type: 'object',
        properties: {
            model_owner: {
                type: 'string',
            },
            model_name: {
                type: 'string',
            },
            version_id: {
                type: 'string',
            },
        },
    },
};
const handler = async (replicate, args) => {
    const body = args;
    await replicate.models.versions.get(body);
    return (0, types_1.asTextContentResult)('Successful tool call');
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=get-models-versions.js.map