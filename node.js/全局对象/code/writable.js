const Writable = require("stream").Writable;

const writable = Writable();

writable._write = function (data, enc, next) {
  // 将流中的数据输出
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
