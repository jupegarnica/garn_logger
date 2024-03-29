import { assertEquals, stub } from "../dev_deps.ts";
import { createLogger, transportToServer } from "../mod.ts";
import { runServer } from "../src/server.ts";

const port = 5678;
const HOST = "http://localhost:" + port;

runServer({ port });

const logger = createLogger();
logger.use(transportToServer({ host: HOST }));

Deno.test({
  name: "[transportToServer] should log to console and return a promise",
  ignore: false,
  // only: true,
  sanitizeOps: false,
  sanitizeExit: false,
  sanitizeResources: false,

  fn: async () => {
    // random string methodname
    const methodName = Math.random().toString(36).substring(7);
    const debug = stub(globalThis.console, methodName);

    await logger[methodName](methodName);
    assertEquals(debug.calls.length, 1);
    debug.restore();
  },
});
