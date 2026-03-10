import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Metadata } from "..//index.js";
import Replicate from 'replicate-stainless';
export declare const metadata: Metadata;
export declare const tool: Tool;
export declare const handler: (replicate: Replicate, args: Record<string, unknown> | undefined) => Promise<import("replicate-mcp/tools/types").ToolCallResult>;
declare const _default: {
    metadata: Metadata;
    tool: {
        [x: string]: unknown;
        name: string;
        inputSchema: {
            [x: string]: unknown;
            type: "object";
            properties?: {
                [x: string]: unknown;
            } | undefined;
        };
        description?: string | undefined;
        annotations?: {
            [x: string]: unknown;
            title?: string | undefined;
            readOnlyHint?: boolean | undefined;
            destructiveHint?: boolean | undefined;
            idempotentHint?: boolean | undefined;
            openWorldHint?: boolean | undefined;
        } | undefined;
    };
    handler: (replicate: Replicate, args: Record<string, unknown> | undefined) => Promise<import("replicate-mcp/tools/types").ToolCallResult>;
};
export default _default;
//# sourceMappingURL=create-files.d.ts.map