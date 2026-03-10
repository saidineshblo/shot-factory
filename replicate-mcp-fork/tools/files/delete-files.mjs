// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { asTextContentResult } from 'replicate-mcp/tools/types';
export const metadata = {
    resource: 'files',
    operation: 'write',
    tags: [],
    httpMethod: 'delete',
    httpPath: '/files/{file_id}',
    operationId: 'files.delete',
};
export const tool = {
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
export const handler = async (replicate, args) => {
    const body = args;
    await replicate.files.delete(body);
    return asTextContentResult('Successful tool call');
};
export default { metadata, tool, handler };
//# sourceMappingURL=delete-files.mjs.map