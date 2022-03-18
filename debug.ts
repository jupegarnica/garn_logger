import { createLogger, formatToAnsiColors, transportToConsoleWithFormat } from "./mod.ts";
import { transportToEmail } from "./src/middleware/transport_to_email.ts";
// import * as colors from "https://deno.land/std@0.128.0/fmt/colors.ts";

const logger = createLogger();
logger.setFilter("debug");
logger.use(
  formatToAnsiColors(),
  transportToConsoleWithFormat({ pretty: { useColor: false } }),
  transportToEmail({
    hostname: Deno.env.get("SMTP_HOST") || "localhost",
    port: Deno.env.get("SMTP_PORT") || "1025",
    username: Deno.env.get("SMTP_USER"),
    password: Deno.env.get("SMTP_PASS"),
    to: "juan@garn.dev",
    from: "juan@garn.dev",
    logLevel: "DEBUG",
    debounceTime: 10,
  }),
);

logger.small("small");
logger.log_tomato("log_tomato");
logger.error_blue("log_blue");
logger.log("hola");
logger.host(Deno.env.get("SMTP_HOST"));
logger.PORT(Deno.env.get("SMTP_PORT"));
logger.USER(Deno.env.get("SMTP_USER"));
logger.PASS(Deno.env.get("SMTP_PASS"));

logger.time();
logger.timeLog();
logger.timeEnd();
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

// for (const method in colors) {
//   if (
//     !["bgRgb24", "rgb24", "rgb8", "setColorEnabled", "getColorEnabled"].includes(method)
//   ) {
//     // logger[method](`${method}`, {a:1, b: ['1', '2']});
//     logger[method](`.${method}{
// }`);
//   }
// }

addEventListener("load", () => logger.load());
addEventListener("unload", () => logger.unload());
