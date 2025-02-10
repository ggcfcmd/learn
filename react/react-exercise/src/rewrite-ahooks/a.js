var arr = [
  { id: 1, pid: null },
  { id: 2, pid: 1 },
  { id: 3, pid: 1 },
  { id: 4, pid: 2 },
  { id: 5, pid: 3 },
  { id: 6, pid: 4 },
];

function foo() {
  const res = [];
  const map = {};
  arr.forEach((item) => {
    const { id, pid } = item;
    if (pid === null) {
      res.push(item);
    }
    if (!map[id]) {
      map[id] = [];
    }
    if (map.hasOwnProperty(pid)) {
      map[id].push(item);
    }
  });
  console.log(map);
}
foo();
