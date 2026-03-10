// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { asTextContentResult } from 'replicate-mcp/tools/types';
export const metadata = {
    resource: 'account',
    operation: 'read',
    tags: [],
    httpMethod: 'get',
    httpPath: '/account',
    operationId: 'account.get',
};
export const tool = {
    name: 'get_account',
    description: 'Returns information about the user or organization associated with the provided API token.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/account\n```\n\nThe response will be a JSON object describing the account:\n\n```json\n{\n  "type": "organization",\n  "username": "acme",\n  "name": "Acme Corp, Inc.",\n  "github_url": "https://github.com/acme",\n}\n```\n',
    inputSchema: {
        type: 'object',
        properties: {},
    },
};
export const handler = async (replicate, args) => {
    return asTextContentResult(await replicate.account.get());
};
export default { metadata, tool, handler };
//# sourceMappingURL=get-account.mjs.map