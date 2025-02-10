import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import Test from "./rewrite-ahooks/test";

const App = () => {
  return (
    <>
      <div className="App"></div>
      {/* <Portal /> */}
      {/* <Parent /> */}
      <Test />
    </>
  );
};

export default App;
