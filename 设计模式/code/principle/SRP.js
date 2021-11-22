// 单一职责原则(Single Responsibility principle): 通过解耦让每一个职责更加的独立
// 目标：一个功能模块只做一件事

class PUBGManager {
  // 弹框
  openDialog() {
    // 计算金额
    setPrice();
  }
}

const game = new PUBGManager(); // < = > 计算金额 两个模块耦合
game.openDialog();

// 重构
// 业务代码
class PUBGManager {
  constructor(command) {
    this.command = command;
  }

  openDialog(price) {
    // 计算金额
    this.command.setPrice(price);
  }
}

// 底层库
class PriceManager {
  constructor() {}

  setPrice(price) {
    // 配置金额...
  }
}

const exe = new PriceManager();
const game = new PUBGManager(exe);
game.openDialog(15);
