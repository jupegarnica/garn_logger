export * from "./src/logger.ts";
export * from "./src/types.ts";
export * from "./src/middleware/transport_to_console.ts";
export * from "./src/middleware/format_to_ansi_colors.ts";
export * from "./src/middleware/transport_to_email.ts";

import { createLogger } from "./src/logger.ts";
import { transportToConsole } from "./src/middleware/transport_to_console.ts";

export const logger = createLogger();
const consolePlugin = transportToConsole(globalThis.console);

logger.use(
  consolePlugin,
);

export default logger;
export const console = consolePlugin._console;
