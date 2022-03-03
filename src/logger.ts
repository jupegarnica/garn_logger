import {
  applyLevel,
  filterBaseOnLevel,
  returnArgs,
  transportToConsole,
} from "./plugins/default_plugins.ts";
import type { AnyMethod, LoggerOptions, LogRecord, Plugin } from "./types.ts";

class Logger {
  [key: string]: (...args: unknown[]) => unknown[]
  #methods: AnyMethod = {};
  #plugins: Plugin[] = [];
  #handle(methodName: string) {
    if (!this.#methods[methodName]) {
      this.#methods[methodName] = (...args: unknown[]) => {
        const logRecord: LogRecord = {
          methodName,
          args,
          timestamp: Date.now(),
          levelNumber: 0,
        };
        return this.#pipeToPlugins(logRecord);
      };
    }
    return this.#methods[methodName];
  }

  #pipeToPlugins(logRecord: LogRecord) {
    const output = this.#plugins.reduce((acc: any, plugin: Plugin) => {
      return plugin(acc);
    }, logRecord);
    return output.returned;
  }

  constructor({ plugins = defaultPlugins }: LoggerOptions = {}) {
    this.#plugins = plugins;
    return new Proxy(this, {
      get(target, name: string) {
        return target.#handle(name);
      },
    });
  }
}

export const defaultPlugins: Plugin[] = [
  applyLevel,
  filterBaseOnLevel("debug"),
  transportToConsole,
  returnArgs,
];

const logger = new Logger();
export default logger;
