import { assertEquals } from "@std/assert";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { better } from "./main.ts";

Deno.test("setLevelErrorTest", function () {
  const error = spy(() => {});
  const warn = spy(() => {});
  const info = spy(() => {});
  const debug = spy(() => {});
  const mockConsole = {
    error,
    warn,
    info,
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.setLevel("error");
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 0);
  assertSpyCalls(info, 0);
  assertSpyCalls(debug, 0);
});

Deno.test("setLevelWarnTest", function () {
  const error = spy(() => {});
  const warn = spy(() => {});
  const info = spy(() => {});
  const debug = spy(() => {});
  const mockConsole = {
    error,
    warn,
    info,
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.setLevel("warn");
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 0);
  assertSpyCalls(debug, 0);
});

Deno.test("setLevelInfoTest", function () {
  const error = spy(() => {});
  const warn = spy(() => {});
  const info = spy(() => {});
  const debug = spy(() => {});
  const mockConsole = {
    error,
    warn,
    info,
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.setLevel("info");
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 1);
  assertSpyCalls(debug, 0);
});

Deno.test("setLevelDebugTest", function () {
  const error = spy(() => {});
  const warn = spy(() => {});
  const info = spy(() => {});
  const debug = spy(() => {});
  const mockConsole = {
    error,
    warn,
    info,
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.setLevel("debug");
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 1);
  assertSpyCalls(debug, 1);
});

Deno.test("set info do not log any debug methods", function () {
  const error = spy(() => {});
  const warn = spy(() => {});
  const info = spy(() => {});
  const debug = spy(() => {});
  const log = spy(() => {});
  const trace = spy(() => {});
  const dir = spy(() => {});
  const time = spy(() => {});
  const timeEnd = spy(() => {});
  const group = spy(() => {});
  const groupEnd = spy(() => {});
  const groupCollapsed = spy(() => {});
  const clear = spy(() => {});
  const count = spy(() => {});
  const assert = spy(() => {});
  const table = spy(() => {});
  const mockConsole = {
    error,
    warn,
    info,
    debug,
    log,
    trace,
    dir,
    time,
    timeEnd,
    group,
    groupEnd,
    groupCollapsed,
    clear,
    count,
    assert,
    table,
  };

  const config = better(mockConsole as unknown as Console);
  config.setLevel("info");
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
  assertSpyCalls(assert, 1);
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 1);
  assertSpyCalls(debug, 0);
  assertSpyCalls(log, 0);
  assertSpyCalls(trace, 0);
  assertSpyCalls(dir, 0);
  assertSpyCalls(time, 0);
  assertSpyCalls(timeEnd, 0);
  assertSpyCalls(group, 0);
  assertSpyCalls(groupEnd, 0);
  assertSpyCalls(groupCollapsed, 0);
  assertSpyCalls(clear, 0);
  assertSpyCalls(count, 0);
  assertSpyCalls(table, 0);
});

Deno.test("set debug do log all debug methods", function () {
  const error = spy(() => {});
  const warn = spy(() => {});
  const info = spy(() => {});
  const debug = spy(() => {});
  const log = spy(() => {});
  const trace = spy(() => {});
  const dir = spy(() => {});
  const time = spy(() => {});
  const timeEnd = spy(() => {});
  const group = spy(() => {});
  const groupEnd = spy(() => {});
  const groupCollapsed = spy(() => {});
  const clear = spy(() => {});
  const count = spy(() => {});
  const assert = spy(() => {});
  const table = spy(() => {});
  const mockConsole = {
    error,
    warn,
    info,
    debug,
    log,
    trace,
    dir,
    time,
    timeEnd,
    group,
    groupEnd,
    groupCollapsed,
    clear,
    count,
    assert,
    table,
  };

  const config = better(mockConsole as unknown as Console);
  config.setLevel("debug");
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
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 1);
  assertSpyCalls(debug, 1);
  assertSpyCalls(log, 1);
  assertSpyCalls(trace, 1);
  assertSpyCalls(dir, 1);
  assertSpyCalls(time, 1);
  assertSpyCalls(timeEnd, 1);
  assertSpyCalls(group, 1);
  assertSpyCalls(groupEnd, 1);
  assertSpyCalls(groupCollapsed, 1);
  assertSpyCalls(clear, 1);
  assertSpyCalls(count, 1);
  assertSpyCalls(assert, 1);
  assertSpyCalls(table, 1);
});

Deno.test("assert always logs", function () {
  const error = spy(() => {});
  const warn = spy(() => {});
  const info = spy(() => {});
  const debug = spy(() => {});
  const log = spy(() => {});
  const trace = spy(() => {});
  const dir = spy(() => {});
  const time = spy(() => {});
  const timeEnd = spy(() => {});
  const group = spy(() => {});
  const groupEnd = spy(() => {});
  const groupCollapsed = spy(() => {});
  const clear = spy(() => {});
  const count = spy(() => {});
  const assert = spy(() => {});
  const table = spy(() => {});
  const mockConsole = {
    error,
    warn,
    info,
    debug,
    log,
    trace,
    dir,
    time,
    timeEnd,
    group,
    groupEnd,
    groupCollapsed,
    clear,
    count,
    assert,
    table,
  };

  const config = better(mockConsole as unknown as Console);
  config.setLevel("debug");
  mockConsole.assert();
  assertSpyCalls(assert, 1);
});

Deno.test("setFilterStringTest", function () {
  const error = spy((a: string) => {});
  const warn = spy((a: string) => {});
  const info = spy((a: string) => {});
  const debug = spy((a: string) => {});
  const mockConsole = {
    error,
    warn,
    info,
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.setFilter("test");
  mockConsole.error("this is a test");
  mockConsole.warn("another test");
  mockConsole.info("not a match");
  mockConsole.debug("test again");
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 0);
  assertSpyCalls(debug, 1);
});

Deno.test("setFilterRegExpTest", function () {
  const error = spy((a: string) => {});
  const warn = spy((a: string) => {});
  const info = spy((a: string) => {});
  const debug = spy((a: string) => {});
  const mockConsole = {
    error,
    warn,
    info,
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.setFilter(/test/i);
  mockConsole.error("this is a test");
  mockConsole.warn("another test");
  mockConsole.info("not a match");
  mockConsole.debug("test again");
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 0);
  assertSpyCalls(debug, 1);
});
