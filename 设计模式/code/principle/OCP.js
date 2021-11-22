// 开闭原则(The Open/Closed Principle): 对拓展开放 对修改关闭
// 目标：已有的场景，对于需要拓展的功能进行开放，拒绝直接的功能修改

// sprint1 - 青年节活动 吃鸡要高亮 + LOL要弹出折扣
// render
if (game === "PUBG") {
  // 高亮
} else {
  // ...
}

// event
if (game === "LOL") {
  // 弹出折扣框
} else {
  // 付款
}

// sprint2 - 要对部分游戏置灰 + 其付款页面要显示停止发售(MHW)
// render
if (game === "PUBG") {
  // 高亮
} else if (game === "MHW") {
  // 灰色
} else {
  // ...
}

// event
if (game === "LOL") {
  // 弹出折扣框
} else if (game === "MHW") {
  // break + 提示停止发售
} else {
  // 付款
}

// 重构
// render
gameManager(game).setColor();

// event
gameManager(game).openDialog();

// 获取相应的game库
function gameManager(game) {
  return `${game}Manager`;
}

const LOLManager = {
  setColor() {
    // 正常
  },
  openDialog() {
    // 折扣
  },
};

const PUBGManager = {
  setColor() {
    // 高亮
  },
  openDialog() {
    // 付款
  },
};

// 重构2
// 底层实现
class Game {
  constructor(name) {
    this.name = name;
  }

  setColor(color) {
    console.log("__");
  }

  openDialog() {
    console.log("付款框");
  }
}

// 业务逻辑
class LOL extends Game {
  openDialog() {
    console.log("折扣");
  }
}

class PUBG extends Game {
  setColor() {
    console.log("高亮");
  }

  openDialog() {
    console.log("付款");
  }
}
