"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'models',
    operation: 'read',
    tags: [],
    httpMethod: 'get',
    httpPath: '/models/{model_owner}/{model_name}',
    operationId: 'models.get',
};
exports.tool = {
    name: 'get_models',
    description: 'Example cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/models/replicate/hello-world\n```\n\nThe response will be a model object in the following format:\n\n```json\n{\n  "url": "https://replicate.com/replicate/hello-world",\n  "owner": "replicate",\n  "name": "hello-world",\n  "description": "A tiny model that says hello",\n  "visibility": "public",\n  "github_url": "https://github.com/replicate/cog-examples",\n  "paper_url": null,\n  "license_url": null,\n  "run_count": 5681081,\n  "cover_image_url": "...",\n  "default_example": {...},\n  "latest_version": {...},\n}\n```\n\nThe model object includes the [input and output schema](https://replicate.com/docs/reference/openapi#model-schemas) for the latest version of the model.\n\nHere\'s an example showing how to fetch the model with cURL and display its input schema with [jq](https://stedolan.github.io/jq/):\n\n```console\ncurl -s \\\n    -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n    https://api.replicate.com/v1/models/replicate/hello-world \\\n    | jq ".latest_version.openapi_schema.components.schemas.Input"\n```\n\nThis will return the following JSON object:\n\n```json\n{\n  "type": "object",\n  "title": "Input",\n  "required": [\n    "text"\n  ],\n  "properties": {\n    "text": {\n      "type": "string",\n      "title": "Text",\n      "x-order": 0,\n      "description": "Text to prefix with \'hello \'"\n    }\n  }\n}\n``` \n\nThe `cover_image_url` string is an HTTPS URL for an image file. This can be:\n\n- An image uploaded by the model author.\n- The output file of the example prediction, if the model author has not set a cover image.\n- The input file of the example prediction, if the model author has not set a cover image and the example prediction has no output file.\n- A generic fallback image.\n\nThe `default_example` object is a [prediction](#predictions.get) created with this model.\n\nThe `latest_version` object is the model\'s most recently pushed [version](#models.versions.get).\n',
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
    await replicate.models.get(body);
    return (0, types_1.asTextContentResult)('Successful tool call');
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=get-models.js.map