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

export type Plugin = (
  log: LogRecord,
  state: LoggerState,
) => LogRecord;

export interface AnyMethod {
  // deno-lint-ignore no-explicit-any
  [key: string]: (...args: any[]) => any;
}
