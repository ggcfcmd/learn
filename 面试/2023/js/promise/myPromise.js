const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class MyPromise {
  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];
  _status = PENDING;

  constructor(fn) {
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
    const realOnFulfilled = this.isFunction(onFulfilled)
      ? onFulfilled
      : (v) => {
          return v;
        };
    const realOnRejected = this.isFunction(onRejected)
      ? onRejected
      : (r) => {
          throw r;
        };
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
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

      switch (this.status) {
        case FULFILLED: {
          fulfilledMicrotask();
          break;
        }
        case REJECTED: {
          rejectedMicrotask();
          break;
        }
        // 当fn中为非同步代码时，需要等待pending状态变更时再执行回调，先将回调存起来
        case PENDING: {
          this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotask);
          this.REJECTED_CALLBACK_LIST.push(rejectedMicrotask);
        }
      }
    });
    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      reject(new TypeError("The promise and the return value are same"));
    }
    // handle promise
    if (x instanceof MyPromise) {
      queueMicrotask(() => {
        x.then((y) => {
          this.resolvePromise(promise2, y, resolve, reject);
        }, reject);
      });
      // handle object | function
    } else if (typeof x === "object" || typeof x === "function") {
      // null
      if (x === null) {
        return resolve(x);
      }

      let then = null;
      try {
        then = x.then;
      } catch (e) {
        reject(e);
      }

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

  isFunction(fn) {
    return typeof fn === "function";
  }

  static resolve(value) {
    if (value && typeof value === "object" && value instanceof MyPromise) {
      return value;
    }

    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static all() {}

  static allSettled(promises) {
    return new MyPromise((resolve) => {
      let count = 0;
      const len = promises.length;
      const res = [];
      if (!len) {
        return resolve([]);
      }

      promises.forEach((item, i) => {
        MyPromise.resolve(item).then(
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
}

const test = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject(222);
  }, 1000);
})
  .then((v) => {
    console.log(test);
  })
  .catch((reason) => {
    console.log(test);
  });

setTimeout(() => {
  console.log(test);
}, 3000);
