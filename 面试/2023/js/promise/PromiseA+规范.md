# 术语

1. promise：一个具有 then 方法的对象或函数，其行为符合 A+规范
2. thenable：定义了 then 方法的对象或函数
3. value：promise 状态成功时的值，和 resolve 搭配使用。其值可以是所有 js 的数据类型、thenable 或者 promise
4. exception：使用 throw 语句抛出的值
5. reason：一个值，用来表示 promise 被拒绝的原因，和 reject 搭配使用

# 要求

## Promise 状态

一个 promise 必须处于以下三种状态之一：pending(待定) | fulfilled(已完成) | rejected(拒绝)

1. pending
   1.1 promise 初始状态，可改变
   1.2 当一个 promise 处于 pending 状态时，其状态可能会转变成 fulfilled 或者 rejected

2. fulfilled
   2.1 最终态，不可变，必须有一个 value 属性，其值不可变

3. rejected
   3.1 最终态，不可变，必须有一个 reason 属性，其值不可变

pending -> resolve(value) -> fulfilled
pending -> reject(reason) -> rejected

## then 方法

Promise 必须提供一个 then 方法用来访问最终的结果/原因。其包含两个参数，分别用来处理被兑现和被拒绝的场景

```js
promise.then(onFulfilled, onRejected);
```

### 参数要求

1. onFulfilled、onRejected 均必须是一个函数类型，如果不是函数，相应入参会被忽略

2. onFulfilled

   2.1 必须在 promise 完成后调用，第一个参数必须为 promise 的 value 属性
   2.2 promise 完成前不可调用
   2.3 只能被调用一次

3. onRejected

   2.1 必须在 promise 被拒绝后调用，第一个参数必须为 promise 的 reason 属性
   2.2 promise 被拒绝前不可调用
   2.3 只能被调用一次

4. onFulfilled 和 onRejected 需要在微任务中执行

5. 同一个 promise 的 then 方法可以被调用多次

   5.1 promise 状态变成 fulfilled 后，所有的 onFulfilled 回调都需要按照 then 的顺序(函数注册顺序)执行
   5.2 promise 状态变成 rejected 后，所有的 onRejected 回调都需要按照 then 的顺序(函数注册顺序)执行

6. 返回值

then 必须返回一个新的 promise

```js
const promise1 = new Promise();

const promise2 = promise1.then(cb1, cb2);
```

6.1 如果 onFulfilled 或 onRejected 最终返回了一个 value x，执行 resolvePromise(promise2, x)

6.2 如果 onFulfilled 或 onRejected 抛出了一个异常 e，promise2 需要以 e 为原因被 reject

6.3 如果 onFulfilled 不是函数并且 promise1 的状态为 fulfilled，promise2 以 promise1 的 value 触发 fulfilled（即提供一个默认函数并将 promise1 的 value 透传出去）

6.4 如果 onRejected 不是函数并且 promise1 的状态为 rejected，promise2 以 promise1 的 reason 触发 rejected（即提供一个默认函数并将 promise1 的 reason 透传出去）
