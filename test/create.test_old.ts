import logger, { create } from "../mod.ts";
import { assertEquals, assertStringIncludes, spy, stub } from "../dev_deps.ts";

Deno.test({
  name: "[create] should create a logger with debug level by default",
  ignore: true,
  only: false,
  fn: () => {
    const scoped = create({ scope: "test" });

    const log = stub(globalThis.console, "log");
    scoped.debug("hello");
    assertEquals(log.calls.length, 1);
    assertStringIncludes(
      log.calls[0].args[0],
      "DEBUG   [test]  hello",
    );
    log.restore();
  },
});

Deno.test({
  name: "[create] should create a logger with level assigned",
  ignore: true,
  only: false,
  fn: () => {
    const scoped = create({ scope: "test", level: "CRITICAL" });
    const log = stub(globalThis.console, "log");
    scoped.error("hello");
    scoped.critical("ups");
    assertEquals(log.calls.length, 1);
    assertStringIncludes(
      log.calls[0].args[0],
      "CRITICAL [test]  ups",
    );
    log.restore();
  },
});

Deno.test({
  name: "[create] should not interfere with other scopes",
  ignore: true,
  only: false,
  fn: () => {
    const scoped = create({ scope: "test", level: "CRITICAL" });
    const log = stub(globalThis.console, "log");
    scoped.critical("ups");
    assertEquals(log.calls.length, 1);
    assertStringIncludes(
      log.calls[0].args[0],
      "CRITICAL [test]  ups",
    );

    logger.error("hello");
    assertEquals(log.calls.length, 2);
    assertStringIncludes(
      log.calls[1].args[0],
      "ERROR   hello",
    );
    log.restore();
  },
});

Deno.test({
  name: "[create] should change level in runtime",
  ignore: true,
  only: false,
  fn: () => {
    const scoped = create({ scope: "test", level: "CRITICAL" });
    const log = stub(globalThis.console, "log");
    scoped.error("ups");
    assertEquals(log.calls.length, 0);
    scoped.error("ups");
    assertEquals(log.calls.length, 1);

    log.restore();
  },
});
