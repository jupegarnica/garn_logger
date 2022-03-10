import type { Middleware, MiddlewareContext, MiddlewareNext } from "../types.ts";

import { levelsNumbersToMethod } from "../constants.ts";

import { compose } from "../middleware.ts";
import { formatToAnsiColors } from "./format_to_ansi_colors.ts";

const timersMethods = ["time", "timeLog", "timeEnd"];
const groupMethods = ["group", "groupCollapsed", "groupEnd"];
const mustUseArgs = [
  ...timersMethods,
  ...groupMethods,
  "table",
  "dir",
  "dirxml",
  "assert",
  "count",
  "trace",
];

export function transportToConsole(
  _console: Console = globalThis.console,
): Middleware & { _console: Console } {
  function log({ logRecord, state }: MiddlewareContext, next: MiddlewareNext): void {
    next();
    if (!logRecord.muted) {
      // @ts-ignore
      let fn = _console[logRecord.methodName] ??
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
      // Timers
      if (timersMethods.includes(logRecord.methodName)) {
        state.timers ||= {};
        let timerName;
        fn = _console.debug;
        timerName = typeof logRecord.args[0] === "string"
          ? logRecord.args[0] || "default"
          : "default";
        switch (logRecord.methodName) {
          case "time":
            {
              state.timers[timerName] = Date.now();
              logRecord.methodName = "time";
              logRecord.args = [`[${timerName}] started`];
              logRecord.willReturn = 0;
            }
            break;
          case "timeLog":
            {
              if (!state.timers[timerName]) {
                logRecord.args = [`[${timerName}] not exists`];
                logRecord.methodName = "timeLog";
                logRecord.willReturn = undefined;
              } else {
                const time = Date.now() - state.timers[timerName];
                logRecord.methodName = "timeLog";
                logRecord.willReturn = time;
                logRecord.args = [`[${timerName}] ${time}ms`];
              }
            }
            break;
          case "timeEnd":
            {
              const timerName = logRecord.args[0] as string;
              const time = Date.now() - state.timers[timerName];
              logRecord.args = [`[${timerName}] ends in ${time}ms`];
              logRecord.methodName = "timeEnd";
              logRecord.willReturn = time;
              state.timers[timerName] = undefined;
            }
            break;
        }
      }

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
