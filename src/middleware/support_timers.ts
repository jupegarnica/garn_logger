import type { MiddlewareContext, MiddlewareNext } from "../types.ts";

const timersMethods = ["time", "timeLog", "timeEnd"];

export function supportForConsoleTimers(
  { logRecord, state }: MiddlewareContext,
  next: MiddlewareNext,
) {
  // Timers
  if (timersMethods.includes(logRecord.methodName)) {
    state.timers ||= {};
    let timerName;
    timerName = typeof logRecord.args[0] === "string"
      ? logRecord.args[0] || "default"
      : "default";
    switch (logRecord.methodName) {
      case "time":
        state.timers[timerName] = Date.now();
        logRecord.methodName = "Time";
        logRecord.args = [`[${timerName}] started`];
        logRecord.willReturn = 0;
        break;
      case "timeLog":
        if (!state.timers[timerName]) {
          logRecord.args = [`[${timerName}] not exists`];
          logRecord.methodName = "TimeLog";
          logRecord.willReturn = undefined;
        } else {
          const time = Date.now() - state.timers[timerName];
          logRecord.methodName = "TimeLog";
          logRecord.willReturn = time;
          logRecord.args = [`[${timerName}] ${time}ms`];
        }

        break;
      case "timeEnd":
        if (!state.timers[timerName]) {
          logRecord.args = [`[${timerName}] not exists`];
          logRecord.methodName = "TimeLog";
          logRecord.willReturn = undefined;
        } else {
          const time = Date.now() - state.timers[timerName];
          logRecord.args = [`[${timerName}] ends in ${time}ms`];
          logRecord.methodName = "TimeEnd";
          logRecord.willReturn = time;
          state.timers[timerName] = undefined;
        }
        break;
    }
  }
  next();
}
