import { assertEquals } from "@std/assert";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { better } from "./main.ts";

Deno.test("setLevelErrorTest", function () {
  const mockConsole = {
    error: spy(() => {}),
    warn: spy(() => {}),
    info: spy(() => {}),
    debug: spy(() => {}),
  };

  const config = better(mockConsole as unknown as Console);
  const noopError = spy(() => {});
  config.setLevel("error", { noop: noopError });
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  assertSpyCalls(mockConsole.error, 1);
  assertSpyCalls(noopError, 3);
});

Deno.test("setLevelWarnTest", function () {
  const mockConsole = {
    error: spy(() => {}),
    warn: spy(() => {}),
    info: spy(() => {}),
    debug: spy(() => {}),
  };

  const config = better(mockConsole as unknown as Console);
  const noopWarn = spy(() => {});
  config.setLevel("warn", { noop: noopWarn });
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  assertSpyCalls(mockConsole.error, 1);
  assertSpyCalls(mockConsole.warn, 1);
  assertSpyCalls(noopWarn, 2);
});

Deno.test("setLevelInfoTest", function () {
  const mockConsole = {
    error: spy(() => {}),
    warn: spy(() => {}),
    info: spy(() => {}),
    debug: spy(() => {}),
  };

  const config = better(mockConsole as unknown as Console);
  const noopInfo = spy(() => {});
  config.setLevel("info", { noop: noopInfo });
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  assertSpyCalls(mockConsole.error, 1);
  assertSpyCalls(mockConsole.warn, 1);
  assertSpyCalls(mockConsole.info, 1);
  assertSpyCalls(noopInfo, 1);
});

Deno.test("setLevelDebugTest", function () {
  const mockConsole = {
    error: spy(() => {}),
    warn: spy(() => {}),
    info: spy(() => {}),
    debug: spy(() => {}),
  };

  const config = better(mockConsole as unknown as Console);
  const noopDebug = spy(() => {});
  config.setLevel("debug", { noop: noopDebug });
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  assertSpyCalls(mockConsole.error, 1);
  assertSpyCalls(mockConsole.warn, 1);
  assertSpyCalls(mockConsole.info, 1);
  assertSpyCalls(mockConsole.debug, 1);
  assertSpyCalls(noopDebug, 0);
});

Deno.test("set info do not log any debug methods", function () {
  const mockConsole = {
    error: spy(() => {}),
    warn: spy(() => {}),
    info: spy(() => {}),
    debug: spy(() => {}),
    log: spy(() => {}),
    trace: spy(() => {}),
    dir: spy(() => {}),
    time: spy(() => {}),
    timeEnd: spy(() => {}),
    group: spy(() => {}),
    groupEnd: spy(() => {}),
    groupCollapsed: spy(() => {}),
    clear: spy(() => {}),
    count: spy(() => {}),
    assert: spy(() => {}),
    table: spy(() => {}),
  };

  const config = better(mockConsole as unknown as Console);
  const noop = spy(() => {});
  config.setLevel("info", { noop });
  mockConsole.assert();
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  mockConsole.log();
  mockConsole.trace();
  mockConsole.dir();
  mockConsole.time();
  mockConsole.timeEnd();
  mockConsole.group();
  mockConsole.groupEnd();
  mockConsole.groupCollapsed();
  mockConsole.clear();
  mockConsole.count();
  mockConsole.table();
  assertSpyCalls(mockConsole.assert, 1);
  assertSpyCalls(mockConsole.error, 1);
  assertSpyCalls(mockConsole.warn, 1);
  assertSpyCalls(mockConsole.info, 1);
  assertSpyCalls(noop, 12);
});

Deno.test("set debug do log all debug methods", function () {
  const mockConsole = {
    error: spy(() => {}),
    warn: spy(() => {}),
    info: spy(() => {}),
    debug: spy(() => {}),
    log: spy(() => {}),
    trace: spy(() => {}),
    dir: spy(() => {}),
    time: spy(() => {}),
    timeEnd: spy(() => {}),
    group: spy(() => {}),
    groupEnd: spy(() => {}),
    groupCollapsed: spy(() => {}),
    clear: spy(() => {}),
    count: spy(() => {}),
    assert: spy(() => {}),
    table: spy(() => {}),
  };

  const config = better(mockConsole as unknown as Console);
  const noop = spy(() => {});
  config.setLevel("debug", { noop });
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  mockConsole.log();
  mockConsole.trace();
  mockConsole.dir();
  mockConsole.time();
  mockConsole.timeEnd();
  mockConsole.group();
  mockConsole.groupEnd();
  mockConsole.groupCollapsed();
  mockConsole.clear();
  mockConsole.count();
  mockConsole.assert();
  mockConsole.table();
  assertSpyCalls(mockConsole.error, 1);
  assertSpyCalls(mockConsole.warn, 1);
  assertSpyCalls(mockConsole.info, 1);
  assertSpyCalls(mockConsole.debug, 1);
  assertSpyCalls(mockConsole.log, 1);
  assertSpyCalls(mockConsole.trace, 1);
  assertSpyCalls(mockConsole.dir, 1);
  assertSpyCalls(mockConsole.time, 1);
  assertSpyCalls(mockConsole.timeEnd, 1);
  assertSpyCalls(mockConsole.group, 1);
  assertSpyCalls(mockConsole.groupEnd, 1);
  assertSpyCalls(mockConsole.groupCollapsed, 1);
  assertSpyCalls(mockConsole.clear, 1);
  assertSpyCalls(mockConsole.count, 1);
  assertSpyCalls(mockConsole.assert, 1);
  assertSpyCalls(mockConsole.table, 1);
  assertSpyCalls(noop, 0);
});

Deno.test("assert always logs", function () {
  const mockConsole = {
    error: spy(() => {}),
    warn: spy(() => {}),
    info: spy(() => {}),
    debug: spy(() => {}),
    log: spy(() => {}),
    trace: spy(() => {}),
    dir: spy(() => {}),
    time: spy(() => {}),
    timeEnd: spy(() => {}),
    group: spy(() => {}),
    groupEnd: spy(() => {}),
    groupCollapsed: spy(() => {}),
    clear: spy(() => {}),
    count: spy(() => {}),
    assert: spy(() => {}),
    table: spy(() => {}),
  };

  const config = better(mockConsole as unknown as Console);
  const noop = spy(() => {});
  config.setLevel("debug", { noop });
  mockConsole.assert();
  assertSpyCalls(mockConsole.assert, 1);
  assertSpyCalls(noop, 0);
});

Deno.test("setFilterStringTest", function () {
  const mockConsole = {
    error: spy((a: string) => {}),
    warn: spy((a: string) => {}),
    info: spy((a: string) => {}),
    debug: spy((a: string) => {}),
  };

  const config = better(mockConsole as unknown as Console);
  config.setFilter("test");
  mockConsole.error("this is a test");
  mockConsole.warn("another test");
  mockConsole.info("not a match");
  mockConsole.debug("test again");
  assertSpyCalls(mockConsole.error, 1);
  assertSpyCalls(mockConsole.warn, 1);
  assertSpyCalls(mockConsole.info, 0);
  assertSpyCalls(mockConsole.debug, 1);
});

Deno.test("setFilterRegExpTest", function () {
  const mockConsole = {
    error: spy((a: string) => {}),
    warn: spy((a: string) => {}),
    info: spy((a: string) => {}),
    debug: spy((a: string) => {}),
  };

  const config = better(mockConsole as unknown as Console);
  config.setFilter(/test/i);
  mockConsole.error("this is a test");
  mockConsole.warn("another test");
  mockConsole.info("not a match");
  mockConsole.debug("test again");
  assertSpyCalls(mockConsole.error, 1);
  assertSpyCalls(mockConsole.warn, 1);
  assertSpyCalls(mockConsole.info, 0);
  assertSpyCalls(mockConsole.debug, 1);
});
