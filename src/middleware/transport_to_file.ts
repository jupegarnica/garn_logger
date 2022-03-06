// import { RotatingFileHandler } from "https://deno.land/std@0.128.0/log/handlers.ts";
// import { LogRecord } from "https://deno.land/std@0.128.0/log/mod.ts";
// import { format } from "../../deps.ts";

// import type { MiddlewareContext, MiddlewareNext} from '../types.ts'

// const stringify = (val: unknown): string => {
//   if (typeof val === "string") return val;
//   return Deno.inspect(val);
// };

// function padEnd(str: string, length = 7): string {
//   // let response = "";
//   // for (let index = 0; index < length; index++) {
//   //   response += str[index] ?? " ";
//   // }

//   return str.padEnd(length, " ");
// }

// const fileFormatter = ({
//   datetime,
//   levelName,
//   args,
//   msg,
// }: any) => {
//   let text = `${format(datetime, "yyyy-MM-dd hh:mm:ss")} ${
//     padEnd(
//       levelName,
//     )
//   } ${msg}`;
//   args.forEach((arg: any) => {
//     text += `\n${stringify(arg)}`;
//   });
//   return text + "\n";
// };

// const defaultOptions = {
//   level: "DEBUG",
//   maxBytes: 1024 * 10,
//   maxBackupCount: 10,
//   filename: `${Deno.cwd()}/${format(new Date(), "yyyy-MM-dd")}.log`,
//   mode: "a",
//   formatter: fileFormatter,
// };

// export const transportToFile = (options: any) => {
//   options = { ...defaultOptions, ...options };
//   const handler = new RotatingFileHandler(options.level, options);
//   return function transportToFileMiddleware(ctx:MiddlewareContext, next:MiddlewareNext) {
//     next();
//     handler.handle(new LogRecord(ctx.logRecord));
//   };
// };
