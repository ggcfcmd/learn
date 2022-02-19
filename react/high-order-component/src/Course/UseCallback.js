import React, { useMemo, useState, useCallback, memo } from 'react';

const UseCallbackSub = memo(
  ({ value, emitChange }) => {
    console.log('子组件发生了渲染 value：', value);
    return <input onChange={emitChange} value={value} type="number" />;
  },
  (prev, next) => prev.value === next.value,
);

export default function UseCallback() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  // const handleEmit = useCallback(
  //   (e) => {
  //     setValue(e.target.value);
  //   },
  //   [count],
  // );

  const handleEmit = useMemo(
    () => (e) => {
      setValue(e.target.value);
    },
    [count],
  );

  return (
    <>
      <button onClick={handleClick}>count 发生变化{count}</button>
      <UseCallbackSub emitChange={handleEmit} value={value} />
    </>
  );
}
