"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'trainings',
    operation: 'write',
    tags: [],
    httpMethod: 'post',
    httpPath: '/trainings/{training_id}/cancel',
    operationId: 'trainings.cancel',
};
exports.tool = {
    name: 'cancel_trainings',
    description: 'Cancel a training',
    inputSchema: {
        type: 'object',
        properties: {
            training_id: {
                type: 'string',
            },
        },
    },
};
const handler = async (replicate, args) => {
    const body = args;
    return (0, types_1.asTextContentResult)(await replicate.trainings.cancel(body));
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=cancel-trainings.js.map