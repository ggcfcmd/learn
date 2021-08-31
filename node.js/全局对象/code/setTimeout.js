const fs = require("fs");

// 主模块执行
// setTimeout(() => {
//   console.log("timeout");
// }, 0);

// setImmediate(() => {
//   console.log("immediate");
// });

// I/O流执行
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log("timeout");
  }, 0);

  setImmediate(() => {
    console.log("immediate");
  });
});
