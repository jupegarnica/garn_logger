import type { Middleware, MiddlewareContext, MiddlewareNext } from "../types.ts";

import { compose } from "../middleware.ts";
import { supportForConsoleTimers } from "./support_timers.ts";

export function transportToServer(
  {
    host = "http://localhost:8080",
  } = {},
): Middleware {
  function postDataToServer(
    { logRecord }: MiddlewareContext,
    next: MiddlewareNext,
  ): void {
    next();
    logRecord.willReturn = fetch(host, {
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
