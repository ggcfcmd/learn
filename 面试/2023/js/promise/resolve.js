// 静态方法。Promise.resolve() 将给定的值转换为一个Promise。如果该值本身就是一个Promise，该值会被返回；如果该值是一个thenable对象，Promise.resolve()会调用其then()方法以及两个回调函数；否则，返回的Promise将会以该值兑现
// thenable：实现了Thenable接口的对象（即拥有.then()方法，该方法被调用时需要传入两个回调函数，一个用于Promise被兑现时调用，一个用于Promise被拒绝时调用）。Promise也是thenable对象

Promise.myResolve = (value) => {
    if (value && typeof value === 'object' && value instanceof Promise) {
        return value;
    }

    return new Promise((resolve) => {
        resolve(value);
    });
}