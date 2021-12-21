import React from "react";

export function Welcome1(props) {
  return <div>Welcome1, {props.name}</div>;
}

export class Welcome2 extends React.Component {
  render() {
    return <div>Welcome2, {this.props.name}</div>;
  }
}
