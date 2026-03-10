import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Endpoint, HandlerFunction } from "./tools.mjs";
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Replicate from 'replicate-stainless';
import { ClientCapabilities } from "./compat.mjs";
import { ParsedOptions } from "./options.mjs";
export { endpoints } from "./tools.mjs";
export declare const server: McpServer;
/**
 * Initializes the provided MCP Server with the given tools and handlers.
 * If not provided, the default client, tools and handlers will be used.
 */
export declare function init(params: {
    server: Server | McpServer;
    client?: Replicate;
    endpoints?: {
        tool: Tool;
        handler: HandlerFunction;
    }[];
    capabilities?: Partial<ClientCapabilities>;
}): void;
/**
 * Selects the tools to include in the MCP Server based on the provided options.
 */
export declare function selectTools(endpoints: Endpoint[], options: ParsedOptions): Endpoint[];
/**
 * Runs the provided handler with the given client and arguments.
 */
export declare function executeHandler(tool: Tool, handler: HandlerFunction, client: Replicate, args: Record<string, unknown> | undefined, compatibilityOptions?: Partial<ClientCapabilities>): Promise<import("./tools/types").ToolCallResult>;
export declare const readEnv: (env: string) => string | undefined;
export declare const readEnvOrError: (env: string) => string;
//# sourceMappingURL=server.d.mts.map