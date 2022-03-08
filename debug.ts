import logger, { formatToAnsiColors } from "./mod.ts";
import { transportToEmail } from "./src/middleware/transport_to_email.ts";

logger.use(
  transportToEmail({
    from: "juan@garn.dev",
    to: "juan@garn.dev",
    hostname: "localhost",
    logLevel: "debug",
    port: "1025",
    debounceTime: 100,
  }),
);

const tableData = [
  { a: 1, b: 2, c: 3 },
  { a: 10, b: 20, c: 30 },
  { a: 100, b: 200, c: 300 },
];

const anyTypeOfData = [
  "string",
  {
    a: 1,
    b: 2,
  },
  [1, "2", 3n, 0.003],
  new Set([1, 2, 3]),
  new Map(),
  new Error("ups"),
];

const methods = [
  "assert",
  // "table",
  "debug",
  "log",
  "info",
  "200",
  "400",
  "500",
  "info",
  "success",
  "warn",
  "warning",
  "catch",
  "error",
  "critical",
  "fatal",
];

for (const method of methods) {
  logger[method](false,"Hello World", [new Date(), Math.random()]);
}
