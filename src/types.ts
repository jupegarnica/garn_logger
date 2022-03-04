export type AnyMethod = {
  [key: string]: (...args: unknown[]) => unknown;
};

export type LevelsNumber = {
  [key: string]: number;
};

export type LogRecord = {
  methodName: string;
  args: unknown[];
  timestamp: number;
  levelNumber: number;
  scope: string;
  msg?: string;
  muted?: boolean;
  returned?: any;
  [key: string | symbol]: unknown;
};

export type Plugin = (
  log: LogRecord,
) => LogRecord;

export type LoggerOptions = {
  plugins?: Plugin[];
  scope?: string;
  extra?: unknown;
};
