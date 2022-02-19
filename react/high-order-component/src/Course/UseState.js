import React, { useState, useEffect } from 'react';

function UseState() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`mount + update: ${count}`); // 只要组件更新了，就执行
  });

  useEffect(() => {
    console.log(`mount + update:`); // 因为没有关联的数据，所以只在首次加载组件时执行一次
  }, []);

  useEffect(() => {
    console.log(`mount + update count: ${count}`); // 只要count发生变化，就执行
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>加一{count}</button>;
}

export default function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>父组件加一{count}</button>
      <UseState />
    </>
  );
}
