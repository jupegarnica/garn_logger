import {  createLogger } from "../mod.ts";
import type { MiddlewareNext } from "../src/types.ts";
import { assertEquals, spy } from "../dev_deps.ts";

Deno.test({
  name: "[default] should return args",
  ignore: false,
  only: false,
  fn: () => {
    const logger = createLogger();
    const data = [1, 2, 3];
    const returned = logger.log(...data);
    assertEquals(returned, data);
  },
});

Deno.test({
  name: "[default] should run plugins",
  ignore: false,
  only: false,
  fn: () => {
    const plugin = spy((_, next: MiddlewareNext) => {
      next();
    });
    const logger = createLogger();
    logger.use(plugin, plugin);
    logger.log("test");
    assertEquals(plugin.calls.length, 2);
  },
});

Deno.test({
  name: "[default] plugins must get LogRecord and state",
  ignore: false,
  only: false,
  fn: () => {
    const plugin = spy(() => {});
    const logger = createLogger();
    logger.use(plugin);
    logger.log("test");
    assertEquals(plugin.calls[0].args[0].logRecord.args, [
      "test",
    ]);
    assertEquals(plugin.calls[0].args[0].state, {
      filterLevel: 0,
    });
  },
});

Deno.test({
  name: "[default] should apply defaults to LogRecord",
  ignore: false,
  only: false,
  fn: () => {
    const logger = createLogger();
    logger.use(
      function ({ logRecord }) {
        assertEquals(
          typeof logRecord.timestamp,
          "number",
        );
        assertEquals(logRecord.methodName, "say");
        assertEquals(logRecord.levelNumber, 0);
        assertEquals(logRecord.args, [
          "hello",
          "world",
        ]);
        assertEquals(logRecord.willReturn, [
          "hello",
          "world",
        ]);
        assertEquals(logRecord.muted, false);
        assertEquals(logRecord.msg, undefined);
      },
    );
    logger.say("hello", "world");
  },
});

Deno.test({
  name: "[default] should apply keep state between plugins",
  ignore: false,
  only: false,
  fn: () => {
    const logger = createLogger();

    logger.use(function ({ state }, next) {
      state.filterLevel = 40;
      next();
    });
    logger.use(function ({ state }, next) {
      assertEquals(state.filterLevel, 40);
      next();
    });
    logger.say("hello", "world");
  },
});

Deno.test({
  name: "[default] setFilter should apply filter state and mute logRecord",
  ignore: false,
  // only: true,
  fn: () => {
    const logger = createLogger();
    logger.setFilter("error")
    logger.use(
      function assertFilter({ state }, next) {
        assertEquals(state.filterLevel, 30);
        next();
      },
      function assertMute({ logRecord }) {
        const { methodName, muted } = logRecord;
        if (methodName === "debug") {
          assertEquals(
            muted,
            true,
          );
        } else {
          assertEquals(
            muted,
            false,
          );
        }
      },
    );
    logger.debug("debug");
    logger.error("error");
  },
});

// Deno.test({
//   name: "[default] should mute lower levels",
//   ignore: false,
//   only: false,
//   fn: () => {
//     const filter = "info";
//     const logger = createLogger();
//     logger.use(
//       filterLowerLevels(filter),
//       function assertIsMuted(log) {
//         if (log.msg !== filter) {
//           assertEquals(log.muted, true);
//         } else {
//           assertEquals(log.muted, undefined);
//         }
//         return log;
//       },
//     )
//     logger.error("error");
//     logger.info("info");
//     logger.log("log");
//     logger.debug("debug");
//   },
// });
