import {
  returnArgs,
  transportToConsole,
} from "./plugins/default_plugins.ts";

import { compose } from "./middleware.ts";

import type {
  AnyMethod,
  LoggerState,
  LogRecord,
  Middleware,
  MiddlewareContext,
  NextMiddleware,
} from "./types.ts";

import { levelsNameToNumbers } from "./constants.ts";

class Logger implements AnyMethod {
  // deno-lint-ignore no-explicit-any
  [key: string]: (...args: any[]) => any
  #methods: AnyMethod = {};
  #plugins: Middleware[] = [];
  #state: LoggerState = {
    filterLevel: 0,
  };
  #composedMiddleware: Middleware = (ctx: MiddlewareContext, next?: NextMiddleware) => {
    next?.();
  };

  use(...plugins: Middleware[]): Logger {
    this.#plugins.push(...plugins);
    this.#composedMiddleware = compose(this.#plugins);
    return this;
  }

  #handle(methodName: string) {
    if (this[methodName]) {
      return this[methodName].bind(this);
    }

    this.#methods[methodName] ??= (
      ...args: unknown[]
    ) => {
      const levelNumber = levelsNameToNumbers[methodName] ?? 0;
      const logRecord: LogRecord = {
        methodName,
        args,
        timestamp: Date.now(),
        levelNumber,
        muted: levelNumber < this.#state.filterLevel,
      };
      const ctx = { logRecord, state: this.#state };
      this.#composedMiddleware(ctx, () => {});

      return ctx.logRecord.returned;
    };

    return this.#methods[methodName].bind(this);
  }

  constructor() {
    this.use(returnArgs);

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

export default logger;

export { Logger };
