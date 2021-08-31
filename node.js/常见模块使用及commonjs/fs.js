const fs = require("fs");
const path = require("path");

const pathToFile = path.resolve(__dirname, "./text");

// node中多参数api如果参数中有callback，那其一定是最后一个参数，callback中的第一个参数一定是错误信息 即 error first
// fs.readFile(pathToFile, "utf-8", function (err, result) {
//   if (err) {
//     console.log("error", err);
//     return err;
//   }
//   console.log("result", result);
// });

// // 同步读取文件 会阻塞
// const content = fs.readFileSync(pathToFile, 'utf-8');
// console.log('sync content', content);

// 将异步读取文件方法promise化
function promisify(func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      console.log(args);
      args.push(function (err, result) {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
      return func.apply(func, args);
    });
  };
}

const readFileAsync = promisify(fs.readFile);

readFileAsync(pathToFile, "utf-8")
  .then((content) => {
    console.log(content);
  })
  .catch((err) => {
    console.log(err);
  });
