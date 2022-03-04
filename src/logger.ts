import {
  applyLevel,
  filterLowerLevels,
  returnArgs,
  transportToConsole,
} from "./plugins/default_plugins.ts";
import type {
  AnyMethod,
  LoggerOptions,
  LogRecord,
  Plugin,
} from "./types.ts";

class Logger<ReturnedType> {
  [key: string]: (
    ...args: unknown[]
  ) => ReturnedType
  #scope: string;
  #extra: unknown;
  #methods: AnyMethod = {};
  #plugins: Plugin[] = [
    applyLevel,
    returnArgs,
  ];

  #handle(methodName: string) {
    this.#methods[methodName] ??= (
      ...args: unknown[]
    ) => {
      const logRecord: LogRecord = {
        methodName,
        args,
        timestamp: Date.now(),
        levelNumber: 0,
        scope: this.#scope,
        extra: this.#extra,
      };
      return this.#pipeToPlugins(logRecord);
    };
    return this.#methods[methodName];
  }

  #pipeToPlugins(logRecord: LogRecord) {
    const output = this.#plugins.reduce(
      (acc: LogRecord, plugin: Plugin) =>
        plugin(acc),
      logRecord,
    );
    return output.returned;
  }
  constructor(
    { plugins = [], scope = "", extra }:
      LoggerOptions = {},
  ) {
    this.#plugins.push(...plugins);
    this.#scope = scope;
    this.#extra = extra;
    return new Proxy(this, {
      get(target, name: string) {
        return target.#handle(name);
      },
    });
  }
}

const logger = new Logger({
  plugins: [
    filterLowerLevels("debug"),
    transportToConsole(globalThis.console),
  ],
});

export { Logger };
export default logger;
