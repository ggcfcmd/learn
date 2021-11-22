// 接口隔离原则(Interface Segregation Principle): 使用方不应被迫加载其不需要的方法或功能，将庞大/臃肿的接口拆分成功能相对独立多个小接口，使用方可以按需应用
// 目标：多个独立的小接口比单个大接口好用

// 需求
// 已经可以开发游戏了，需要实现游戏中台 —— 快速生产游戏
// PUBG(run shot) LOL(run mega)

class Game {
  constructor(name) {
    this.name = name;
  }

  run() {}

  shot() {}

  mega() {}
}

class PUBG extends Game {
  constructor() {
    // pubg constructor
  }
}

class LOL extends Game {
  constructor() {
    // lol constructor
  }
}

pubg = new PUBG("pubg");
pubg.run();
pubg.shot();
pubg.mega();

// 重构 —— 用多个接口替代基类，每个接口服务于一个子模块
class Game {
  constructor(name) {
    this.name = name;
  }

  run() {}
}

class PUBG extends Game {
  constructor() {}

  shot() {}
}

class LOL extends Game {
  constructor() {}

  mega() {}
}
