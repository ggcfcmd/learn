import useInterval from "./useInterval";
import { useEffect, useState } from "react";

export default () => {
  const [count, setCount] = useState(0);
  console.log("render test log");
  const handleChange = (e: any) => {
    setCount((v) => {
      console.log("v1 log: ", v);
      return v + 1;
    });
    setCount((v) => {
      console.log("v2 log: ", v);
      return v + 1;
    });
  };

  return <div onClick={handleChange}>count: {count}</div>;
};
