export type LoggerState = { [key: string]: any };

export type LogRecord = {
  methodName: string;
  args: unknown[];
  timestamp: number;
  levelNumber: number;
  scope?: string;
  msg?: string;
  muted?: boolean;
  returned?: any;
};

export interface AnyMethod {
  // deno-lint-ignore no-explicit-any
  [key: string]: (...args: any[]) => any;
}

export type NextMiddleware = () => void;

export type MiddlewareContext = {
  logRecord: LogRecord;
  state: LoggerState;
};

export type Middleware = (
  ctx: MiddlewareContext,
  next: NextMiddleware,
) => void;
