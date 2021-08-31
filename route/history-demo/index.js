class BaseRouter {
  constructor() {
    this.routes = {}; // 存储path以及callback的对应关系
    this.bindPopState = this.popState.bind(this);
    this.bindPopState();
  }

  init(path) {
    window.history.replaceState({ path }, null, path);
    this.execCallbackByPath(path);
  }

  route(path, callback) {
    this.routes[path] = callback || function () {};
  }

  popState() {
    window.addEventListener("popstate", (e) => {
      const path = e.state && e.state.path;
      console.log(`in popstate listener path=${path}`);
      this.execCallbackByPath(path);
    });
  }

  execCallbackByPath(path) {
    const cb = this.routes[path];
    if (cb) {
      cb();
    }
  }
}

const body = document.querySelector("body");

function changeBgColor(color) {
  body.style.backgroundColor = color;
}

const router = new BaseRouter();

router.route("/", function () {
  changeBgColor("white");
});

router.route("/green", function () {
  changeBgColor("green");
});

router.route("/gray", function () {
  changeBgColor("gray");
});
