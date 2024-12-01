type Config = {
  setLevel: (level: ConsoleLevel) => Config;
  setFilter: (query: string | RegExp) => Config;
};

type FunctionLog = (...args: unknown[]) => void;

type ConsoleLevel = "warn" | "error" | "info" | "debug";
type ConsoleMethod =
  | ConsoleLevel
  | "log"
  | "trace"
  | "dir"
  | "time"
  | "timeEnd"
  | "group"
  | "groupEnd"
  | "groupCollapsed"
  | "clear"
  | "count"
  | "assert"
  | "table";

const consoleMethodsOrder: ConsoleMethod[] = [
  "error",
  "warn",
  "info",
  "debug",
  "log",
  "trace",
  "dir",
  "time",
  "timeEnd",
  "group",
  "groupEnd",
  "groupCollapsed",
  "clear",
  "count",
  "assert",
  "table",
];

const methodLevels: Record<ConsoleMethod, ConsoleLevel> = {
  error: "error",
  warn: "warn",
  info: "info",
  debug: "debug",
  log: "debug",
  trace: "debug",
  dir: "debug",
  time: "debug",
  timeEnd: "debug",
  group: "debug",
  groupEnd: "debug",
  groupCollapsed: "debug",
  clear: "debug",
  count: "debug",
  assert: "error", // Ensure assert always logs
  table: "debug",
};

export function better(consoleReference: Console = console): Config {
  const originalMethodsReferences: Partial<Record<ConsoleMethod, FunctionLog>> =
    {};
  for (const method in consoleReference) {
    originalMethodsReferences[method as ConsoleMethod] =
      consoleReference[method as ConsoleMethod] as FunctionLog;
  }

  const config: Config = {
    setLevel(level: ConsoleLevel) {
      const levels: ConsoleLevel[] = ["error", "warn", "info", "debug"];
      const levelIndex = levels.indexOf(level);
      if (levelIndex === -1) {
        throw new Error(
          "Invalid log level, use one of: " + levels.join(", "),
        );
      }
      consoleMethodsOrder.forEach((method) => {
        const methodLevel = methodLevels[method];
        const methodLevelIndex = levels.indexOf(methodLevel);
        const originalMethod = originalMethodsReferences[method] as FunctionLog;
        consoleReference[method] = (...args: unknown[]) => {
          if (methodLevelIndex <= levelIndex) {
            originalMethod(...args);
          }
        };
      });
      return config;
    },
    setFilter(query: string | RegExp) {
      const filter = (query instanceof RegExp) ? query : new RegExp(query, "i");
      consoleMethodsOrder.forEach((method) => {
        const originalMethod = originalMethodsReferences[method] as FunctionLog;
        consoleReference[method] = (...args: unknown[]) => {
          if (filter.test(args.join(" "))) {
            originalMethod(...args);
          }
        };
      });
      return config;
    },
  };

  return config;
}
