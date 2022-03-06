import logger, { pretty } from "./mod.ts";

logger.use(pretty({ multiline: false }));

// const dataOfAllTypes = [
//   {
//     name: "string",
//     value: "stringstringstring",
//   },
//   {
//     name: "number",
//     value: 42,
//   },
//   {
//     name: "boolean",
//     value: true,
//   },
//   {
//     name: "null",
//     value: null,
//   },
//   {
//     name: "undefined",
//     value: undefined,
//   },
//   {
//     name: "NaN",
//     value: NaN,
//   },
//   {
//     name: "Infinity",
//     value: Infinity,
//   },
//   {
//     name: "function",
//     value: () => {},
//   },
//   {
//     name: "object",
//     value: {},
//   },
//   {
//     name: "array",
//     value: [],
//   },
//   {
//     name: "date",
//     value: new Date(),
//   },
//   {
//     name: "regexp",
//     value: /^regexp$/,
//   },
// {
//     name: "symbol",
//     value: Symbol("symbol"),
//   },
//   {
//     name: "bigint",
//     value: BigInt(42),
//   },

// ];

// const data = dataOfAllTypes.map((item) => item.value)

const tableData = [
  { a: 1, b: 2, c: 3 },
  { a: 10, b: 20, c: 30 },
  { a: 100, b: 200, c: 300 },
];

// logger[200]("hello 200");
// logger.group('hola');
logger.table(tableData);
// logger.groupCollapsed('groupCollapsed');
// console.log(tableData);

// logger.groupEnd();
// logger.table(tableData);

// logger.log(...data);

// logger.info(...data);

// logger.warn(...data);

// logger.error(...data);

// logger.debug(...data);

// logger.trace(...data);
