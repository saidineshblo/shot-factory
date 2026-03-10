import { Filter } from "./tools.mjs";
import { ClientCapabilities } from "./compat.mjs";
export interface ParsedOptions {
    includeDynamicTools: boolean | undefined;
    includeAllTools: boolean | undefined;
    filters: Filter[];
    capabilities: ClientCapabilities;
    list: boolean;
}
export declare function parseOptions(): ParsedOptions;
//# sourceMappingURL=options.d.mts.map