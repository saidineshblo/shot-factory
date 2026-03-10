// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { asTextContentResult } from 'replicate-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from '../';
import Replicate from 'replicate-stainless';

export const metadata: Metadata = {
  resource: 'files',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/files',
  operationId: 'files.create',
};

export const tool: Tool = {
  name: 'create_files',
  description:
    "Create a file by uploading its content and optional metadata.\n\nExample cURL request:\n\n```console\ncurl -X POST https://api.replicate.com/v1/files \\\n  -H \"Authorization: Token $REPLICATE_API_TOKEN\" \\\n  -H 'Content-Type: multipart/form-data' \\\n  -F 'content=@/path/to/archive.zip;type=application/zip;filename=example.zip' \\\n  -F 'metadata={\"customer_reference_id\": 123};type=application/json'\n```\n\nThe request must include:\n- `content`: The file content (required)\n- `type`: The content / MIME type for the file (defaults to `application/octet-stream`)\n- `filename`: The filename (required, ≤ 255 bytes, valid UTF-8)\n- `metadata`: User-provided metadata associated with the file (defaults to `{}`, must be valid JSON)\n",
  inputSchema: {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        description: 'The file content',
      },
      filename: {
        type: 'string',
        description: 'The filename',
      },
      metadata: {
        type: 'object',
        description: 'User-provided metadata associated with the file',
      },
      type: {
        type: 'string',
        description: 'The content / MIME type for the file',
      },
    },
  },
};

export const handler = async (replicate: Replicate, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await replicate.files.create(body));
};

export default { metadata, tool, handler };
