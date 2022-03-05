import {
  Logger,
  transportToConsole,
} from "../mod.ts";
import {
  assertEquals,
  assertStringIncludes,
  spy,
  stub,
} from "../dev_deps.ts";

const consolePlugin = transportToConsole(
  globalThis.console,
);
const logger = new Logger({
  plugins: [consolePlugin],
});

const consoleMethods = Object.keys(console)
  .filter((method: string) =>
    // @ts-ignore
    typeof console[method] === "function"
  );
Deno.test({
  name:
    "[console] should proxy every method to console",
  ignore: false,
  only: false,
  fn: async ({ step }) => {
    for (const method of consoleMethods) {
      await step({
        name: `proxy ${method} to console`,
        ignore: false,
        fn: () => {
          const stubbed = stub(
            consolePlugin._console,
            method,
          );
          const returned = logger[method](method);
          assertEquals(returned, [method]);
          assertEquals(stubbed.calls.length, 1);
          assertEquals(stubbed.calls[0].args, [
            method,
          ]);
          stubbed.restore();
        },
      });
    }
  },
});

Deno.test({
  name:
    "[console] should convert every method to a console equivalent method",
  ignore: false,
  only: false,
  fn: () => {
    const debug = stub(
      consolePlugin._console,
      "debug",
    );
    logger.debug(1);
    logger.silly(1);
    logger.fun(1);
    assertEquals(debug.calls.length, 3);
    debug.restore();

    const log = stub(
      consolePlugin._console,
      "log",
    );
    logger.log(1);
    logger.LOG(1);
    logger.Log(1);
    assertEquals(log.calls.length, 3);
    log.restore();

    const info = stub(
      consolePlugin._console,
      "info",
    );
    logger.info(1);
    logger.iNfo(1);
    assertEquals(info.calls.length, 2);
    info.restore();

    const warn = stub(
      consolePlugin._console,
      "warn",
    );
    logger.warn(1);
    logger.warning(1);
    assertEquals(warn.calls.length, 2);
    warn.restore();

    const error = stub(
      consolePlugin._console,
      "error",
    );
    logger.error(1);
    logger.critical(1);
    logger.fatal(1);
    assertEquals(error.calls.length, 3);
    error.restore();
  },
});

Deno.test({
  name:
    "[console] should override native console",
  ignore: false,
  only: false,
  fn: () => {
    const console = logger;

    const log = stub(
      consolePlugin._console,
      "log",
    );
    const returned = console.log(1, 2);
    assertEquals(log.calls.length, 1);
    assertEquals(returned, [1, 2]);
    log.restore();
  },
});

const deep: any = {
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
};

deep.circular = deep;
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
  new Proxy(deep, {}),
  deep,
];

Deno.test({
  name:
    "[console] should work with all types of data, even with circular references",
  ignore: false,
  only: false,
  fn: () => {
    const log = stub(
      consolePlugin._console,
      "log",
    );
    const returned = logger.log(...data);
    assertEquals(returned, data);
    assertEquals(log.calls.length, 1);
    log.restore();
  },
});