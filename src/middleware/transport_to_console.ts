import type { Middleware, MiddlewareContext, MiddlewareNext } from "../types.ts";

import { levelsNumbersToMethod } from "../constants.ts";

import { compose } from "../middleware.ts";
import { formatToAnsiColors } from "./format_to_ansi_colors.ts";

export function transportToConsole(
  _console: Console = globalThis.console,
): Middleware & { _console: Console } {
  function log({ logRecord }: MiddlewareContext, next: MiddlewareNext): void {
    next();
    if (!logRecord.muted) {
      // @ts-ignore
      const fn = _console[logRecord.methodName] ??
        // @ts-ignore
        _console[
          logRecord.methodName.toLowerCase()
        ] ??
        // @ts-ignore
        _console[
          levelsNumbersToMethod[
            logRecord.levelNumber
          ]
        ];

      const mustUseArgs = [
        "table",
        "dir",
        "dirxml",
        "time",
        "timeEnd",
        "group",
        "groupEnd",
        "assert",
        "count",
        "trace",
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
  },
): Middleware {
  return compose([formatToAnsiColors(pretty), transportToConsole(console)]);
}
