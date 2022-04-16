# 数据挂载 $mount()

1. 判断要挂载的元素是否为body或html元素
2. 判断是否存在render()函数
    2.1 如果不存在，将template或el转化为render()函数（compileToFunction）
3. 调用mountComponent()

## Q：vue 实例为何不能挂载在 body 或者 html 根节点上？

vue 在执行$mount()时会将当前挂载的节点替换为我们根据虚拟节点去生成的dom，如果挂载到body或html元素下会破坏当前dom结构，所以$mount()需要配合常规元素使用

## Q: 使用 vue 脚手架新建项目的时候，compiler 可以选择 runtime only 模式或者 runtime + compiler 两者有什么区别，在哪个文件做的区分

在 runtime 模块有一个简易版本的$mount()方法（src/platforms/web/runtime/index.js），对于已经编译好的代码，可以直接引用，而对于需要编译(el、template)的代码，在compiler模块重写$mount()方法（src/platforms/web/entry-runtime-with-compiler.js）

体现了一个思路：涉及到多状态的场景，可以先实现一个简易版本，在后续可能遇到的复杂场景中对于之前的简易版本进行重写

## Q：beforeMount 和 mounted 之间做了什么？

创建Watcher实例，渲染dom（先生成虚拟dom，再生成真实dom）