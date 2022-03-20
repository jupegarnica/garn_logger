import { delay } from "https://deno.land/std@0.128.0/async/mod.ts";
import { createLogger, transportToEmail } from "../deno.ts";
// import type { MiddlewareContext, MiddlewareNext } from "../deno.ts";
import { assert } from "../dev_deps.ts";

const emailOptions = {
  // hostname: Deno.env.get("SMTP_HOST") || "localhost",
  // port: Deno.env.get("SMTP_PORT") || "1025",
  // username: Deno.env.get("SMTP_USER"),
  // password: Deno.env.get("SMTP_PASS"),
  hostname: "localhost",
  port: "1025",
  to: Deno.env.get("SMTP_TO") || "",
  from: Deno.env.get("SMTP_FROM") || "",
  logLevel: "DEBUG",
  debounceTime: 100,
};

const logToEmail = createLogger();
logToEmail.use(
  transportToEmail(emailOptions),
);

Deno.test({
  name: "[email] should have correct default options",
  ignore: !Deno.env.get("TEST_EMAIL"),
  only: false,
  // sanitizeResources: false,
  // sanitizeOps: false,
  // sanitizeExit: false,
  fn: async () => {
    const now = Date.now();
    logToEmail["now"](now);
    logToEmail.time();
    logToEmail.silly("silly");
    logToEmail.log("log");
    logToEmail.debug("debug");
    logToEmail.info("info");
    logToEmail.table("table");
    logToEmail.success("success");
    logToEmail.warn("warn");
    logToEmail.warning("warning");
    logToEmail.error("error");
    logToEmail.critical("critical");
    logToEmail.$$$$$$$$$$$$$$$$("$$$$$$$$$$$$$$$$");
    logToEmail.timeLog();
    logToEmail.inverse("inverse");
    logToEmail.dim("dim");
    logToEmail.yellow("yellow");
    logToEmail.green("green");
    logToEmail.bgRed("bgRed");
    logToEmail.red("red");
    logToEmail.brightRed("brightRed");
    logToEmail.italic("italic");
    logToEmail.blue("blue");
    logToEmail.cyan("cyan");
    logToEmail.gray("gray");
    logToEmail[200]("200");
    logToEmail[400]("400");
    logToEmail[500]("500");
    logToEmail.timeEnd();
    await delay(500);
    const emails = await (await fetch("http://localhost:1080/email")).json();
    const lastEmail = emails[emails.length - 1];
    assert(lastEmail.html.includes(now));
  },
});
