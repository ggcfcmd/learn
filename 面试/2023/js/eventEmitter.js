class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(name, cb) {
    if (!this.events.name) {
      this.events[name] = [];
    }
    this.events[name].push(cb);
    return this;
  }

  emit(name, ...args) {
    if (this.events[name]) {
      const cbList = this.events[name];
      cbList.forEach((cb) => {
        cb.apply(this, args);
      });
    }
    return this;
  }

  once(name, cb) {
    const fn = (...args) => {
      this.off(name);
      cb.apply(this, args);
    };
    this.on(name, fn);
    return this;
  }

  off(name) {
    delete this.events[name];
  }
}

const instance = new EventEmitter();

instance.once("click", (...args) => {
  console.log(args);
});

instance.emit("click", 1, 2, 3, [4, 5]);
