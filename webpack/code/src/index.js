import React from "react";
import { render } from "react-dom";
import "./style.css";

const lazy = (fn) =>
  class extends React.Component {
    state = {
      Component: () => null,
    };
    async componentDidMount() {
      const { default: Component } = await fn();
      this.setState({ Component });
    }
    render() {
      const Component = this.state.Component;
      return <Component {...this.props} />;
    }
  };

const Async = lazy(() => import(/* webpackChunkName: "Async" */ "./Async"));

const onClick = () => {
  require.ensure([], function () {
    const ensure = require("./requireEnsure");
    ensure.default();
  });
};

const App = () => <div onClick={onClick}>Appasa</div>;

render(<App />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept(App, () => {
    render(<App />, document.querySelector("#app"));
  });
}
