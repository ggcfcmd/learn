import React, { useEffect } from "react";

const Child1 = ({ emitClick, count }) => {
  const handleClick = (v) => {
    emitClick(v);
  };

  useEffect(() => {
    console.log("child1 update");
  });

  return (
    <div>
      <p>你已经点击 {count} 次了</p>
      <button onClick={() => handleClick(count + 1)}>点击</button>
    </div>
  );
};
export default Child1;
