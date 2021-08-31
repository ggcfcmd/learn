# Stream —— 流

shell 通过管道连接各个部分 输入和输出的规范是文本流

Nodejs 内置的 Stream 模块实现了类似的功能 各个部分之间通过 pipe() 连接

```js
const stream = require("stream");

const readable = stream.Readable;
const writable = stream.Writable;
const duplex = stream.Duplex;
const transfrom = stream.Transform;
```

## Readable 可读流

```js
const Readable = require("stream").Readable;

class ToReadable extends Readable {
  constructor(iterator) {
    super();
    this.iterator = iterator;
  }

  _read() {
    const res = this.iterator.next();
    if (res.done) {
      return this.push(null);
    }
    setTimeout(() => {
      this.push(res.value + "\n");
    });
  }
}

const iterator = (function (limit) {
  return {
    next: function () {
      if (limit--) {
        return {
          done: false,
          value: limit + Math.random(),
        };
      }
      return {
        done: true,
      };
    },
  };
})(1000);

const readable = new ToReadable(iterator);

readable.on("data", (data) => process.stdout.write(data));
readable.on("end", () => process.stdout.write("DONE"));
```

创建可读流的时候，需要继承 Readable，并且实现\_read 方法

1. \_read 是生产数据的逻辑
2. 在\_read 方法中，通过调用 push(data)将数据放入可读流中供下游消耗
3. 当全部数据生产完成后，通过 push(null)这种特殊形式通知底层当前流生产数据已结束，之后不能再写入数据

可以通过监听 data 事件消耗可读流

1. 在首次监听 data 事件后，readable 会不断调用\_read 方法生产数据
2. 所有数据生产完毕后，会触发 end

## Writable 可写流

```js
// 可以通过函数调用的方式直接使用 无需继承
const Writable = require("stream").Writable;

const writable = Writable();

// 需要重写_write方法写入数据
writable._write = function (data, enc, next) {
  // 将流中的数据输出
  // write写入的规范是buffer或字符串 为保证输出内容的可读性 此处统一使用toString()强转成字符串
  process.stdout.write(data.toString().toUpperCase());
  // 写入完成时，通知流传入下一个数据
  process.nextTick(next);
};

writable.on("finish", () => {
  process.stdout.write("DONE");
});

writable.write("a" + "\n");
writable.write("b" + "\n");
writable.write("c" + "\n");

writable.end();
```

1. 上游通过 write 方法写入数据到可写流中
2. 在\_write 中，当数据成功写入后，需要调用 next 告诉流开始处理下一个数据
3. 上游必须调用 end()方法来结束可写流 之后不可在写入数据 之后会触发 finish 事件

## Duplex 双工流 —— 同时实现可读和可写接口的流

## Transform 转换流 —— 输出以某种方式关联输入的双工流

可读流中的数据 0 1
可写流中的数据 a b c

在 Transform 中可写端写入的数据，经过自动变换后可以自动添加到可读端

Transform extends Duplex 其内部已实现\_read 和 \_write 方法 需手动实现底层的\_transform 方法

## 数据类型

可读流：push(data) data：String | Buffer，消耗 data 的时候，data 事件输出的数据都是 Buffer

```js
const Readable = require("stream").Readable;
const readable = Readable();

readable.push("a");
readable.push("b");
readable.push({});
readable.push(null);

readable.on("data", (data) => console.log(data));
readable.on("data", (data) => console.log(data.toString()));
```

可写流：push(data) data：String | Buffer，\_write(data) Buffer

Node Stream 中的数据流都是 Buffer 类型（取个交集 ^-^）
