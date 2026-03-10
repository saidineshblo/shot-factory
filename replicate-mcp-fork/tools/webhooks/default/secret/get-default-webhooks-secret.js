"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'webhooks.default.secret',
    operation: 'read',
    tags: [],
    httpMethod: 'get',
    httpPath: '/webhooks/default/secret',
    operationId: 'webhooks.default.secret.get',
};
exports.tool = {
    name: 'get_default_webhooks_secret',
    description: 'Get the signing secret for the default webhook endpoint. This is used to verify that webhook requests are coming from Replicate.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/webhooks/default/secret\n```\n\nThe response will be a JSON object with a `key` property:\n\n```json\n{\n  "key": "..."\n}\n```\n',
    inputSchema: {
        type: 'object',
        properties: {},
    },
};
const handler = async (replicate, args) => {
    return (0, types_1.asTextContentResult)(await replicate.webhooks.default.secret.get());
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=get-default-webhooks-secret.js.map