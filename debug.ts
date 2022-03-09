import logger, { formatToAnsiColors } from "./mod.ts";
import { transportToEmail } from "./src/middleware/transport_to_email.ts";
import * as colors from "https://deno.land/std@0.128.0/fmt/colors.ts";
logger.setFilter("debug");

logger.use(
  formatToAnsiColors(),
  transportToEmail({
    hostname: "localhost",
    port: "1025",
    from: "juan@garn.dev",
    to: "juan@garn.dev",
    logLevel: "debug",
    debounceTime:100,
  }),
);

for (const method in colors) {
  if (!['bgRgb24','rgb24', 'rgb8', 'setColorEnabled', 'getColorEnabled'].includes(method)) {

    // logger[method](`${method}`, {a:1, b: ['1', '2']});
    logger[method](`.${method}{
}`);

  }
}

// logger.silly("silly");
// logger.log("log");
// logger.debug(("debug"));
// logger.info("info");
// logger.table("table");
// logger.success("success");
// logger.warn("warn");
// logger.warning("warning");
// logger.error("error");
// logger.critical("critical");
// logger.$$$$$$$$$$$$$$$$("$$$$$$$$$$$$$$$$");
// // logger.inverse(inverse(red("inverse")));
// logger.inverse("inverse");
// logger.dim("dim");
// logger.yellow("yellow");
// logger.green("green");
// logger.bgRed("bgRed");
// logger.red("red");
// logger.brightRed("brightRed");
// logger.italic("italic");
// logger.blue("blue");
// logger.cyan("cyan");
// logger.gray("gray");
// logger[200]("200");
// logger[400]("400");
// logger[500]("500");
