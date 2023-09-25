// 静态方法，传入一个 Promise 的可迭代对象，当其中所有 Promise 子项都决议之后，按输入顺序返回一个拥有描述每个 Promise 子项执行结果的 Promise 对象数组
// 返回值中通过对象来具体描述子项 promise 的执行结果，其包含以下三个属性：
// · status："fulfilled" | "rejected"，表示 promise 的最终状态
// · value：表示 promise 兑现的值，仅当 status 为 "fulfilled" 时存在
// · status：表示 promise 拒绝的原因，仅当 status 为 "rejected" 时存在
// Promise.allSettled() 是 Promise 并发解决方案之一，适用于当有多个独立的异步任务，并且想获取每一个的结果

Promise.allSettled = (promises) => {
  return new Promise((resolve) => {
    let count = 0;
    let result = [];
    let len = promises.length;
    if (!len) {
      resolve([]);
    }
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((res) => {
          count += 1;
          result[i] = {
            status: "fulfilled",
            value: res,
          };
          if (count === len) {
            resolve(result);
          }
        })
        .catch((reason) => {
          count += 1;
          result[i] = {
            status: "rejected",
            reason,
          };
          if (count === len) {
            resolve(result);
          }
        });
    });
  });
};
