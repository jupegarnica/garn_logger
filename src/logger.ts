import {
  applyLevel,
  returnArgs,
  transportToConsole,
} from "./plugins/default_plugins.ts";

import type {
  AnyMethod,
  LoggerState,
  LogRecord,
  Plugin,
} from "./types.ts";

// import { levelsNameToNumbers } from "./constants.ts";

class Logger implements AnyMethod {
  // deno-lint-ignore no-explicit-any
  [key: string]: (...args: any[]) => any
  #methods: AnyMethod = {};
  #plugins: Plugin[] = [
    applyLevel,
    returnArgs,
  ];
  #state: { [key: string]: any } = {
    filterLevel: 0,
  };

  // filter(level: string): Logger {
  //   this.#state.filterLeverLowerThan =
  //     levelsNameToNumbers[level] ?? 0;
  //   return this;
  // }

  use(...plugins: Plugin[]): Logger {
    this.#plugins.push(...plugins);
    return this;
  }

  #handle(methodName: string) {
    if (this[methodName]) {
      return this[methodName].bind(this);
    }

    this.#methods[methodName] ??= (
      ...args: unknown[]
    ) => {
      const logRecord: LogRecord = {
        methodName,
        args,
        timestamp: Date.now(),
        levelNumber: 0,
      };
      return this.#pipeToPlugins(
        logRecord,
        this.#state,
      );
    };

    return this.#methods[methodName].bind(this);
  }

  #pipeToPlugins(
    logRecord: LogRecord,
    state: LoggerState,
  ) {
    const output = this.#plugins.reduce(
      (acc: LogRecord, plugin: Plugin) =>
        plugin(acc, state),
      logRecord,
    );
    return output.returned;
  }
  constructor() {
    return new Proxy(this, {
      get(target, name: string) {
        return target.#handle(name);
      },
    });
  }
}

export function createLogger() {
  const logger = new Logger();
  return logger;
}

const logger = createLogger();
logger.use(
  transportToConsole(globalThis.console),
);

logger.yellow("hello");

export default logger;

export { Logger };
