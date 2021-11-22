## 初始化项目

npm init

## 安装需要的包

yarn add superagent cheerio --registry=https://registry.npm.taobao.org

## 修改 package.json script

npm start: node index.js

## 访问百度，获取 html

```js
const superagent = require("superagent");
const cheerio = require("cheerio");

superagent.get("http://www.baidu.com").end((err, res) => {
  if (err) {
    console.log(`访问失败 - ${err}`);
  } else {
    console.log(res.text);
  }
});
```

## 解析获取到的 html

```js
const superagent = require("superagent");
const cheerio = require("cheerio");

superagent.get("http://www.baidu.com").end((err, res) => {
  if (err) {
    console.log(`访问失败 - ${err}`);
  } else {
    // console.log(res.text);
    const htmlText = res.text;
    const $ = cheerio.load(htmlText);
    $("meta").each((index, ele) => {
      console.log(index);
      console.log($(ele).attr("content"));
    });
  }
});
```

## 抓取百度图片

1. 检查 url

完整的 url: https://image.baidu.com/search/index?tn=baiduimage&ps=1&ct=201326592&lm=-1&cl=2&nc=1&ie=utf-8&word=%E7%8C%AB%E5%92%AA

关键 url: https://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=%E7%8C%AB%E5%92%AA

tn=baiduimage
word=encode('猫咪')
ie=utf-8 内容编码格式

2. 检查 DOM 结构

https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F06%2F20190106214108_ipsef.thumb.700_0.gif&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633051524&t=7f39759c4bd3af00832b4ac90326af7b

图片的 url 叫做 objURL 字段，是存在 json 当中的

"objURL": 'xxxxxxx', 'xx': 'xxx'

通过正则去匹配

```js
/"objURL":"(.*?)",/;
```

3. 写代码 访问百度图片

Tips: 尽可能的模拟浏览器请求，headers 尽量和浏览器一致，尤其是 Accept

```js
const headers = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,_/_;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  "sec-ch-ua":
    '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36",
};

superagent
  .get(
    `http://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=${encodeURIComponent(
      word
    )}`
  )
  .set("Accept", headers["Accept"])
  .set("Accept-Encoding", headers["Accept-Encoding"])
  .set("Accept-Language", headers["Accept-Language"])
  .set("Cache-Control", headers["Cache-Control"])
  .set("Connection", headers["Connection"])
  .set("sec-ch-ua", headers["sec-ch-ua"])
  .set("User-Agent", headers["User-Agent"])
  .end((err, res) => {
    if (err) {
      console.log(`访问失败 - ${err}`);
    } else {
      // console.log(res.text);
      const htmlText = res.text;
      const $ = cheerio.load(htmlText);
      console.log(htmlText);
    }
  });
```

4. 获取图片链接列表

```js
// console.log(res.text);
const htmlText = res.text;
// console.log(htmlText);
const imageMatches = htmlText.match(/"objURL":"(._?)",/g);
console.log(imageMatches);
// '"objURL":"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbbs.lyd.com.cn%2Fdata%2Fattachment%2Fforum%2F201310%2F30%2F131626sl0c55llelcc5e05.jpg&refer=http%3A%2F%2Fbbs.lyd.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633169321&t=382a84821de50be45d4d82143e2e435e",'
const imageUrlList = imageMatches.map((item) => {
  const imageUrl = item.match(/:"(._?)",/g);
  return RegExp.$1;
});
console.log(imageUrlList);
```

5. 获取图片的标题列表

fromPageTitle

```js
const titleMatches = htmlText.match(/"fromPageTitle":"(.*?)",/g);
const titleList = titleMatches.map((item) => {
  const imageUrl = item.match(/:"(.*?)",/g);
  return RegExp.$1;
});
```

6. 提取公共函数

```js
function getValueListByReg(str, key) {
  const reg = new RegExp(`"${key}":"(.*?)"`, "g");
  const matchResult = str.match(reg);
  const resList = matchResult.map((item) => {
    const imageUrl = item.match(/:"(.*?)"/g);
    return RegExp.$1;
  });
  return resList;
}
```

7. 去除标题中的冗余内容

```js
const titleList = getValueListByReg(htmlText, "fromPageList").map((item) =>
  item.replace("<strong>", "").replace("<\\/strong>", "")
);
```

8. 创建 images 目录存储图片

```js
function mkImageDir(pathname) {
  const fullPath = path.resolve(__dirname, pathname);

  if (fs.existsSync(fullPath)) {
    console.log(`${pathname}目录已存在，跳过此步骤`);
    return;
  }

  fs.mkdirSync(fullPath);
  console.log(`创建目录${pathname}成功`);
}
```

9. 下载图片到 images 目录

```js
function downloadImage(url, name, index) {
  const fullPath = path.join(__dirname, "images", `${index}-${name}.png`);
  if (fs.existsSync(fullPath)) {
    console.log(`文件已存在，跳过此步骤：${name}`);
  }

  superagent.get(url).end((err, res) => {
    if (err) {
      console.log("get image url error log：", err);
      return;
    }
    fs.writeFile(fullPath, res.body, "binary", (err) => {
      if (err) {
        console.log(`write ${fullPath} failed:`, err);
        return;
      }
      console.log(`下载成功 ${url}`);
    });
  });
}
```
