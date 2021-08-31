console.log(this);

const a = 1;

module.exports.count = 5;
module.exports.foo = function () {};

console.log(this);

// 当前模块打印this，输出的不是全局对象global，而是module.exports
