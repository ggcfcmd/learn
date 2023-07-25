// 静态方法。接受一个promises可迭代对象作为输入，并返回一个Promise。返回值是promises中第一个决议promise的值

// Promise并发方法之一，用于获取第一个完成的异步任务，且不关心其状态
Promise.myRace = (promises) => {
    return new Promise((resolve, reject) => {
        promises.forEach(p => {
            Promise.resolve(p).then(v => resolve(v)).catch(r => reject(r));
        });
    });
}