# PromiseA+规范

## 术语

1. promise：一个有then方法的对象或者函数，行为遵循promiseA+规范
2. thenable：一个有then方法的对象或者函数
3. value：promise状态成功时的值，即resolve的参数，只是一个形参，便于理解，数据类型不限
4. reason：promise状态失败时的值，即reject的参数，表示拒绝的原因
5. exception：throw 抛出去的异常

## 规范

### Promise Status

promise有三种状态，其间可以有条件的相互流转，promise必须处于这三种状态之一
resolve reject 是动作
fulfilled rejected 是状态，即动作的结果

1. pending 
    1.1 初始的状态，可改变
    1.2 一个promise在被resolve或者reject之前，都处于这个状态
    1.3 通过 resolve ——> fulfilled
    1.4 通过 reject ——> rejected

2. fulfilled
    2.1 最终态，不可变更
    2.2 一个promise经过resolve后变成此状态
    2.3 必须拥有一个value值（默认返回undefined）

3. rejected
    3.1 最终态，不可改变
    3.2 一个promise经过reject后变成此状态
    3.3 必须拥有一个reason值（默认返回undefined）

pending ——> resolve(value) ——> fulfilled
pending ——> reject(value) ——> rejected

# promise状态一旦进入最终态便不可再更改，并且状态之间的流转不可逆

### then
promise 应该通提供一个then方法，用来访问最终的结果，无论value还是reason

```js
promise.then(onFulfilled, onRejected);
```

1. 参数要求

    1.1 onFulfilled 必须是函数类型，如果不是函数，应该被忽略
    1.2 onRejected 必须是函数类型，如果不是函数，应该被忽略

2. onFulfilled 特性

    2.1 在promise变成 fulfilled 时，应该调用 onFulfilled，参数是value
    2.2 在promise变成 fulfilled 之前，不应该被调用
    2.3 只能被调用一次

3. onRejected 特性

    3.1 在promise变成 rejected 时，应该调用 onRejected，参数是reason
    3.2 在promise变成 rejected 之前，不应该被调用
    3.3 只能被调用一次

4. onFulfilled 和 onRejected 应该是微任务

5. then方法可以被调用多次

    5.1 promise 变成 fulfilled 之后，所有 onFulfilled 的回调都应该按照then的顺序执行