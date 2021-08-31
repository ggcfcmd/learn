exports.b = false;

const a = require('./a.js');

console.log('b 模块获取到a 模块的值为： ', a);

exports.b = true;

console.log('b模块到此结束');