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
