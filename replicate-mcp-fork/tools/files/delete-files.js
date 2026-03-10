"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'files',
    operation: 'write',
    tags: [],
    httpMethod: 'delete',
    httpPath: '/files/{file_id}',
    operationId: 'files.delete',
};
exports.tool = {
    name: 'delete_files',
    description: 'Delete a file. Once a file has been deleted, subsequent requests to the file resource return 404 Not found.\n\nExample cURL request:\n\n```console\ncurl -X DELETE \\\n  -H "Authorization: Token $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/files/cneqzikepnug6xezperrr4z55o\n```\n',
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
    await replicate.files.delete(body);
    return (0, types_1.asTextContentResult)('Successful tool call');
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=delete-files.js.map