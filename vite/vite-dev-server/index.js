const Koa = require("koa");
const fs = require("fs");
const path = require("path");

const app = new Koa();

// node 做的最频繁的事儿就是在处理请求和操作文件

// 请求来临后会直接进入到 use 注册的回调函数中
app.use(async (ctx) => {
    console.log('ctx request: ', ctx.request, 'ctx response: ', ctx.response)
    if (ctx.request.url === '/') {
        const indexContent = await fs.promises.readFile(path.resolve(__dirname, './index.html'));
        // console.log('indexContent: ', indexContent.toString());
        ctx.response.body = indexContent;   // 将页面内容设置为请求相应内容
        ctx.response.set('Content-Type', 'text/html');  // 配置浏览器解析文件方式
    }
    if (ctx.request.url === '/main.js') {
        const mainJSContent = await fs.promises.readFile(path.resolve(__dirname, './main.js'));
        // console.log('mainJS: ', mainJSContent.toString());
        ctx.response.body = mainJSContent;   // 将页面内容设置为请求相应内容
        ctx.response.set('Content-Type', 'text/javascript');  // 配置浏览器解析文件方式
    }
    if (ctx.request.url === '/App.vue') {
        // 如果是.vue文件，会判断文件中是否存在<template>标签，(eg: mainVueContent.toString().find('template')) 如果
        // 匹配到了就直接全部进行字符串替换
        const mainVueContent = await fs.promises.readFile(path.resolve(__dirname, './App.vue'));
        // console.log('mainVue: ', mainVueContent.toString());
        ctx.response.body = mainVueContent;   // 将页面内容设置为请求相应内容
        // 即使匹配到.vue文件，也用解析js文件的方式去解析
        ctx.response.set('Content-Type', 'text/javascript');  // 配置浏览器解析文件方式
    }
})

app.listen(5173, () => {
    console.log('vite dev serve listen on 5173');
})