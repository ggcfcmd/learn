import { useEffect, useState } from "react";

const Interval = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((c) => c + 1);
    console.log(count);
    setCount((c) => c + 1);
    console.log(count);
    setCount((c) => c + 1);
    console.log(count);
    setCount(count + 40);
  };
  return <div onClick={handleClick}>{count}</div>;
};

export default Interval;
