import type { LogRecord } from "./types.ts";
import { Application } from "https://deno.land/x/oak@v10.3.0/mod.ts";
import logger, { formatToAnsiColors } from "../mod.ts";

export async function runServer({ port = 8080 } = {}) {
  logger.use(formatToAnsiColors());
  const app = new Application();

  app.use(async (ctx) => {
    try {
      const { value } = await ctx.request.body({ type: "json" });
      const logRecord: LogRecord = await value;

      if (!logRecord.methodName) {
        ctx.response.status = 400;
        ctx.response.body = "Bad Request. No methodName provided";
        return;
      }
      logger.setScope(ctx.request.ip);
      logger[logRecord.methodName](...logRecord.args);
      ctx.response.body = logRecord;
    } catch (error) {
      // console.error(error);
      ctx.response.status = 400;
      ctx.response.body = error.message;
      return;
    }
  });
  logger.setScope("SERVER");
  logger.info(`Logger server running on port ${port} - http://localhost:${port}`);
  return await app.listen({ port });
}
