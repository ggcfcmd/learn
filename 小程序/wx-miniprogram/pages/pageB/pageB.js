const appInstance = getApp();
console.log("我在pageA的js文件中获取到了全局数据", appInstance.globalData);

Page({
  data: {
    message: "I’m page B",
  },
  changeMessage() {
    this.setData({
      message: "I’m pageB change message",
    });
  },
});
