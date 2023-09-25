# 组件生命周期 hooks 形式

创建 更新 销毁

# 组件通讯方式

1. 父组件 -> 子组件：props
2. 上层向下层跨层级通信：context
3. 下层将能力传递给上层：forwardRef （自定义部分 ref：useImperativeHandle）
4. 全局状态管理 redux
5. 自定义事件（EventEmitter）

# 常用的 hooks

## useState

可以向函数组件中添加一个状态变量， 最常用的状态管理机制

```js
const [state, setState] = useState(initialState);
```

1. initialState 代表初始值，只在组件首次渲染赋值，如果是一个函数，则只在组件首次渲染时调用

### 更新

#### 更新引用数据类型

使用 setState 时 react 会利用 Object.is()对比新旧值的变化，如果变化则会发起一次新的变更，所以当 state 是引用数据类型时，应该用新的对象替换旧的而不是在原有对象上追加变更

#### 更新策略

setState 更新的值会在本轮渲染之后生效，如果 setState 后立即获取 state，拿到的是当前视图上显示的值（旧值）

#### 通过先前的 state 更新 state

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

setState 不会更新当前正在运行的变量的状态，所以每一次的计算结果都是以当前视图上的旧值为基准进行计算

Q：如何解决呢？

为 setAge 传递一个更新函数

每个 hooks 都会有一个 queue 属性，用来缓存准备更新的队列（pending queue），当 queue 中存储的是一个函数时，会把函数的执行结果作为当前最新的待更新状态，并以这个结果来计算后续的更新

## useEffect

处理副作用

```js
useEffect(() => {
  // doSomething
  return () => {
    // doSomeclear
  };
}, []);
```

return 函数在每次依赖项发生变更即将执行回调之前调用，也会在当前组件销毁前调用

## useMemo

```js
const cachedValue = useMemo(calculateValue, dependencies);
```

用来缓存计算结果，dependencies 数组变更时返回 calculateValue 重新计算的结果

## useCallback

```js
const cachedValue = useMemo(fn, dependencies);
```

用来缓存函数，dependencies 数组变更时返回参数更新后的 fn

## useRef

返回一个拥有 current 属性的对象，这个对象在当前组件整个生命周期中都是同一个引用。可以用来操作 dom 或者获取非受控组件的 value，还可以通过 forwardRef 将当前组件的 ref 传递给上层组件

# react hook 闭包陷阱

主要是在 hook 中使用定时器因为闭包的原因无法拿到最新的 state 导致的异常情况

```js
// 闭包陷阱
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // 这个匿名函数拥有的闭包是 {count: 0}，定时器每次执行的时候是从闭包中去取值，所以每次setCount()都是 0 + 1，和之前的state相同，所以始终没有触发视图的更新
    const id = setInterval(() => {
      setCount(count++);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <h1>{count}</h1>
    </>
  );
}
```

## 解决办法

### ref

useRef 返回一个拥有 current 属性的对象，这个对象在当前组件整个生命周期中都是同一个引用，当 state 更新时是从 hook 的 memoizedState 中拿到最新的值

```js
const HooksTimer = () => {
  const [count, setCount] = useState(1);
  const countRef = useRef<any>();

  countRef.current = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    const tick = () => {
      countRef.current();
    };
    const timer = setInterval(tick, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <span>{count}</span>;
};
```

### setState 改为函数形式

当 setState 是函数形式时，形参 c 的初始值是本次变更最新的 state，计算的结果会成为本次变更最新的 state，并继续接下来的计算

```js
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <h1>{count}</h1>
    </>
  );
}
```

# React 中的性能优化手段

因为 react 是以 app 维度处理更新的框架，当组件 props 或内部的 state 发生变更时，就会引发 reconciler 的计算。所以 react 函数式组件中优化的思路主要有两个方向：减少重新 render 的次数（即触发 reconciliation 的频率）；减少计算的量（对于函数式组件来说，每次 render 都会重头开始执行函数调用）

useMemo
useCallback
React.memo()

# react 18 新特性

## setState 批量更新

react18 版本之前只会合并 react 事件处理函数（handleClick）中的批量更新，默认情况下 promise、setTimeout、原生事件处理函数以及其他任何事件内的更新都不会进行自动批处理

18 版本之后任何场景下都会自动执行批处理

## 新增开启并发模式（concurrent mode）的开关

```js

const root = document.getElementById('root')!;

// React 17

ReactDOM.render(<App />, root);

// React 18

ReactDOM.createRoot(root).render(<App />);

```

## Concurrent Mode（并发模式）

时间切片：从不可中断的同步更新变成可中断的异步更新

### 并发更新

开启了并发模式之后，可以使用一些并发特性，如 useTransition、useDeferredValue

开启并发模式并不意味着当前就处于并发更新状态，需要调用并发特性的 hook 才能实现并发更新的效果

# 受控组件和非受控组件

两者都是基于表单元素的概念

## 受控组件

表单元素通常自己维护 value 属性，并随着用户的输入实时更新。将 value 和 react 的 state 进行关联，再通过 onChange 事件和 setState 结合更新 state 属性，就可以控制用户进行表单输入过程中的操作。通过这种方式控制取值的表单输入元素叫受控组件

## 非受控组件

react 组件不关心表单元素的值是如何更新的，只希望获取到最新的值（用 ref），或者表单元素值的更新无法用代码控制（比如 input 的 file 类型，上传文件）

# immer.js （state 不可变数据）

原生 js 中创建的数据都是可变的，（const 可以控制基本数据类型，但引用数据类型 const 存储的是对象的指针）

不可变数据：一旦创建，就不能再被更改的数据

因为 react 坚持不可变数据的理念，所以当 state 是引用数据类型时，需要创建一个新的对象整体替换之前的，而不是在原有基础上改

immer 提供了更便捷的处理引用数据类型的方式

使用 produce 函数，第一个参数是当前的 state，第二个参数是 draft，我们在 draft 上做属性的修改，immer 会基于我们修改的版本返回一个新的 state

```js
produce((preState, draft) => {
  (draft.name = "Tom"), (draft.address = "北京");
});
```

immer 其实相当于帮我们做了深拷贝的过程，底层用 Proxy 来实现，比深拷贝的性能要好

# CSS 解决方案

## CSS Module

目前 js 编码的模块化已经比较成熟了，但 CSS 并不是一种模块化的语言。CSS 通过层叠和继承来确定最终样式，这个计算是在整个文档流中，这就意味着不同组件的样式可能会相互影响。CSS Module 就是将每一个文件生成一个独立且唯一（拥有一个属于自己的 hash）的模块，可以让开发人员 import 一个 js 模块一样去 import 一个 css 模块

### 特点

作用域：模块中的名称默认属于本地作用域，定义在:local 中的名称也属于本地作用域，定义在:global 中的名称属于全局作用域，全局名称不会被编译为 hash 字符串。

命名：本地名称类，CSS Module 建议使用 camelCase 方式来命名，即 style.className

### 使用

webpack 中的 css-loader 设置 modules:true

## css-in-js

可以增强在 js 中操作 css 的能力，styled-components。可以写样式组件

# jsx 原理 虚拟 dom

jsx 会被 babel 转译为 createElement 格式，通过 createElement 生成 react 元素（也就是虚拟 dom，是对真实 dom 的描述）

## 使用虚拟 dom 的好处

1. 提升性能，虚拟 dom 的体量要比真实 dom 轻很多，支持做双缓存的对比就可以
2. 结合 react-reconciler 实现跨平台

react 将计算视图变更的逻辑（放到 react-reconciler 包中）和 UI 的渲染做了一个彻底的隔离，再将计算的结果给到对应宿主环境的解析器中，需要一种进行计算的中间态

# fiber 架构

1. 从架构的角度来说，fiber 其实是 react 内部实现的一套状态更新机制，整体是异步的，支持任务不同优先级，可中断和恢复，并且可以恢复到之前中断的中间状态

2. 从静态的数据结构来说，fiber 对应一个组件（或者说一个 fiber 节点），用来描述当前组件类型，要进行的行为（挂载？更新？删除？），描述 currentFiber 和 workInProgressFiber 链表结构（child，sibling，return），以及一些和优先级相关的字段

# diff 原理

diff 本质是 vdom 和 currentFiber 进行对比，生成 workInProgressFiber

在 beginWork 阶段，会根据当前 fiber 节点，生成当前节点的下一个 fiber 节点，如果下一个节点之前存在，就会判断当前 currentFiber 上的节点是否可以复用，这个判断的过程就是 diff

因为完整的对比两个链表开销太大，所以 react 中的 diff 只进行同级节点的比较，不考虑节点的后代

因为 fiber 的操作主要有三种，创建（上次没有，这次有），更新（上次有，这次还有），删除（上次有，这次没了），react 团队发现更新的触发频率要远大于创建和删除，所以采用对比同级节点的方式，牺牲小部分情况的性能，以保证大部分场景性能的相对高效

# react 合成事件和原生事件的区别

一个系统内注册的事件监听如果过多会对性能造成影响，所以 react 自己封装了一套事件机制。所有的事件在 document 上监听，并且在冒泡阶段触发，通过合成事件层的对象池管理合成事件对象的创建和销毁，并给当前事件派发对应的处理函数。合成事件对象可以复用，避免每次创建和销毁原生 dom 事件，进而提高性能。同时合成事件磨平了各个浏览器的差异，降低了研发人员使用的心智负担

# Redux

状态管理：数据跨组件维护、共享

## 核心理念

1. 单一数据源

整个应用的 state 被存储在一棵树（store）中，且全局唯一

2. 单向数据流（核心中的核心）

state 状态是只读的，使用者想要更新状态时只能通过 dispatch 发起 action，拿到数据之后使用 reducer 更新 state，这是 redux 中唯一一种更新 state 的方式

3. 纯函数（reducer）更新 state

## 核心属性

1. store：存储 state 的地方，全局唯一

2. dispatch：redux 中唯一更新 state 的方式

调用 store.dispatch() 并传入一个 action 对象，

3. reducer：纯函数（输出只和输入内容有关），用来更新 state

4. action：任意获取数据的行为，可以是同步，也可以是异步，拿到数据之后再调用相应的 reducer 去更新 state

5. selectors：获取数据的函数，可复用

# React-router
