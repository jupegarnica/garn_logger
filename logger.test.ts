import logger from "./mod.ts";
import { assertEquals, assertStringIncludes, spy, stub } from "./dev_deps.ts";

const data = [
  new Error("upss"),
  "string",
  123,
  true,
  false,
  null,
  undefined,
  123n,
  NaN,
  10_000_000,
  { a: 2 },
  new Set([1, 2, 3]),
  new Map([["a", 2]]),
  new Date(),
  {
    a: {
      b: {
        c: [
          {
            d: 1,
            e: 2,
          },
          {
            d: 1,
            e: 2,
          },
        ],
      },
    },
  },
];
Deno.test({
  name: "[default] should log to console",
  ignore: false,
  only: false,
  fn: () => {
    const log = stub(globalThis.console, "log");
    logger.log("hola!");
    assertEquals(log.calls.length, 1);
    assertStringIncludes(
      log.calls[0].args[0],
      "\x1b[22m [INFO]     \x1b[1mhola!\x1b[22m\x1b[39m ",
    );
    log.restore();
  },
});

Deno.test({
  name: "[default] should return args",
  ignore: false,
  only: false,
  fn: () => {
    const log = stub(globalThis.console, "log");
    const returned = logger.log(...data);
    assertEquals(returned, data);
    log.restore();
  },
});

Deno.test({
  name: "[default] should log everything to console",
  ignore: false,
  only: false,
  fn: () => {
    const log = stub(globalThis.console, "log");

    logger.debug(1);
    logger.log(1);
    logger.info(1);
    logger.warning(1);
    logger.warn(1);
    logger.error(1);
    logger.critical(1);
    assertEquals(log.calls.length, 7);

    log.restore();
  },
});
