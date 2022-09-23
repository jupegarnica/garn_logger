import type { Middleware } from "./types.ts";

export function compose(
  middleware: Middleware[],
): Middleware {
  return function composedMiddleware(
    context,
    next,
    // deno-lint-ignore no-explicit-any
  ): any {
    let index = -1;
    function dispatch(i: number): void {
      if (i <= index) {
        throw new Error("next() called multiple times.");
      }
      index = i;
      let fn: Middleware | undefined = middleware[i];
      if (i === middleware.length) {
        fn = next;
      }
      if (!fn) {
        return;
      }
      return fn(context, dispatch.bind(null, i + 1));
    }

    return dispatch(0);
  };
}
