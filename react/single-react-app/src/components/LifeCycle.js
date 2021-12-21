import React, { Component } from "react";

export default class LifeCycle extends Component {
  constructor(props) {
    super(props);
    // 初始化一些状态
    console.log("1. 组件构造函数执行");
  }

  componentWillMount() {
    // 访问一些状态、属性 进行一些api的调用 发送网络请求
    console.log("2. 组件将要挂载");
  }

  componentDidMount() {
    // 实例已完成挂载 可以操作dom了
    console.log("3. 组件已经挂载");
  }

  componentWillReceiveProps() {
    // 父组件传递给子组件属性有变化
    console.log("4. 将要接收属性传递");
  }

  shouldComponentUpdate() {
    // 组件是否需要更新 返回true/false
    console.log("5. 组件是否需要更新？");
  }

  componentWillUpdate() {
    console.log("6. 组件将要更新");
  }

  componentDidUpdate() {
    console.log("7. 组件已更新");
  }

  //   componentWillUnmount() {
  //     console.log("8. 组件将要卸载");
  //   }

  render() {
    console.log("组件渲染");
    return <div>lifeCycle</div>;
  }
}
