import { createLogger, LogRecord, pretty } from "../mod.ts";
import type {Middleware, MiddlewareContext, NextMiddleware} from "../mod.ts";
import { assertEquals, assertMatch, stub } from "../dev_deps.ts";

function returnMsg({ logRecord }: MiddlewareContext, next: NextMiddleware): void {
  logRecord.returned = logRecord.msg || "";
  next();
}

const fulltimeRegex = /\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d/;
const timeRegex = /\d\d:\d\d:\d\d/;

Deno.test({
  name: "[pretty] should have correct default options",
  ignore: false,
  only: false,
  fn: () => {
    const prettyPlugin = pretty({});
    const prettify = createLogger();
    prettify.use(prettyPlugin, returnMsg);

    const msg = prettify.debug("hello", 123);
    assertMatch(
      msg,
      fulltimeRegex,
    );
    assertMatch(msg, /DEBUG/);
    assertMatch(msg, /"hello"/);
    assertMatch(msg, /123/);
  },
});

// TODO: MAKE IT WORK WHEN COLORED
Deno.test({
  name: "[pretty] should padEnd correctly",
  ignore: true,
  only: false,
  fn: () => {
    const prettyPlugin = pretty({});
    const prettify = createLogger();
    prettify.use(prettyPlugin, returnMsg);

    console.log("\n\n----\n");
    const log = prettify.log("--");
    console.log(log.length, log);
    const warn = prettify.warn("--");
    console.warn(warn.length, warn);
    const error = prettify.error("--");
    console.error(error.length, error);
    const warning = prettify.warning("--");
    console.log(warning.length, warning);
    const critical = prettify.critical("--");
    console.log(critical.length, critical);
    assertEquals(log, warning);
  },
});

Deno.test({
  name: "[pretty] should only use colors if enabled",
  ignore: false,
  only: false,
  fn: () => {
    const prettyPlugin = pretty({
      useColor: false,
    });
    const prettify = createLogger();
    prettify.use(prettyPlugin, returnMsg);

    const msg = prettify.log(
      { a: 1 },
      "message",
      123,
    );
    assertMatch(msg, fulltimeRegex);
    const rest = msg.replace(fulltimeRegex, "");
    assertEquals(
      rest,
      ` LOG { a: 1 } "message" 123`,
    );
  },
});

Deno.test({
  name: "[pretty] should not use color if not tty",
  ignore: false,
  only: false,
  fn: () => {
    const stubbed = stub(
      Deno,
      "isatty",
      () => false,
    );
    assertEquals(
      Deno.isatty(Deno.stdout.rid),
      false,
    );
    const prettyPlugin = pretty({
      useColor: true,
    });
    const prettify = createLogger();
    prettify.use(prettyPlugin, returnMsg);

    const msg = prettify.log(
      { a: 1 },
      "message",
      123,
    );
    assertMatch(msg, fulltimeRegex);
    const rest = msg.replace(fulltimeRegex, "");
    assertEquals(
      rest,
      ` LOG { a: 1 } "message" 123`,
    );
    stubbed.restore();
  },
});

Deno.test({
  // https://no-color.org/
  name: "[pretty] should not use color if variable NO_COLOR is set",
  ignore: false,
  only: false,
  fn: () => {
    const stubbed = stub(
      Deno,
      "isatty",
      () => true,
    );
    assertEquals(
      Deno.isatty(Deno.stdout.rid),
      true,
    );
    Deno.env.set("NO_COLOR", "1");
    const prettyPlugin = pretty({
      useColor: true,
    });
    const prettify = createLogger();
    prettify.use(prettyPlugin, returnMsg);
    const msg = prettify.log(
      { a: 1 },
      "message",
      123,
    );
    assertMatch(msg, fulltimeRegex);
    const rest = msg.replace(fulltimeRegex, "");
    assertEquals(
      rest,
      ` LOG { a: 1 } "message" 123`,
    );
    stubbed.restore();
    Deno.env.delete("NO_COLOR");
  },
});

Deno.test({
  name: "[pretty] should be configured correctly",
  ignore: false,
  only: false,
  fn: () => {
    const prettyPlugin = pretty({
      timestampFormat: "HH:mm:ss",
      useColor: false,
      showMethod: false,
      showScope: false,
      multiline: true,
      depth: 1,
      iterableLimit: 1,
    });
    const prettify = createLogger();
    prettify.use(prettyPlugin, returnMsg);

    const msg = prettify.log(
      {
        a: {
          b: 2,
        },
      },
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      "message",
      123,
    );
    assertMatch(msg, timeRegex);
    const rest = msg.replace(timeRegex, "");
    assertEquals(
      rest,
      ` {\n  a: [Object],\n}\n[\n  1,\n  ... 9 more items,\n]\nmessage\n123`,
    );
  },
});
