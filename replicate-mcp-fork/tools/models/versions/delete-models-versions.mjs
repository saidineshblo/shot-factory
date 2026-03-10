// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { asTextContentResult } from 'replicate-mcp/tools/types';
export const metadata = {
    resource: 'models.versions',
    operation: 'write',
    tags: [],
    httpMethod: 'delete',
    httpPath: '/models/{model_owner}/{model_name}/versions/{version_id}',
    operationId: 'models.versions.delete',
};
export const tool = {
    name: 'delete_models_versions',
    description: 'Delete a model version and all associated predictions, including all output files.\n\nModel version deletion has some restrictions:\n\n- You can only delete versions from models you own.\n- You can only delete versions from private models.\n- You cannot delete a version if someone other than you has run predictions with it.\n- You cannot delete a version if it is being used as the base model for a fine tune/training.\n- You cannot delete a version if it has an associated deployment.\n- You cannot delete a version if another model version is overridden to use it.\n\nExample cURL request:\n\n```command\ncurl -s -X DELETE \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/models/replicate/hello-world/versions/5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa\n```\n\nThe response will be an empty 202, indicating the deletion request has been accepted. It might take a few minutes to be processed.\n',
    inputSchema: {
        type: 'object',
        properties: {
            model_owner: {
                type: 'string',
            },
            model_name: {
                type: 'string',
            },
            version_id: {
                type: 'string',
            },
        },
    },
};
export const handler = async (replicate, args) => {
    const body = args;
    await replicate.models.versions.delete(body);
    return asTextContentResult('Successful tool call');
};
export default { metadata, tool, handler };
//# sourceMappingURL=delete-models-versions.mjs.map