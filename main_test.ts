import { assertEquals } from "@std/assert";
import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock";
import { better } from "./main.ts";

Deno.test(function setLevelErrorTest() {
  const mockConsole = {
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

Deno.test(function setLevelWarnTest() {
  const mockConsole = {
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

Deno.test(function setLevelInfoTest() {
  const mockConsole = {
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

Deno.test(function setLevelDebugTest() {
  const mockConsole = {
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
