import type { Middleware, MiddlewareContext, NextMiddleware } from "../types.ts";

import { levelsNameToNumbers, levelsNumbersToMethod } from "../constants.ts";

export const applyFilter = (
  levelName: string,
) => {
  const filterLevel = levelsNameToNumbers[levelName] ??
    levelsNameToNumbers[
      levelName.toLowerCase()
    ] ??
    0;
  return function muteLogRecord(
    { logRecord, state }: MiddlewareContext,
    next: NextMiddleware,
  ) {
    state.filterLevel = filterLevel;
    logRecord.muted = logRecord.levelNumber < state.filterLevel;
    next();
  };
};

export function transportToConsole(
  _console: Console = globalThis.console,
): Middleware & { _console: Console } {
  function log({ logRecord }: MiddlewareContext, next: NextMiddleware): void {
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
    }
  }
  // append console instance just for stub during tests
  log._console = _console;
  return log;
}

export function returnArgs(
  { logRecord }: MiddlewareContext,
  next: NextMiddleware,
): void {
  logRecord.returned = logRecord.args;
  next();
}
