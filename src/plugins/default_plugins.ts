import type { LoggerState, LogRecord, Plugin } from "../types.ts";

import { levelsNameToNumbers, levelsNumbersToMethod } from "../constants.ts";

export function applyLevelNumber(
  log: LogRecord,
): LogRecord {
  log.levelNumber = levelsNameToNumbers[log.methodName] ?? 0;
  return log;
}

export const applyFilter = (
  levelName: string,
) => {
  const filterLevel = levelsNameToNumbers[levelName] ??
    levelsNameToNumbers[
      levelName.toLowerCase()
    ] ??
    0;
  return function muteLogRecord(
    log: LogRecord,
    state: LoggerState,
  ): LogRecord {
    state.filterLevel = filterLevel;
    log.muted = log.levelNumber < state.filterLevel;
    return log;
  };
};

export function transportToConsole(
  _console: Console = globalThis.console,
): Plugin & { _console: Console } {
  function log(logRecord: LogRecord): LogRecord {
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
    return logRecord;
  }
  // append console instance just for stub during tests
  log._console = _console;
  return log;
}

export function returnArgs(
  log: LogRecord,
): LogRecord {
  log.returned = log.args;
  return log;
}
