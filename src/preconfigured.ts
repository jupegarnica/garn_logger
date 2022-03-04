import {
  Logger,
  pretty,
  transportToConsole,
} from "../mod.ts";

export const colorConsole = new Logger({
  plugins: [
    pretty({}),
    transportToConsole(globalThis.console),
  ],
});
