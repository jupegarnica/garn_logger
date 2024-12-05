import { better } from "./main.ts";
better(console).level("error");

console.error("1 TEST This is a test error");
console.warn("2 TEST NOT this should be logged");
console.info("3 TEST NOT this should be logged");
console.log("4 TEST NOT this should be logged");

better(console).level("warn");
console.error("5 TEST This should be logged");
console.warn("6 TEST This should be logged");
console.info("7 TEST NOT this should be logged");
console.log("8 TEST NOT this should be logged");

better(console).level("info");
console.error("9 TEST This should be logged");
console.warn("10 TEST This should be logged");
console.info("11 TEST This should be logged");
console.log("12 TEST NOT this should be logged");

better(console).level("debug");
console.error("13 TEST This should be logged");
console.warn("14 TEST This should be logged");
console.info("15 TEST This should be logged");
console.log("16 TEST This should be logged");

console.error({ a: 1, b: 2, c: { list: [1, 2, 3] } });
