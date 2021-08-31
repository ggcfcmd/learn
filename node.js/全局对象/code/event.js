class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 触发事件
  emit(name, ...args) {
    if (this.events[name]) {
      const cbList = this.events[name];
      cbList.forEach((cb) => {
        cb.apply(this, args);
      });
    }
    // 返回this即返回当前实例以支持链式调用
    return this;
  }

  // 创建监听事件
  on(name, cb) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(cb);
    return this;
  }

  // 创建只监听一次的事件
  once(name, cb) {
    const func = (...args) => {
      this.off(name);
      cb.apply(this, args);
    };
    this.on(name, func);
    return this;
  }

  // 注销事件
  off(name) {
    delete this.events[name];
  }
}

const event1 = new EventEmitter();

event1.on("log", (data) => {
  console.log(data);
});

event1.emit("log", "111");

console.log("222");
