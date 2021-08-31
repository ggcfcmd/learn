# Vue 路由及异步组件

## 背景

SSR (Server Side Rendering)：服务器端渲染，多页应用

缺点：

1. 维护成本高
2. 服务器压力大
3. 没有前后端分离，协作流程不清晰

优点：

1. SEO 效果好，因为是已经完全渲染好的页面
2. 用户看到首屏的耗时会比较小

## 现阶段的路由

SPA (Simple Page Application)：单页应用

不仅在页面的交互中是不刷新页面的，就连页面跳转（router.push）也是不刷新页面

www.shenzn.com/index => cdn => index.html => app.js
www.shenzn.com/list => cdn => list.js

首次加载时通过 cdn 加载项目的根页面（通常是 index.html），之后页面间的跳转都是通过 cdn 加载对应页面的 js，和服务器端无任何交互

发布流程：webpack 打包 => 将静态文件.js img html .css 上传到 oss => cdn

好处：成本低，SSR 的情况所有页面都要走服务器端，如果高并发时服务器需要扩容集群，而 SPA 的场景都是通过 cdn 去加载，只需要去买 cdn 的带宽（再直接点就是买流量），成本很低

## 前端路由的特性

1. 根据不同的 url 渲染不同的内容
2. 不刷新页面

### hash 路由原理及其实现

hash 其实就是指 url 中'#'及其后面的部分

# hash 路由的改变，会在 url 上有什么表现

# hash 具体是怎么改变路由的

1. 直接改 url
   www.shenzn.com/#/index ——> www.shenzn.com/#/parent

2. html 标签

```js
<a href="#"></a>
```

3. location.hash
   通过 location 对象直接修改 hash 值

# 如何通过 js 监听 hash 路由改变

hashchange 事件

# 特性

· url 中的 hash 值至少是客户端/浏览器端的一种状态，向服务器发送请求的时候，hash 部分是不会携带的
· hash 值的更改，并不会导致页面的刷新
· hash 值的更改，会在浏览器的访问历史中增加记录，可以通过浏览器的前进、回退按钮来控制 hash 的切换
· hash 值的更改，通过 hashchange 事件

### history 路由

hash 虽然能解决问题，但是带有#不太美观

window.history.back();
window.history.forward();
go(number);
pushState 新增状态
replaceState 替换状态

1. 可以使用 popstate 事件监听 url 变化
2. pushstate 和 replacestate 并不会触发
3. 哪些情况会触发 popstate
   1. 浏览器 回退/前进 按钮
   2. history back forward go

pushState/replaceState 参数

1. state：一个与指定网址相关的状态对象，如果不需要，可以填 null
2. title：新页面的标题，null
3. url：新的网址，必须与当前页面处在同一个域，浏览器的地址栏会显示这个网址

部署 history 路由的时候，要记住，要使你路由中的所有 path 都访问到 index.html 文件
