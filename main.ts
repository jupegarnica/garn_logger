/**
 * Configuration object for setting log level and filter.
 */
export type Config = {
  /**
   * Sets the logging level.
   * @param level - The logging level to set.
   * @returns The configuration object.
   * @example
   * better(console).setLevel("warn");
   */
  setLevel: (level: ConsoleLevel) => Config;

  /**
   * Sets the filter for log messages.
   * @param query - The query string or regular expression to filter log messages.
   * @returns The configuration object.
   * @example
   * better(console).setFilter("error");
   * better(console).setFilter(/error/i);
   */
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

/**
 * Enhances the console object with additional configuration options.
 * @param consoleReference - The console object to enhance.
 * @returns The configuration object.
 * @example
 * better(console).setLevel("info").setFilter("test");
 */
export function better(consoleReference: Console = console): Config {
  const originalMethodsReferences: Partial<Record<ConsoleMethod, FunctionLog>> =
    {};
  for (const method in consoleReference) {
    originalMethodsReferences[method as ConsoleMethod] =
      consoleReference[method as ConsoleMethod] as FunctionLog;
  }

  let currentLevel: ConsoleLevel = "debug";
  let currentFilter: RegExp | null = null;

  const config: Config = {
    setLevel(level: ConsoleLevel) {
      currentLevel = level;
      applyConfig();
      return config;
    },
    setFilter(query: string | RegExp) {
      currentFilter = (query instanceof RegExp) ? query : new RegExp(query, "i");
      applyConfig();
      return config;
    },
  };

  function applyConfig() {
    const levels: ConsoleLevel[] = ["error", "warn", "info", "debug"];
    const levelIndex = levels.indexOf(currentLevel);
    consoleMethodsOrder.forEach((method) => {
      const methodLevel = methodLevels[method];
      const methodLevelIndex = levels.indexOf(methodLevel);
      const originalMethod = originalMethodsReferences[method] as FunctionLog;
      consoleReference[method] = (...args: unknown[]) => {
        if (methodLevelIndex <= levelIndex && (!currentFilter || currentFilter.test(args.join(" ")))) {
          originalMethod(...args);
        }
      };
    });
  }

  return config;
}
