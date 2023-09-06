Promise.race = (promises) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    let len = promises.length;
    const res = [];

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((v) => {
          count++;
          res[i] = {
            status: "fulfilled",
            value: v,
          };
          if (count === len) {
            resolve(res);
          }
        })
        .catch((e) => {
          count++;
          res[i] = {
            status: "rejected",
            reason: e,
          };
          if (count === len) {
            resolve(res);
          }
        });
    });
  });
};
