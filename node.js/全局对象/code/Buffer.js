// 创建一个长度为10 填充为0的Buffer
const buf1 = Buffer.alloc(10);
// console.log(buf1);

// 创建一个长度为10 填充为1的Buffer
const buf2 = Buffer.alloc(10, 1);
// console.log(buf2);

// 创建一个长度为10 填充内容可能为旧数据的Buffer
const buf3 = Buffer.allocUnsafe(10);
console.log(buf3);
