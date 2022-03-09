import { colors, format } from "../../deps.ts";
import { levelsNameToColors } from "../constants.ts";
import type { Middleware, MiddlewareContext, MiddlewareNext } from "../types.ts";

type Colorize = (str: string) => string;

const nop = () => (_: string): string => _;

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
  // if (val instanceof Error) {
  //   return `${val.name}: ${val.message} ${ Deno.inspect(val.stack)}`;
  // }
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
const textToHex = (str: string): number => parseInt(str.replace(/^#/, ""), 16);

const getColorByMethod = (
  method: string,
): Colorize => (txt) => colors.rgb24(txt, textToHex(levelsNameToColors(method)));

type AnsiColorOptions = {
  timestamp?: string | false;
  useColor?: boolean;
  showMethod?: boolean;
  showScope?: boolean;
  multiline?: boolean;
  depth?: number;
  iterableLimit?: number;
  methodMaxLength?: number;
};

export function formatToAnsiColors(
  {
    timestamp = "yyyy-MM-dd HH:mm:ss",
    useColor = true,
    showMethod = true,
    showScope = true,
    multiline = false,
    depth = Infinity,
    iterableLimit = 5,
    methodMaxLength = 9,
  }: AnsiColorOptions = {},
): Middleware {
  // https://no-color.org/

  // TODO: think in Node Compatibility
  const shouldUseColor = typeof Deno !== "undefined" &&
    Deno.env.get("NO_COLOR") === undefined &&
    (Deno.stdout?.rid ? Deno.isatty(Deno.stdout?.rid) : true);

  useColor = useColor && shouldUseColor;
  colors.setColorEnabled(useColor);
  const colorTimestamp = colors.dim;
  const colorByMethod = getColorByMethod;
  const bold = colors.bold;
  return function handle(
    { logRecord, state }: MiddlewareContext,
    next: MiddlewareNext,
  ) {
    let ansiText = "";
    const color = colorByMethod(
      logRecord.methodName.toLowerCase(),
    );
    if (timestamp) {
      ansiText += colorTimestamp(
        formatDate(
          logRecord.timestamp,
          timestamp,
        ),
      ) + " ";
    }
    if (showMethod) {
      ansiText += color(
        bold(
          logRecord.methodName.toUpperCase().slice(0, methodMaxLength).padEnd(
            methodMaxLength,
            " ",
          ),
        ),
      ) + " ";
    }
    if (showScope && state.scope) {
      ansiText += `${color(`[${state.scope}]`)} `;
    }

    const separator = multiline ? "\n" : " ";
    ansiText +=
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

    logRecord.ansiText = ansiText;
    next();
  };
}
