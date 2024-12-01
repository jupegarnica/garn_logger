type Config = {
  setLevel: (level: ConsoleLevel, options?: SetLevelOptions ) => void;
};

type FunctionLog = (...args: any[]) => void;
type SetLevelOptions = {
  noop: () => void;
};

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

const consoleMethods: ConsoleMethod[] = [
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


const setLevelOptionsDefault: SetLevelOptions = {
  noop: () => {},
};

export function better(consoleReference: Console = console): Config {
  const originalMethodsReferences: Partial<Record<ConsoleMethod, FunctionLog>> =
    {};
  for (const method in consoleReference) {
    originalMethodsReferences[method as ConsoleMethod] =
      consoleReference[method as ConsoleMethod];
  }

  return {
    setLevel: (level: ConsoleLevel, options?: SetLevelOptions) => {
      const { noop } = { ...setLevelOptionsDefault, ...options };

      const levels: ConsoleLevel[] = ["error", "warn", "info", "debug"];
      const levelIndex = levels.indexOf(level);
      if (levelIndex === -1) {
        throw new Error(
          "Invalid log level, use one of: warn, error, info, debug"
        );
      }
      const methods = [...levels, ...consoleMethods];
      methods.forEach((method, index) => {
        if (index > levelIndex) {
          consoleReference[method] = noop;
        } else {
          consoleReference[method] = originalMethodsReferences[method] as FunctionLog;
        }
      });
    },
  };
}
