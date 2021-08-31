const vm = require("vm");
const path = require("path");
const fs = require("fs");

const pathToFile = path.resolve(__dirname, "./index.js");
// 文件本身内容 字符串类型
const content = fs.readFileSync(pathToFile, "utf-8");

const wrapper = [`(function (require, module, exports) {\n`, "})"];

const wrappedContent = wrapper[0] + content + wrapper[1];

// console.log(wrappedContent);

// vm.script 将传入字符串变为可执行代码
const script = new vm.Script(wrappedContent, {
  filename: "index.js",
});

// 执行代码
const result = script.runInThisContext();
console.log(typeof result);

function r(filename) {
  const pathToFile = path.resolve(__dirname, filename);
  // 文件本身内容 字符串类型
  const content = fs.readFileSync(pathToFile, "utf-8");

  const wrapper = [
    `(function (require, module, exports, __dirname, __filename, variable) {\n`,
    "})",
  ];

  const wrappedContent = wrapper[0] + content + wrapper[1];

  // vm.script 将传入字符串变为可执行代码
  const script = new vm.Script(wrappedContent, {
    filename: "index.js",
  });
  const module = {
    exports: {},
  };
  const result = script.runInThisContext();
  result(r, module, module.exports, null, null, "嘿嘿嘿");
  return module.exports;
}

global.r = r;
