import { colors, format } from "../../deps.ts";
import type { Middleware, MiddlewareContext, NextMiddleware } from "../types.ts";

type Colorize = (str: string) => string;

const nop = () => (_: string): string => _;
const red = (txt: string) => colors.rgb24(txt, 0xff0000);

const colorsByLevel: {
  [level: number]: Colorize;
} = {
  0: colors.dim,
  10: colors.blue,
  20: (txt) => colors.rgb24(txt, 0xffcc00),
  30: red,
  40: (txt) => colors.underline(red(txt)),
};

const getColorByLevel = (
  level: number,
): Colorize => colorsByLevel[level];
export function pretty(
  {
    timestampFormat = "yyyy-MM-dd HH:mm:ss",
    useColor = true,
    showMethod = true,
    showScope = true,
    multiline = false,
    depth = Infinity,
    iterableLimit = 99,
  } = {},
): Middleware {
  // https://no-color.org/
  useColor = useColor &&
    typeof Deno !== 'undefined' &&
    Deno.isatty(Deno.stdout.rid) &&
    Deno.env.get("NO_COLOR") === undefined;

  const colorTimestamp = useColor ? colors.dim : nop();
  const colorByLevel = useColor ? getColorByLevel : nop;
  const bold = useColor ? colors.bold : nop();
  return function handle(
    { logRecord }: MiddlewareContext,
    next: NextMiddleware,
  ) {
    let msg = "";
    const color = colorByLevel(
      logRecord.levelNumber,
    );
    if (timestampFormat) {
      msg += colorTimestamp(
        formatDate(
          logRecord.timestamp,
          timestampFormat,
        ),
      );
    }
    if (showMethod) {
      msg += " " +
        color(
          bold(
            logRecord.methodName.toUpperCase(),
          ),
        );
    }
    if (showScope && logRecord.scope) {
      msg += ` ${color(`[${logRecord.scope}]`)}`;
    }

    const separator = multiline ? "\n" : " ";
    msg += " " +
      // deno-lint-ignore no-explicit-any
      logRecord.args.map((arg: any) =>
        stringify(arg, {
          colors: useColor,
          compact: !multiline,
          depth,
          iterableLimit,
        })
      )
        .join(separator);

    logRecord.msg = msg;
    next();
  };
}

function formatDate(
  date: number,
  formatter: string,
): string {
  return format(new Date(date), formatter);
}

// function padEnd(str: string, length = 7, char = " "): string {
//   return str.padEnd(length, char);
// }

// const stringify = (val: unknown): string => {
//   if (typeof val === "string") return val;
//   return Deno.inspect(val);
// };

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
  if (!compact && typeof val === "string") {
    return val;
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
