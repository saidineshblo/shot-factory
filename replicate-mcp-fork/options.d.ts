import { Filter } from "./tools.js";
import { ClientCapabilities } from "./compat.js";
export interface ParsedOptions {
    includeDynamicTools: boolean | undefined;
    includeAllTools: boolean | undefined;
    filters: Filter[];
    capabilities: ClientCapabilities;
    list: boolean;
}
export declare function parseOptions(): ParsedOptions;
//# sourceMappingURL=options.d.ts.map