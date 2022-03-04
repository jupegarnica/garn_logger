import { colorConsole } from "../src/preconfigured.ts";

Deno.test({
  name: "[default] test contrast",
  ignore: false,
  only: false,
  fn: () => {
    const logs = [
      "\n\n",
      "hello",
      ["world"],
      10_000n,
      { a: 1, b: 2 },
    ];
    colorConsole.silly(logs);
    colorConsole.debug(logs);
    colorConsole.info(logs);
    colorConsole.warn(logs);
    colorConsole.error(logs);
    colorConsole.fatal(logs);
    colorConsole.critical(logs);
  },
});
