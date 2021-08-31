## 类 —— 提供一种继承的语法糖

```js
// 传统对象
function Course(teacher, course) {
    this.teacher = teacher;
    this.course = course;
}

Course.prototype.getCourse = function() {
    return `teacher: ${this.teacher}, course: ${this.course}`;
}

const course = new Course('老张', '语文');

// ES6
class CourseClass {
    constructor(teacher, course) {
        this.teacher = teacher;
        this.course = course;
    }

    getCourse() {
        return `teacher: ${this.teacher}, course: ${this.course}`;
    }
}

const course1 = new CourseClass('老张', '语文');
```

### class 是什么类型
```js
console.log(typeof CourseClass);    // function
```

### class 是否有prototype
```js
console.log(CourseClass.prototype);     // {constructor: ƒ, getCourse: ƒ}... 和传统function的原型链一样
```

### class 可以使用对象方法 & 属性么
```js
console.log(course.hasOwnProperty('teacher'));      // true
```

综上所述 class其实就是一个语法糖 其也是根据关联原型链进行委托的方式来实现所谓 "继承"

### 属性定义 两种定义属性的方式：构造器 & 顶层定义（访问器属性）
```js
class Course {
    constructor(teacher, course) {
        this._teacher = teacher;
        this.course = course;
    }

    getCourse() {
        return `teacher: ${this._teacher}, course: ${this.course}`;
    }

    get teacher() {
        return this._teacher;
    }
}

const course = new Course('老张', '语文');

```
### 访问器方式创建变量意义何在

1. 创建只读变量

```js
class Course {
    constructor(teacher, course) {
        this._teacher = teacher;
        this.course = course;
    }

    get teacher() {
        return this._teacher;
    }
}

const course1 = new Course('老张', '语文');
console.log(course1.teacher);   // 老张
course1.teacher = '222';
console.log(course1.teacher);   // 还是老张

// 修改只读变量不会生效，但也不会报错
```
2. js实现一个私有属性

```js
class Course2 {
    constructor(teacher, course) {
        this._teacher = teacher;
        // constructor作用域中定义局部变量 内部在通过闭包对外暴露该变量
        let _course = 'es6';
        this.getCourse = () => {
            return _course;
        }
    }
}

// 更优雅的方式
class Course3 {
    #course = 'es6';
    constructor(teacher) {
        this.teacher = teacher;
    }

    get course() {
        return this.#course;
    }

    set course(val) {
        if (val) {
            this.#course = val;
        }
    }
}
```

### 静态方法
```js
// ES5
function Course(teacher, course) {
    this.teacher = teacher;
    this.course = course;
}

Course.call = function() {
    console.log('call');
}

// ES6
class Course {
    constructor(teacher, course) {
        this._teacher = teacher;
    }

    // static 声明的方法会注册在原型对象，而非示例对象
    static call () {
        console.log('call');
    }
}
```
