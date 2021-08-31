# VueRouter

1. vue router 从列表浏览了一段时间，点击进了一个详情页，然后返回的时候，期望回到列表页还是停留在原来的浏览位置，可以怎么做？

· keep-alive
· localStorage/sessionStorage + scrollTop + scrollTo
· scrollBehavior

- router-link 的跳转，scrollBehavior 没有记住滚动条的位置
- 通过手动点击浏览器的返回或者前进按钮 | 浏览器支持的 history api，可以记住滚动条位置

2. router-view 路由出口

· 异步加载 about.js
首屏 app.js chunk-vendors
跳转 About 页面 加载 about.js

· 同步加载 about.js
首屏 app.js chunk-vendors
跳转 About 页面

同步加载时所有子页面都被打包到 app.js 中

## 导航守卫的执行顺序

1. [组件] 前一个组件的 beforeROuteLeave
2. [全局] router beforeEach
3. [路由参数变化] beforeRouteUpdate
4. [配置文件里] beforeEnter
5. [组件] beforeRouteEnter
6. [全局] afterEach
