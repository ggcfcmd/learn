// 依赖倒置原则(Dependence Inversion Principle): 上层业务应依赖于接口的抽象，而不依赖于具体的实现，只要接口不变，上层业务实现也不应该改变
// 目标：面向抽象进行coding，而不是对实现进行coding。降低需求与实现的耦合

// 需求
// sprint1
// 分享功能
// class Store {
//   constructor() {
//     this.share = new Share();
//   }
// }

// class Share {
//   shareTo() {
//     // 分享到不用平台
//   }
// }

// const store = new Store();
// store.share.shareTo("wx");

// // sprint2
// // 评分功能
// class Store {
//   constructor() {
//     this.share = new Share();
//     this.rate = new Rate();
//   }
// }

// class Share {
//   shareTo() {
//     // 分享到不用平台
//   }
// }

// class Rate {
//   star(stars) {
//     // 分享到不用平台
//   }
// }

// const store = new Store();
// store.rate.star("5");

// // 重构
// // 目标：暴露挂载 => 动态挂载
class Rate {
  constructor(name) {
    this.name = name;
  }

  init(store) {
    store.rate = this;
  }

  logName() {
    console.log(this.name);
  }

  star(stars) {
    // 评分
  }
}

class Store {
  static modules = new Map();
  constructor() {
    for (let module of Store.modules.values()) {
      module.init(this);
    }
  }

  static inject(module) {
    Store.modules.set(module.constructor.name, module);
  }
}

class Share {
  init(store) {
    store.share = this;
  }

  shareTo(platform) {
    // 分享到不同平台
  }
}

// 依次注册完所有模块
const rate1 = new Rate("shenzn");
Store.inject(rate1);
const rate2 = new Rate("handy");
Store.inject(rate2);

// 初始化
const store = new Store();
store.rate.logName();
