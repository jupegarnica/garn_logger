import type { Middleware, MiddlewareContext, MiddlewareNext } from "../types.ts";

import { levelsNumbersToMethod } from "../constants.ts";

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

      const args = logRecord.msg ? [logRecord.msg] : logRecord.args;
      fn(...args);
      if (logRecord.msg && logRecord.methodName === "table") {
        fn(...logRecord.args);
      }
    }
  }
  // append console instance just for stub during tests
  log._console = _console;
  return log;
}
