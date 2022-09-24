import { compose } from "../src/middleware.ts";
import { assertEquals } from "../dev_deps.ts";

const logRecord = {
  args: [],
  timestamp: 0,
  levelNumber: 0,
  methodName: "ups",
  willReturn: 999,
  muted: false,
};

Deno.test({
  name: "[compose] 1 fn composed must run in the right order",
  // only: true,
  fn() {
    const middlewareComposed = compose(
      [
        function (ctx, next) {
          assertEquals(ctx.state.a, 1);
          ctx.state.a++;
          assertEquals(
            next(),
            "a",
          );
          assertEquals(ctx.state.a, 2);
          ctx.state.a++;
          return 1;
        },
      ],
    );

    const returned = middlewareComposed({
      state: { a: 1 },
      logRecord,
    }, () => "a");
    assertEquals(returned, 1);
  },
});

Deno.test({
  name: "[compose] 2 fn composed must run in the right order",
  // only: true,
  fn() {
    const middlewareComposed = compose(
      [
        function (ctx, next) {
          assertEquals(ctx.state.a, 1);
          ctx.state.a++;
          assertEquals(
            next(),
            "b",
          );
          assertEquals(ctx.state.a, 4);
          ctx.state.a++;
          return "a";
        },
        function (ctx, next) {
          assertEquals(ctx.state.a, 2);
          ctx.state.a++;
          assertEquals(
            next(),
            "c",
          );
          assertEquals(ctx.state.a, 3);
          ctx.state.a++;
          return "b";
        },
      ],
    );

    const returned = middlewareComposed({
      state: { a: 1 },
      logRecord,
    }, () => "c");

    assertEquals(returned, "a");
  },
});

Deno.test({
  name: "[compose] 3 fn composed must run in the right order",
  // only: true,
  fn() {
    const middlewareComposed = compose(
      [
        function (ctx, next) {
          assertEquals(ctx.state.a, 1);
          ctx.state.a++;
          assertEquals(
            next(),
            "b",
          );
          assertEquals(ctx.state.a, 6);
          return "a";
        },
        function (ctx, next) {
          assertEquals(ctx.state.a, 2);
          ctx.state.a++;
          assertEquals(
            next(),
            "c",
          );
          assertEquals(ctx.state.a, 5);
          ctx.state.a++;

          return "b";
        },
        function (ctx, next) {
          assertEquals(ctx.state.a, 3);
          ctx.state.a++;
          assertEquals(
            next(),
            "d",
          );
          assertEquals(ctx.state.a, 4);
          ctx.state.a++;

          return "c";
        },
      ],
    );

    const returned = middlewareComposed({
      state: { a: 1 },
      logRecord,
    }, () => "d");
    assertEquals(returned, "a");
  },
});

Deno.test({
  name: "[compose] async composed must return a promise",
  // only: true,
  async fn() {
    const middlewareComposed = compose(
      [
        function (_, next) {
          next();
          return Promise.resolve(6);
        },
        function (_, next) {
          next();

          return 2;
        },
        function (_, next) {
          next();
          return 2;
        },
      ],
    );

    const returned = await middlewareComposed({
      state: { a: 1 },
      logRecord,
    }, () => {});
    assertEquals(returned, 6);
  },
});
