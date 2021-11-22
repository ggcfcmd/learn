# 模块化

## AMD、CMD、CommonJs、UMD、ES6 的对比

### CommonJs

CommonJs 规范是通过 module.exports 定义的，例如 Nodejs，即由服务端兴起

```js
// eg：
const { concat } = require("string");
const newStr = concat("hello world");
```

加载模块是同步的，在服务端，依赖加载速度就是硬盘文件读取的速度，所以没什么问题，如果客户端也使用此方案，就会出现加载模块过久，卡死的假象

### AMD（Asynchronous Module Definition）

采用异步方式加载模块，模块的加载不影响它后面语句的运行，以 RequireJS 为代表

所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。采用 require()语句加载模块但是不同于 CommonJS，它要求两个参数，第一个参数[module]，是一个数组，里面的成员就是要加载的模块，第二个参数 callback，则是加载成功之后的回调函数

```js
// eg：
require(["string"], function (string) {
  const newStr = string.concat("hello", "world");
});

// 多模块 回调参数与模块顺序一致
require(["string", "replace"], function (string, replace) {
  const newStr = string.concat("hello", "world");
});
```

### CMD 是 SeaJS 在推广过程中对模块定义的规范化产出，SeaJS 是淘宝团队提供的一个模块开发的 js 框架

通过 define() 定义，没有依赖前置，通过 require 加载 jQuery 插件，CMD 是依赖就近，在什么地方使用到插件就在什么地方 require 该插件，即用即返，这是一个同步的概念

```js
if (typeof define === "function" && define.cmd) {
  // 有 Sea.js 等 CMD 模块加载器存在
}

// define(id?, deps?, factory) 参数依次为模块标识，依赖项，回调函数
define("moduleName", ["jquery"], function (require, exports, module) {});

define(function (require, exports, module) {
  // 这里用到了jquery
  const $ = require("jquery");
  $("#app").click((e) => {
    // 这里用到了lodash
    const _ = require("lodash");
  });
});
```

### UMD

```js
// 分别判断CommonJS define AMD
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['export'], factory) : (global = global || self, factory(global.React = {}));
}(this, (function (exports) {
    'use strict';
    ...
    exports.useReducer = useReducer;
    exports.useRef = useRef;
    exports.useState = useState;
    exports.version = ReactVersion;
})))
```

## 模块的导出

假如，我们实现的模块为函数 test（没有其他的依赖），为了在 node 环境运行，我们得这样导出

```js
module.exports = test;
```

要支持 ES6 模块使用，得这样

```js
export default test;
```

在 CMD 环境下，这样实现 test

```js
define(function (require, exports, module) {
    export.test = function test() {

    }
})
```

如何写一份兼容各种环境的代码呢？
