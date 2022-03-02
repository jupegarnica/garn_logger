import {
  handlers,
  LogLevels,
  // getLogger,
  // setup,
} from "https://deno.land/std@0.127.0/log/mod.ts";

// export type { LevelName } from "https://deno.land/std@0.127.0/log/levels.ts";
export type { LogRecord } from "https://deno.land/std@0.127.0/log/logger.ts";

import * as colors from "https://deno.land/std@0.127.0/fmt/colors.ts";
import { format } from "https://deno.land/std@0.127.0/datetime/mod.ts";

import { ensureDirSync } from "https://deno.land/std@0.127.0/fs/mod.ts";

import {
  GenericFunction,
  Logger as _Logger,
  LogRecord,
} from "https://deno.land/std@0.127.0/log/logger.ts";

import { addLogToQueue, flushQueue } from "./mailer.ts";

export type LevelName =
  | "NOTSET"
  | "DEBUG"
  | "INFO"
  | "WARNING"
  | "ERROR"
  | "CRITICAL";

function formatLogFileName(
  date: Date = new Date(),
): string {
  return format(date, "yyyy-MM-dd");
}

function formatDate(date: Date | string): string {
  date = new Date(date);
  return format(date, "yyyy-MM-dd HH:mm");
}

function padEnd(str: string, length = 7): string {
  // let response = "";
  // for (let index = 0; index < length; index++) {
  //   response += str[index] ?? " ";
  // }

  return str.padEnd(length, " ");
}

const stringify = (val: unknown): string => {
  if (typeof val === "string") return val;
  return Deno.inspect(val);
};

const stringifyConsole = (val: unknown): string => {
  if (typeof val === "string") return val;
  return Deno.inspect(val, {
    trailingComma: true,
    colors: true,
    depth: Infinity,
    compact: true,
    sorted: false,
    getters: false,
    showHidden: false,
    showProxy: false,
    iterableLimit: Infinity,
  });
};
// const DEBUG = Deno.env.get("DEBUG");
// const LOG_LEVEL = (Deno.env.get("LOG_LEVEL") || "INFO") as unknown as LogLevels;
const LOGS_DIR = Deno.env.get("LOGS_DIR") || "logs";

const emailFormatter = ({
  datetime,
  levelName,
  args,
}: LogRecord) => {
  let text = `<div class="record ${levelName}"> <i>${
    formatDate(
      datetime,
    )
  }</i> <b>${padEnd(levelName)}</b>`;

  text += '<div class="args">';
  args.forEach((arg, i) => {
    text += `<div class="arg${i}">${stringify(arg)}</div>`;
  });
  text += "</div>";

  return text + "</div><hr>";
};

class EmailHandler extends handlers.BaseHandler {
  format(logRecord: LogRecord): string {
    const msg = super.format(logRecord);
    return msg.replaceAll("\n", "<br>");
  }
  async log(msg: string): Promise<void> {
    await addLogToQueue({
      subject: `logs`,
      content: msg,
    });
  }
}

function colorize(level: number, arg: unknown): string {
  switch (level) {
    case LogLevels.DEBUG:
      return colors.dim(stringify(arg));
    case LogLevels.INFO:
      return colors.green(stringify(arg));
    case LogLevels.WARNING:
      return colors.rgb24(stringify(arg), 0xffcc00);
    case LogLevels.ERROR:
      return colors.red(stringify(arg));
    case LogLevels.CRITICAL:
      return colors.bgBlack(colors.red(stringify(arg)));
    default:
      return arg as string;
  }
  // return (a: unknown) => a;
}

class Logger extends _Logger {
  // @ts-ignore
  _log<T>(
    level: number,
    msg: (T extends GenericFunction ? never : T) | (() => T),
    ...args: T[]
  ): T | undefined {
    // @ts-ignore
    super._log(level, msg, ...args);
    // @ts-ignore
    return args;
  }

  log = super.info;
  warn = super.warning;
}


class ConsoleHandler extends handlers.BaseHandler {
  format(logRecord: LogRecord): string {
    const [firstArg, ...args] = [...logRecord.args];

    let headers = `${
      colors.dim(
        formatDate(logRecord.datetime),
      )
    } `;

    headers += `${(padEnd(`${logRecord.levelName}`))}`;
    headers += logRecord.msg ? ` ${(padEnd(`[${logRecord.msg}]`))}` : "";
    headers += ` ${(stringify(firstArg))} `;
    headers = colorize(logRecord.level,headers) as string;

    const newArgs = args
      ?.map((v) => stringifyConsole(v));

    // ?.map(colorize(LogLevels.DEBUG));
    // console.log(headers,'\n',...newArgs);
    // console.group();
    // newArgs?.forEach((v: unknown) => {
    //   console.log(v);
    // });
    // console.groupEnd();
    // console.log("\n");

    return `${headers} ${newArgs.join(" ")}`;
  }

  log(msg: string): void {
    console.log(msg);
  }
}

const fileFormatter = ({
  datetime,
  levelName,
  args,
  msg,
}: LogRecord) => {
  let text = `${formatDate(datetime)} ${
    padEnd(
      levelName,
    )
  } ${msg}`;
  args.forEach((arg) => {
    text += `\n${stringify(arg)}`;
  });
  return text + "\n";
};

class FileHandler extends handlers.FileHandler {
  constructor(level: LevelName, options: any) {
    super(level, options);
    ensureDirSync(LOGS_DIR);
  }
}

const fileHandler = new FileHandler("WARNING", {
  filename: `${LOGS_DIR}/${formatLogFileName()}.log`,
  mode: "a", // 'a', 'w', 'x'
  formatter: fileFormatter,
});

export const flushLogs = fileHandler.flush.bind(fileHandler);

const handlersDefault = {
  console: new ConsoleHandler("DEBUG"),
  file: fileHandler,

  fileRotating: new handlers.RotatingFileHandler("DEBUG", {
    maxBytes: 1024 * 10,
    maxBackupCount: 10,
    filename: `${LOGS_DIR}/${formatLogFileName()}.log`,
    mode: "a",
    formatter: fileFormatter,
  }),
  email: new EmailHandler("DEBUG", {
    formatter: emailFormatter,
  }),
  // email2: new EmailHandler("NOTSET"),
};

// await setup({
//   handlers: handlersDefault,
//   loggers: {
//     default: {
//       level: "INFO",
//       handlers: ["console"]
//     },
//     // full: {
//     //   level: "INFO",
//     //   handlers: ["file", "console", "email"],
//     // },
//     // debug: {
//     //   level: "DEBUG",
//     //   handlers: ["console"],
//     // },
//     // email: {
//     //   level: "ERROR",
//     //   handlers: ["email"],
//     // },
//   },
// });

export type Transports = "file" | "console" | "email" | "fileRotating";

export type LoggerOptions = {
  level?: LevelName;
  transports?: Transports[];
  scope?: string;
};

type LoggerMethod = (...args: unknown[]) => string;

export type LoggerType = {
  debug: LoggerMethod;
  log: LoggerMethod;
  info: LoggerMethod;
  warn: LoggerMethod;
  warning: LoggerMethod;
  error: LoggerMethod;
  critical: LoggerMethod;
};

export const create = (
  { scope = "default", transports = ["console"], level = "DEBUG" }:
    LoggerOptions,
): LoggerType => {

  const _handlers = transports.map((t) => handlersDefault[t]);
  const _logger = new Logger(scope, level, { handlers: _handlers });
  if (scope === "default") {
    scope = "";
  }

  return {
    debug: (...args: unknown[]) => _logger.debug(scope, ...args),
    log: (...args: unknown[]) => _logger.info(scope, ...args),
    info: (...args: unknown[]) => _logger.info(scope, ...args),
    warn: (...args: unknown[]) => _logger.warning(scope, ...args),
    warning: (...args: unknown[]) => _logger.warning(scope, ...args),
    error: (...args: unknown[]) => _logger.error(scope, ...args),
    critical: (...args: unknown[]) => _logger.critical(scope, ...args),

  };
};

const logger = create({
  scope: "default",
  transports: ["console"],
  level: "DEBUG",
});

export { logger };
export default logger;
