## 对象是什么 为什么要面向对象

# 面向对象(OOP)：逻辑迁移灵活、代码可复用性高、高度模块化

# 对象的理解

1. 对象是对于单个物体的简单抽象
2. 是一个容器，封装了属性&方法
   · 属性：对象的状态
   · 方法：对象的行为

```js
// 简单对象
const Course = {
  teacher: "云隐",
};

// 函数对象
function Course() {
  (this.teacher = ""),
    (this.leader = ""),
    (this.startCourse = function () {
      return ``;
    });
}
```

## 构造函数 - 生成对象

# 需要一个模板 - 表征了一类物体的共同特征，从而生成对象

# 类即对象模板

# js 本质上不是基于类，而是基于构造函数 + 原型链（constructor + prototype）

```js
function Course() {
    this.teacher = '云隐',
    this.leader = '黄小杨',
}

const course = new Course();
```

## Q: 构造函数 不初始化 可以使用么

A: 不可以使用

## Q: 如果需要使用 如何做兼容

```js
function Course() {
    const _isClass = this instanceof Course;
    if (!_isClass) {
        return new Course();
    }
    this.teacher = '云隐',
    this.leader = '黄小杨',
}
const course = Course();
```

## 引发思考： new 是什么 / new 的原理 / new 做了什么

```js
function Course() {
  const course = new Course();
}
```

1. 创建了一个空对象，作为返回的对象实例
2. 将生成空对象的原型对象指向了构造函数的 prototype 属性（原型委托）
3. 将第 1 步创建的实例对象赋值给内部 this
4. 执行构造函数初始化代码，如果没有返回其他对象，就返回第 1 步创建的实例对象

## 创建的各个实例属性是相互隔离的

```js
function Course(teacher, leader) {
    this.teacher = teacher,
    this.leader = leader,
}

const course1 = new Course('云隐', '黄小杨');
const course2 = new Course('老李', '黄小杨');
course2.teacher = '老张';
console.log(course1.teacher);     // '云隐'

```

## constructor 是什么

1. 每个实例对象在创建时会自动生成一个构造函数属性 constructor
2. constructor 继承自原型对象，指向构造函数的引用 // course1.constructor === Course

## 使用构造函数创建对象 有什么问题

构造函数中的所有方法，都会存在于每个生成的实例中，重复挂载会导致资源浪费

## 原型对象

```js
function Course() {}
const course1 = new Course();
const course2 = new Course();
```

1. 构造函数：用来初始化创建对象的函数 - Course
   · 会自动给构造函数赋予一个 prototype，该属性实际等于实例对象的原型对象

2. 根据原型对象创建出来的实例 - course1
   · 每个对象中都有一个\_\_proto\_\_属性
   · 每个实例对象都有一个 constructor 属性
   · constructor 通过继承得到，并指向当前构造函数

3. 原型对象：Course.prototype

```js
function Course() {}
Course.prototype.teacher = "云隐";
const course1 = new Course();
const course2 = new Course();
```

## 继承

### 原型链继承

思路：重写原型对象，将父对象的属性方法，作为子对象原型对象的属性和方法

```js
// Game类
function Game() {
  this.name = "lol";
}
Game.prototype.getName = function () {
  return this.name;
};

// LOL类
function LOL() {}
LOL.prototype = new Game();
LOL.prototype.constructor = LOL;
```

#### 追问：原型链继承有什么缺点

1. 父类属性一旦赋值给子类的原型属性，此时属性属于子类的共享属性
2. 实例化子类时无法传参

### 构造函数继承（经典继承）

思路：在子类构造函数内部调用父类构造函数

```js
function Game(arg) {
  this.name = "lol";
  this.skin = arg;
}
Game.prototype.getName = function () {
  return this.name;
};

// LOL 类
function LOL(arg) {
  Game.call(this, arg);
}

const game3 = new LOL();
```

解决了共享属性问题 & 传参问题

#### 追问：原型链上的共享方法无法被读取继承，如何解决

### 组合继承

```js
function Game(arg) {
  this.name = "lol";
  this.skin = arg;
}
Game.prototype.getName = function () {
  return this.name;
};
function LOL(arg) {
  Game.call(this, arg);
}

LOL.prototype = new Game();
LOL.prototype.constructor = LOL;

const game3 = new LOL();
```

## 缺点 无论何种场景 都会调用两次父类构造函数

1. 初始化子类原型时
2. 子类构造函数内部 call 父类的时候

## 寄生组合继承(最终版)

```js
function Game(arg) {
  this.name = "lol";
  this.skin = ["s"];
}
Game.prototype.getName = function () {
  return this.name;
};
function LOL(arg) {
  Game.call(this, arg);
}

LOL.prototype = Object.create(Game.prototype);
LOL.prototype.constructor = LOL;

const game3 = new LOL();
```

## 提高 看起来完美解决了继承，js 实现多重继承

```js
function Game(arg) {
  this.name = "lol";
  this.skin = ["s"];
}
Game.prototype.getName = function () {
  return this.name;
};

function Store() {
  this.shop = "steam";
}
Store.prototype.getPlatform = function () {
  return this.shop;
};

function LOL(arg) {
  Game.call(this, arg);
  Store.call(this, arg);
}

LOL.prototype = Object.create(Game.prototype);
Object.assign(LOL.prototype, Store.prototype);
LOL.prototype.constructor = LOL;

const game3 = new LOL();
```
