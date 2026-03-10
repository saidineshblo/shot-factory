// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { endpoints, query } from "./tools.mjs";
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import Replicate from 'replicate-stainless';
import { applyCompatibilityTransformations, defaultClientCapabilities, parseEmbeddedJSON, } from "./compat.mjs";
import { dynamicTools } from "./dynamic-tools.mjs";
export { endpoints } from "./tools.mjs";
// Create server instance
export const server = new McpServer({
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
export function init(params) {
    const server = params.server instanceof McpServer ? params.server.server : params.server;
    const providedEndpoints = params.endpoints || endpoints;
    const endpointMap = Object.fromEntries(providedEndpoints.map((endpoint) => [endpoint.tool.name, endpoint]));
    const client = params.client || new Replicate({});
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: providedEndpoints.map((endpoint) => endpoint.tool),
        };
    });
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
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
export function selectTools(endpoints, options) {
    const filteredEndpoints = query(options.filters, endpoints);
    const includedTools = filteredEndpoints;
    if (options.includeAllTools && includedTools.length === 0) {
        includedTools.push(...endpoints);
    }
    if (options.includeDynamicTools) {
        includedTools.push(...dynamicTools(endpoints));
    }
    if (includedTools.length === 0) {
        includedTools.push(...endpoints);
    }
    return applyCompatibilityTransformations(includedTools, options.capabilities);
}
/**
 * Runs the provided handler with the given client and arguments.
 */
export async function executeHandler(tool, handler, client, args, compatibilityOptions) {
    const options = { ...defaultClientCapabilities, ...compatibilityOptions };
    if (options.validJson && args) {
        args = parseEmbeddedJSON(args, tool.inputSchema);
    }
    return await handler(client, args || {});
}
export const readEnv = (env) => {
    if (typeof globalThis.process !== 'undefined') {
        return globalThis.process.env?.[env]?.trim();
    }
    else if (typeof globalThis.Deno !== 'undefined') {
        return globalThis.Deno.env?.get?.(env)?.trim();
    }
    return;
};
export const readEnvOrError = (env) => {
    let envValue = readEnv(env);
    if (envValue === undefined) {
        throw new Error(`Environment variable ${env} is not set`);
    }
    return envValue;
};
//# sourceMappingURL=server.mjs.map