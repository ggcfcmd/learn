## useRef

ref 是 reference（引用）的缩写，在 React 中，通常用 ref 保存 DOM

### 使用

对于 useRef(1)，memoizedState 保存 { current: 1 }。useRef 只是返回一个包含 current 属性的对象

### 工作流程

HostComponent 在 commit 阶段的 mutation 阶段执行 DOM 操作。对应 ref 的更新也发生在 mutation 阶段。而 mutation 阶段执行 DOM 操作的依据为 effectTag，对于 HostComponent、ClassComponent 如果包含 ref 操作，也会赋值相应的 effectTag。所以，ref 的工作流程可以分为两部分，render 阶段为含有 ref 属性的 fiber 添加 Ref effectTag；commit 阶段为包含 Ref effectTag 的 fiber 执行对应操作

## useMemo & useCallback

### 区别

useMemo 会返回回调函数的执行结果，useCallback 会返回回调函数本身
