import React, { Component } from "react";

export default class Clock extends Component {
  state = {
    date: new Date(),
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        date: new Date(),
      });
    }, 1000);
  }

  render() {
    return (
      <div>
        <p>你好啊 朋友</p>
        <div>{this.state.date.toLocaleTimeString()}</div>
      </div>
    );
  }
}
