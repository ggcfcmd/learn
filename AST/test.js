const parser = require("./index.js");

const input = "(add 20 (subtract 4 2))";
const output = "add(20, subtract(4, 2))";

console.log(parser(input));
