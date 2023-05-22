// 第一种使用svg的方式
// import svgIcon from '@/assets/svg/fullScreen.svg?url'; // ?url 读取当前文件路径 默认为url 可省略

// console.log('svgIcon', svgIcon);

// const img = document.createElement('img');

// img.src = svgIcon;

// document.body.appendChild(img);

// 第二种使用svg的方式
// import svgRaw from '../../assets/svg/fullScreen.svg?raw'; // 读取当前文件内容 字符串格式

// console.log('svgRaw', svgRaw);

// document.body.innerHTML = svgRaw;

// const svgElement = document.getElementsByTagName('svg')[0];

// svgElement.onmouseenter = function() {
//     // 修改svg的颜色需要操作fill属性
//     this.style.fill = 'red';
// }