Function.prototype.myBind = function (...args) {
  const _self = this;
  console.log("_self log: ", this);
  const thisArgs = args.shift();
  return function (...fnArgs) {
    return _self.apply(thisArgs, args.concat(fnArgs));
  };
};

const name = "Jack";
const obj = {
  name: "Tom",
};
function foo(age, address) {
  console.log(this.name);
  console.log(age);
  console.log(address);
}

var bar = foo.myBind(obj);
bar(18, "北京");
