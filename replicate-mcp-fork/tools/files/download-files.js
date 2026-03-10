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
    httpPath: '/files/{file_id}/download',
    operationId: 'files.download',
};
exports.tool = {
    name: 'download_files',
    description: 'Download a file by providing the file owner, access expiry, and a valid signature.\n\nExample cURL request:\n\n```console\ncurl -X GET "https://api.replicate.com/v1/files/cneqzikepnug6xezperrr4z55o/download?expiry=1708515345&owner=mattt&signature=zuoghqlrcnw8YHywkpaXQlHsVhWen%2FDZ4aal76dLiOo%3D"\n```\n',
    inputSchema: {
        type: 'object',
        properties: {
            file_id: {
                type: 'string',
            },
            expiry: {
                type: 'integer',
                description: 'A Unix timestamp with expiration date of this download URL',
            },
            owner: {
                type: 'string',
                description: 'The username of the user or organization that uploaded the file',
            },
            signature: {
                type: 'string',
                description: "A base64-encoded HMAC-SHA256 checksum of the string '{owner} {id} {expiry}' generated with the Files API signing secret",
            },
        },
    },
};
const handler = async (replicate, args) => {
    const body = args;
    return (0, types_1.asBinaryContentResult)(await replicate.files.download(body));
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=download-files.js.map