exports.a = false;

const b = require('./b.js');

console.log('a 模块获取到b 模块的值为： ', b);

exports.a = true;

console.log('a模块到此结束');