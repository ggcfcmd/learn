import React, { useState, useEffect } from "react";

export default function HookTest() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `您点击了${count}次`;
  }, [count]);

  return (
    <div>
      <p>点击了{count}次</p>
      <button onClick={() => setCount(count + 1)}>点击</button>
    </div>
  );
}

// 实现思路 react是通过一个单向链表来维护通过useState和useEffect创建的属性 因为每次组件重新渲染都会重新触发其中的useState、useEffect方法
// 所以需要在全局环境下有一块内存去管理上述属性 又因为useState是严格通过注册顺序来确保维护数据正常流转的，所以还需要维护一个索引字段
let stateArray = [];
let curInd = 0;

function mockUseState(initalState) {
  const curCount = curInd;
  // 首次加载赋初值 如果有值取当前值
  stateArray[curCount] = stateArray[curCount] || initalState;

  // 赋值函数
  function setState(newState) {
    stateArray[curCount] = newState;
    // 更改数据后触发视图渲染 当下无法模拟
    // render;
  }

  // 更新索引
  curInd++;
  return [stateArray[curCount], setState];
}
