import {
  createLogger,
  filterLowerLevels,
} from "../mod.ts";
import type { LogRecord } from "../src/types.ts";
import {
  assertEquals,
  spy,
} from "../dev_deps.ts";

Deno.test({
  name: "[default] should return args",
  ignore: false,
  only: false,
  fn: () => {
    const console = createLogger();
    const data = [1, 2, 3];
    const returned = console.log(...data);
    assertEquals(returned, data);
  },
});

Deno.test({
  name: "[default] should run plugins",
  ignore: false,
  only: false,
  fn: () => {
    const plugin = spy((_: LogRecord) => _);
    const logger = createLogger();
    logger.use(plugin, plugin);
    logger.log("test");
    assertEquals(plugin.calls.length, 2);
  },
});

Deno.test({
  name:
    "[default] plugins must get LogRecord and state",
  ignore: false,
  only: false,
  fn: () => {
    const plugin = spy((_: LogRecord) => _);
    const logger = createLogger();
    logger.use(plugin);
    logger.log("test");
    assertEquals(plugin.calls[0].args[0].args, [
      "test",
    ]);
    assertEquals(plugin.calls[0].args[1], {
      filterLevel: 0,
    });
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

Deno.test({
  name:
    "[default] should apply defaults to LogRecord",
  ignore: false,
  only: false,
  fn: () => {
    const logger = createLogger();
    logger.use(
      function (record) {
        assertEquals(
          typeof record.timestamp,
          "number",
        );
        assertEquals(record.methodName, "say");
        assertEquals(record.levelNumber, 0);
        assertEquals(record.args, [
          "hello",
          "world",
        ]);
        assertEquals(record.returned, [
          "hello",
          "world",
        ]);
        // assertEquals(record.scope, "");
        assertEquals(record.msg, undefined);
        assertEquals(record.muted, undefined);
        return record;
      },
    );
    logger.say("hello", "world");
  },
});

Deno.test({
  name:
    "[default] should apply keep state between plugins",
  ignore: false,
  only: false,
  fn: () => {
    const logger = createLogger();

    logger.use(function (record, state) {
      state.filterLevel = 40;
      return record;
    });
    logger.use(function (record, state) {
      assertEquals(state.filterLevel, 40);
      return record;
    });
    logger.say("hello", "world");
  },
});

// Deno.test({
//   name: "[default] should change filter conf",
//   ignore: false,
//   only: false,
//   fn: () => {
//     const logger = createLogger()
//       .use(
//         function (record) {
//           assertEquals(record.args[0], "warn");
//           return record;
//         },
//       );
//     // logger.filter(
//     //   "WARN",
//     // );
//     logger.debug("debug");
//     logger.warn("warn");
//   },
// });
