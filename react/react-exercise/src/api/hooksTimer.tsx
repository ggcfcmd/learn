import { useState, useEffect, useRef, useLayoutEffect } from "react";

const HooksTimer = () => {
  const [count, setCount] = useState(1);
  const countRef = useRef<any>();

  countRef.current = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    const tick = () => {
      countRef.current();
    };
    const timer = setInterval(tick, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <span>{count}</span>;
};

export default HooksTimer;

// function Counter() {
//   const [count, setCount] = useState(0);
//   useEffect(() => {
//     const id = setInterval(() => {
//       setCount(count++);
//     }, 1000);
//     return () => clearInterval(id);
//   }, [count]);
//   return (
//     <>
//       <h1>{count}</h1>
//     </>
//   );
// }
