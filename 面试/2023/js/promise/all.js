// 静态方法。输入一个可迭代对象，返回一个 Promise。当所有输入的 Promise 都被兑现时，按输入顺序返回一个包含所有兑现值的数组，如果输入的内容中有任何一个 Promise 被拒绝，则返回的 Promise 也被拒绝，并携带第一个被拒绝的原因

// 适用于多个相互关联的异步任务，并希望最终的执行结果是成功的

Promise.myAll = (promises) => {
    return new Promise((resolve, reject) => {
      let count = 0;
      let result = [];
      let len = promises.length;

      if (!len) {
        return resolve([]);
      }

      promises.forEach((p, i) => {
        Promise.resolve(p)
          .then((res) => {
            count += 1;
            result[i] = res;
            if (count === len) {
              resolve(result);
            }
          })
          .catch(reject);
      });
    });
};