import {
  createLogger,
  pretty,
  transportToConsole,
} from "../mod.ts";

export const colorConsole = createLogger()
  .use(
    pretty({}),
  )
  .use(
    transportToConsole(globalThis.console),
  );
