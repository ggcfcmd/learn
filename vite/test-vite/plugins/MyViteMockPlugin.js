const fs = require("fs");
const path = require("path");

module.exports = (options) => {
  // 拦截http请求 由viteServer处理
  return {
    configureServer(server) {
      // 服务器的相关配置
      // req 请求对象 ——> 用户发过来的请求
      // res 响应对象
      // next 是否交给下一个中间件，调用next方法会将处理结果交给下一个中间件

      const mockStat = fs.statSync("mock");
      const isDirectory = mockStat.isDirectory();
      // 如果是目录 获取目录下文件内容 过滤掉mock为文件的场景
      let mockResult = [];
      if (isDirectory) {
        // process.cwd() ——> 获取你当前的执行根目录
        mockResult = require(path.resolve(process.cwd(), "mock/index.js"));
        console.log("result", mockResult);
      }
      server.middlewares.use((req, res, next) => {
        const matchItem = mockResult.find(
          (mockDescriptor) => mockDescriptor.url === req.url
        );
        if (matchItem) {
          console.log("进来了");
          const responseData = matchItem.response(req);
          console.log("responseData log: ", responseData);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(responseData));
        } else {
          next();
        }
      });
    },
  };
};
