class MyPromise {
  constructor() {}

  static resolve() {}

  static reject() {}

  static all() {}

  static allSettled(promises) {
    return new Promise((resolve) => {
      let count = 0;
      const len = promises.length;
      const res = [];
      if (!len) {
        return resolve([]);
      }

      promises.forEach((item, i) => {
        Promise.resolve(item).then(
          (value) => {
            res[i] = {
              status: "fulfilled",
              value,
            };
            count += 1;
            if (count === len) {
              return resolve(res);
            }
          },
          (reason) => {
            res[i] = {
              status: "rejected",
              reason,
            };
            count += 1;
            if (count === len) {
              return resolve(res);
            }
          }
        );
      });
    });
  }

  static race() {}

  static any() {}

  then() {
    return new Promise((resolve, reject) => {});
  }
}
