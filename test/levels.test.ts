import logger, { console, createLogger } from "../mod.ts";
// import type { MiddlewareNext } from "../src/types.ts";
import { assertEquals, stub } from "../dev_deps.ts";

Deno.test({
  name: "[levels] no found method should log to debug method",
  ignore: false,
  // only: true,
  fn: () => {
    const debug = stub(console, "debug");
    logger.debug("debug");
    logger.silly("silly");
    logger.verbose("verbose");
    assertEquals(debug.calls.length, 3);
    debug.restore();
  },
});

Deno.test({
  name: "[levels] info level",
  ignore: false,
  // only: true,
  fn: () => {
    const info = stub(console, "info");
    // logger.log('log');
    logger.info("info");
    logger.success("success");
    logger[200]("200");
    logger[202]("202");
    logger[204]("204");
    logger["204"]("204");
    assertEquals(info.calls.length, 6);
    info.restore();
  },
});

Deno.test({
  name: "[levels] warning level",
  ignore: false,
  // only: true,
  fn: () => {
    const warn = stub(console, "warn");
    logger.warn("warn");
    logger.warning("warning");
    logger[300]("300");
    logger[303]("303");
    logger[304]("304");
    logger["304"]("304");
    logger[404]("404");
    logger[400]("400");
    assertEquals(warn.calls.length, 8);
    warn.restore();
  },
});

Deno.test({
  name: "[levels] error level",
  ignore: false,
  // only: true,
  fn: () => {
    const error = stub(console, "error");
    logger.error("error");
    logger.catch("catch");
    logger[500]("500");
    logger[503]("503");
    logger[504]("504");
    logger["504"]("504");
    assertEquals(error.calls.length, 6);
    error.restore();
  },
});

Deno.test({
  name: "[levels] critical level",
  // ignore: true,
  // only: true,
  fn: () => {
    const error = stub(console, "error");
    logger.critical("critical");
    logger.important("important");
    logger.fatal("fatal");
    assertEquals(error.calls.length, 3);
    error.restore();
  },
});

Deno.test({
  name: "[levels] setFilter should apply filter state and mute logRecord",
  ignore: false,
  // only: true,
  fn: () => {
    const logger = createLogger();
    logger.setFilter("ERROR");
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

Deno.test({
  name: "[levels] should mute lower levels",
  ignore: false,
  only: false,
  fn: () => {
    const filter = "info";
    const logger = createLogger();
    logger.setFilter(filter);
    logger.use(
      function assertIsMuted({ logRecord }) {
        switch (logRecord.methodName) {
          case "error":
          case "warn":
          case "info":
            assertEquals(logRecord.muted, false);
            break;
          case "log":
          case "debug":
            assertEquals(logRecord.muted, true);
        }
        return logRecord;
      },
    );
    logger.debug("debug");
    logger.info("info");
    logger.log("log");
    logger.warn("warn");
    logger.error("error");
  },
});
