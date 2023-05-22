import "./src/component/loader/imageLoader";
import "./src/component/loader/svgLoader";
// vite支持以解构形式引入 有利于tree shaking （摇树优化：打包工具会自动帮你移除掉没有用到的变量或者方法） 整体引入文件构建工具无法区分其中究竟有哪些属性被使用
import { name } from './src/assets/json/index.json';

console.log('jsonFile name log: ', name);    // 其他构建工具中，json文件的导入会作为一个json字符串形式存在，vite会自动帮忙将其转换为object（JSON.parse()）

fetch('/api/users', {
    method: 'post'
}).then(data => {
    console.log('data', data);
}).catch(error => {
    console.log('error', error);
})