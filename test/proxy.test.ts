import logger from "../mod.ts";
import { assertEquals, assertStringIncludes, spy, stub } from "../dev_deps.ts";

Deno.test({
  name: "[console] should proxy everything to console",
  ignore: false,
  only: false,
  fn: () => {
    const debug = stub(globalThis.console, "debug");
    logger.debug(1);
    logger.silly(1);
    logger.fun(1);
    assertEquals(debug.calls.length, 3, "should call debug 3 times");
    debug.restore();

    const log = stub(globalThis.console, "log");
    logger.log("log level");
    assertEquals(log.calls.length, 1);
    log.restore();

    const info = stub(globalThis.console, "info");
    logger.info(1);
    assertEquals(info.calls.length, 1);
    info.restore();

    const warn = stub(globalThis.console, "warn");
    logger.warn(1);
    logger.warning(1);
    assertEquals(warn.calls.length, 2);
    warn.restore();

    const error = stub(globalThis.console, "error");
    logger.error(1);
    logger.critical(1);
    logger.fatal(1);
    assertEquals(error.calls.length, 3);
    error.restore();
  },
});

// const data = [
//   new Error("upss"),
//   "string",
//   123,
//   true,
//   false,
//   null,
//   undefined,
//   123n,
//   NaN,
//   10_000_000,
//   { a: 2 },
//   new Set([1, 2, 3]),
//   new Map([["a", 2]]),
//   new Date(),
//   {
//     a: {
//       b: {
//         c: [
//           {
//             d: 1,
//             e: 2,
//           },
//           {
//             d: 1,
//             e: 2,
//           },
//         ],
//       },
//     },
//   },
// ];
