import { Component } from "react";

class MouseWithCat extends Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = (e) => {
    this.setState({ x: e.clientX, y: e.clientY });
  };

  render() {
    return (
      <>
        <p>
          当前坐标({this.state.x}, {this.state.y})
        </p>
        <div
          style={{ width: "500px", height: "300px", border: "1px solid #fff" }}
          onMouseMove={this.handleMouseMove}
        >
          {this.props.sos(this.state)}
        </div>
      </>
    );
  }
}

class Cat extends Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img
        src="./460K.png"
        alt=""
        style={{
          position: "absolute",
          left: mouse.x,
          top: mouse.y,
          width: "130px",
          height: "80px",
        }}
      />
    );
  }
}

export default class MouseTracker extends Component {
  render() {
    return (
      <div>
        <h1>移动鼠标！</h1>
        <MouseWithCat sos={(mouse) => <Cat mouse={mouse} />} />
      </div>
    );
  }
}
