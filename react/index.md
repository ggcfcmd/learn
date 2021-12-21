# React 基础

## State

如果视图内的数据需要修改，并且同时需要响应变化，我们就需要将数据放到 state 中，并且使用 setState 来修改

更改 state

1. this.state.xxx = xxx; // 禁止使用，直接修改值无法使视图响应变化
2. this.setState(obj);
3. this.setState(obj, callback);
4. this.setState(fn);

## 组件类型

· class 组件：有状态的组件（有 state），有交互逻辑和状态需要维护的组件
· 函数式组件：无副作用的组件（纯函数），不会影响外界调用的组件，所有输出均由输入来决定（工具组件、如处理日期格式）

## 生命周期

1. 组建的初始化阶段 init, constructor
2. 挂载阶段 mount
   1. componentWillMount 组件挂载到 dom 前调用 这里写 setState 不会引起组件的重新渲染（因为还没渲染呢 嘿嘿）
   2. render 返回一个 react 元素 不能在这里去 setState（会死循环）
   3. componentDidMount 组件挂载到 dom 后调用 只执行一次
3. 更新阶段 update
   1. componentWillReceiveProps(nextProps) 触发于由 props 引起的组件更新过程中
   2. shouldComponentUpdate(nextProps, nextState)
   3. componentWillUpdate
   4. render
   5. componentDidUpdate
4. 卸载阶段 unmount

   1. componentWillUnmount 释放内存（清理一些定时器）

### 16.3 版本新增 Fiber 架构

提出了 render 之前生命周期的替代方案

getDerivedStateFromProps(props, state)

在组件创建和更新的 render 之前调用，应该返回一个对象来更新状态，如果不想更新任何状态，return null

getSnapshotBeforeUpdate

可以在更改之前获取一些 dom 信息 比如 scrollTop
此生命周期的返回值都会作为参数传递给 componentDidUpdate
