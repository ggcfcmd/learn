import React, { Component } from "react";

export default class NameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };

  handleSubmit = (e) => {
    alert("提交的名字：", this.state.value);
    e.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}
