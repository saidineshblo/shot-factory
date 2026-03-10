"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'hardware',
    operation: 'read',
    tags: [],
    httpMethod: 'get',
    httpPath: '/hardware',
    operationId: 'hardware.list',
};
exports.tool = {
    name: 'list_hardware',
    description: 'Example cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/hardware\n```\n\nThe response will be a JSON array of hardware objects:\n\n```json\n[\n    {"name": "CPU", "sku": "cpu"},\n    {"name": "Nvidia T4 GPU", "sku": "gpu-t4"},\n    {"name": "Nvidia A40 GPU", "sku": "gpu-a40-small"},\n    {"name": "Nvidia A40 (Large) GPU", "sku": "gpu-a40-large"},\n]\n```\n',
    inputSchema: {
        type: 'object',
        properties: {},
    },
};
const handler = async (replicate, args) => {
    return (0, types_1.asTextContentResult)(await replicate.hardware.list());
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=list-hardware.js.map