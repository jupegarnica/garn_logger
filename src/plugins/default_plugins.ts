import type {
  LevelsNumber,
  LogRecord,
  Plugin,
} from "../types.ts";

const levelsNameToNumbers: LevelsNumber = {
  debug: 0,
  info: 10,
  table: 10,
  warn: 20,
  warning: 20,
  error: 30,
  critical: 40,
  fatal: 40,
};
const levelsNumbersToMethod: {
  [level: number]: string;
} = {
  0: "debug",
  10: "info",
  20: "warn",
  30: "error",
  40: "error",
};

export function applyLevel(
  log: LogRecord,
): LogRecord {
  log.levelNumber =
    levelsNameToNumbers[log.methodName] ?? 0;
  return log;
}

export function filterLowerLevels(
  level: string,
): Plugin {
  level = level.toLowerCase();
  return (log: LogRecord): LogRecord => {
    log.muted =
      log.levelNumber <
        levelsNameToNumbers[level];
    return log;
  };
}

export function transportToConsole(
  _console: Console,
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

      const args = logRecord.msg
        ? [logRecord.msg]
        : logRecord.args;
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
