"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'files',
    operation: 'read',
    tags: [],
    httpMethod: 'get',
    httpPath: '/files/{file_id}',
    operationId: 'files.get',
};
exports.tool = {
    name: 'get_files',
    description: 'Get the details of a file.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Token $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/files/cneqzikepnug6xezperrr4z55o\n```\n',
    inputSchema: {
        type: 'object',
        properties: {
            file_id: {
                type: 'string',
            },
        },
    },
};
const handler = async (replicate, args) => {
    const body = args;
    return (0, types_1.asTextContentResult)(await replicate.files.get(body));
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=get-files.js.map