# 当前前端存在的一些问题

1. 当前主流 vue、react 框架均为单页应用，修改一个很小的功能却需要打包、编译、发布整个项目，对于比较庞大的项目，成本较高
2. 对于一些老旧项目(jQuery)，如果想使用 react 或者 vue 进行开发，需要对之前的项目进行重构
3. 当前的单页应用，所有 js 最后都会打包到一个 bundle.js 文件中，这会导致线上用户第一次进入的时间比较长，对于前端性能统计中的 FP、FCP、TTI 等一系列指标产生重大影响。（虽然可以使用懒加载的形式对代码进行拆分，但仍然会有上述问题，因为懒加载是在路由发生变化的时候去加载的，当切换路由时，仍然需要动态获取相应模块的代码资源，其中也会有损耗）

# 希望解决上述问题的技术可以做到？

1. 使各个子模块或者子系统进行隔离，这样在更新一个子模块的时候，我们只需要对这个子模块进行打包，发布上线，不会影响到其他模块。并且由于各个子系统之间相互隔离，项目就会被拆分得轻量化，打包速度、前端性能等也会上去。并且因为各个子系统之间的相互隔离，不会受限于技术栈，子系统只需要关注自身功能就可以
2. 可以使各个子系统进行数据共享，如用户信息
3. 能够对 js、css 进行相互隔离，防止出现污染问题

# 微前端

将 Web 应用由单一的单页应用转变为由多个小型前端应用聚合的应用。并且每个前端应用还可以独立运行、开发、部署（独立！！！）

## 实现方案

1. 路由转发：将路由跳转交给服务端，当访问一个路由时，由后端进行重定向，可以不受技术栈的限制，并且由于符合同源策略，可以通过 cookie 传递信息，
   并且每次切换路由的时候，都会重新加载页面，也实现了 js、css 的隔离

优点：简单、可快速配置
缺点：每次跳转都相当于重新刷新一次页面，而不是页面内进行跳转，影响性能

2. iframe 嵌套：父程序监听路由的变化，加载或卸载相应的子程序 iframe，每一个 iframe 相当于一个独立的页面，具有天然的 js、css 隔离，信息共享方面可以使用 postMessage 或 contentWindow 进行通信

优点：实现简单、自带沙盒特性
缺点：
· 业务兼容性问题（比如在子应用内需要实现的全局弹窗，需要 postMessage 通知父应用，实现复杂）
· 主应用劫持快捷键操作
· 事件无法冒泡至顶层（主应用）
· iframe 内元素会被限制在文档树中，视窗宽高限制问题
· 无法共享基础库进一步减少包体积
· 事件通信繁琐且限制多 （iframe 通信总结 https://blog.csdn.net/willspace/article/details/49003963）

3. Web Components（创建可复用的定制元素并使用 Custom Elements | Shadow DOM | HTML templates），将每个子应用采用 web components 进行开发，纯 web-components 相当于自定义一个 html 标签，可以注入到任意框架中去使用（使用较少）

优点：每个子应用拥有独立的 script 和 css，可以单独部署
确定：对之前的子系统改造成本较高，通信复杂

4. 组合式应用路由分发：每个子应用单独打包、部署和运行，只不过需要基于父应用进行路由管理。比如当前路由在/testA，其对应一个子应用 A，当路由切换到/testB 时（testB 也对应着一个子应用 B），那么首先会进行子应用 A 的卸载，完成之后，再去加载子应用 B

优点：纯前端改造，相比于路由式，无刷新，体验感良好
缺点：需要解决样式冲突、JS 污染问题、应用间通信

## 目前采用的方案

目前微前端采用的技术方案是 组合式应用路由开发

· CSS 冲突解决方案：

1. 类似于 vue 的 scoped，打包时对 css 选择器加上响应的属性，属性的 key 是一些不重复的 hash 值，然后使用属性选择器进行选择
2. 自定义前缀：在开发子模块前，确定一个全局唯一的 css 前缀，然后在书写过程中统一添加此前缀，或在根 root 上添加此前缀，使用 less/sass 作用域嵌套即可解

· JS 污染解决方案（沙盒环境）：

1. diff 方法（兼容 IE） 当子页面加载到父类的基座中时，维护一个基于父页面的 parentMap 散列表，在子页面渲染之前，将当前 window 上的变量都存储在这个 map 上。同时维护一个基于子页面的 childMap 散列表，在子页面渲染前将 childMap 中维护的属性赋值给 window，（子页面中间各种操作 window，此处省略若干字），当从子应用跳转回父应用时，将 window 和 parentMap 中属性进行对比，如果两者不一样，说明这个属性在子应用中更改过，存储到 childMap 中，再从 parentMap 中取值还原，就实现了属性的隔离（即在不同的作用域中维护其相应的属性）

```js
class Sandbox {
  constructor() {
    this.cacheMy = new Map(); // 子类缓存
    this.cacheBeforeWindow = new Map(); // 父类缓存
  }

  // 加载子页面
  loadChildPage() {
    // 首先将当前window下的属性存储起来
    this.cacheBeforeWindow.clear();
    Object.keys(window).forEach((item) => {
      this.cacheBeforeWindow.set(item, window[item]);
    });
    // 将子页面中的特定属性赋值给window（首次加载是没有的）
    for (let item of this.cacheMy.keys()) {
      window[item] = this.cacheMy.get(item);
    }
  }

  // 从子页面回到父页面
  leaveChildPage() {
    Object.keys(window).forEach((item) => {
      // 当前window属性和父页面缓存中属性进行对比 如果有不同的属性 说明这个属性在子应用中被修改了 需要维护到子应用缓存中
      if (window[item] !== this.cacheBeforeWindow.get(item)) {
        // 将属性添加到子应用缓存中
        this.cacheMy.set(item, window[item]);
        // 还原父页面缓存中的属性
        window[item] = this.cacheBeforeWindow.get(item);
      }
    });
  }
}

const diffSandbox = new Sandbox();
window.a = 1;
diffSandbox.loadChildPage();
console.log(window.a);
window.a = 2;
diffSandbox.leaveChildPage();
console.log(window.a);
diffSandbox.loadChildPage();
console.log(window.a);
```

2. proxy 代理（不兼容 IE）：监听 set 和 get 方法，根据路由进行对应 windos 属性或方法的存取

```js
const windowMap = new Map(); // 管理（路由-window对象）键值对的map
const resertWindow = {}; // window对象的初始化实例

let routerUrl = ""; // 当前路由

const handler = {
  get: function (obj, prop) {
    // 先取到当前路由对应的内存对象 再返回相应属性
    const tempWindow = windowMap.get(routerUrl);
    console.log(
      "cur windowMap log:",
      tempWindow,
      "cur routerUrl log:",
      routerUrl
    );
    return tempWindow[prop];
  },
  set: function (obj, prop, value) {
    // 空值处理
    if (!windowMap.has(routerUrl)) {
      windowMap.set(routerUrl, JSON.parse(JSON.stringify(resertWindow)));
    }
    // 从当前路由对应的缓存对象中获取对应的属性
    const tempWindow = windowMap.get(routerUrl);
    tempWindow[prop] = value;
  },
};
```

3. iframe 自带 css 和 js 沙箱隔离（有点 low）
