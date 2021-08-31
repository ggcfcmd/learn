## 解构 - 解开解构(私以为也是语法糖的一种)

```js
// 对象
const zhuawa = {
    teacher: '云隐',
    leader: '黄小杨'
}

const teacher = zhuawa.teacher;
const leader = zhuawa.leader;

// es6
const zhuawa1 = {
    teacher1: '云隐',
    leader1: '黄小杨'
}
const { teacher1, leader1 } = zhuawa1;

// 数组
const arr = [1, 2, 3, 4];
const a = arr[0];
const b = arr[1];

const [a, b, c, d] = arr;
```

## 技巧 key解构
```js
const zhuawa = {
    teacher: {
        name: '云隐',
        age: 30
    },
    leader: '黄小杨',
    name: 'es6'
}
const {
    teacher,
    leader,
    name
} = zhuawa;

// key 别名
const {
    teacher: {
        name,
    }
}
```

### 追问 解构 使用场景/情况
```js
// 数组传参
// es5
const sum = arr => {
    let res = 0;
    arr.forEach(each => {
        res += each;
    })
}
// es6
const sum = ([a, b, c]) => {
    return a + b + c;
}
```

### 结合初始值
```js
const course = ({
    teacher,
    leader,
    course = 'zhuawa'
}) => {
    // ...
}
course({
    teacher: 'yy',
    leader: 'xx',
    // course: 'zz'
})
```

## 返回值
```js
const getCourse = () => {
    return {
        teacher: 'yy',
        leader: 'xx'
    }
}

const { teacher, leader } = getCourse();
```

## 变量交换
```js
let a = 1;
let b = 2;

[b, a] = [a, b];
```

## json处理
```js
const json = '{"teacher": "xx", "leader": "yy"}';

// es5
const obj = JSON.parse(json);

// es6
const { teacher, leader } = JSON.parse(json);
```

## ajax
```js
ajax.get(URL).then(res => {
    // es5
    let code = res.code;
    let data = res.code;
    // es6
    let { code, data } = res.code;
});
```