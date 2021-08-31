const Duplex = require("stream").Duplex;

const duplex = Duplex();

duplex._read = function () {
  this._readNum = this._readNum || 0;

  if (this._readNum > 1) {
    this.push(null);
  } else {
    this.push(`${this._readNum++}`);
  }
};

duplex._write = function (buf, enc, next) {
  process.stdout.write(`_write ${buf.toString()}\n`);
  next();
};

duplex.on("data", (data) => console.log(`ondata = ${data.toString()}`));

duplex.write("a");
duplex.write("b");
duplex.write("c");
duplex.write("d");
duplex.write("e");

duplex.end();
