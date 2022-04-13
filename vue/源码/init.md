# 项目目录结构

src
compiler
core
platform
server
sfc
share

· compiler：包含 Vue 中所有编译相关的功能，模板解析成 AST、语法树的优化、template 转化为 render()函数（其中做了一些优化节流）
· core：vue 核心代码 包括内置组件、全局 api 封装、vue 实例化、观察者模式、虚拟 dom、工具函数等
· platform：跨平台代码 其下有两个文件 web（浏览器） weex（native）
· server：服务端渲染（SSR）
· sfc：vue 文件的解析器（Single File Component）
· share：共享工具方法（utils）

# Vue 源码入口

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

# initMixin 做了什么 (src/core/instance/init.js)

· 提供\_init()方法 将外部传入参数进行合并和挂载
· 功能性初始化
initLifecycle：生命周期相关变量、属性的初始化
initEvents：初始化事件
initRender：渲染相关（slot、createElement()、defineReactive(defineProperty()的封装)）
· 触发 beforeCreate 生命周期
initInjections：初始化 inject，并将其中每个属性都变成响应式的
initState：初始化状态（props、methods、data、computed、watch）
initProps：
· 对于属性进行响应式处理
· 通过 proxy()方法去掉 '\_props' 的中间层，可以直接通过 vm.xxx 访问 props 属性
（data 与 props 类似，methods、computed、watch 也是初始化逻辑）
initProvide：初始化 provide
· 触发 created 生命周期

## Q1：Vue 中有几种生成 dom 的方式，他们之间有什么区别

两种：<template></template>模板 和 render()函数
无论用哪种方式去写，最后都会转换成 render()函数的形式，建议使用 template 模板的形式去写，因为在 compiler 模块中 template 转换成 render()函数时会有一些优化代码，直接写 render()函数会跳过这些优化

## Q2：beforeCreate 和 created 之间做了什么 / 二者都有什么区别？

beforeCreate 在实例初始化之后，数据观测之前调用
在两个钩子之间初始化了 Inject、Provide、props、data、methods、watch 以及 computed
所以当 created 被触发时，实例已经具备了数据侦听、计算属性、方法、事件的回调函数等功能

## Q3：为什么 vm 实例中 data 是函数，而 component 是对象

因为如果 data 是对象，当两个不同实例中有同名属性，修改其中任意一个就会影响到所有属性，用函数会生成一个新的实例，做了一层隔离，解决了这个问题，component 中本身就是用的一个组件，只是根据传参不同对应的状态也不同

## Q4：beforeDestroy 和 destroyed 之间做了什么，二者都有什么区别？

beforeDestroy 在实例销毁前触发，在这一步时实例仍完全可用，触发之后就开始切断实例与父组件的依赖关系，销毁所有子实例，解绑实例中所有指令，移除实例中所有监听器，最后销毁自己，然后触发 destroyed，当触发 destroyed 时，实例已完全不可用

## Q5: 使用 vue 脚手架新建项目的时候，compiler 可以选择 runtime only 模式或者 runtime + compiler 两者有什么区别，在哪个文件做的区分

## Q6：props 和 data 是如何将属性挂载到 vm 实例上的？

在initState()中分别调用initData()和initProps()来将属性挂载到vm实例上
在执行 initState() 时执行了 initProps() 其中利用 proxy()将 vm 做了一层代理，可以直接访问原本在 vm.\_props 上的属性值，即去掉了 props 的中间层，使得获取 data 属性和 props 属性的行为一致（vm.\_props.xxx => vm.props）

# stateMixin 做了什么 (src/core/instance/state.js)

· 挂载 $set
· 挂载 $delete
· 挂载 $watch
· 挂载 $data
· 挂载 $props

## Q7：$set 本质上做了什么？有什么副作用么？该如何避免使用？

· $set 在响应式对象中添加一个属性，并保证新增的这个属性也是响应式的。set 方法在向对象上注册响应式属性之前做了一些前置工作：类型判断、判断要新增的属性是否已经在对象上了，即需要遍历对象，当对象比较庞大时会有性能损耗。最好在初始化对象时就注册需要的属性

# lifecycleMixin 做了什么 (src/core/instance/lifecycle.js)

· 挂载 \_update (vnode、**patch**)
· 挂载 $forceupdate
· 挂载 $destroy (期间触发 beforeDestroy 和 destory)

## Q8：beforeDestroy 和 destroyed 期间做了什么？两者有什么区别？

beforeDestroy 触发后开始从当前实例的 parent 上将自身销毁，并在当前渲染树上销毁自身。beforeDestroy 触发时实例仍完全可用，destroyed 触发时实例已销毁。destroyed 触发后会解绑实例上所有指令、移除所有事件监听器、销毁所有子实例

# renderMixin 做了什么 (src/core/instance/render.js)

· 挂载$nextTick
· 挂载\_render()

## Q9：$nextTick 功能是什么？怎么实现的？使用时有什么需要注意的点？

· nextTick 将回调函数延迟到下次 dom 更新后执行；
· Promise.then()、MutationObserver()、setImmediate、setTimeout 四种实现方案从左到右依次降级处理
· nextTick 中的回调不能有引起 dom 变更的操作，否则会造成死循环

条件允许下最好在初始化时就定义好所需属性，不要动态添加
