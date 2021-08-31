# Buffer

## 背景知识

1. ArrayBuffer：通用的、固定长度的原始二进制数据缓冲区

   1.1 ArrayBuffer 能够直接操作么？

   答：不能直接操作 需要通过类型数组对象（TypedArray）或 DataView 对象来操作 将缓冲区中的数据表示为特定的格式

即可以把 arrayBuffer 理解为一块原生内存，具体存什么需要其他的声明

2. TypedArray：描述了一个底层的二进制数据缓冲区（ArrayBuffer）的一个类数组视图，如果说 arrayBuffer 只是声明了一块内存，那么 typedArray 则进一步规定了这块内存存储的数据类型，并不是某种单一的类型，而是一些类型的统称

## ArrayBuffer 和 TypedArray 的关系

ArrayBuffer 本身是一个 0 和 1 存放在一行的一个集合

单纯的 arraybuffer：10101100011010011101010101

# 使用一个 Int8 的确定类型数组来分离存放 8 位的二进制字节

10101100|01101001|11010101|01...

# 使用一个 Int16 的确定类型数组来分离存放 16 位的二进制字节

1010110001101001|1101010101

3. Unit8Array：表示一个 8 位的无符号整形数组，创建时内容被初始化为 0

位 bit 字节 byte

1byte = 8bit

## NodeJs 中的 Buffer

Buffer 以对 Node.js 更友好的方式实现了 Uint8Array 的 Api 其属于 Uint8Array 的子集 Node 也支持原生的 Uint8Array
Buffer 类的实例类似于从 0~255 的整数数组
其大小是由创建时决定的 不能更改

## Tips

1. 调用 Buffer.allocUnsafe()时，被分配的内存段是未初始化的

   内存的分配非常快，但是分配的内存段可能包含潜在的旧数据
   具有明显的性能优势，但如果使用不当，会给程序引入安全漏洞

## Buffer 与 字符编码

Buffer 的实例一般用于表示编码字符的序列

Nodejs 中目前支持的字符编码

1. ascii - 仅支持 7 位的 ASCII 数据
2. utf8 - 多字节编码的 Unicode 字符
3. base64 - 看 MDN 吧
