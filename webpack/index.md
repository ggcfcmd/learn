# 概念

webpack 把一切静态资源视为模块，所以又叫静态模块打包器，通过入口文件递归构建依赖图，借助不同的 loader 处理相应的文件源码，最终输出目标环境可执行的代码

· webpack-dev-server 开发模式的包在内存中存储，不输出文件

· 使用 async/await 时会报 'regeneratorRuntime is not defined' 错误，因为 babel 默认只转换新的 JavaScript 语法，如箭头函数等，而不转换新的 Api，如 Iterator、Generator、Set、Maps、Symbol、Promise 等全局对象，babel7+可以使用 @babel/plugin-transform-runtime（babel 6.x 以下版本需要写 ployfill）
