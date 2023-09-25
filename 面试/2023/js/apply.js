Function.prototype.myApply = function (thisArg, ...args) {
  const context = Object(thisArg) || window;
  const key = Symbol("_fn");
  context[key] = this;
  let res;
  if (args) {
    if (!Array.isArray(args)) {
      throw TypeError("the second arg is not array!");
    }
    res = context[key](...args);
  } else {
    res = context[key]();
  }
  delete context[key];
  return res;
};

var obj = {
  name: "Tom",
};

var getName = function (age, address) {
  console.log("name log: ", this.name);
  console.log("age log: ", age);
  console.log("address log: ", address);
};

getName.myApply(obj, [18, "北京"]);
