"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
// PATCHED: Added local file path and base64 support for binary uploads.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
const fs = require("fs");
const path = require("path");
const { toFile } = require("replicate-stainless/uploads");
exports.metadata = {
    resource: 'files',
    operation: 'write',
    tags: [],
    httpMethod: 'post',
    httpPath: '/files',
    operationId: 'files.create',
};

const MIME_MAP = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.zip': 'application/zip',
    '.json': 'application/json',
    '.txt': 'text/plain',
};

exports.tool = {
    name: 'create_files',
    description: "Upload a file to Replicate and get a hosted URL. Accepts either a local file path or base64-encoded content.\n\n**Note:** For prediction inputs, you usually do NOT need this tool. The prediction tools (create_predictions, create_models_predictions, create_deployments_predictions) automatically handle local file paths passed in the input object. Use this tool only when you need a hosted URL for other purposes.\n\nFor local files, pass the absolute path as `content`:\n  content: \"C:/Users/me/image.png\"\n  filename: \"image.png\"\n\nFor base64, pass the encoded string as `content` and set `encoding` to \"base64\":\n  content: \"iVBORw0KGgo...\"\n  filename: \"image.png\"\n  encoding: \"base64\"\n",
    inputSchema: {
        type: 'object',
        properties: {
            content: {
                type: 'string',
                description: 'Local file path (absolute) OR base64-encoded file content',
            },
            filename: {
                type: 'string',
                description: 'The filename for the upload',
            },
            encoding: {
                type: 'string',
                enum: ['base64'],
                description: 'Set to "base64" if content is base64-encoded. Omit for local file paths.',
            },
            metadata: {
                type: 'object',
                description: 'User-provided metadata associated with the file',
            },
            type: {
                type: 'string',
                description: 'The content / MIME type for the file (auto-detected from extension if omitted)',
            },
        },
        required: ['content', 'filename'],
    },
};
const handler = async (replicate, args) => {
    const body = args;
    const contentStr = body.content;
    const filename = body.filename || 'upload';

    let buffer;
    if (body.encoding === 'base64') {
        buffer = Buffer.from(contentStr, 'base64');
    } else if (fs.existsSync(contentStr)) {
        buffer = fs.readFileSync(contentStr);
    } else {
        throw new Error(
            `content is not a valid file path and encoding is not "base64". ` +
            `Provide an absolute local file path or set encoding to "base64".`
        );
    }

    const ext = path.extname(filename).toLowerCase();
    const mimeType = body.type || MIME_MAP[ext] || 'application/octet-stream';

    const fileObj = await toFile(buffer, filename, { type: mimeType });
    const result = await replicate.files.create({ content: fileObj, ...(body.metadata ? { metadata: body.metadata } : {}) });
    return (0, types_1.asTextContentResult)(result);
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=create-files.js.map