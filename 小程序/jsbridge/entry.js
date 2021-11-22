const ws = require("nodejs-websocket");
const Koa = require("koa");
const KoaStatic = require("koa-static");
const wxApi = require("./wxApi.js");

const port = process.env.PORT || 8089;

const wsServer = new ws.createServer((connect) => {
  connect.on("text", (e) => {
    console.log("receive request from client", e);
    const isBridge = e.startsWith("jsBridge://");
    if (isBridge) {
      console.log("是jsBridge, 准备拦截");
      const info = parse(e);
      console.log("request message log:", info);
      wxApi[info.api](connect, info.query);
    } else {
      console.log("不是jsBridge, 放行");
    }
  });
  connect.on("error", () => {
    console.log("client disconnect");
  });
}).listen(8081);

const parse = (url) => {
  const queryStartIndex = url.indexOf("?");
  // if (queryStartIndex > -1) {
  const tempArr = url.slice(0, queryStartIndex - 1).split(".");
  const api = tempArr[tempArr.length - 1];
  const queryStr = url.slice(queryStartIndex);
  const query = {};
  for (const [key, value] of new URLSearchParams(queryStr)) {
    query[key] = value;
  }
  // }
  return { api, query };
};

// 搭建一个web服务器
const app = new Koa();
const staticServer = KoaStatic(__dirname + "/public");
app.use(staticServer);
app.listen(port, () => {
  console.log("开始监听");
});
