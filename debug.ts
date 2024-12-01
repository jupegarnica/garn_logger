import { better } from "./main.ts";
better(console).setLevel("error");


console.error("1 TEST This is a test error");
console.info("2 TEST this should be logged");

better(console).setLevel("debug");

console.log("3 TEST This should be logged");
console.error("4 TEST This should be logged");