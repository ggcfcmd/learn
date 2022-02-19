# 概念

redux 和 mobx 都是为状态管理而生，其本身与 react 并无关联，为了在 react 环境中很好地使用，作为桥梁的 react-redux 应运而生。状态管理本身是一个抽象的概念，对于一个 react 组件而言，state 是在父组件维护，还是在本组件声明，抑或是在组件外部借助 createContext 传递，都是一种状态管理的方式。业务开发中最常见的场景是状态重复而不集中，只有当一个状态不能很好地使用组件间数据流进行维护或者被复用的场景足够多时，才应该考虑使用状态管理工具

无论使用哪种管理状态的方式，有一条主线是一致的，即：
· 创建 state
· 注入 state
· state 的变化触发 UI 的更新（rerender）

## 核心思想

redux 和 vuex 一样，遵循单向数据流，即状态只能通过 store 派发，进而驱动视图渲染，不能反过来，状态的更新只能通过 action => reducer 触发，并且是替换原先的状态，而非修改原先的状态，同时 redux 遵循 flux 架构，通过单一状态树管理状态，即全局有且仅有一个 store

## 工作流程

初始化：

1. 通过 createStore 生成全局的 store
2. Provider 注入 store 到项目根节点
3. 子组件通过 connect 获取 store 并映射为被包装组件的 props，同时把被包装组件的更新方法注册到 store listeners

更新：

1. 被包装组件调用 props 的 action，即 dispatch => reducer
2. reducer 生成新的 state，同时遍历执行上一步采集的 listeners
3. 被包装组件基于变化的状态强制更新，包括子组件都会受到影响（穿透）

### createStore

创建一个 redux store 来存放应用中的所有 store
createStore(ruducer, preloadedState, enhancer);

参数：
· reducer(Function)：接收两个参数，分别是当前的 state 树和要处理的 action，返回新的 state 树
· preloadedState(any)：初始时的 state，在同构应用中，你可以决定是否把服务端传来的 state 水合(hydrate)后传给他，或者从之前保存的用户会话中恢复一个传给他。如果使用 combineReducers 创建 reducer，他必须是一个普通对象，与传入的 keys 保持同样的结构。否则你可以自由传入任何 reducer 可理解的内容
· enhancer(Function)：Store enhancer，可选使用。可以用第三方能力如中间键、时间旅行、持久化来增强 store。是一个组合 store creator 的高阶函数，返回一个新的强化过的 store creator。redux 中唯一内置的 store enhander 是 applyMiddleware()

```js
import { createStore } from "redux";

const initialState = { count: 0 };
const reducer = function (state = initialState, action) {
  switch (action.type) {
    case "ADD": {
      return { count: state.count + action.value };
    }
    case "DECREMENT": {
      return { count: state.count - action.value };
    }
    default:
      return state;
  }
};
const store = createStore(reducer);
```

#### store 对象结构

1. @@observable: 异步 api 库
2. dispatch: 改变 state 的唯一途径
3. getState: 获取当前 state
4. replaceReducer:
5. subscribe: 注册更新 state 之后的回调

#### 模拟实现 createStore

需要维护一个状态管理对象 state 以及一个监听事件回调列表，仅实现 dispatch、getState、subscribe 三个功能

```js
function createStore() {
  let state;
  let listeners = [];

  const getState = () => {
    return state;
  };

  // 修改state 执行所有已注册的回调方法
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  // 注册state变更回调方法 返回一个可注销当前回调的函数
  const subscribe = (listener) => {
    if (!listeners.includes(listener)) {
      listeners.push(listener);
    }

    return function unsubscribe() {
      listeners = listeners.filter((l) => l !== listener);
    };
  };
  // 初始化时默认执行一次不匹配任何type类型的dispatch 返回initialState 以达到初始化state的目的
  dispatch({ type: "@@redux-init@@" });

  return { getState, dispatch, subscribe };
}
```

#### 模拟实现 react-redux

思路：需要返回 Provider(上层容器组件)和 connect(下层获取 context 值的方法)，核心功能通过 React 的 context 相关 api 实现

```jsx
import { createContext, useContext, useState } from "react";
const ReduxContext = createContext();

// redux容器组件直接使用<Provider> 而react原生context中使用<Context.Provider> 让他俩相等呗
const Provider = ReduxContext.Provider;

const connect =
  (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => (prop) => {
    const [, forceUpdate] = useState([]);
    const { store } = useContext(ReduxContext); // useContext hook要求传入参数为createContext()创建的对象 所以此处的ReduxContext和Provider中的ReduxContext是同一个context对象
    store.subscribe(() => forceUpdate([])); // 值发生变化后强制更新组件
    const props = {
      ...mapStateToProps(store.getState()),
      ...mapDispatchToProps(store.dispatch),
      ...prop,
    };
    return <WrappedComponent {...props} />;
  };

export { Provider, connect };
```

### 异步提交 action

```jsx
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const store = createStore(reducer, applyMiddleware(thunk));
```

使用包含自定义功能的 middleware 来扩展 Redux 是解决开发问题的一种推荐方式，多个 middleware 可以被组合到一期使用，形成 middleware'链'，并且每个 middleware 都是相互独立的。使用 applyMiddleware 可以让你无需引入第三方依赖就可以 dispatch 异步 actions。例如 redux-thunk 支持 dispatch function（传统的提交 action 的方式是 dispatch 一个对象），以此让 action creator 控制反转，被 dispatch 的 function 会接收 dispatch 作为参数，并可以异步调用他，这类 function 被称为 thunk

### 模块化 reducer

业务开发中，可以考虑将 reducer 函数拆分成多个单独的函数，拆分后的每个函数负责独立管理 state 的一部分，而 combineReducers() 函数的作用是把一个由多个不同 reducer 函数作为 value 的 object，合并成一个最终的 reducer 函数，然后可以对这个 reducer 调用 createStore() 方法。合并后的 reducer 可以调用各个子 reducer，并把他们返回的结果合并成一个 state 对象，由 combineReducers()返回的 state 对象，会将传入的每个 reducer 返回的 state 按其传递给 combineReducers()时对应的 key 进行命名

· 本函数可以组织多个 reducer，使他们分别管理自身相关联的 state，类似于 Flux 中的多个 store 分别管理不同的 state。在 Redux 中，有且仅有一个 store，但是 combineReducers 让你拥有多个 reducer，同时保持各自负责逻辑块的独立性
