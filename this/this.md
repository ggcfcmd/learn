## 上下文 + 作用域

# 作用域链

# this 上下文 context

this 是在执行是动态读取上下文决定的，不是在函数声明时

# 函数直接调用 - this 指向 window

```js
function foo() {
  console.log(this);
}
foo(); // window
```

### 隐式绑定 - 指向调用堆栈的上一级（包含 fn 的 obj 的上下文）

```js
function fn() {
  console.log("隐式绑定", this.a);
}
const obj = {
  a: 1,
};
obj.fn = fn;
obj.fn();
```

# 实战 - 绑定丢失

1.

```js
const foo = {
  bar: 10,
  fn: function () {
    console.log(this.bar);
    console.log(this);
  },
};
let fn1 = foo.fn();
fn1();
```

2.

```js
const o1 = {
  text: "o1",
  fn: function () {
    return this.text;
  },
};
const o2 = {
  text: "o2",
  fn: function () {
    return o1.fn;
  },
};
const o3 = {
  text: "o3",
  fn: function () {
    text: "aaa";
    let fn = o1.fn;
    return fn();
  },
};
console.log(o1.fn());
console.log(o2.fn());
console.log(o3.fn());
```

1. 在执行函数时，如果函数被上一级所调用，那么上下文即指定上一级
2. 否则为全局孤立，指向 window

# 追问：现在要将 console.log(o2.fn())结果是 o2

1. 人为改变 this bind/call/apply

2. 不允许改变 this

```js
const o1 = {
  text: "o1",
  fn: function () {
    return this.text;
  },
};
const o2 = {
  text: "o2",
  fn: o1.fn,
};

// this指向最后调用他的对象，在fn执行时，函数挂载到o2即可
```

### 显式绑定（bind | apply | call）

```js
function foo() {
  console.log(this.a);
}
foo();
foo.call({ a: 1 });
foo.apply({ a: 1 });
const bindFoo = foo.bind({ a: 1 });
bindFoo();
```

## 追问 call、apply、bind 的区别

1. 传参不同
2. 直接返回不同，最终执行结果相同

## 追问 bind 原理

```js
// 1. bind在哪里
function sum(a, b, c) {
  console.log(a, b, c, this);
  return a + b + c;
}
// console.log(sum.hasOwnProperty(bind));   false
// sum.bind 在哪里 => Function.prototype

Function.prototype.newBind = function () {
  // bind 做了什么
  // 1. 返回一个函数 2. 返回原函数执行结果 3. 传参不变
  const _self = this;
  const args = Array.from(arguments);
  // bind函数第一个参数是新的this指向 和call、apply相同
  const newThis = args.shift();

  return function () {
    return _self.apply(newThis, args);
  };
};
```

## 拓展 apply 应用 - 多传参数组化

```js
Math.max(2, 4, 5, 6);
const arr = [2, 4, 5, 6];
let max = Math.max.apply(this, arr);
```

### new

```js
class Course {
  constructor(name) {
    this.name = name;
    console.log("构造函数中的this：", this);
  }

  test() {
    console.log("类方法中的this：", this);
  }
}
const course = new Course();
course.test();
```

## 追问：异步方法中的 this 有区别么

```js
class Course {
  constructor(name) {
    this.name = name;
    console.log("构造函数中的this：", this);
  }

  test() {
    console.log("类方法中的this：", this);
  }

  asyncTest() {
    console.log("异步类方法外的this：", this);
    setTimeout(function () {
      console.log("异步类方法中的this：", this);
    }, 100);
  }
}
const course = new Course();
course.test();
course.asyncTest();
```

1. 执行 setTimeout 时，传入匿名 function 执行，效果和全局执行函数效果相同

# 追问 如何解决 - 把 function 改为无独立上下文的箭头函数即可

箭头函数本身没有上下文，在执行时会默认找上一级的上下文

## 优先级 - new > 显式 > 隐式 > 默认规则

```js
function fn() {
  console.log(this);
}
// fn()  window

const obj = {
  fn,
};

obj.fn(); // obj   隐式大于默认规则

obj.fn.bind(111)(); // 111 显式 > 隐式

function foo(a) {
  this.a = a;
}

const obj1 = {};
var bar = foo.bind(obj1);
bar(2);
console.log(obj1.a); // 2

let baz = new bar(3);
console.log(obj1.a); // 2
console.log(baz.a); // 3  new 大于 显式
```

### 如何突破作用域的束缚

## 闭包：一个函数和对其周围状态（词法环境）的引用捆绑在一起，这样的组合就是闭包 其在函数创建的同时被创建出来

# 函数作为返回值场景

```js
function mail() {
  let content = "信";
  return function () {
    console.log(content);
  };
}
const envelop = mail();
envelop(); // "信"
```

函数外部获取到了函数作用域内的变量值

# 函数作为参数

```js
function envelop(fn) {
  let content = 1;
  fn();
}

function mail() {
  console.log(content);
}
```

# 函数嵌套

```js
let counter = 0;
function outerFn() {
  function innerFn() {
    counter++;
    console.log(counter);
  }
  return innerFn();
}

outerFn(); // 1
```

# 事件处理（异步执行）的闭包

```js
for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}

// 输出10个10
// var 声明的变量会挂载的全局环境 for循环是同步代码 setTimeout是宏任务 当执行到setTimeout时for循环已执行完毕 此时获取到的i已经是10了
```

# 如何解决

使代码执行时获取到正确的 i 值 （限制 i 的作用域）

1. let 块作用域

```js
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}
```

2. IIFE

```js
for (let i = 0; i < 10; i++) {
  (function (i) {
    setTimeout(() => {
      console.log(i);
    }, 100);
  })(i);
}
```

## 追问

1. IIFE 嵌套

```js
(function immediateA(a) {
  return (function immediateB(b) {
    console.log(a); // 0
  })(1);
})(0);

// IIFE在执行时也是通过作用域链逐层向上查找
```

2. IIFE + 块级作用域

```js
let count = 0;
(function immediate() {
  if (count === 0) {
    let count = 1;
    console.log(count); // 1
  }
  console.log(count); // 0
})();
```

3. 拆分执行多个闭包

```js
function createIncrement() {
  let count = 0;

  function increment() {
    count++;
  }

  let message = `count is ${this.count}`;

  function log() {
    console.log(message);
  }

  return [increment, log];
}

const [increment, log] = createIncrement();
increment();
increment();
increment();
log(); // 0
// message在创建时已经赋值了 当时的count就是0 后续对count的修改并没有同步给message
```

4. 实现私有变量

```js
function createStack() {
  return {
    items: [],
    push(item) {
      this.items.push(item);
    },
  };
}

function createStack() {
  const items = [];
  return {
    push(item) {
      items.push(item);
    },
  };
}
```
