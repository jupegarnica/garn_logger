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
   * @param query - The query strings or regular expressions to filter log messages.
   * @returns The configuration object.
   * @example
   * better(console).filter("error", /test/i);
   */
  filter: (...query: (string | RegExp)[]) => Config;

  /**
   * Resets the filter for log messages.
   * @returns The configuration object.
   * @example
   * better(console).resetFilter();
   */
  resetFilter: () => Config;
};

type FunctionLog = (...args: unknown[]) => void;

type ConsoleLevel = "warn" | "error" | "info" | "debug";
type ConsoleMethod = keyof Console;

const levelValues: Record<ConsoleLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Update METHODS_LEVELS to use numeric levels
const METHODS_LEVELS_VALUES: Record<ConsoleMethod, number> = {
  error: levelValues["error"],
  warn: levelValues["warn"],
  info: levelValues["info"],
  debug: levelValues["debug"],
  log: levelValues["debug"],
  trace: levelValues["debug"],
  dir: levelValues["debug"],
  dirxml: levelValues["debug"],
  time: levelValues["debug"],
  timeEnd: levelValues["debug"],
  timeLog: levelValues["debug"],
  group: levelValues["debug"],
  groupEnd: levelValues["debug"],
  groupCollapsed: levelValues["debug"],
  clear: levelValues["error"], // Ensure clear always logs
  count: levelValues["debug"],
  countReset: levelValues["debug"],
  assert: levelValues["error"], // Ensure assert always logs
  table: levelValues["debug"],
  profile: levelValues["debug"],
  profileEnd: levelValues["debug"],
  timeStamp: levelValues["debug"],
};

type ConsoleReference = Console & {
  [currentFilterSymbol]?: RegExp [];
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
  consoleReference[currentFilterSymbol] ??= [];
  consoleReference[currentLevelSymbol] ??= "debug";

  consoleReference[originalMethodsReferencesSymbol] ??= Object.fromEntries(
    Object.entries(consoleReference).map(([key, value]) => [key, value])
  );

  const config: Config = {
    setLevel(level: ConsoleLevel) {
      if (levelValues[level] === undefined) {
        throw new Error(`Invalid level: ${level}`);
      }
      consoleReference[currentLevelSymbol] = level;
      return config;
    },
    filter(...queries: (string | RegExp)[]) {
      consoleReference[currentFilterSymbol] = queries.map(
        q => (q instanceof RegExp ? q : new RegExp(q, "i"))
      );
      return config;
    },
    resetFilter() {
      consoleReference[currentFilterSymbol] = [];
      return config;
    },
  };
  applyConfig(consoleReference);

  return config;
}

function applyConfig(consoleReference: ConsoleReference) {
  const originalMethods = consoleReference[
    originalMethodsReferencesSymbol
  ] as Partial<Record<ConsoleMethod, FunctionLog>>;

  // Wrap console methods only once
  for (const methodName in originalMethods) {
    // console.log({methodName});

    const method = methodName as ConsoleMethod;
    const methodLevelValue =
      METHODS_LEVELS_VALUES[method] ?? levelValues["debug"];
    const originalMethod = originalMethods[method]!;

    consoleReference[method] = (...args: unknown[]) => {
      const currentLevelValue =
        levelValues[consoleReference[currentLevelSymbol] ?? "debug"];
      const currentFilters = consoleReference[currentFilterSymbol] ?? [];

      if (methodLevelValue <= currentLevelValue) {
        if (
          currentFilters.length === 0 ||
          args.some((arg) =>
            currentFilters.some((filter) => filter.test(stringify(arg)))
          )
        ) {
          originalMethod(...args);
        }
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
