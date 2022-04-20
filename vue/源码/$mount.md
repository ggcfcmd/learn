# 数据挂载 （入口 src/core/instance/init.js initMixin() vm.$mount(vm.$options.el)）

1. 判断要挂载的元素是否为body或html元素
2. 判断是否存在render()函数
    2.1 如果不存在，将template或el转化为render()函数（compileToFunction）

3. 调用mountComponent()
    3.1 触发 beforeMount() 生命周期
    3.2 创建 Watcher 实例
        3.2.1 调用 updateComponent() （即先通过vm实例生成虚拟dom，再根据虚拟dom生成真实dom）
            3.2.1.1 调用 vm._render() 生成虚拟dom
            3.2.1.2 调用 vm._update() 更新/生成 真实dom
    3.3 触发 mounted() 生命周期

## Q：vue 实例为何不能挂载在 body 或者 html 根节点上？

vue 在执行$mount()时会将当前挂载的节点替换为我们根据虚拟节点去生成的dom，如果挂载到body或html元素下会破坏当前dom结构，所以$mount()需要配合常规元素使用

## Q: 使用 vue 脚手架新建项目的时候，compiler 可以选择 runtime only 模式或者 runtime + compiler 两者有什么区别，在哪个文件做的区分

在 runtime 模块有一个简易版本的$mount()方法（src/platforms/web/runtime/index.js），对于已经编译好的代码，可以直接引用，而对于需要编译(el、template)的代码，在compiler模块重写$mount()方法（src/platforms/web/entry-runtime-with-compiler.js）

体现了一个思路：涉及到多状态的场景，可以先实现一个简易版本，在后续可能遇到的复杂场景中对于之前的简易版本进行重写

## Q：beforeMount 和 mounted 之间做了什么？

创建Watcher实例，渲染dom（先生成虚拟dom，再生成真实dom）

## Q：什么是虚拟节点 / 简述虚拟dom的构成

对于真实dom的一种抽象描述，由于html标准存在，每个真实节点其实是比较复杂的，涵盖各种api和event

## _render()做了什么？

实例挂载分为两步，第一步是创建当前实例（和他的后代）的虚拟节点，第二步是根据当前的虚拟节点创建真实节点，_render()做的是第一步，即创建虚拟节点，最终随_render()返回的是一个vnode类型的树形结构，再交给_update()去处理

## _update()做了什么？
将vnode转换成真实dom节点

初始化实例、每次实例变更的时候都会调用（入口：src/core/instance/lifecycle.js initLifecycle）

1. 调用 vm.__patch__()
2. 调用 createPatchFunction()
3. 调用 patch()
4. 调用 createElm() 重点：通过虚拟节点创建真实dom，并且把自己插入到父节点中