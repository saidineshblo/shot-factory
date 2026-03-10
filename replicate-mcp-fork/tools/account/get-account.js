"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'account',
    operation: 'read',
    tags: [],
    httpMethod: 'get',
    httpPath: '/account',
    operationId: 'account.get',
};
exports.tool = {
    name: 'get_account',
    description: 'Returns information about the user or organization associated with the provided API token.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/account\n```\n\nThe response will be a JSON object describing the account:\n\n```json\n{\n  "type": "organization",\n  "username": "acme",\n  "name": "Acme Corp, Inc.",\n  "github_url": "https://github.com/acme",\n}\n```\n',
    inputSchema: {
        type: 'object',
        properties: {},
    },
};
const handler = async (replicate, args) => {
    return (0, types_1.asTextContentResult)(await replicate.account.get());
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=get-account.js.map