# node.js 事件循环模型

## 什么是事件循环

事件循环使 node.js 可以通过将操作转移到系统内核中来执行非阻塞（异步）I/O 操作（虽然 JavaScript 是单线程的）

由于大多数现代内核都是多线程的，因此他们可以处理在后台执行的多个操作，内核会告诉 node.js，以便可以将适当的回调添加到轮询队列中以最终执行

node.js 启动时，他将初始化事件循环，处理提供的输入脚本，这些脚本可能会进行异步 API 调用，调度计时器或调用 process.nextTick，然后开始处理事件循环

```js
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

每个阶段都有一个要执行的回调 FIFO 队列，尽管每个阶段都有其自己的特殊方式，但是通常，当事件循环进入给定阶段时，它将执行该阶段特定的任何操作，然后在该阶段的队列中执行回调，直到队列耗尽或执行回调的最大数量为止。当队列已为空或达到回调限制时，事件循环将移至下一个阶段，以此类推

1. timers：setTimeout 和 setInterval 的回调
2. pending callbacks：推迟到下一个循环迭代的 I/O 回调
3. idle、prepare：仅在系统内部使用
4. poll：执行 I/O 相关的回调，除了 timers、close callback、setImmediate，其他的回调都在这里执行
5. check：setImmediate 回调
6. close callbacks：一些关闭的回调，如 socket.on('close', () => {})

## setImmediate 和 setTimeout 的区别

基本行为相似，但是在不同时机下的调用，行为会发生改变

- setImmediate 在当前 poll 阶段完成后执行
- setTimeout 以毫秒为最小阈值，执行脚本

1. 主模块中执行

两者的执行顺序并不固定，可能 timeout 在前，可能 immediate 在前

```js
setTimeout(() => {
  console.log("timeout");
}, 0);

setImmediate(() => {
  console.log("immediate");
});
```

原因：在主代码部分执行 setTimeout 设置定时器，setImmediate 写入 check 队列

第一阶段是 timer，这个阶段 setTimeout 的回调不一定已经被写入，如果已经被写入，就执行，此时 timeout 先输出；若未写入，则继续往下走，走到 check 阶段，执行 setImmediate，等到下一次事件循环走到 timer 阶段时，再执行 setTimeout，这种情况下 immediate 先输出

2. 在同一个 I/O 回调里执行

setImmediate 总是最先执行的

```js
const fs = require("fs");

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log("timeout");
  }, 0);

  setImmediate(() => {
    console.log("immediate");
  });
});
```
