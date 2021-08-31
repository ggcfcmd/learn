class BaseRouter {
  constructor() {
    this.routes = {}; // 存储path以及callback的对应关系
    this.history = [];
    this.isBack = false;
    this.isFirstLoad = true;
    this.refresh = this.refresh.bind(this);
    window.addEventListener("load", this.refresh); // 处理页面的首次加载
    window.addEventListener("hashchange", this.refresh);
  }

  route(path, callback) {
    this.routes[path] = callback || function () {};
  }

  refresh() {
    const path = `/${location.hash.slice(1) || ""}`;
    console.log(location.hash, path);
    const cb = this.routes[path];
    cb && cb();
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
