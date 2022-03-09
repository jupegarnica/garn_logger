import type {
  LoggerState,
  LogLevels,
  LogRecord,
  Middleware,
} from "./types.ts";

import { levelsNameToNumbers } from "./constants.ts";
import { compose } from "./middleware.ts";

type AnyMethodName = Exclude<string, "use">;

type Methods = { [key: AnyMethodName]: (...args: any[]) => any };

class Logger {
  // deno-lint-ignore no-explicit-any
  [key: AnyMethodName]: (...args: any[]) => any
  #methods: Methods = {};
  #middleware: Middleware[] = [];
  #state: LoggerState = {
    filterLevel: 0,
  };
  #composedMiddleware: Middleware = (_, next) => next();

  setFilter(levelName: LogLevels) {
    this.#state.filterLevel = levelsNameToNumbers(levelName.toLowerCase());
  }

  use(...plugins: Middleware[]): Logger {
    this.#middleware.push(...plugins.flat(1));
    this.#composedMiddleware = compose(this.#middleware);
    return this;
  }

  #handle(methodName: string) {
    if (this[methodName]) {
      return this[methodName].bind(this);
    }

    this.#methods[methodName] ??= (
      ...args: unknown[]
    ) => {
      const levelNumber = levelsNameToNumbers(methodName);
      const logRecord: LogRecord = {
        methodName,
        args,
        timestamp: Date.now(),
        levelNumber,
        willReturn: args,
        muted: levelNumber < this.#state.filterLevel,
      };
      const ctx = { logRecord, state: this.#state };
      this.#composedMiddleware(ctx, () => {});

      return ctx.logRecord.willReturn;
    };

    return this.#methods[methodName].bind(this);
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

export { Logger };
