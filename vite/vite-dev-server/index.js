const Koa = require("koa");
const fs = require("fs");
const path = require("path");

const viteConfig = require("./vite.config");
const aliasResolver = require("./aliasResolver");
console.log("vite.config log: ", viteConfig);

const app = new Koa();

// node 做的最频繁的事儿就是在处理请求和操作文件

// 请求来临后会直接进入到 use 注册的回调函数中
app.use(async (ctx) => {
    // console.log('ctx request: ', ctx.request, 'ctx response: ', ctx.response)
    if (ctx.request.url === '/') {
        const indexContent = await fs.promises.readFile(path.resolve(__dirname, './index.html'));
        ctx.response.body = indexContent;   // 将页面内容设置为请求相应内容
        ctx.response.set('Content-Type', 'text/html');  // 配置浏览器解析文件方式
    }
    if (ctx.request.url.endsWith(".js")) {
        const JSContent = await fs.promises.readFile(path.resolve(__dirname, '.' + ctx.request.url));
        console.log('JSContent', JSContent);
        const lastResult = aliasResolver(viteConfig.resolve.alias, JSContent.toString());
        ctx.response.body = lastResult;   // 将页面内容设置为请求相应内容
        ctx.response.set('Content-Type', 'text/javascript');  // 配置浏览器解析文件方式
    }
})

app.listen(5173, () => {
    console.log('vite dev serve listen on 5173');
})