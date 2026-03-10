// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { asTextContentResult } from 'replicate-mcp/tools/types';
export const metadata = {
    resource: 'trainings',
    operation: 'write',
    tags: [],
    httpMethod: 'post',
    httpPath: '/trainings/{training_id}/cancel',
    operationId: 'trainings.cancel',
};
export const tool = {
    name: 'cancel_trainings',
    description: 'Cancel a training',
    inputSchema: {
        type: 'object',
        properties: {
            training_id: {
                type: 'string',
            },
        },
    },
};
export const handler = async (replicate, args) => {
    const body = args;
    return asTextContentResult(await replicate.trainings.cancel(body));
};
export default { metadata, tool, handler };
//# sourceMappingURL=cancel-trainings.mjs.map