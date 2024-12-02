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
   * better(console).setFilter(null);
   */
  setFilter: (query: string | RegExp | null) => Config;
};

type FunctionLog = (...args: unknown[]) => void;

type ConsoleLevel = "warn" | "error" | "info" | "debug";
type ConsoleMethod = keyof Console;

const METHODS_LEVELS: Record<ConsoleMethod, ConsoleLevel> = {
  error: "error",
  warn: "warn",
  info: "info",
  debug: "debug",
  log: "debug",
  trace: "debug",
  dir: "debug",
  dirxml: "debug",
  time: "debug",
  timeEnd: "debug",
  timeLog: "debug",
  group: "debug",
  groupEnd: "debug",
  groupCollapsed: "debug",
  clear: "error", // Ensure clear always logs
  count: "debug",
  countReset: "debug",
  assert: "error", // Ensure assert always logs
  table: "debug",
  profile: "debug",
  profileEnd: "debug",
  timeStamp: "debug",
};
const levels: ConsoleLevel[] = ["error", "warn", "info", "debug"];


type ConsoleReference = Console & {
  [currentFilterSymbol]?: RegExp | null;
  [currentLevelSymbol]?: ConsoleLevel;
  [originalMethodsReferencesSymbol]?: Partial<
    Record<ConsoleMethod, FunctionLog>
  >;
};

const currentFilterSymbol = Symbol("currentFilter");
const currentLevelSymbol = Symbol("currentLevel");
const originalMethodsReferencesSymbol = Symbol("originalMethodsReferences");

/**
 * Enhances the console object with additional configuration options.
 * @param consoleReference - The console object to enhance.
 * @returns The configuration object.
 * @example
 * better(console).setLevel("info").setFilter("test");
 */
export function better(consoleReference: ConsoleReference = console): Config {
  consoleReference[currentFilterSymbol] ??= null;
  consoleReference[currentLevelSymbol] ??= "debug";

  consoleReference[originalMethodsReferencesSymbol] ??= Object.fromEntries(
    Object.entries(consoleReference).map(([key, value]) => [key, value])
  );
  const config: Config = {
    setLevel(level: ConsoleLevel) {
      consoleReference[currentLevelSymbol] = level;
      return config;
    },
    setFilter(query: string | RegExp | null) {
      if (query === null) {
        consoleReference[currentFilterSymbol] = null;
      } else {
        consoleReference[currentFilterSymbol] =
          query instanceof RegExp ? query : new RegExp(query, "i");
      }

      return config;
    },
  };

  applyConfig(
    consoleReference,
  );
  return config;
}

function applyConfig(
  consoleReference: ConsoleReference,
) {
  for (const _method in consoleReference) {
    const method = _method as ConsoleMethod;
    const methodLevel = METHODS_LEVELS[method] || "debug";
    const methodLevelIndex = levels.indexOf(methodLevel);
    const originalMethod = (
      consoleReference[originalMethodsReferencesSymbol] as Partial<
        Record<ConsoleMethod, FunctionLog>
      >
    )[method];
    consoleReference[method] = (...args: unknown[]) => {

      const levelIndex = levels.indexOf(consoleReference[currentLevelSymbol] || "debug");
      const currentFilter = consoleReference[currentFilterSymbol];
      const isLevelAllowed = methodLevelIndex <= levelIndex;
      const isFilterMatched = !currentFilter || args.some((arg: unknown) =>
        currentFilter.test(stringify(arg))
      );

      if (isLevelAllowed && isFilterMatched) {
        originalMethod?.(...args);
      }
    };
  }
}

function stringify(arg: unknown): string {
  const seen = new WeakSet();
  return JSON.stringify(arg, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[]";
      }
      seen.add(value);
    }
    return value;
  });
}