import { SmtpClient } from "https://deno.land/x/denomailer@0.9.0/mod.ts";
import { debounce } from "https://deno.land/std@0.128.0/async/mod.ts";

import type { Middleware, MiddlewareContext, MiddlewareNext } from "../types.ts";
import { levelsNameToNumbers } from "../constants.ts";
import { formatToHtml } from "./format_to_html.ts";
import { compose } from "../middleware.ts";
import { supportForConsoleTimers } from "./support_timers.ts";

export interface EmailOptions {
  hostname: string;
  port: string;
  username?: string;
  password?: string;
  from: string;
  to: string;
  subject?: string;
  logLevel?: string;
  debounceTime?: number;
}

export interface Email {
  from: string;
  to: string;
  subject: string;
  content: string;
}

const client = new SmtpClient({
  content_encoding: "quoted-printable", // 7bit, 8bit, base64, binary, quoted-printable
});

const queue: Email[] = [];

function layout(content: string) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
        .html, body {
           font-family: ui-monospace,
            Menlo, Monaco,
            "Cascadia Mono", "Segoe UI Mono",
            "Roboto Mono",
            "Oxygen Mono",
            "Ubuntu Monospace",
            "Source Code Pro",
            "Fira Mono",
            "Droid Sans Mono",
            "Courier New", monospace;
              margin: 0;
              padding: 0;
              line-height: 1.5;
        }
        main {
            padding: 2em;
        }
        span {
          white-space: pre;
        }
        .logRecord {
            padding-bottom: 0.3em;
            color: currentColor;
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-start;
            flex-wrap: wrap;
        }
        .timestamp {
            color: grey;
            font-size:0.9em;
        }
        .method {
            font-size: 1.2em;
            font-weight: bold;
            font-family: monospace;
            text-transform: uppercase;
            /*text-shadow: 0 0 3px #3335;*/
        }
        .args {
            display: inline-block;
            padding: 0 0.3em;
            margin-left: 1ch;
            white-space: pre-wrap;
            color: #666;
        }

        </style>
        <style id="methodNames">
        /* methodNames */
        .dim {
          opacity: 0.5;
        }
        .bold {
          font-weight: 800;
        }
        .italic {
          font-style: italic;
        }
        .underline {
          text-decoration: underline;
        }
        .strikethrough, .line-through, .lineThrough {
          text-decoration: line-through;
        }
        .blink {
          text-decoration: blink;
        }
        .inverse {
          color: #fff;
          background-color: #000;
        }
        .hidden {
          visibility: hidden;
        }
        .bgBlack{
          background-color: #000;
          color: #fff;
        }
        .bgBlue{
          background-color: #0074d9;
          color: #fff;
        }
        .bgBrightBlack{
          background-color: #7f7f7f;
          color: #fff;
        }
        .bgBrightBlue{
          background-color: #013388;
          color: #fff;
        }
        .bgBrightCyan{
          background-color: #33bbff;
          color: #000;
        }
        .bgBrightGreen{
          background-color: #33bb33;
          color: #fff;
        }
        .bgBrightMagenta{
          background-color: #ff00ff;
          color: #fff;
        }
        .bgBrightRed{
          background-color: #ff3333;
          color: #fff;
        }
        .bgBrightWhite{
          background-color: #ffffff;
          color: #000;
        }
        .bgBrightYellow{
          background-color: #ffff33;
          color: #000;
        }
        .bgCyan{
          background-color: #0088cc;
          color: #fff;
        }
        .bgGreen{
          background-color: #00bb00;
          color: #fff;
        }
        .bgMagenta{
          background-color: #bb00bb;
          color: #fff;
        }
        .bgRed{
          background-color: #bb0000;
          color: #fff;
        }
        .bgWhite{
          background-color: #bbbbbb;
          color: #000;
        }
        .bgYellow{
          background-color: #ffcc00;
          color: #000;
        }
        .black{
          color: #000;
        }
        .blue{
          color: #0074d9;
        }
        .brightBlack{
          color: #7f7f7f;
        }
        .brightBlue{
          color: #013388;

        }
        .brightCyan{
          color: #33bbff;
        }
        .brightGreen{
          color: #33bb33;
        }
        .brightMagenta{
          color: #ff00ff;
        }
        .brightRed{
          color: #ff3333;
        }
        .brightWhite{
          color: #ffffff;
        }
        .brightYellow{
          color: #ffff33;
        }
        .cyan{
          color: #0088cc;
        }
        .gray{
          color: #bbbbbb;
        }
        .green{
          color: #00bb00;
        }
        .magenta{
          color: #bb00bb;
        }
        .red{
          color: #bb0000;
        }
        .reset{
          color: inherit;
          background-color: inherit;
        }
        .stripColor{
          color: inherit;
        }
        .white{
          color: #fff;
        }
        .yellow{
          color: #ffcc00;
        }
        </style>
    </head>
    <body>
        <main>
        ${content}
        </main>
    </body>
    </html>`;
}

export function addLogToQueue(
  {
    from = "",
    to = "",
    subject = "",
    content = "",
  }: Partial<
    Email
  >,
): void {
  queue.push({
    from,
    to,
    subject,
    content,
  });
}

export async function flushQueue(config: EmailOptions): Promise<void> {
  try {
    const connectOptions = {
      hostname: config.hostname,
      port: Number(config.port),
      username: config.username,
      password: config.password,
    };
    let connect = client.connect.bind(client);
    const tlsPorts = [25, 465, 587];
    if (tlsPorts.includes(connectOptions.port)) {
      connect = client.connectTLS.bind(client);
    }
    await connect(connectOptions);

    let content = "";
    let from = "";
    let to = "";
    let subject = "";

    for (const email of queue) {
      const data: Email = email;
      content += `${data.content}\n`;
      from = email.from;
      to = email.to;
      subject = email.subject;
    }
    if (content) {
      await sendEmail({
        to,
        from,
        subject,
        content,
      });
      await client.close();
    }
    queue.length = 0;
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.debug(error);
    //   } finally {
    //     try {
    //         await client.close();
    //     } catch {}
  }
}

export async function sendEmail(
  { from, to, subject, content }: Email,
) {
  await client.send({
    from,
    to,
    subject,
    html: layout(content),
  });
  console.info(
    `Email with subject ${subject} sent to ${to}`,
  );
}

const stringify = (val: unknown) => {
  if (typeof val === "string") return val;
  return typeof Deno !== "undefined" ? Deno.inspect : JSON.stringify;
};

export function transportToEmail(
  emailOptions: EmailOptions,
): Middleware {
  emailOptions.debounceTime ||= 10_000;
  emailOptions.subject ||= "LOGS";

  const flushQueueDebounced = debounce(
    (options) => flushQueue(options).catch(console.error),
    emailOptions.debounceTime,
  );

  function handle({ logRecord }: MiddlewareContext, next: MiddlewareNext): void {
    next();
    if (
      !logRecord.muted &&
      (logRecord.levelNumber >=
        (levelsNameToNumbers(emailOptions.logLevel || "warn")))
    ) {
      addLogToQueue({
        from: emailOptions.from,
        to: emailOptions.to,
        subject: emailOptions.subject,
        content: logRecord.html ||
          logRecord.args.map((arg) => stringify(arg)).join(" "),
      });
      flushQueueDebounced(emailOptions);
    }
  }

  return compose([
    supportForConsoleTimers,
    formatToHtml(),
    handle,
  ]);
}
