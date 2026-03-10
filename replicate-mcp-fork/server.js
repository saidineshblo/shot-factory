"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readEnvOrError = exports.readEnv = exports.server = exports.endpoints = void 0;
exports.init = init;
exports.selectTools = selectTools;
exports.executeHandler = executeHandler;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const tools_1 = require("./tools.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const replicate_stainless_1 = __importDefault(require("replicate-stainless"));
const compat_1 = require("./compat.js");
const dynamic_tools_1 = require("./dynamic-tools.js");
var tools_2 = require("./tools.js");
Object.defineProperty(exports, "endpoints", { enumerable: true, get: function () { return tools_2.endpoints; } });
// Create server instance
exports.server = new mcp_js_1.McpServer({
    name: 'replicate_stainless_api',
    version: '0.9.0',
}, {
    capabilities: {
        tools: {},
    },
});
/**
 * Initializes the provided MCP Server with the given tools and handlers.
 * If not provided, the default client, tools and handlers will be used.
 */
function init(params) {
    const server = params.server instanceof mcp_js_1.McpServer ? params.server.server : params.server;
    const providedEndpoints = params.endpoints || tools_1.endpoints;
    const endpointMap = Object.fromEntries(providedEndpoints.map((endpoint) => [endpoint.tool.name, endpoint]));
    const client = params.client || new replicate_stainless_1.default({});
    server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
        return {
            tools: providedEndpoints.map((endpoint) => endpoint.tool),
        };
    });
    server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        const endpoint = endpointMap[name];
        if (!endpoint) {
            throw new Error(`Unknown tool: ${name}`);
        }
        return executeHandler(endpoint.tool, endpoint.handler, client, args, params.capabilities);
    });
}
/**
 * Selects the tools to include in the MCP Server based on the provided options.
 */
function selectTools(endpoints, options) {
    const filteredEndpoints = (0, tools_1.query)(options.filters, endpoints);
    const includedTools = filteredEndpoints;
    if (options.includeAllTools && includedTools.length === 0) {
        includedTools.push(...endpoints);
    }
    if (options.includeDynamicTools) {
        includedTools.push(...(0, dynamic_tools_1.dynamicTools)(endpoints));
    }
    if (includedTools.length === 0) {
        includedTools.push(...endpoints);
    }
    return (0, compat_1.applyCompatibilityTransformations)(includedTools, options.capabilities);
}
/**
 * Runs the provided handler with the given client and arguments.
 */
async function executeHandler(tool, handler, client, args, compatibilityOptions) {
    const options = { ...compat_1.defaultClientCapabilities, ...compatibilityOptions };
    if (options.validJson && args) {
        args = (0, compat_1.parseEmbeddedJSON)(args, tool.inputSchema);
    }
    return await handler(client, args || {});
}
const readEnv = (env) => {
    if (typeof globalThis.process !== 'undefined') {
        return globalThis.process.env?.[env]?.trim();
    }
    else if (typeof globalThis.Deno !== 'undefined') {
        return globalThis.Deno.env?.get?.(env)?.trim();
    }
    return;
};
exports.readEnv = readEnv;
const readEnvOrError = (env) => {
    let envValue = (0, exports.readEnv)(env);
    if (envValue === undefined) {
        throw new Error(`Environment variable ${env} is not set`);
    }
    return envValue;
};
exports.readEnvOrError = readEnvOrError;
//# sourceMappingURL=server.js.map