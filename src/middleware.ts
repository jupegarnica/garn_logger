import type { Middleware, MiddlewareContext, MiddlewareNext } from "./types.ts";

export function compose(
  middleware: Middleware[],
): Middleware {
  return function composedMiddleware(
    context,
    next,
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

// const middlewareComposed = compose(
//   [
//     function (ctx, next) {
//       ctx.logRecord.msg = "1";
//       console.log("1", ctx);
//       console.log("next1", next());
//       console.log("3", ctx);
//       return 1;
//     },
//     function (ctx, next) {
//       ctx.logRecord.msg = "2";
//       console.log("next2", next());
//       console.log("2", ctx);
//       return 2;
//     },
//   ],
// );

// console.log(
//   "middlewareComposed",
//   middlewareComposed({
//     state: { a: 1 },
//     logRecord: { args: [], timestamp: 0, levelNumber: 0, methodName: "ups" },
//   }, console.trace),
// );
