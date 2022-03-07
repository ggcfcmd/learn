# 项目目录结构

src
  compiler
  core
  platform
  server
  sfc
  share

· compiler：包含Vue中所有编译相关的功能，模板解析成AST、语法树的优化、template转化为render()函数（其中做了一些优化节流）
· core：vue核心代码 包括内置组件、全局api封装、vue实例化、观察者模式、虚拟dom、工具函数等
· platform：跨平台代码 其下有两个文件 web（浏览器） weex（native）
· server：服务端渲染（SSR）
· sfc：vue文件的解析器（Single File Component）
· share：共享工具方法（utils）


# Vue源码入口

src/core/instance/index.js

```js
// Q：为什么这里使用函数对象而非class？
// A：除了可读性更好之外，后续会在Vue的prototype上进行拓展，用函数对象更方便拓展和维护
function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}

// Q：为何要单独抽离以下几个流程？
// A：不仅仅是初始化流程，还生成了vue必要的参数属性，属于Vue实例的一部分
initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);
```

# initMixin做了什么 (src/core/instance/init.js)

· 提供_init()方法 将外部传入参数进行合并和挂载
· 功能性初始化
      initLifecycle：生命周期相关变量、属性的初始化
      initEvents：初始化事件
      initRender：渲染相关（slot、createElement()、defineReactive(defineProperty()的封装)）
      · 触发 beforeCreate 生命周期
      initInjections：初始化inject，并将其中每个属性都变成响应式的
      initState：初始化状态（props、methods、data、computed、watch）
          initProps：
              · 对于属性进行响应式处理
              · 通过proxy()方法去掉 '_props' 的中间层，可以直接通过vm.xxx访问props属性
          （data与props类似，methods、computed、watch也是初始化逻辑）

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

# Q5: 使用vue脚手架新建项目的时候，compiler可以选择 runtime only 模式或者 runtime + compiler 两者有什么区别，在哪个文件做的区分

# Q6：props 和 data 是如何将属性挂载到 vm 实例上的？
在执行 initState() 时执行了 initProps() 其中利用proxy()将vm做了一层代理，可以直接访问原本在vm._props上的属性值，即去掉了props的中间层，使得获取data属性和props属性的行为一致（vm._props.xxx => vm.props）