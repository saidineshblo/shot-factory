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
  httpPath: '/predictions',
  operationId: 'predictions.list',
};

export const tool: Tool = {
  name: 'list_predictions',
  description:
    'Get a paginated list of all predictions created by the user or organization associated with the provided API token.\n\nThis will include predictions created from the API and the website. It will return 100 records per page.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/predictions\n```\n\nThe response will be a paginated JSON array of prediction objects, sorted with the most recent prediction first:\n\n```json\n{\n  "next": null,\n  "previous": null,\n  "results": [\n    {\n      "completed_at": "2023-09-08T16:19:34.791859Z",\n      "created_at": "2023-09-08T16:19:34.907244Z",\n      "data_removed": false,\n      "error": null,\n      "id": "gm3qorzdhgbfurvjtvhg6dckhu",\n      "input": {\n        "text": "Alice"\n      },\n      "metrics": {\n        "predict_time": 0.012683\n      },\n      "output": "hello Alice",\n      "started_at": "2023-09-08T16:19:34.779176Z",\n      "source": "api",\n      "status": "succeeded",\n      "urls": {\n        "web": "https://replicate.com/p/gm3qorzdhgbfurvjtvhg6dckhu",\n        "get": "https://api.replicate.com/v1/predictions/gm3qorzdhgbfurvjtvhg6dckhu",\n        "cancel": "https://api.replicate.com/v1/predictions/gm3qorzdhgbfurvjtvhg6dckhu/cancel"\n      },\n      "model": "replicate/hello-world",\n      "version": "5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa",\n    }\n  ]\n}\n```\n\n`id` will be the unique ID of the prediction.\n\n`source` will indicate how the prediction was created. Possible values are `web` or `api`.\n\n`status` will be the status of the prediction. Refer to [get a single prediction](#predictions.get) for possible values.\n\n`urls` will be a convenience object that can be used to construct new API requests for the given prediction. If the requested model version supports streaming, this will have a `stream` entry with an HTTPS URL that you can use to construct an [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource).\n\n`model` will be the model identifier string in the format of `{model_owner}/{model_name}`.\n\n`version` will be the unique ID of model version used to create the prediction.\n\n`data_removed` will be `true` if the input and output data has been deleted.\n',
  inputSchema: {
    type: 'object',
    properties: {
      created_after: {
        type: 'string',
        description: 'Include only predictions created at or after this date-time, in ISO 8601 format.',
        format: 'date-time',
      },
      created_before: {
        type: 'string',
        description: 'Include only predictions created before this date-time, in ISO 8601 format.',
        format: 'date-time',
      },
    },
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await replicate.predictions.list(body));
};

export default { metadata, tool, handler };
