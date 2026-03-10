// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'predictions',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/predictions/{prediction_id}',
  operationId: 'predictions.get',
};

export const tool: Tool = {
  name: 'get_predictions',
  description:
    'Get the current state of a prediction.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/predictions/gm3qorzdhgbfurvjtvhg6dckhu\n```\n\nThe response will be the prediction object:\n\n```json\n{\n  "id": "gm3qorzdhgbfurvjtvhg6dckhu",\n  "model": "replicate/hello-world",\n  "version": "5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa",\n  "input": {\n    "text": "Alice"\n  },\n  "logs": "",\n  "output": "hello Alice",\n  "error": null,\n  "status": "succeeded",\n  "created_at": "2023-09-08T16:19:34.765994Z",\n  "data_removed": false,\n  "started_at": "2023-09-08T16:19:34.779176Z",\n  "completed_at": "2023-09-08T16:19:34.791859Z",\n  "metrics": {\n    "predict_time": 0.012683\n  },\n  "urls": {\n    "web": "https://replicate.com/p/gm3qorzdhgbfurvjtvhg6dckhu",\n    "get": "https://api.replicate.com/v1/predictions/gm3qorzdhgbfurvjtvhg6dckhu",\n    "cancel": "https://api.replicate.com/v1/predictions/gm3qorzdhgbfurvjtvhg6dckhu/cancel"\n  }\n}\n```\n\n`status` will be one of:\n\n- `starting`: the prediction is starting up. If this status lasts longer than a few seconds, then it\'s typically because a new worker is being started to run the prediction.\n- `processing`: the `predict()` method of the model is currently running.\n- `succeeded`: the prediction completed successfully.\n- `failed`: the prediction encountered an error during processing.\n- `canceled`: the prediction was canceled by its creator.\n\nIn the case of success, `output` will be an object containing the output of the model. Any files will be represented as HTTPS URLs. You\'ll need to pass the `Authorization` header to request them.\n\nIn the case of failure, `error` will contain the error encountered during the prediction.\n\nTerminated predictions (with a status of `succeeded`, `failed`, or `canceled`) will include a `metrics` object with a `predict_time` property showing the amount of CPU or GPU time, in seconds, that the prediction used while running. It won\'t include time waiting for the prediction to start.\n\nAll input parameters, output values, and logs are automatically removed after an hour, by default, for predictions created through the API.\n\nYou must save a copy of any data or files in the output if you\'d like to continue using them. The `output` key will still be present, but it\'s value will be `null` after the output has been removed.\n\nOutput files are served by `replicate.delivery` and its subdomains. If you use an allow list of external domains for your assets, add `replicate.delivery` and `*.replicate.delivery` to it.\n',
  inputSchema: {
    type: 'object',
    properties: {
      prediction_id: {
        type: 'string',
      },
    },
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await replicate.predictions.get(body));
};

export default { metadata, tool, handler };
