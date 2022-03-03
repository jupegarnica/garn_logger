import logger from "../mod.ts";
import { assertEquals, assertStringIncludes, spy, stub } from "../dev_deps.ts";

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
  ignore: true,
  only: false,
  fn: () => {
    const log = stub(globalThis.console, "log");
    logger.log("hola!");
    assertEquals(log.calls.length, 1);
    assertStringIncludes(
      log.calls[0].args[0],
      "INFO    hola!",
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
