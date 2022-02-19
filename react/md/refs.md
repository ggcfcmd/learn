# 概念

提供一种访问 DOM 节点或在 render 方法中创建的 React 元素

在 react 传统数据流中，props 是父子组件交互的唯一方式，要修改一个子组件，你需要赋值新的 props 属性来触发子组件的重新渲染，
但某些情况下，你需要强制修改子组件或者调用子组件上的方法，这种时候你需要获取子组件的实例

## 使用方式

通过 React.createRef()创建，并通过 ref 属性附加到 React 元素，便可以在上层组件内获取子节点的实例

### 获取 refs

- 当 ref 被传递给 render 中的元素时，对该节点的引用可以在 ref 的 current 属性中被访问

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  handleHover = () => {
    const el = this.myRef.current;
  };

  render() {
    return <div ref={this.myRef} onMouseOver={this.handleHover} />;
  }
}
```

### ref 的值根据节点的类型而有所不同

- 当 ref 属性用于 HTML 元素时，构造函数中使用 React.createRef()创建的 ref 接收底层 DOM 元素作为其 current 属性
- 当 ref 属性用于自定义 class 组件时，ref 对象接收组件的挂载实例作为其 current 属性
- 你不能在函数组件上使用 ref 属性，因为他们没有实例

### 在函数组件中使用 refs

默认情况下，无法在函数组件上使用 ref 属性，但可以通过 forwardRef 或者 useRef 实现在函数组件上使用 ref 属性

```jsx
function CustomTextInput(props) {
  // 这里必须声明 textInput，这样 ref 才可以引用它
  const textInput = useRef(null);

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input type="text" ref={textInput} />
      <input type="button" value="Focus the text input" onClick={handleClick} />
    </div>
  );
}
```

React.forwardRef((props, ref) => (

))

以 forwardRef 为例，该方法接受一个渲染函数，接收 props 和 ref 参数并返回一个 react 系欸但，其会将接收的 ref 属性转发到其他组件树的另一个组件中

### refs 转发

一个可选特征，允许某些组件接收 ref，并将其向下传递（转发）

#### 高阶组件中转发 refs

就像 key 一样，ref 不是 prop 属性，无法通过 props 进行传递，在高阶组件中使用 ref 时，直接传递 ref 会导致上层组件获取的实例是包裹真实子组件的容器组件，解决方式为使用 forwardRef，并且因为 ref 无法通过 props 传递，所以需要定义一个 ref 的中间键（即示例代码中的 forwardedref）

```jsx
const insertLog = (WrappedComponent) => {
  class Log extends Component {
    componentDidUpdate(...args) {
      console.log(...args);
    }
    render() {
      const { forwardedref, ...props } = this.props;
      return <WrappedComponent {...this.props} ref={forwardedref} />;
    }
  }
  return forwardRef((props, ref) => <Log {...props} forwardedref={ref} />);
};

class Sub extends Component {
  input = createRef();
  focus = () => {
    // focus ⽅法执⾏时会让 input 元素聚焦。
    this.input.current.focus();
  };
  render() {
    return <input {...this.props} ref={this.input} />;
  }
}

export default class Parent extends Component {
  state = {
    value: "",
  };
  input = createRef(); // 引⽤⼦组件实例，便于调⽤实例上的⽅法
  onFocus = () => {
    this.input.current.focus(); // 调⽤⼦组件实例上的⽅法
  };
  onChange = (e) => {
    this.setState({ value: e.target.value });
  };
  Wrap = insertLog(Sub);
  render() {
    const Wrap = this.Wrap;
    return (
      <>
        <Wrap
          onChange={this.onChange}
          value={this.state.value}
          ref={this.input}
        />
        <button onClick={this.onFocus}>点击聚焦</button>
      </>
    );
  }
}
```
