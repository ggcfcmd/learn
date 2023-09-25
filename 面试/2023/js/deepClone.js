const deepClone = function (target, map = new WeakMap()) {
  if (target && typeof target === "object") {
    const res = target instanceof Array ? [] : {};
    if (map.has(target)) {
      return map.get(target);
    }
    map.set(target, res);
    for (const key in target) {
      res[key] = deepClone(target[key], map);
    }
    return res;
  } else {
    return target;
  }
};

const target = {
  field1: 1,
  field2: "aaa",
  field3: ["a", "b", "c"],
  field4: {
    name: "Jack",
  },
};
target.target = target;
const copy = deepClone(target);

console.log(copy);
console.log(copy.target === target.target);
