const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class MPromise {
  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];
  _status = PENDING;

  constructor(fn) {
    // 初始状态为pending
    this.status = PENDING;
    this.value = null;
    this.reason = null;

    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
    switch (newStatus) {
      case FULFILLED: {
        this.FULFILLED_CALLBACK_LIST.forEach((cb) => {
          cb(this.value);
        });
        break;
      }
      case REJECTED: {
        this.REJECTED_CALLBACK_LIST.forEach((cb) => {
          cb(this.reason);
        });
        break;
      }
    }
  }

  resolve(value) {
    if (this.status === PENDING) {
      this.value = value;
      this.status = FULFILLED;
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason;
      this.status = REJECTED;
    }
  }

  then(onFulfilled, onRejected) {
    // onFulfilled和onRejected的兜底函数
    // 6.3、6.4 如果onFulfilled 或者 onRejected 不是一个函数 promise1 以 promise 的 value/reason 触发 fulfilled/rejected
    // 即把 promise 的 value/reason 透传给promise1
    const realOnFulfilled = this.isFunction(onFulfilled)
      ? onFulfilled
      : (value) => {
          return value;
        };
    const realOnRejected = this.isFunction(onRejected)
      ? onRejected
      : (reason) => {
          throw reason;
        };
    // .then()的返回值整体是一个promise
    const promise2 = new MPromise((resolve, reject) => {
      // 6.2 onFulfilled 或者 onRejected 执行时抛出异常，promise2 需要被 reject
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            // 6.1 onFulfilled 或者 onRejected 执行的结果为x，调用resolvePromise
            const x = realOnFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      // 当调用.then()的时候，不同的状态，调用不同的回调
      switch (this.status) {
        // 同步执行
        case FULFILLED: {
          fulfilledMicrotask();
          break;
        }
        // 同步执行
        case REJECTED: {
          rejectedMicrotask();
          break;
        }
        // 当执行then()方法时promise还没有被决议的时候 将回调函数先存储起来 等到状态流转时统一处理 对应5.1、5.2
        /*** code example ***/
        // const promise = new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     resolve();
        //   }, 1000);
        // });
        // promise.then((v) => {
        //   console.log(v);
        // });

        // 异步执行（大多数场景）
        case PENDING: {
          this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotask);
          this.REJECTED_CALLBACK_LIST.push(rejectedMicrotask);
        }
      }
    });
    return promise2;
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(
        new TypeError("The Promise and the return value are the same")
      );
    }

    if (x instanceof MPromise) {
      // 如果x是promise，那么让新的promise接收x的状态
      // 即继续执行x，如果执行的时候又拿到了一个y，那么继续解析y
      queueMicrotask(() => {
        x.then((y) => {
          this.resolvePromise(promise2, y, resolve, reject);
        }, reject);
      });
    } else if (typeof x === "object" || this.isFunction(x)) {
      if (x === null) {
        return resolve(x);
      }

      let then = null;
      try {
        // 取x.then赋值给then
        then = x.then;
      } catch (e) {
        return reject(e);
      }
      // 如果获取到的then是一个函数
      if (this.isFunction(then)) {
        let called = false;
        try {
          then.call(
            x,
            (y) => {
              if (called) {
                return;
              }
              called = true;
              this.resolvePromise(promise2, y, resolve, reject);
            },
            (r) => {
              if (called) {
                return;
              }
              called = true;
              reject(r);
            }
          );
        } catch (e) {
          if (called) {
            return;
          }
          reject(e);
        }
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  isFunction(fn) {
    return typeof fn === "function";
  }

  static resolve(value) {
    if (value instanceof MPromise) {
      return value;
    }

    return new MPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new MPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static race(promiseList) {
    return new MPromise((resolve, reject) => {
      const length = promiseList.length;

      if (length === 0) {
        return resolve();
      } else {
        for (let i = 0; i < length; i++) {
          MPromise.resolve(promiseList[i]).then(
            (v) => {
              return resolve(v);
            },
            (r) => {
              return reject(r);
            }
          );
        }
      }
    });
  }
}

const test = new MPromise((resolve, reject) => {
  setTimeout(() => {
    reject(111);
  }, 1000);
}).catch((r) => {
  console.log("报错", +r);
  console.log(test);
});

setTimeout(() => {
  console.log(test);
}, 3000);
