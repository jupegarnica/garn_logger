export type LoggerState = { [key: string]: any };

export type LogRecord = {
  methodName: string;
  args: unknown[];
  timestamp: number;
  levelNumber: number;
  willReturn: any;
  scope?: string;
  msg?: string;
  muted?: boolean;
};

export interface AnyMethod {
  // deno-lint-ignore no-explicit-any
  [key: string]: (...args: any[]) => any;
}

export type MiddlewareNext = () => void;

export type MiddlewareContext = {
  logRecord: LogRecord;
  state: LoggerState;
};

export type Middleware = (
  ctx: MiddlewareContext,
  next: MiddlewareNext,
) => void;
