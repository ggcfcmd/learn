import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import Portal from "./api/portal";
import HooksTimer from "./api/hooksTimer";
import TransitionTest from "./api/useTransition";
import Index from "./api/a";
import Count from "./api/a";
import Interval from "./api/a";
import Parent from "./api/useMemo/parent";

const App = () => {
  return (
    <>
      <div className="App"></div>
      {/* <Portal /> */}
      {/* <HooksTimer /> */}
      {/* <Test /> */}
      {/* <Index /> */}
      {/* <Count /> */}
      {/* <Interval /> */}
      {/* <TransitionTest /> */}
      <Parent />
    </>
  );
};

export default App;
