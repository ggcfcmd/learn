const path = require("path");

// 绝对路径
const resolvePath = path.resolve("a", "..", "b", "c/d.js");
// 单纯进行拼接路径操作
const joinPath = path.join("..", "a", "..", "b", "c");

console.log(resolvePath);
console.log(joinPath);

console.log(__filename);
console.log(__dirname);

// 返回路径的目录名
console.log(path.dirname(resolvePath));
// 返回路径的最后一部分
console.log(path.basename(resolvePath));
// 返回路径的扩展名
console.log(path.extname(resolvePath));

// node.js在解析时会自动注入require、module、exports这三个变量 故三者在任意一个node模块中都可以使用
// 除上述三者之外 还有两个变量可以被任意调用 __dirname（文件夹绝对路径） __filename （文件绝对路径）
