// 首次触发会立即执行 其余触发的事件会按时间间隔执行
function throttle(func, interval) {
  let timer;
  let startTime = 0;

  return function (...args) {
    let curTime = Date.now();
    clearTimeout(timer);
    // 还剩下多少时间来执行本次触发函数 用时间间隔减去当前时间和上次执行时间的差值
    // 因为只要触发执行就会重置 startTime，所以将 startTime 设为 0 来实现首次触发立即执行
    let remaining = interval - (curTime - startTime);
    // 如果是负数 说明本次触发距离上次触发的时间间隔大于默认时间间隔 此时立即执行
    if (remaining <= 0) {
      func.apply(this, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(() => {
        func.apply(this, args);
        startTime = Date.now();
      }, remaining);
    }
  };
}
