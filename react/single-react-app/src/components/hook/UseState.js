import { useState } from "react";
import Child1 from "./Child1";
import Child2 from "./Child2";

export default function State() {
  const [count, setState] = useState(0);
  const handleClick = (v) => {
    setState(v);
  };

  return (
    <>
      {count !== 1 && <Child1 count={count} emitClick={handleClick} />}
      <Child2 count={count} emitClick={handleClick} />
    </>
  );
}
