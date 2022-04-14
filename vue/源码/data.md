# 数据更新

## Q：vue 实例为何不能挂载在 body 或者 html 根节点上？

vue 在执行$mount()时会将当前挂载的节点替换为我们根据虚拟节点去生成的dom，如果挂载到body或html元素下会破坏当前dom结构，所以$mount()需要配合常规元素使用

## Q：beforeMount 和 mounted 之间做了什么？
