# js 数据类型

基本类型：

1. number
2. string
3. boolean
4. null
5. undefined
6. Symbol（ES6）
7. BigInt（ES10）

引用数据类型：

1. object

注：Array、Date、Function、JSON、RegExp 等都属于 object 的 "内置对象"，不属于数据类型

typeof 类型判断的规则：对于基本数据类型，除了 null 会返回 "object"，其余都会返回正确的类型；对于引用数据类型，除了函数会返回 "function"，其他内置对象都会返回 "object"

## 实现一个获取数据类型的函数

```js
function typeOf(v) {
  let res = Object.prototype.toString.call(v).split(" ")[1];
  res = res.substring(0, res.length - 1).toLowerCase();
  return res;
}
```

# 深拷贝

一个对象子属性是引用数据类型的情况下，拷贝前后同一个子属性如果引用的不是同一片内存地址，就是深拷贝；是一片内存地址就是浅拷贝

## 实现一个深拷贝（解决循环引用）

循环引用指对象的属性直接或间接引用自身的情况，这里选择开辟一块新的内存来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间去找，是否已经拷贝过这个对象，如果有的话直接返回，没有的话存一份之后继续拷贝，来实现直接引用自身的解耦

```js
function deepClone(target, map = new Map()) {
  if (target && typeof target === "object") {
    const res = target instanceof Array ? [] : {};
    if (map.has(target)) {
      return target;
    }
    map.set(target, res);
    for (let key in target) {
      res[key] = deepClone(target[key], map);
    }
    return res;
  } else {
    return target;
  }
}
```

# class 继承

子类通过 extends 继承父类，并且在 construtor 中首次调用 this 之前执行 super()

## 为什么子类要先执行一次 super() ？

因为 ES6 的继承机制与 ES5 不同，ES5 的继承是先创建一个独立的子类的实例对象，然后再将父类的方法添加到这个对象上面，先有实例，之后做继承的行为。ES6 的继承机制则是先将父类的属性和方法，加到一个空的对象上面，然后再将该对象作为子类的实例，所以 ES6 必须先调用 super() 方法，因为这一步会生成一个继承父类的 this 对象，没有这一步就无法继承父类。这也意味着新建子类实例时，父类的构造函数必定会先运行一次

出自阮一峰老师的[class 继承](https://es6.ruanyifeng.com/#docs/class-extends)

# 作用域、作用域链、自由变量

## 作用域

变量和函数的可访问范围，即作用域控制着变量和函数的可见性和生命周期，js 中的作用域在函数声明阶段创建（静态作用域）

全局作用域：全局作用域中的对象代码任何地方都能访问，其伴随页面的整个生命周期
函数作用域：在函数内部定义的变量或者函数，并且定义的变量或者函数只能在函数内部被访问。当函数执行结束之后，函数内部定义的变量会被销毁
块作用域：使用一对大括号包裹的一段代码（比如判断语句、循环语句、单独的{}），使用 let、const 声明
的变量会使用块作用域，块作用域内部定义的变量在外部是访问不到的

## 作用域链

函数声明时会有嵌套的层级关系，也就形成了不同的作用域，内部的作用域是可以访问到外部所有作用域的所有属性或方法，这种类似于链式访问的形式就叫作用域链

## 词法作用域

词法作用域是指作用域是由代码中函数声明的位置来决定的，在代码编译阶段就决定好的，与函数的调用方式无关。

## 闭包

由于词法作用域的规则，内部函数总是可以访问外部函数中声明的变量，当通过一个外部函数返回一个内部函数时，如果这个内部函数引用了外部函数的属性（正常外部函数执行完成后就已经被销毁了），系统就会把子函数引用到的变量按作用域生成一个个包，放到函数的 \[\[scope\]\] 属性上，这些包的集合就被称为闭包

### 闭包的缺点

闭包的原理会导致部分数据因为还需要使用而持续存在于堆中，如果数据体量较大，且数据长时间不被使用，可能会造成较为严重的内存泄漏

## 自由变量

函数访问当前作用域之外的变量（作用域链上的变量）

# this

指向最后一个调用当前函数的环境（箭头函数除外），和函数的调用方式有关，在运行阶段才会明确 this 指向

## 默认绑定：非严格模式下 function 中的 this 会绑定到 window，严格模式下则会绑定到 undefined（严格模式并不会影响全局环境下 this 指向 window）

```js
"use strict";
function foo() {
  console.log(this); // undefined
}
console.log(this); // window
```

## var、let、const

使用 var 声明的变量会被提升到当前作用域的变量环境上，而使用 let 或 const 声明的变量会存储在当前作用域的词法环境上，window 可以直接访问的是变量环境

```js
var a = 1;
let b = 2;

function foo() {
  console.log(this.a); // 1
  console.log(this.b); // undefined
}

console.log(window.a); // 1
console.log(window.b); // undefined
```

## 隐式绑定

当函数引用有上下文对象时，例如 obj.foo()，foo 中的 this 指向 obj

```js
function foo() {
  console.log(this);
}
var obj = {
  a: 1,
  foo,
};

var a = 2;

obj.foo(); // 1
```

### 隐式绑定丢失

1. 使用另一个变量来给函数取别名会发生隐式绑定丢失

```js
function foo() {
  console.log(this.a);
}

var obj = { a: 1, foo };
var a = 2;
var foo2 = obj.foo;
var obj2 = { a: 3, foo3: foo };

obj.foo(); // 1
foo2(); // 2
obj2.foo3(); // 3
```

foo2() 发生了隐式丢失，调用者是 window，使得 foo() 中的 this 指向 window
foo3() 发生了隐式丢失，调用者是 obj2，使得 foo() 中的 this 指向 obj2

2. 函数作为参数传递

```js
function foo() {
  console.log(this);
}

function doFoo(fn) {
  console.log(this);
  fn();
}

var a = 1;
var obj = { a: 2, foo };
var obj2 = { a: 3, doFoo };

obj2.doFoo(obj.foo);
// { a: 3, doFoo: f }
// Window {...}
```

当一个函数作为参数传递到另一个函数的时候，也会发生隐式丢失的问题，并且与包裹他的函数的 this 无关。非严格模式下，会把该函数的 this 绑定到 window 上，严格模式下绑定到 undefined

## 优先级：

new > call、apply、bind > 隐式绑定（作为对象属性）> 默认绑定（window）

## 箭头函数

箭头函数中没有绑定 this 的能力（所以无法用 call、bind、apply 去改变 this 指向），此时 this 由外层作用域决定，并且指向函数定义时的 this 而非执行时，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则 this 为 undefined

## class 中的 this

1. constructor 中的 this 指向实例对象
2. 普通方法中的 this 指向实例对象
3. 静态方法中的 this 指向 class

# Event Loop（事件循环）

为了保证浏览器中事件、用户交互、脚本、UI 渲染、网络可以正常运行的一种机制

1. 一开始整个脚本作为一个宏任务执行
2. 执行过程中同步代码直接执行，宏任务进宏任务队列，微任务进微任务队列
3. 当前宏任务执行完之后，检查微任务列表，依次执行，直到微任务列表清空
4. 执行浏览器 UI 渲染的工作
5. 检查是否有 Web Worker 任务，有的话执行
6. 本轮循环执行完毕，回到第 2 步，重复此过程，直到宏任务和微任务队列都为空

微任务：
· Promise 的 then()、catch()、finally()
· 基于 Promise 实现的其他技术，比如 await、fetch API
· V8 的垃圾回收过程
· MutationObserver
· process.nextTick() （Node 独有）

宏任务：
· script
· setTimeout
· setInterval
· setImmediate
· I/O
· UI rendering

# Promise

promise 相关太琐碎，暂不整理，输出题、和 then catch 等特性基本掌握，可以写 all、allSettled、race、any

# Map 、Set

1. map
   key - value 形式，key 可以是任意类型（Object 只能是 Symbol 或者 string）

2. set

value 形式，自动去重，向 set 加入值的时候，不会发生类型转换

# 防抖

对于频繁触发的事件，单位时间不再触发后再执行，如果单位时间内又触发事件，重新计时

```js
function debounce(fn, wait) {
  let timer;

  return function (...args) {
    const _self = this;
    timer = setTimeout(() => {
      clearTimeout(timer);
      fn.apply(_self, args);
    }, wait);
  };
}
```

# 节流

对于频繁触发的事件，按单位时间频率执行

```js
// 首次触发立即执行，其余事件按单位时间执行
function throttle(fn, wait) {
  let timer,
    last = 0;

  return function (...args) {
    const now = Date.now();
    const context = this;
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      fn.apply(context, args);
      last = Date.now();
    } else {
      timer = setTimeout(() => {
        clearTimeout(timer);
        fn.apply(context, args);
        last = Date.now();
      }, remaining);
    }
  };
}
```

# EventEmitter

```js
class EventEmitter {
  constructor() {
    this.event = new Map();
  }

  on(name, fn) {
    if (!this.event[name]) {
      this.event[name] = [];
    }
    this.event[name].push(fn);
    return this;
  }

  once(name, fn) {
    const cb = (...args) => {
      this.off(name);
      cb.apply(this, args);
    };
    this.on(name, cb);
    return this;
  }

  emit(name, ...args) {
    if (this.event[name]) {
      const cbList = this.event[name];
      cbList.forEach((cb) => {
        cb.apply(this, args);
      });
    }
    return this;
  }

  off(name) {
    delete this.event.delete(name);
  }
}
```
