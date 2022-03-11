import { createLogger, formatToAnsiColors } from "../mod.ts";
import type { MiddlewareContext, MiddlewareNext } from "../mod.ts";
import { assert, assertEquals, assertMatch, stub } from "../dev_deps.ts";

function returnMsg({ logRecord }: MiddlewareContext, next: MiddlewareNext): void {
  next();
  logRecord.willReturn = logRecord.ansiText || "";
}

const fulltimeRegex = /\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d/;
const timeRegex = /\d\d:\d\d:\d\d/;

Deno.test({
  name: "[formatToAnsiColors] should have correct default options",
  ignore: false,
  only: false,
  fn: () => {
    const prettyPlugin = formatToAnsiColors({});
    const prettify = createLogger();
    prettify.use(prettyPlugin, returnMsg);

    const msg = prettify.debug("hello", 123);
    assertMatch(
      msg,
      fulltimeRegex,
    );
    assertMatch(msg, /DEBUG/);
    assertMatch(msg, /hello/);
    assertMatch(msg, /123/);
  },
});

Deno.test({
  name: "[formatToAnsiColors] should padEnd correctly",
  // ignore: true,
  // only: true,
  fn: () => {
    const prettyPlugin = formatToAnsiColors({ useColor: false, methodMaxLength: 10 });
    const prettify = createLogger();
    prettify.use(prettyPlugin, returnMsg);

    const log = prettify.log("--");
    const longestMethod = prettify.longestMethod("--");
    assertEquals(log.length, longestMethod.length);
  },
});

Deno.test({
  name: "[formatToAnsiColors] should use color",
  // ignore: true,
  // only: true,
  fn: () => {
    const prettyPlugin = formatToAnsiColors({
      useColor: true,
      showMethod: true,
      methodMaxLength: 3,
      multiline: false,
      timestamp: false,
    });
    delete Deno.stdout.rid;
    const prettify = createLogger();
    prettify.use(prettyPlugin, returnMsg);
    const log = prettify.log("--");
    const noColorOutput = `LOG --`;
    console.log(Deno.env.toObject());

    assertEquals(log, noColorOutput);

    assert(log.length > noColorOutput.length);
  },
});

Deno.test({
  name: "[formatToAnsiColors] should only use colors if enabled",
  ignore: false,
  only: false,
  fn: () => {
    const prettyPlugin = formatToAnsiColors({
      useColor: false,
      methodMaxLength: 3,
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
      ` LOG { a: 1 } message 123`,
    );
  },
});

Deno.test({
  name: "[formatToAnsiColors] should not use color if not tty",
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
    const prettyPlugin = formatToAnsiColors({
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
      ` LOG       { a: 1 } message 123`,
    );
    stubbed.restore();
  },
});

Deno.test({
  // https://no-color.org/
  name: "[formatToAnsiColors] should not use color if variable NO_COLOR is set",
  ignore: false,
  // only: true,
  fn: () => {
    try {
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
      const prettyPlugin = formatToAnsiColors({
        useColor: true,
        methodMaxLength: 3,
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
        ` LOG { a: 1 } message 123`,
      );
      stubbed.restore();
    } catch (error) {
      throw console.error();
    } finally {
      Deno.env.delete("NO_COLOR");
    }
  },
});

Deno.test({
  name: "[formatToAnsiColors] should be configured correctly",
  ignore: false,
  // only: true,
  fn: () => {
    const prettyPlugin = formatToAnsiColors({
      timestamp: "HH:mm:ss",
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
