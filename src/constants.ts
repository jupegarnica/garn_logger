export const levelsNumbers: {
  [key: string]: number;
} = {
  debug: 0,
  log: 0,
  table: 0,
  info: 10,
  success: 10,
  warn: 20,
  warning: 20,
  catch: 30,
  error: 30,
  critical: 40,
  fatal: 40,
};

export const levelsNameToNumbers = (name: string): number => levelsNumbers[name] ?? levelsNumbers.debug


const colors: { [level: string]: string } = {
  debug: "#666666",
  timestamp: "#666666",
  time: "#666666",
  timeEnd: "#666666",
  group: "#666666",
  groupEnd: "#666666",
  log: "#666666",
  table: "#666666",
  success: "#44cc11",
  '200': "#44cc11",
  '201': "#44cc11",
  '204': "#44cc11",
  info: "#0099ff",
  warn: "#ff9900",
  '400': "#ff9900",
  '404': "#ff9900",
  '422': "#ff9900",
  warning: "#ff9900",
  '500': "#ee0055",
  '502': "#ee0055",
  '503': "#ee0055",
  '504': "#ee0055",
  error: "#ee0055",
  critical: "#ff3300",
  fatal: "#ff0000",
};

export const levelsNameToColors = (name: string):string => {
  return colors[name] ?? colors.debug;
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
