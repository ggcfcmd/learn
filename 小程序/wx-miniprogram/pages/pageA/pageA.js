const appInstance = getApp();
console.log("我在pageA的js文件中获取到了全局数据", appInstance.globalData);

Page({
  data: {
    message: "I’m page A",
    name: "shenzn",
    age: 25,
  },
  changeMessage() {
    this.setData({
      message: "I’m pageA change message",
    });
  },
  handleClick(e) {
    console.log("糟了，被点击了");
    console.log(e);
    const { detail } = e;
    const { name, age } = detail || {};
    this.setData({ name, age });
  },
});
