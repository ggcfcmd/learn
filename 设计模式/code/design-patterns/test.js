class EventEmitter {
  constructor() {
    this.event = {};
  }

  on(type, cb) {
    if (!this.event[type]) {
      this.event[type] = [];
    }
    this.event[type].push(cb);
    return this;
  }

  once(type, cb) {
    if (!this.event[type]) {
      this.event[type] = [];
    }
    const func = (...args) => {
      this.off(type);
      cb.apply(this, args);
    };
    this.on(type, func);
    return this;
  }

  emit(type, ...args) {
    const cbList = this.event[type];
    if (Array.isArray(cbList) && cbList.length) {
      cbList.forEach((cb) => {
        cb.apply(this, args);
      });
    }
    return this;
  }

  off(type) {
    delete this.event[type];
    return this;
  }
}

// 观察者模式
class Subject {
  constructor() {
    this.state = null;
    this.observers = [];
  }

  setState(state) {
    this.state = state;
    this.nodifyAllObservers();
  }

  getState() {
    return this.state;
  }

  nodifyAllObservers() {
    this.observers.forEach((ob) => {
      ob.update();
    });
  }

  attach(observer) {
    this.observers.push(observer);
  }
}

class Observer {
  constructor(name, subject) {
    this.name = name;
    this.subject = subject;
    this.subject.attach(this);
  }

  update() {
    console.log(`${this.name} update, state: ${this.subject.getState()}`);
  }
}
