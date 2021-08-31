## 标识常量

```js
const age = 10;
```
· 声明时必须赋值
· 一旦声明不可修改，对于基本类型就是不可更改，引用类型不可改变内存地址，但可以操作其中属性
· 不允许重复声明
· var 声明的变量会自动挂载在全局对象(web是window)，const不会

## 块级作用域

## 暂时性死区

let、const 必须先声明再使用

Q: Object.freeze() 可以限制一个对象的操作，即 "冻结"，但不能限制对象中复合类型的属性，如何解决（freeze做deep化）？

A: 嵌套遍历并逐层freeze(递归)

```js

function deepFreeze(obj = {}) {
    Object.freeze(obj);
    (Object.keys(obj) || []).forEach((key) => {
        if (typeof key === 'object') {
            deepFreeze(obj[key]);
        }
    })
}
```