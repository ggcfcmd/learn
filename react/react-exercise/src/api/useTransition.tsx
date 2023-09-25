import React, { useState, useTransition } from "react";

export default function Test() {
  const [flag, setFlag] = useState(false);
  const [, startTransition] = useTransition();
  const openStartTransition = () => {
    startTransition(() => {
      setFlag(!flag);
    });
  };
  return (
    <>
      <button onClick={openStartTransition}>触发时间切片</button>
      <button
        onClick={() => {
          console.log(111);
        }}
      >
        测试按钮
      </button>
      <br />
      <ul>
        {flag ? (
          Array(3000)
            .fill(0)
            .map((x, i) => {
              return <Child value={i} key={i} />;
            })
        ) : (
          <li>空数据</li>
        )}
      </ul>
    </>
  );
}

const Child = React.memo(function Child({ value }: any) {
  const now = Date.now();
  while (Date.now() - now < 1) {}
  return <li key={value}>name: {value}</li>;
});
