"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'predictions',
    operation: 'write',
    tags: [],
    httpMethod: 'post',
    httpPath: '/predictions/{prediction_id}/cancel',
    operationId: 'predictions.cancel',
};
exports.tool = {
    name: 'cancel_predictions',
    description: 'Cancel a prediction that is currently running.\n\nExample cURL request that creates a prediction and then cancels it:\n\n```console\n# First, create a prediction\nPREDICTION_ID=$(curl -s -X POST \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "input": {\n      "prompt": "a video that may take a while to generate"\n    }\n  }\' \\\n  https://api.replicate.com/v1/models/minimax/video-01/predictions | jq -r \'.id\')\n\n# Echo the prediction ID\necho "Created prediction with ID: $PREDICTION_ID"\n\n# Cancel the prediction\ncurl -s -X POST \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/predictions/$PREDICTION_ID/cancel\n```\n',
    inputSchema: {
        type: 'object',
        properties: {
            prediction_id: {
                type: 'string',
            },
        },
    },
};
const handler = async (replicate, args) => {
    const body = args;
    return (0, types_1.asTextContentResult)(await replicate.predictions.cancel(body));
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=cancel-predictions.js.map