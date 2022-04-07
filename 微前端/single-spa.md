# 概念

针对组合式应用路由分发的微前端有两种实现方案，其一是 qiankun（基于 single-spa 实现的升级版），另一种就是 single-spa

## 使用（基于 vue 实现）

### 子应用

1. 在子应用项目中引入 single-spa-vue

npm install single-spa-vue --save

2. 在子类的 main.js 中加入 single-spa 对应的生命周期

子应用想要被 single-spa 接入 必须要导出 bootstrap、mount、unmount 三个生命周期

```js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import singleSpaVue from "single-spa-vue";

Vue.config.productionTip = false;

const appOptions = {
  el: "#microApp",
  router,
  render: (h) => h(App),
};

// 支持应用独立运行、部署，不依赖于基座应用
if (!process.env.isMicro) {
  delete appOptions.el;
  new Vue(appOptions).$mount("#app");
}
// 基于基座应用，导出生命周期函数
const vueLifecycle = singleSpaVue({
  Vue,
  appOptions,
});
// 启动生命周期
export function bootstrap(props) {
  console.log("app2 bootstrap");
  return vueLifecycle.bootstrap(() => {});
}
// 挂载生命周期
export function mount(props) {
  console.log("app2 mount");
  return vueLifecycle.mount(() => {});
}
// 卸载生命周期
export function unmount(props) {
  console.log("app2 unmount");
  return vueLifecycle.unmount(() => {});
}
```

3. 新建 vue.config 文件，并设置导出格式为 umd
