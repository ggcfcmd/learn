# 创建型模式

解决在创建对象阶段的问题，规范创建步骤

## 工厂模式

隐藏创建过程，暴露共同接口

适合批量生产用类型应用来满足频繁使用同一种类型需求时

```js
// 需求：游戏商店里下载初始化游戏，并且可以运行游戏

class Shop {
  create(name) {
    return new Game(name);
  }
}

class Game {
  constructor(name) {
    this.name = name;
  }

  init() {
    console.log("init");
  }

  run() {
    console.log("run");
  }
}

const shop = new Shop();
shop.create("pubg");
const pubg = new Game("pubg");
```

## 建造者模式

将复杂对象拆分为简单模块，独立执行 => 注重过程与搭配

模块化拆分一个大模块，同时使模块间独立解耦分工

```js
// 需求：优惠套餐单元 商品 + 皮肤 进行打折售卖

// 每个模块独立解耦，而建造者负责创建串联整体系统
// 行为类 Skin同理
class Product {
  constructor(name) {
    this.name = name;
  }

  init() {
    console.log("Product init");
  }
}

class Skin {
  constructor(name) {
    this.name = name;
  }

  init() {
    console.log("Skin init");
  }
}

class Shop {
  constructor() {
    this.package = "";
  }

  create(name) {
    this.package = new PackageBuilder(name);
  }

  getGamePackage() {
    return this.package.getPackage();
  }
}

// 构建类(创建者) 将多个简单行为类整合起来
class PackageBuilder {
  constructor(name) {
    this.game = new Product(name);
    this.skin = new Skin(name);
  }

  getPackage() {
    return this.game.init() + this.skin.init();
  }
}
```

## 单例模式

全局只有一个实例 注重统一一体化

```js
class PlayStation {
  constructor() {
    this.state = "on";
    this.instance;
  }

  open() {
    if (this.state === "on") {
      console.log("已经在happy了");
      return;
    }
    this.state = "on";
    console.log("开始happy");
  }

  shutdown() {
    if (this.state == "off") {
      console.log("已经关闭");
      return;
    }
    this.state = "off";
    console.log("已关机，请放心");
  }

  static getInstance() {
    return (function () {
      if (!this.instance) {
        this.instance = new PlayStation();
      }
    })();
  }
}

const ps1 = PlayStation.getInstance();
ps1.play();

const ps2 = PlayStation.getInstance();
ps2.play();
```
