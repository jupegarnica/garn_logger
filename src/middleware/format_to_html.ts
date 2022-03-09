import { format } from "../../deps.ts";
import { levelsNameToColors } from "../constants.ts";
import type { Middleware, MiddlewareContext, MiddlewareNext } from "../types.ts";

const styleByLevel: {
  [level: number]: string;
} = {
  0: "",
  10: "",
  20: "",
  30: "",
  40: "text-decoration: underline #d66;",
};
function padEnd(str: string, len: number = 10, char: string = " "): string {
  return str.slice(0, len).padEnd(len, char);
}

export function formatToHtml(
  {
    timestamp = "yyyy-MM-dd HH:mm:ss",
    useColor = true,
    showMethod = true,
    showScope = true,
    multiline = false,
    depth = Infinity,
    iterableLimit = 20,
  } = {},
): Middleware {
  return function handle(
    { logRecord, state }: MiddlewareContext,
    next: MiddlewareNext,
  ) {
    const colorize = useColor ? levelsNameToColors : (x: string) => x;
    const style = `color:${colorize(logRecord.methodName)};` +
      styleByLevel[logRecord.levelNumber];
    let html = "<div class='logRecord'>";
    if (timestamp) {
      html += `<span class="timestamp" style="color:${colorize("timestamp")}">`;
      html += formatDate(
        logRecord.timestamp,
        timestamp,
      );
      html += " </span>";
    }
    if (showMethod) {
      html += `<span class="method" style="${style}; ">${
        padEnd(logRecord.methodName)
      } </span>`;
    }
    if (showScope && state.scope) {
      html += `<span class="scope> style="${style}">[${state.scope} </span>`;
    }

    const separator = multiline ? "<br>" : " ";
    html += `<span class="args" style="">` +
      // deno-lint-ignore no-explicit-any
      logRecord.args.map((arg: any) =>
        stringify(arg, {
          colors: false,
          compact: !multiline,
          depth,
          iterableLimit,
        })
          .replaceAll("\n", separator)
      ).join(separator);
    html += "</span></div>";
    logRecord.html = html;
    next();
  };
}

function formatDate(
  date: number,
  formatter: string,
): string {
  return format(new Date(date), formatter);
}

function stringify(val: unknown, {
  trailingComma = true,
  colors = true,
  depth = Infinity,
  compact = true,
  sorted = false,
  getters = false,
  showHidden = false,
  showProxy = false,
  iterableLimit = Infinity,
} = {}): string {
  if (typeof val === "string") {
    return val;
  }
  if (val instanceof Error) {
    return `${val.name}: ${val.message} ${(val.stack)}`;
  }
  return Deno.inspect(val, {
    trailingComma,
    colors,
    depth,
    compact,
    sorted,
    getters,
    showHidden,
    showProxy,
    iterableLimit,
  });
}
