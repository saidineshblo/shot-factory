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
    httpPath: '/models',
    operationId: 'models.list',
};
exports.tool = {
    name: 'list_models',
    description: 'Get a paginated list of public models.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/models\n```\n\nThe response will be a pagination object containing a list of model objects.\n\nSee the [`models.get`](#models.get) docs for more details about the model object.\n',
    inputSchema: {
        type: 'object',
        properties: {},
    },
};
const handler = async (replicate, args) => {
    return (0, types_1.asTextContentResult)(await replicate.models.list());
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=list-models.js.map