import React, { useState, useRef, useEffect } from 'react';

// 挂载 DOM 节点
// export default function UseRef() {
//   const container = useRef(null);
//   console.log('log container instance:', container); // 第一次是拿不到的

//   useEffect(() => {
//     console.log('log container after dom init:', container); // 在组件更新之后 再次获取实例 此时实例的current属性引用着虚拟DOM节点
//     // container.current.addEventListener('click', () => {
//     //   alert(0);
//     // });
//   });

//   return <button ref={container}>Ref容器</button>;
// }

// 模拟类组件的this，充当持久化数据对象
export default function UseRef() {
  const [count, setCount] = useState(0);
  const container = useRef(false);
  // 如果在组件内维护状态字段 组件重新加载时状态字段也会重新初始化 所以需要在一个类全局的
  // 内存中去维护凌驾于组件生命周期之上的持久化状态字段
  // let isFirstLoad = true;

  useEffect(() => {
    if (container.current) {
      console.log('模拟componentDidUpdate，即除了初始化，之后的更新进到这里');
    } else {
      container.current = true;
    }
  });

  return <button onClick={() => setCount(count + 1)}>Ref 容器{count}</button>;
}
