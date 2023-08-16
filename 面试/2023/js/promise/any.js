// 静态方法。接收一个可迭代对象，返回一个Promise。当可迭代对象中的第一个promise子项被兑现时，返回的Promise也被兑现，并携带子项被兑现的值；当所有的promise都被拒绝时，返回一个包含所有拒绝原因的Promise数组

Promise.myAny = (args) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    let len = args.length;
    const res = [];

    args.forEach((p, i) => {
      Promise.resolve(p)
        .then((v) => {
          resolve(v);
        })
        .catch((e) => {
          count++;
          res[i] = e;
          if (count === len) {
            reject(new AggregateError([...res], "All promises were rejected"));
          }
        });
    });
  });
};

var p1 = Promise.reject(1);
var p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(2);
  }, 1000);
});
Promise.myAny([p1, p2])
  .then((v) => {
    console.log("resolve log: ", v);
  })
  .catch((e) => {
    console.log("reject log: ", e.message);
  });
