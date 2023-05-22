// node读文件时如果写的是相对路径，node会尝试去拼接成绝对路径

const fs = require('fs');   // 处理文件的模块（读文件、修改文件等一系列操作）
const path = require('path');   // path本质上就是一个路径处理模块，其中有非常多的路径字符串处理方法

require('./src/a.js');

// path.resolve() 会智能的识别相对路径以及处理不同系统下文件路径不一致的兼容性问题
// __dirname：始终返回的是当前文件所在的目录 eg: E:\learn\vite\test-path
// 直接路径相加：(__dirname + '/variable.css') 使用path.resolve()可以使用相对路径 path.resolve(__dirname, './variable.css')
// 路径兼容性eg：windows: E:\learn\vite\test-path  mac: E:/learn/vite/test-path
const result = fs.readFileSync(path.resolve(__dirname, './variable.css'));

// console.log('result', result.toString());

console.log('process cwd log: ', process.cwd(), '__dirname log: ', __dirname);

// node端去读取文件或操作文件时，如果发现当前使用的是相对路径，则会使用process.cwd()来进行路径拼接
// process.cwd()：获取当前的node执行目录