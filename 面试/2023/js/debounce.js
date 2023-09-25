// 对于频繁触发的事件，单位时间内没有再触发才执行，如果事件触发后在单位时间内再次触发事件，则重新计时
// 使用计时器实现，触发事件时生成一个单位时间后执行的setTimeout 单位时间内再次触发 重新生成
// immediate： 是否立即执行，执行完之后单位时间内无法再执行
function debounce(func, wait, immediate) {
  let timeout;
  return function (...args) {
    const context = this;

    if (timeout) {
      clearTimeout(timeout);
    }
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) {
        func.apply(context, args);
      }
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
}
