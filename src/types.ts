export type LoggerState = { [key: string]: any };

export type LogRecord = {
  methodName: string;
  args: unknown[];
  timestamp: number;
  levelNumber: number;
  willReturn: any;
  muted: boolean;
  [msg: string]: any;
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


export type LogLevels =
  | "VERBOSE"
  | "DEBUG"
  | "INFO"
  | "WARNING"
  | "ERROR"
  | "CRITICAL";
