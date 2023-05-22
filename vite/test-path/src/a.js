console.log('__dirname log: ', __dirname);
console.log('arguments log: ', arguments);

// commonjs规范
// 在读取文件时会将当前文件内容复制一份，放到一个IIFE中，

(function(module, exports, require, __dirname, __filename) {

}());