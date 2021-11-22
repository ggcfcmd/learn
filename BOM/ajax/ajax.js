const xhr = new XMLHttpRequest();

xhr.open("GET", "http://domain/service");
xhr.setRequestHeader("withCredentials", "true");

xhr.onreadystatechange = function () {
  if (xhr.readyState !== 4) {
    return;
  }

  if (xhr.status === 200) {
    console.log(xhr.responseText);
  } else {
    console.error(
      `HTTP error, status=${xhr.status}, errorText=${xhr.statusText}`
    );
  }
};

xhr.timeout = 3000;
xhr.ontimeout = () => {
  console.log("当前请求超时啦！");
};

xhr.upload.onprogress = (p) => {
  const percent = Math.round((p.loaded / p.total) * 100 + "%");
};

xhr.send();

// fetch本身不支持超时设置
function fetchTimeout(url, init, timeout = 3000) {
  return new Promise((resolve, reject) => {
    fetch(url, init).then(resolve).catch(reject);
    setTimeout(reject, timeout);
  });
}

const controller = new AbortController();

fetch("http://domain/service", {
  method: "GET",
  credentials: "same-origin",
  signal: controller.signal,
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("http error");
  })
  .then((json) => {
    console.log(json);
  })
  .catch((err) => {
    console.error(err);
  });

// 中断所有signal 为controller.signal的请求
controller.abort();
