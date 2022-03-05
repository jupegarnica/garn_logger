export const levelsNameToNumbers: {
  [key: string]: number;
} = {
  debug: 0,
  log: 0,
  info: 10,
  table: 10,
  warn: 20,
  warning: 20,
  error: 30,
  critical: 40,
  fatal: 40,
};

export const levelsNumbersToMethod: {
  [level: number]: string;
} = {
  0: "debug",
  10: "info",
  20: "warn",
  30: "error",
  40: "error",
};
