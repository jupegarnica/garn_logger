import { better } from "./main.ts";
better(console).setFilter("TEST").setLevel("info");


console.error("1 TEST This is a test error");
console.info("2 TEST this should be logged");

better(console).setFilter(null).setLevel("debug");

console.log("3 This should be logged");
console.error("4 This should be logged");