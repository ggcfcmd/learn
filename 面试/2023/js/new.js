function myNew(Fn, ...args) {
  const obj = Object.create(Fn.prototype);
  const res = Fn.apply(obj, args);
  return typeof res === "object" && res ? res : obj;
}

function Foo(name) {
  this.name = name;
}

const instance = myNew(Foo, "shenzn");
console.log(instance);
console.log(instance.name);
console.log(instance.hasOwnProperty("name"));
