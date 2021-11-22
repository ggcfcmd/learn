src/core/instance/index.js

```js
// 为什么这里使用函数对象而非class？
// 除了可读性更好之外，后续会在Vue的prototype上进行拓展，用函数对象更方便拓展和维护
function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}

// 为何要单独抽离以下几个流程？
// 不仅仅是初始化流程，还生成了vue必要的参数属性
initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);
```

# Q1：Vue 中有几种生成 dom 的方式，他们之间有什么区别

两种：<template></template>模板 和 render()函数
无论用哪种方式去写，最后都会转换成 render()函数的形式，建议使用 template 模板的形式去写，因为在 compiler 模块中 template 转换成 render()函数时会有一些优化代码，直接写 render()函数会跳过这些优化

# Q2：beforeCreate 和 created 之间做了什么 / 二者都有什么区别？

beforeCreate 在实例初始化之后，数据观测之前调用
在两个钩子之间初始化了 Inject、Provide、props、data、methods、watch 以及 computed
所以当 created 被触发时，实例已经具备了数据侦听、计算属性、方法、事件的回调函数等功能

# Q3：为什么 vm 实例中 data 是函数，而 component 是对象

因为如果 data 是对象，当两个不同实例中有同名属性，修改其中任意一个就会影响到所有属性，用函数会生成一个新的实例，做了一层隔离，解决了这个问题，component 中本身就是用的一个组件，只是根据传参不同对应的状态也不同

# Q4：beforeDestroy 和 destroyed 之间做了什么，二者都有什么区别？

beforeDestroy 在实例销毁前触发，在这一步时实例仍完全可用，触发之后就开始切断实例与父组件的依赖关系，销毁所有子实例，解绑实例中所有指令，移除实例中所有监听器，最后销毁自己，然后触发 destroyed，当触发 destroyed 时，实例已完全不可用
