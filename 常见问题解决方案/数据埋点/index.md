# 数据埋点方案、监控方案

数据采集 ——> 上报 ——> 分析 ——> 监控

产品/数据分析定义埋点：埋点名称/埋点携带的字段/什么时候出发埋点

与前端确认当前埋点是否可行，是否可写

通常需要上报哪些信息？

1. 埋点的标识信息 eventId（埋点唯一标识） eventType（触发类型 eg：click）

pv：page view. A 用户访问页面 2 次 2pv
uv：user page view. A 用户访问页面 2 次 1uv

2. 业务自定义的信息

   如电商网站中 sku 一双鞋子 颜色：红、绿 size：大、小

   红 + 大
   红 + 小
   绿 + 大
   绿 + 小

3. 通用的设备信息/用户信息

userId (已登录)、deviceId (未登录)、useragent、timestamp、location

4.  一般怎么上报呢
    接口：api/report

    4.1 实时上报，调用 report 之后立即发送请求
    4.2 延时上报，sdk 内部统一收集业务方要上报的信息，依托于防抖、浏览器空闲时间或者在页面卸载前去统一上报，上报失败做一些补偿措施（尝试重新上报）

5.  埋点方式

    5.1 代码埋点
    5.2 无(代码)埋点 性能较差 / 无法支持过于定制的需求
    5.3 可视化埋点

## 代码埋点

错误信息大概包含哪些类别

1. js error window.addEventListener('error')
2. resource error window.addEventListener('error')
3. unhandlePromise
4. 主动上报的

## 无埋点

### 概念

监听所有事件，上报所有点击事件以及对应的事件所在的元素，最后通过后台去分析数据

常见商业解决方案：GrowingIO，神策，诸葛 IO，Heap

### 实现

1. 监听 window 元素

```js
window.addEventListener(
  "click",
  (e) => {
    const target = e.srcElement || e.target;
    const xPath = getXPath(target);

    report({ xPath });
  },
  true
);
```

2. 获取元素唯一标识 xPath

```js
function getXPath() {
  if (element.id) {
    return '//*[@id"' + element.id + '"]';
  }

  if (element == document.body) {
    return "/html/" + element.tagName.toLowerCase();
  }

  let curIndex = 1;
  let siblings = element.parentNode.childNodes;

  for (let sibling of siblings) {
    if (sibling == element) {
      return (
        getXPath(element.parentNode) +
        "/" +
        element.tagName.toLowerCase() +
        "[" +
        curIndex +
        "]"
      );
    } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
      curIndex++;
    }
  }
}
```
