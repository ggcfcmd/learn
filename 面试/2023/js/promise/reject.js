// Promise.reject()返回一个已拒绝的Promise对象，拒绝原因为入参

Promise.reject = (reason) => {
    return new Promise((reject) => {
        reject(reason);
    });
}