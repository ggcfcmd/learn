# 项目起因

当前系统只有座席端支持呼叫功能，对于只想集成核心呼叫功能的客户来说，没有很合适的方案，这种前提下，插件版工具条应运而生，为只想拥有核心呼叫功能的客户提供一种轻量级的集成方案

## 实现方案

通过将 vue 实例挂载到 dom 节点的方式将工具条集成到客户系统中，传入一个 dom 节点作为最终要挂载到的那个节点（不传默认挂到 body 下），创建一个 div 挂载到传入的那个 dom 节点上，再通过$mount()将刚创建的那个 div 替换为工具条实例，在生成实例时挂载事件监听调度中心，使用单例模式防止工具条实例创建多次，将必要参数挂载到 Vue prototype 上

```js
class ClinkToolbar {
  constructor(option, dom, cb) {
    // 挂载事件监听调度中心
    this.userCustomEvent = new UserCustomEvent();
    // 单例模式 防止工具条实例多次创建
    if (!ClinkToolbar.instance) {
      ClinkToolbar.instance = this;
      ClinkToolbar.renderDom(option, dom, cb);
    }
    return ClinkToolbar.instance;
  }
  // 渲染vue
  static renderDom(options, dom, cb) {
    // 先判断参数
    if (!options) {
      console.log("缺少参数");
      return;
    }
    // 1.创建挂载节点
    const outer = document.createElement("div");
    outer.setAttribute("id", "ClinkToolbar");
    if (dom && dom.nodeType == Node.ELEMENT_NODE) {
      dom.appendChild(outer);
    } else {
      document.body.appendChild(outer);
    }
    // 2.传入的参数绑定到全局，方便统一调用
    Vue.prototype.options = options || {};
    // 3.绑定成功的回调，完成加载后，通知用户
    Vue.prototype.$successCb = cb;
    // 4.第三方事件对象挂载到Vue全局
    Vue.prototype._userCustomEvent = ClinkToolbar.instance.userCustomEvent;
    // vue2.0写法
    new Vue({
      render: (h) => h(TinetToolbar),
    }).$mount("#ClinkToolbar");
  }

  setLoginNecessaryParams(options) {
    Vue.prototype._loginNecessaryParams = options;
    loginParamsEvent.$emit("handleLoginParams");
  }
}
```
