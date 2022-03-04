import defaultLogger, {
  filterLowerLevels,
  Logger,
} from "../mod.ts";
import { assertEquals } from "../dev_deps.ts";

Deno.test({
  name: "[default] should return args",
  ignore: false,
  only: false,
  fn: () => {
    const console = new Logger();
    const data = [1, 2, 3];
    const returned = console.log(...data);
    assertEquals(returned, data);
  },
});

Deno.test({
  name: "[default] should mute lower levels",
  ignore: false,
  only: false,
  fn: () => {
    const filter = "critical";
    const logger = new Logger({
      plugins: [
        filterLowerLevels(filter),
        function assertIsMuted(log) {
          if (log.level !== filter) {
            assertEquals(log.muted, true);
          } else {
            assertEquals(log.muted, undefined);
          }
          return log;
        },
      ],
    });
    logger.error("error");
    logger.info("info");
    logger.log("log");
    logger.debug("debug");
  },
});

Deno.test({
  name:
    "[default] should apply defaults to LogRecord",
  ignore: false,
  only: false,
  fn: () => {
    const logger = new Logger({
      // scope: 'test',
      plugins: [
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
          assertEquals(record.scope, "");
          assertEquals(record.msg, undefined);
          assertEquals(record.extra, undefined);
          assertEquals(record.muted, undefined);
          return record;
        },
      ],
    });
    logger.say("hello", "world");
  },
});

Deno.test({
  name:
    "[default] should apply options to LogRecord",
  ignore: false,
  only: false,
  fn: () => {
    const logger = new Logger({
      scope: "test",
      extra: { a: 1, b: 2 },
      plugins: [
        function (record) {
          assertEquals(record.scope, "test");
          assertEquals(record.extra, {
            a: 1,
            b: 2,
          });

          return record;
        },
      ],
    });
    logger.say("hello", "world");
  },
});
