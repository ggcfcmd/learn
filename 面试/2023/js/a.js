function throttle(fn, wait) {
  let timer,
    last = 0;

  return function (...args) {
    const context = this;
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      fn.apply(context, args);
      last = Date.now();
    } else {
      setTimeout(() => {
        timer = fn.apply(context, args);
        last = Date.now();
        clearTimeout(timer);
      }, remaining);
    }
  };
}
