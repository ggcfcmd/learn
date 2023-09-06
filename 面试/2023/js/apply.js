Function.prototype.myApply = function (thisArg) {
  const context = thisArg || window;
  context._fn = this;
  const args = [...arguments].slice(1);
  const res = context._fn(...args);
  delete context._fn;
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
