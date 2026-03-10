"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.tool = exports.metadata = void 0;
const types_1 = require("replicate-mcp/tools/types");
exports.metadata = {
    resource: 'deployments',
    operation: 'read',
    tags: [],
    httpMethod: 'get',
    httpPath: '/deployments',
    operationId: 'deployments.list',
};
exports.tool = {
    name: 'list_deployments',
    description: 'Get a list of deployments associated with the current account, including the latest release configuration for each deployment.\n\nExample cURL request:\n\n```console\ncurl -s \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  https://api.replicate.com/v1/deployments\n```\n\nThe response will be a paginated JSON array of deployment objects, sorted with the most recent deployment first:\n\n```json\n{\n  "next": "http://api.replicate.com/v1/deployments?cursor=cD0yMDIzLTA2LTA2KzIzJTNBNDAlM0EwOC45NjMwMDAlMkIwMCUzQTAw",\n  "previous": null,\n  "results": [\n    {\n      "owner": "replicate",\n      "name": "my-app-image-generator",\n      "current_release": {\n        "number": 1,\n        "model": "stability-ai/sdxl",\n        "version": "da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf",\n        "created_at": "2024-02-15T16:32:57.018467Z",\n        "created_by": {\n          "type": "organization",\n          "username": "acme",\n          "name": "Acme Corp, Inc.",\n          "avatar_url": "https://cdn.replicate.com/avatars/acme.png",\n          "github_url": "https://github.com/acme"\n        },\n        "configuration": {\n          "hardware": "gpu-t4",\n          "min_instances": 1,\n          "max_instances": 5\n        }\n      }\n    }\n  ]\n}\n```\n',
    inputSchema: {
        type: 'object',
        properties: {},
    },
};
const handler = async (replicate, args) => {
    return (0, types_1.asTextContentResult)(await replicate.deployments.list());
};
exports.handler = handler;
exports.default = { metadata: exports.metadata, tool: exports.tool, handler: exports.handler };
//# sourceMappingURL=list-deployments.js.map