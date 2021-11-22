# 结构型

优化结构的实现方式

## 适配器模式 - adapter

适配独立模块，保证模块间的独立解耦并且连接兼容

应用场景例子：筛选器和表格，需要做一个联动，但筛选器的数据不能直接传入表格，需要做数据结构转换

```js
// 需求：买了一个港行PS，插座是国标

class HKDevice {
  constructor() {}
  getPlug() {
    return "港行双圆柱插头";
  }
}

class Target {
  constructor() {
    this.plug = new HKDevice();
  }

  getPlug() {
    return this.plug.getPlug() + "港行双圆柱转换器";
  }
}

const target = new Target();
target.getPlug();
```

## 装饰器模式

可以批量动态赋予组件功能，是可通用的

应用场景例子：目前有 button、title、icon 三个组件，希望开发一个模块，让三个组件同时具备相同功能，
有统一的能力提升，且可以动态添加功能进行拓展

```js
class Device {
  create() {
    console.log("PlayStation4");
  }
}
class Phone {
  create() {
    console.log("iphone18");
  }
}
class Decorator {
  constructor(device) {
    this.device = device;
  }
  create() {
    this.device.create();
    this.update(device);
  }

  update(device) {
    console.log(device + "pro");
  }
}

const device = new Device();
device.create();

const newDevice = new Decorator(device);
newDevice.create();
```

## 代理模式

使用代理对象与调用对象分离，不直接调用目标对象

应用场景例子：ul 中多个 li，每个 li 上的点击事件 => 利用冒泡做委托，事件绑定在 ul 上 => 代理

```js
// 需求：游戏防沉迷

class Game {
  play() {
    return "playing";
  }
}

class Player {
  constructor(age) {
    this.age = age;
  }
}

class GameProxy {
  constructor(player) {
    this.player = player;
  }

  play() {
    return this.player.age < 16 ? "too young to play" : new Game().play();
  }
}

const player = new Player(18);
const game = new GameProxy(player);

game.play();
```
