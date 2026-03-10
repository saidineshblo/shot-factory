"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'collections',
    operation: 'read',
    tags: [],
    httpMethod: 'get',
    httpPath: '/collections/{collection_slug}',
    operationId: 'collections.get',
};
exports.tool = {
    name: 'get_collections',
    description: 'Example cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/collections/super-resolution\n```\n\nThe response will be a collection object with a nested list of the models in that collection:\n\n```json\n{\n  "name": "Super resolution",\n  "slug": "super-resolution",\n  "description": "Upscaling models that create high-quality images from low-quality images.",\n  "models": [...]\n}\n```\n',
    inputSchema: {
        type: 'object',
        properties: {
            collection_slug: {
                type: 'string',
            },
        },
    },
};
const handler = async (replicate, args) => {
    const body = args;
    await replicate.collections.get(body);
    return (0, types_1.asTextContentResult)('Successful tool call');
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=get-collections.js.map