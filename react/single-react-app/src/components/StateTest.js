import React, { Component } from "react";

export default class StateTest extends Component {
  state = {
    counter: 1,
    count: 0,
  };

  componentDidMount() {
    this.setState({ counter: this.state.counter + 1 });
    this.setState({ counter: this.state.counter + 1 }, () => {
      console.log(this.state);
      console.log(this.state.counter);
    });
    this.setState((preState, props) => ({
      counter: preState.counter + 1,
      count: props.count + 1,
    }));
  }

  handleClick = (e) => {
    console.log(e);
  };

  render() {
    return (
      <div onClick={this.handleClick}>
        <span>{this.state.counter}</span>
        <span>{this.state.count}</span>
      </div>
    );
  }
}
