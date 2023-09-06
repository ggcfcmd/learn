function debounce(func, wait) {
  let timeout;
  return function () {
    var context = this;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply();
    }, wait);
  };
}
