// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { asTextContentResult } from 'replicate-mcp/tools/types';
export const metadata = {
    resource: 'trainings',
    operation: 'read',
    tags: [],
    httpMethod: 'get',
    httpPath: '/trainings/{training_id}',
    operationId: 'trainings.get',
};
export const tool = {
    name: 'get_trainings',
    description: 'Get the current state of a training.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/trainings/zz4ibbonubfz7carwiefibzgga\n```\n\nThe response will be the training object:\n\n```json\n{\n  "completed_at": "2023-09-08T16:41:19.826523Z",\n  "created_at": "2023-09-08T16:32:57.018467Z",\n  "error": null,\n  "id": "zz4ibbonubfz7carwiefibzgga",\n  "input": {\n    "input_images": "https://example.com/my-input-images.zip"\n  },\n  "logs": "...",\n  "metrics": {\n    "predict_time": 502.713876\n  },\n  "output": {\n    "version": "...",\n    "weights": "..."\n  },\n  "started_at": "2023-09-08T16:32:57.112647Z",\n  "status": "succeeded",\n  "urls": {\n    "web": "https://replicate.com/p/zz4ibbonubfz7carwiefibzgga",\n    "get": "https://api.replicate.com/v1/trainings/zz4ibbonubfz7carwiefibzgga",\n    "cancel": "https://api.replicate.com/v1/trainings/zz4ibbonubfz7carwiefibzgga/cancel"\n  },\n  "model": "stability-ai/sdxl",\n  "version": "da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf",\n}\n```\n\n`status` will be one of:\n\n- `starting`: the training is starting up. If this status lasts longer than a few seconds, then it\'s typically because a new worker is being started to run the training.\n- `processing`: the `train()` method of the model is currently running.\n- `succeeded`: the training completed successfully.\n- `failed`: the training encountered an error during processing.\n- `canceled`: the training was canceled by its creator.\n\nIn the case of success, `output` will be an object containing the output of the model. Any files will be represented as HTTPS URLs. You\'ll need to pass the `Authorization` header to request them.\n\nIn the case of failure, `error` will contain the error encountered during the training.\n\nTerminated trainings (with a status of `succeeded`, `failed`, or `canceled`) will include a `metrics` object with a `predict_time` property showing the amount of CPU or GPU time, in seconds, that the training used while running. It won\'t include time waiting for the training to start.\n',
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
    return asTextContentResult(await replicate.trainings.get(body));
};
export default { metadata, tool, handler };
//# sourceMappingURL=get-trainings.mjs.map