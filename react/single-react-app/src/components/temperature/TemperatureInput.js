import React from "react";

const scaleNames = {
  c: "摄氏",
  f: "华氏",
};

export default class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
  }
  handleChange = (e) => {
    this.props.onTemperatureChange(e.target.value);
  };

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>输入{scaleNames[scale]}温度：</legend>
        <input value={temperature} onChange={this.handleChange} />
      </fieldset>
    );
  }
}
