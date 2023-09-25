import { useEffect, useMemo, useRef, useState } from "react";
import Child from "./child";

const Parent = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Tom");
  const ref = useRef(null);

  const handleCountChange = () => {
    setCount((v) => v + 1);
  };

  useEffect(() => {
    console.log("parent init");
  }, [count]);

  const handleNameChange = (e: any) => {
    const v = e.target.value;
    setName(v);
  };

  const userInfo = useMemo(() => {
    return { name, age: 18 };
  }, [name]);

  return (
    <>
      <input onChange={handleCountChange} value={count} />
      <input
        ref={ref}
        onChange={(e) => {
          handleNameChange(e);
        }}
      />
      <Child userInfo={userInfo} />
    </>
  );
};

export default Parent;
