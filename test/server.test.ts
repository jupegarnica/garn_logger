import { assertEquals, stub } from "../dev_deps.ts";

import runServer from "../src/server.ts";

const HOST = "http://localhost:4567";

runServer({ port: 4567 });

Deno.test({
  name: "[server] should respond 400 IF BAD REQUEST",
  ignore: false,
  only: false,
  sanitizeOps: false,
  // sanitizeExit: false,
  sanitizeResources: false,

  fn: async () => {
    const response = await fetch(`${HOST}/`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    assertEquals(response.status, 400);
    // const body = await response.json();
    // assertEquals(body.methodName, 'info');
  },
});

Deno.test({
  name: "[server] should respond with 200 and reply same body",
  ignore: false,
  only: false,
  sanitizeOps: false,
  // sanitizeExit: false,
  sanitizeResources: false,

  fn: async () => {
    const methodName = "info";
    const debug = stub(globalThis.console, methodName);
    const response = await fetch(`${HOST}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        methodName,
        args: ["hello world", 123, { foo: "bar" }],
      }),
    });
    assertEquals(response.status, 200);
    const body = await response.json();
    assertEquals(body.methodName, methodName);
    debug.restore();
  },
});

Deno.test({
  name: "[server] should log to console",
  ignore: false,
  // only: true,
  sanitizeOps: false,
  sanitizeExit: false,
  sanitizeResources: false,

  fn: async () => {
    // random string methodname
    const methodName = Math.random().toString(36).substring(7);

    const debug = stub(globalThis.console, methodName);
    const response = await fetch(`${HOST}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        methodName,
        args: ["hello world"],
      }),
    });
    await response.json();

    assertEquals(debug.calls.length, 1);
    debug.restore();
  },
});
