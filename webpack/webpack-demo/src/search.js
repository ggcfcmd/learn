"use strict";

import React from "react";
import ReactDOM from "react-dom";
import "./search.less";
import pic from "./assets/images/1.jpg";

const Search = () => {
  return (
    <div className="search-text">
      Search Text12311
      <img src={pic} />
    </div>
  );
};

ReactDOM.render(<Search />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
