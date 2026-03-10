"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'trainings',
    operation: 'read',
    tags: [],
    httpMethod: 'get',
    httpPath: '/trainings',
    operationId: 'trainings.list',
};
exports.tool = {
    name: 'list_trainings',
    description: 'Get a paginated list of all trainings created by the user or organization associated with the provided API token.\n\nThis will include trainings created from the API and the website. It will return 100 records per page.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/trainings\n```\n\nThe response will be a paginated JSON array of training objects, sorted with the most recent training first:\n\n```json\n{\n  "next": null,\n  "previous": null,\n  "results": [\n    {\n      "completed_at": "2023-09-08T16:41:19.826523Z",\n      "created_at": "2023-09-08T16:32:57.018467Z",\n      "error": null,\n      "id": "zz4ibbonubfz7carwiefibzgga",\n      "input": {\n        "input_images": "https://example.com/my-input-images.zip"\n      },\n      "metrics": {\n        "predict_time": 502.713876\n      },\n      "output": {\n        "version": "...",\n        "weights": "..."\n      },\n      "started_at": "2023-09-08T16:32:57.112647Z",\n      "source": "api",\n      "status": "succeeded",\n      "urls": {\n        "web": "https://replicate.com/p/zz4ibbonubfz7carwiefibzgga",\n        "get": "https://api.replicate.com/v1/trainings/zz4ibbonubfz7carwiefibzgga",\n        "cancel": "https://api.replicate.com/v1/trainings/zz4ibbonubfz7carwiefibzgga/cancel"\n      },\n      "model": "stability-ai/sdxl",\n      "version": "da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf",\n    }\n  ]\n}\n```\n\n`id` will be the unique ID of the training.\n\n`source` will indicate how the training was created. Possible values are `web` or `api`.\n\n`status` will be the status of the training. Refer to [get a single training](#trainings.get) for possible values.\n\n`urls` will be a convenience object that can be used to construct new API requests for the given training.\n\n`version` will be the unique ID of model version used to create the training.\n',
    inputSchema: {
        type: 'object',
        properties: {},
    },
};
const handler = async (replicate, args) => {
    return (0, types_1.asTextContentResult)(await replicate.trainings.list());
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=list-trainings.js.map