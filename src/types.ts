export type LoggerState = { [key: string]: any };

export type LogRecord = {
  methodName: string;
  args: unknown[];
  timestamp: number;
  levelNumber: number;
  willReturn: any;
  muted: boolean;
  [dataParsed: string]: any;
};

export type MiddlewareNext = () => void;

export type MiddlewareContext = {
  logRecord: LogRecord;
  state: LoggerState;
};

export type Middleware = (
  ctx: MiddlewareContext,
  next: MiddlewareNext,
) => void;

/**
 * Any string not in this list will be treated as a debug level.
 */
export type LogLevels =
  | string
  | "DEBUG"
  | "INFO"
  | "WARNING"
  | "ERROR"
  | "CRITICAL";
