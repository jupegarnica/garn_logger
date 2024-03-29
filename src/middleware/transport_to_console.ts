import type { Middleware, MiddlewareContext, MiddlewareNext } from "../types.ts";

import { levelsNumbersToMethod } from "../constants.ts";

import { compose } from "../middleware.ts";
import { formatToAnsiColors } from "./format_to_ansi_colors.ts";
import { supportForConsoleTimers } from "./support_timers.ts";

const groupMethods = ["group", "groupCollapsed", "groupEnd"];
const mustUseArgs = [
  ...groupMethods,
  "table",
  "dir",
  "dirxml",
  "assert",
  "count",
  "countReset",
  "trace",
  "clear",
];

export function transportToConsole(
  _console: Console = globalThis.console,
): Middleware & { _console: Console } {
  function log({ logRecord }: MiddlewareContext, next: MiddlewareNext): void {
    next();
    if (!logRecord.muted) {
      // @ts-ignore is a method
      const fn = _console[logRecord.methodName] ??
        // _console[
        //   logRecord.methodName.toLowerCase()
        // ] &&
        // @ts-ignore if a method
        _console[
          levelsNumbersToMethod[
            logRecord.levelNumber
          ]
        ];

      if (mustUseArgs.includes(logRecord.methodName)) {
        fn(...logRecord.args);
      } else {
        const args = logRecord.ansiText ? [logRecord.ansiText] : logRecord.args;
        fn(...args);
      }
    }
  }
  // append console instance just for stub during tests
  log._console = _console;

  return log;
}

export function transportToConsoleWithFormat(
  {
    pretty = {},
    console = globalThis.console,
  } = {},
): Middleware {
  return compose([
    supportForConsoleTimers,
    formatToAnsiColors(pretty),
    transportToConsole(console),
  ]);
}
