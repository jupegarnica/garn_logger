import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { debounce } from "https://deno.land/std@0.128.0/async/mod.ts";
import type { Middleware, MiddlewareContext, MiddlewareNext } from "../types.ts";
import { levelsNameToNumbers } from "../constants.ts";
import { formatToHtml } from "./format_to_html.ts";
import { compose } from "../middleware.ts";

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
const client = new SmtpClient();

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
        .logRecord {
            padding-bottom: 1em;
            color: currentColor;
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-start;
            flex-wrap: wrap;
        }

        span {
            white-space: pre;
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
            padding-left: 1em;
            white-space: pre-wrap;
            color: #666;
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
    try {
      await client.connectTLS(connectOptions);
    } catch {
      await client.connect(connectOptions);
    }
    let content = "";
    let from = "";
    let to = "";
    let subject = "";

    for (const email of queue) {
      const data: any = email;
      content += `${data.content}\n`;
      from = email.from;
      to = email.to;
      subject = email.subject;
    }
    if (content) {
      await client.connect({
        hostname: connectOptions.hostname,
        port: connectOptions.port,
      });
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
    content: layout(content),
  });
  console.info(
    `Email with subject ${subject} sent to ${to}`,
  );
}

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
          logRecord.args.map((arg) => JSON.stringify(arg)).join(" "),
      });
      flushQueueDebounced(emailOptions);
    }
  }

  return compose([ formatToHtml(), handle]);
}
