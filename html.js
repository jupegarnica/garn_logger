import { marked } from "https://cdn.skypack.dev/marked";
// import TerminalRenderer from 'https://cdn.skypack.dev/marked-terminal';

// console.log(marked);
// marked.setOptions({
//   // Define custom renderer
//   renderer: new TerminalRenderer()
// });

// Show the parsed data
console.log(
  marked(
    "# Hello \n This is **markdown** printed in the `terminal`",
  ),
);
