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
    httpPath: '/collections',
    operationId: 'collections.list',
};
exports.tool = {
    name: 'list_collections',
    description: 'Example cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/collections\n```\n\nThe response will be a paginated JSON list of collection objects:\n\n```json\n{\n  "next": "null",\n  "previous": null,\n  "results": [\n    {\n      "name": "Super resolution",\n      "slug": "super-resolution",\n      "description": "Upscaling models that create high-quality images from low-quality images."\n    }\n  ]\n}\n```\n',
    inputSchema: {
        type: 'object',
        properties: {},
    },
};
const handler = async (replicate, args) => {
    await replicate.collections.list();
    return (0, types_1.asTextContentResult)('Successful tool call');
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=list-collections.js.map