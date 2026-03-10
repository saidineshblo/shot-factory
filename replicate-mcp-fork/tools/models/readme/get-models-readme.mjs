// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { asTextContentResult } from 'replicate-mcp/tools/types';
export const metadata = {
    resource: 'models.readme',
    operation: 'read',
    tags: [],
    httpMethod: 'get',
    httpPath: '/models/{model_owner}/{model_name}/readme',
    operationId: 'models.readme.get',
};
export const tool = {
    name: 'get_models_readme',
    description: 'Get the README content for a model.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/models/replicate/hello-world/readme\n```\n\nThe response will be the README content as plain text in Markdown format:\n\n```\n# Hello World Model\n\nThis is an example model that...\n```\n',
    inputSchema: {
        type: 'object',
        properties: {
            model_owner: {
                type: 'string',
            },
            model_name: {
                type: 'string',
            },
        },
    },
};
export const handler = async (replicate, args) => {
    const body = args;
    return asTextContentResult(await replicate.models.readme.get(body));
};
export default { metadata, tool, handler };
//# sourceMappingURL=get-models-readme.mjs.map