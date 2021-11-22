# 行为型

不同的对象之间划分责任和算法的抽象化

## 命令模式

请求以命令的形式包裹在对象中，并传给调用对象

应用场景例子：调度器在接受到一组新的数据时，解析数据，并且根据数据类型包裹在对象中传递到下级 helper，helper 再去执行相应操作

```js
// 接受者
class Receiver {
  execute() {
    console.log("角色开始奔跑");
  }
}

// 触发者
class Operator {
  constructor(command) {
    this.command = command;
  }

  run() {
    console.log("让我们跑起来");
    this.command.execute();
  }
}

// 指令器
class Command {
  constructor(receiver) {
    this.receiver = receiver;
  }

  execute() {
    console.log("执行命令");
    this.receiver.execute();
  }
}

const soldier = new Receiver();
const order = new Command(soldier);
const player = new Operator(order);
player.run();
```

## 模板模式

在模板中 定义好每个方法的执行步骤 方法本身关注于自己的事情

实际调用例子：echarts 准备工作：canvas => config => init => draw 规划顺序执行

```js
// 需求 想要吃个鸡 需要分几个步骤

class Device {
  constructor() {}

  powerOn() {
    console.log("打开电源");
  }

  login() {
    console.log("登录账号");
  }

  clickIcon() {
    console.log("点击开始游戏");
  }

  enterGame() {
    console.log("进入战场");
  }

  play() {
    this.powerOn();
    this.login();
    this.clickIcon();
    this.enterGame();
  }
}
```

## 观察者模式

当一个对象的状态发生改变的时候 所有依赖它的对象都会得到通知并被更新

```js
// 需求：通过智能家居一键开始游戏
class MediaCenter {
  constructor() {
    this.state = "";
    this.observers = [];
  }

  attach(observer) {
    this.observers.push(observer);
  }

  setState(state) {
    this.state = state;
    this.notifyAllObservers();
  }

  getState() {
    return this.state;
  }

  notifyAllObservers() {
    this.observers.forEach((ob) => {
      ob.update();
    });
  }
}

class Observers {
  constructor(name, center) {
    this.name = name;
    this.center = center;
    this.center.attach(this);
  }

  update() {
    console.log(`${this.name} update, state: ${this.center.getState}`);
  }
}

const center = new MediaCenter();
const ob1 = new Observers();
const ob2 = new Observers();
const ob3 = new Observers();
center.setState("走你");
```

## 职责链

链式调用 => 职责独立 => 顺序执行

实际应用例子：提交表单进行表单逐行校验，链式调用 validate，依次执行

```js
// 需求：成年高质量男性想要打个游戏 在家里需要过几关

class Action {
  constructor(name) {
    this.name = name;
    this.nextAction = null;
  }

  setNextAction(action) {
    this.nextAction = action;
  }

  handle() {
    console.log(`${this.name}请审批，是否可以打游戏`);
    if (this.nextAction !== null) {
      this.nextAction.handle();
    }
  }
}

const dad = new Action("爸");
const mom = new Action("妈");
const wife = new Action("夫人");

dad.setNextAction(mom);
mom.setNextAction(wife);
```

### 模式场景

· 发出指令，中间层传递命令本身，命中包含执行对象 —— 命令模式
· 通过模板定义执行顺序，做独立操作 —— 模板模式
· 通过观察者，可以让被观察值统一发生变化，触发响应依赖值的统一更新 —— 观察者模式
· 独立职责的单元通过链式执行，逐步操作流程 —— 职责链
