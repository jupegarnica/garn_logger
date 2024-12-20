import { test } from "@cross/test";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { assert, assertEquals } from "@std/assert";
import { better } from "./main.ts";
test("set level error", function () {
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
  config.level("error");
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 0);
  assertSpyCalls(info, 0);
  assertSpyCalls(debug, 0);
});

test("set level warn", function () {
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
  config.level("warn");
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 0);
  assertSpyCalls(debug, 0);
});

test("set level info", function () {
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
  config.level("info");
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 1);
  assertSpyCalls(debug, 0);
});

test("set level debug", function () {
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
  config.level("debug");
  mockConsole.error();
  mockConsole.warn();
  mockConsole.info();
  mockConsole.debug();
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 1);
  assertSpyCalls(debug, 1);
});

test("set info do not log any debug methods", function () {
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
  config.level("info");
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
  assertSpyCalls(clear, 1);
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
  assertSpyCalls(count, 0);
  assertSpyCalls(table, 0);
});

test("set debug do log all debug methods", function () {
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
  config.level("debug");
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

test("assert always logs", function () {
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
  config.level("debug");
  mockConsole.assert();
  assertSpyCalls(assert, 1);
});

test("set filter string", function () {
  const error = spy((_: string) => {});
  const warn = spy((_: string) => {});
  const info = spy((_: string) => {});
  const debug = spy((_: string) => {});
  const mockConsole = {
    error,
    warn,
    info,
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.filter("test");
  mockConsole.error("this is a test");
  mockConsole.warn("another test");
  mockConsole.info("not a match");
  mockConsole.debug("test again");
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 0);
  assertSpyCalls(debug, 1);
});

test("set filter multiple methods args", function () {
  const debug = spy((..._) => {});
  const mockConsole = {
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.filter("yes");
  mockConsole.debug("no", "yes");
  assertSpyCalls(debug, 1);
  mockConsole.debug("yes", "no");
  assertSpyCalls(debug, 2);
  config.filter("none");
  mockConsole.debug("yes", "no");
  assertSpyCalls(debug, 2);
});

test("set filter multiple filters", function () {
  const debug = spy((_: string) => {});
  const mockConsole = {
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.filter("yes", "no");
  mockConsole.debug("no");
  assertSpyCalls(debug, 1);
  mockConsole.debug("yes");
  assertSpyCalls(debug, 2);
  mockConsole.debug("--");
  assertSpyCalls(debug, 2);
});

test("set filter RegExp", function () {
  const error = spy((_: string) => {});
  const warn = spy((_: string) => {});
  const info = spy((_: string) => {});
  const debug = spy((_: string) => {});
  const mockConsole = {
    error,
    warn,
    info,
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.filter(/test/i);
  mockConsole.error("this is a test");
  mockConsole.warn("another test");
  mockConsole.info("not a match");
  mockConsole.debug("test again");
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 0);
  assertSpyCalls(debug, 1);
});

test("set reset filter", function () {
  const error = spy((_: string) => {});
  const warn = spy((_: string) => {});
  const info = spy((_: string) => {});
  const debug = spy((_: string) => {});
  const mockConsole = {
    error,
    warn,
    info,
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.filter("test");
  mockConsole.error("this is a test");
  mockConsole.warn("another test");
  mockConsole.info("not a match");
  mockConsole.debug("test again");
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 0);
  assertSpyCalls(debug, 1);

  config.resetFilter();
  mockConsole.error("this is a test");
  mockConsole.warn("another test");
  mockConsole.info("not a match");
  mockConsole.debug("test again");
  assertSpyCalls(error, 2);
  assertSpyCalls(warn, 2);
  assertSpyCalls(info, 1);
  assertSpyCalls(debug, 2);
});

test("set filter objects", function () {
  const debug = spy((_) => {});
  const mockConsole = {
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.filter("test");
  mockConsole.debug({ test: 1 });
  mockConsole.debug({ a: 1 });
  assertSpyCalls(debug, 1);
});

test("set filter circular objects", function () {
  const debug = spy((_) => {});
  const mockConsole = {
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.filter("loop");
  const obj = { a: 1, loop: {} };
  obj.loop = obj;
  mockConsole.debug(obj);
  assertSpyCalls(debug, 1);
});

test("add filter", function () {
  const debug = spy((_: string) => {});
  const mockConsole = {
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.filter("1").addFilter("2");
  mockConsole.debug("1");
  mockConsole.debug("not a match");
  mockConsole.debug("2");
  assertSpyCalls(debug, 2);
});

test("config chaining", function () {
  const error = spy((_) => {});
  const warn = spy((_) => {});
  const info = spy((_) => {});
  const debug = spy((_) => {});
  const mockConsole = {
    error,
    warn,
    info,
    debug,
  };

  const config = better(mockConsole as unknown as Console);
  config.level("warn").filter("test");
  mockConsole.error("this is a test");
  mockConsole.error("not a match");
  mockConsole.warn("test again");
  mockConsole.warn("not a match");
  mockConsole.info("test again");
  mockConsole.debug("test again");
  assertSpyCalls(error, 1);
  assertSpyCalls(warn, 1);
  assertSpyCalls(info, 0);
  assertSpyCalls(debug, 0);
});

test("set level in two steps", function () {
  const error = spy((_) => {});
  const log = spy((_) => {});
  const mockConsole = {
    error,
    log,
  } as unknown as Console;

  better(mockConsole).level("error");
  mockConsole.error("1 TEST This should be logged");
  mockConsole.log("2 TEST this should not be logged");
  assertSpyCalls(error, 1);
  assertSpyCalls(log, 0);

  better(mockConsole).level("debug");
  mockConsole.error("3 TEST This should be logged");
  mockConsole.log("4 TEST This should be logged");
  assertSpyCalls(error, 2);
  assertSpyCalls(log, 1);
});

test("console.only filters every other log", function () {
  const debug = spy((_) => {});
  const mock = {
    debug
  } as unknown as Console;

  better(mock).level("debug");
  mock.debug("1");
  assertSpyCalls(debug, 1);
  better(mock).level("error");
  // @ts-ignore
  mock.only("2");
  assertSpyCalls(debug, 2);
  mock.debug("3");
  assertSpyCalls(debug, 2);

  // mock.debug("2");
  // assertSpyCalls(debug, 2);

});

test("console.only exists", function () {
  const mock = {} as unknown as Console;
  better(mock);
  assert(
    // @ts-ignore
    typeof mock.only === "function",
    "only method should be defined has a function"
  );
});

test("when multiples console.only all works", function () {
  const debug = spy((_) => {});
  const mock = {
    debug
  } as unknown as Console;

  better(mock).level("debug");
  // @ts-ignore
  mock.only("1");
  assertSpyCalls(debug, 1);
  // @ts-ignore
  mock.only("2");
  assertSpyCalls(debug, 2);
});



test("error logs must be red", function () {

  const error = spy((_) => {});
  const mock = {
    error
  } as unknown as Console;

  better(mock)
  mock.error("UPS");
  assertSpyCalls(error, 1);
  assert(String(error.calls[0].args[0]).includes("\x1b[31m"), "error logs must be red");
});

test("warn logs must be yellow", function () {

  const warn = spy((_) => {});
  const mock = {
    warn
  } as unknown as Console;

  better(mock)
  mock.warn("UPS");
  assertSpyCalls(warn, 1);
  assert(String(warn.calls[0].args[0]).includes("\x1b[33m"), "warn logs must be yellow");
});

test("info logs must be blue", function () {

  const info = spy((_) => {});
  const mock = {
    info
  } as unknown as Console;

  better(mock)
  mock.info("UPS");
  assertSpyCalls(info, 1);
  assert(String(info.calls[0].args[0]).includes("\x1b[34m"), "info logs must be blue");
});

test("debug logs args must be untouched", function () {

  const debug = spy((_) => {});
  const mock = {
    debug
  } as unknown as Console;

  better(mock)
  const arg = 'hola';
  mock.debug(arg);
  assertSpyCalls(debug, 1);
  assertEquals(debug.calls[0].args[0], arg);
  assert(debug.calls[0].args[0] === arg, "debug logs args must be untouched");

});

test("args not string must be untouched", function () {

  const error = spy((..._) => {});
  const mock = {
    error
  } as unknown as Console;

  better(mock)
  const obj = { a: 1 };
  mock.error(obj, 'hola');
  assertSpyCalls(error, 1);
  assertEquals(error.calls[0].args[0], obj);
  assert(error.calls[0].args[0] === obj, "args not string must be untouched");
  assert(String(error.calls[0].args[1]).includes("\x1b[31m"), "error logs must be red");
});
