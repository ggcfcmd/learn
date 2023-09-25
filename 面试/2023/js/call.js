Function.prototype.myCall = function (thisArg, ...args) {
  const context = Object(thisArg) || window;
  const key = Symbol("_fn");
  context[key] = this;
  // const res = eval("context[key](" + args + ")");
  let res;
  if (args) {
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

getName.myCall(obj, 18, "北京");
