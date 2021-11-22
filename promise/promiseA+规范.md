# PromiseA+规范

## 术语

1. promise：一个有 then 方法的对象或者函数，行为遵循 promiseA+规范
2. thenable：一个有 then 方法的对象或者函数
3. value：promise 状态成功时的值，即 resolve 的参数，只是一个形参，便于理解，数据类型不限
4. reason：promise 状态失败时的值，即 reject 的参数，表示拒绝的原因
5. exception：throw 抛出去的异常

## 规范

### Promise Status

promise 有三种状态，其间可以有条件的相互流转，promise 必须处于这三种状态之一
resolve reject 是动作
fulfilled rejected 是状态，即动作的结果

1. pending
   1.1 初始的状态，可改变
   1.2 一个 promise 在被 resolve 或者 reject 之前，都处于这个状态
   1.3 通过 resolve ——> fulfilled
   1.4 通过 reject ——> rejected

2. fulfilled
   2.1 最终态，不可变更
   2.2 一个 promise 经过 resolve 后变成此状态
   2.3 必须拥有一个 value 值（默认返回 undefined）

3. rejected
   3.1 最终态，不可改变
   3.2 一个 promise 经过 reject 后变成此状态
   3.3 必须拥有一个 reason 值（默认返回 undefined）

pending ——> resolve(value) ——> fulfilled
pending ——> reject(value) ——> rejected

# promise 状态一旦进入最终态便不可再更改，并且状态之间的流转不可逆

### then

promise 应该提供一个 then 方法，用来访问最终的结果，无论 value 还是 reason

```js
promise.then(onFulfilled, onRejected);
```

1. 参数要求

   1.1 onFulfilled 必须是函数类型，如果不是函数，应该被忽略
   1.2 onRejected 必须是函数类型，如果不是函数，应该被忽略

2. onFulfilled 特性

   2.1 在 promise 变成 fulfilled 时，应该调用 onFulfilled，参数是 value
   2.2 在 promise 变成 fulfilled 之前，不应该被调用
   2.3 只能被调用一次（需要一个变量来限制执行次数）

3. onRejected 特性

   3.1 在 promise 变成 rejected 时，应该调用 onRejected，参数是 reason
   3.2 在 promise 变成 rejected 之前，不应该被调用
   3.3 只能被调用一次

4. onFulfilled 和 onRejected 应该是微任务

5. then 方法可以被调用多次

   5.1 promise 变成 fulfilled 之后，所有 onFulfilled 的回调都应该按照 then 的顺序执行(在实现 promise 的时候，需要一个数组来存储 onFulfilled 的 cb)
   5.2 promise 变成 rejected 之后，所有 onRejected 的回调都应该按照 then 的顺序执行(在实现 promise 的时候，需要一个数组来存储 onRejected 的 cb)

6. 返回值

   then 返回值是一个 promise

   ```js
   const promise = new Promise((resolve) => {
     console.log(1);
     resolve();
   });
   const promise1 = promise.then((v) => {
     console.log(2);
   });
   ```

   6.1 onFulfilled 或者 onRejected 执行的结果为 x，调用 resolvePromise
   6.2 onFulfilled 或者 onRejected 执行时抛出异常，promise1 需要被 reject
   6.3 如果 onFulfilled 不是一个函数，promise1 以 promise 的 value 触发 fulfilled
   6.4 如果 onRejected 不是一个函数，promise1 以 promise 的 reason 触发 rejected

7. resolvePromise

   ```js
   <!-- promise1: promise.then()方法的执行结果, x: promise执行的结果 -->
   resolvePromise(promise1, x, resolve, reject);
   ```

   7.1 如果 promise1 和 x 相等，那么 reject TypeError
   7.2 如果 x 是一个 promise
   · 如果 x 处于 pending，promise 的状态必须也是 pending，直到 x 被决议
   · 如果 x 处于 fulfilled，resolve promise with the same value
   · 如果 x 处于 rejected，reject promise with the same reason

   7.3 如果 x 是一个 Object 或者是一个 function
   执行 let then = x.then;
   · 如果 x.then 这一步出错了，try catch(e)， reject(e)
   · 如果 then 是一个函数，then.call(x, resolvePromise, rejectPromise)，即执行 x.then
   · resolvePromiseFn 的入参是 y，执行 resolvePromise(promise1, y, resolve, reject)
   · 如果调用 then 的时候抛出了异常 e，reject(e)
