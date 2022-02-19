# 概念

react16.8 新增特性，旨在可以在不编写 class 的情况下使用 state 以及其他的 react 特性，其解决的主要问题依然是代码逻辑的复用，同时也简化了生命周期，使得函数式组件拥有了状态，命名规范强制以 use 开头，可返回组件或者任意类型的数据（当然也可以不返回）

## 使用条件

Hook api 创建持久化的状态属性，可能会在项目中的各个组件分别注册自己想要的属性，为保证每个 state 对应相应的 useState，Hook 强依赖于其调用的顺序，即每次渲染中 Hook 都会按照同样的顺序被调用，所以不能在条件语句中调用 Hook，而要放在组件最顶层，将条件判断放在 Hook api 内部

1. 只在最顶层使用 Hook
2. 不要在循环、条件或嵌套函数中调用 Hook
3. 不要在普通的 JavaScript 函数中调用 Hook（仅在 React 组件函数或者自定义 Hook 中调用其他 Hook）

## API

必须掌握：useState、useEffect、useRef、useCallback、useMemo、useContext
建议掌握：useImperativeHandle、useReducer
能看懂：useLayoutEffect、useDebugValue、useTransition

### useState

允许在函数组件中添加 state（创建持久化的状态，使函数组件可以拥有状态）

```jsx
function UseState() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>加一{count}</button>;
}
```

#### 模拟实现 useState

实现思路：react 是通过一个单向链表来维护通过 useState 和 useEffect 创建的属性 因为每次组件重新渲染都会重新触发其中的 useState、useEffect
方法所以需要在全局环境下有一块内存去管理上述属性 又因为 useState 是严格通过注册顺序来确保维护数据正常流转的，所以还需要维护一个索引字段

```js
// global
let stateArray = [];
let curIndex = 0;

function mockUseState(initalState) {
  // 组件更新时useState会返回当前state的最新值 initalState做初始化赋值
  stateArray[curIndex] = stateArray[curIndex] || initalState;

  function setState(newState) {
    stateArray[curIndex] = newState;
    // 触发视图更新 省略
    // render()
  }

  curIndex++;
  return [stateArray[curIndex], setState];
}
```

### useEffect

可以在函数组件中执行副作用操作（数据获取、设置订阅、更改 dom）

1. 只要当前组件有更新（首次加载以及之后的每次渲染），就会执行（相当于 componentDidMount、componentDidUpdate 和 componentWillUnmount 的组合体）
2. 被父组件包裹时，父组件的更新也会触发子组件的 useEffect 执行
3. 在组件内部调用 useEffect 就可以在 effect（调用 useEffect 时传递的回调函数）中直接访问 state 变量（或其他 props）
   ，他们已经保存在函数作用域中，利用 JavaScript 的闭包机制

```jsx
import React, { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

#### 可选的清除机制

如果 effect 返回一个函数，那么 React 会在组件卸载的时候（componentWillUnmount）执行清除操作，因为每次执行 useEffect(() => {})
都会传入一个全新的 effect 来替换之前的，所以如果 effect 返回一个函数时，在将新的 effect 替换为当前的 effect 之前，会先执行旧的 effect 函数中返回的那个函数以保证一些数据或订阅可以正确的被 '清除'

#### 有条件地触发

有些时候，每次渲染后都执行清理或者执行 effect 可能会导致性能问题，这种情况下可以通过调用 useEffect 时传第二个参数来进行 '渲染判断'

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 只在count发生变化时才会更改
```

如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行）可以将 useEffect 的第二个参数置为空数组，这代表当前 effect 不与任何属性关联

### useRef

```jsx
const refContainer = useRef(initialValue);
```

返回一个可变的 ref 对象，其.current 属性被初始化为传入的参数(initialValue)，返回的 ref 对象在组件的整个生命周期中持续存在
可以使用其.current 属性保存任意值 并且 useRef 会在每次渲染时返回同一个 ref 对象 这点和自己维护一个 { current: ... } 对象不同
重新为.current 属性赋值时不会引起组件重新渲染

#### 用途

1. 挂载 dom 节点

```jsx
export default function UseRef() {
  const container = useRef(null);
  console.log("log container instance:", container); // 第一次是拿不到的

  useEffect(() => {
    // 在组件更新之后 再次获取实例 此时实例的current属性引用着虚拟DOM节点
    console.log("log container after dom init:", container);
    // container.current.addEventListener('click', () => {
    //   alert(0);
    // });
  });

  return <button ref={container}>Ref容器</button>;
}
```

2. 模拟类组件的 this，充当持久化数据对象

```jsx
export default function UseRef() {
  const container = useRef(false);

  useEffect(() => {
    if (container.current) {
      console.log("模拟componentDidUpdate，即除了初始化，之后的更新进到这里");
    } else {
      container.current = true;
    }
  });

  return <button>Ref 容器</button>;
}
```

### useCallback

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

把内联回调函数和依赖项数组作为参数传入 useCallback，返回一个 memoized 值，该回调函数仅在某个依赖项改变时才会更新

useCallback(fn, deps)相当于 useMemo(() => fn, deps);

### useMemo

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

将需要创建的函数以及依赖项数组作为参数传入 useMemo，返回一个 memoized 值，他仅会在某个依赖项改变时才重新计算 memoized 值，
可以有效的避免次渲染时都进行高开销的计算

· 传入 useMemo 的函数会在渲染期间执行，不应在这个函数内部执行与渲染无关的操作
· 如果没有提供依赖项数组，useMemo 在每次渲染时都会计算新的值

### useContext

```jsx
const MyContext = React.createContext(defaultValue);
const value = useContext(MyContext);
```

· 接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值，当前的 context 值由上层组件中距离
当前组件最近的<MyContext.Provider>的 value 决定（上层多个 Context 嵌套时，里层的会覆盖外层的数据）
· 当组件上层最近的<MyContext.Provider>更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext.Provider 的 context value 值，即使祖先
跳过更新时，只要 context value 发生改变 下层组件依然会更新
· useContext(MyContext)相当于 class 组件中的 static contextType = MyContext 或者<MyContext.Consumer>，即 useContext 只是让子组件能够
读取 context 的值以及订阅 context 的变化，你仍然需要在上层组件树中使用<MyContext.Provider>来为下层组件注册 context
