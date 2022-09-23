import type { Middleware, MiddlewareContext, MiddlewareNext } from "../types.ts";

import { compose } from "../middleware.ts";
import { supportForConsoleTimers } from "./support_timers.ts";

export function transportToServer(
  {
    host = "http://localhost:8080",
  } = {},
): Middleware {
  async function postDataToServer(
    { logRecord }: MiddlewareContext,
    next: MiddlewareNext,
  ): Promise<void> {
    next();
    await fetch(host, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logRecord),
    });
  }

  return compose([
    supportForConsoleTimers,
    postDataToServer,
  ]);
}
