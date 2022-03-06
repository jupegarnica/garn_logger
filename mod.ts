export * from "./src/logger.ts";
export * from "./src/types.ts";
export * from "./src/middleware/transport_to_console.ts";
export * from "./src/middleware/pretty.ts";

import { createLogger } from "./src/logger.ts";
import { transportToConsole } from "./src/middleware/transport_to_console.ts";

export const logger = createLogger();
logger.use(
  transportToConsole(globalThis.console),
);

export default logger;
