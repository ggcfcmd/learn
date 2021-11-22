const superagent = require("superagent");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");

const cliProgress = require("cli-progress");
const bar1 = new cliProgress.SingleBar(
  {
    cleanOnComplete: false,
  },
  cliProgress.Presets.shades_classic
);

let total = 0;
let succeed = 0;

const word = "猫咪";

const headers = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  "sec-ch-ua":
    '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36",
};

function getValueListByReg(str, key) {
  const reg = new RegExp(`"${key}":"(.*?)"`, "g");
  const matchResult = str.match(reg);
  const resList = matchResult.map((item) => {
    const imageUrl = item.match(/:"(.*?)"/g);
    return RegExp.$1;
  });
  return resList;
}

// 创建文件目录
function mkImageDir(pathname) {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(__dirname, pathname);

    if (fs.existsSync(fullPath)) {
      return reject(`${pathname}目录已存在，跳过此步骤`);
    }

    fs.mkdirSync(fullPath);
    console.log(`创建目录${pathname}成功`);
    return resolve();
  });
}

function downloadImage(url, name, index) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, "images", `${index}-${name}.png`);
    if (fs.existsSync(fullPath)) {
      return reject(`文件已存在，跳过此步骤：${name}`);
    }

    superagent.get(url).end((err, res) => {
      if (err) {
        return reject("get image url error log：", err);
      }
      fs.writeFile(fullPath, res.body, "binary", (err) => {
        if (err) {
          return reject(`write ${fullPath} failed:`, err);
        }
        return resolve();
      });
    });
  });
}

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
      const htmlText = res.text;
      // '"objURL":"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbbs.lyd.com.cn%2Fdata%2Fattachment%2Fforum%2F201310%2F30%2F131626sl0c55llelcc5e05.jpg&refer=http%3A%2F%2Fbbs.lyd.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633169321&t=382a84821de50be45d4d82143e2e435e",'
      const imageUrlList = getValueListByReg(htmlText, "objURL");

      const titleList = getValueListByReg(htmlText, "fromPageTitle").map(
        (item) => item.replace("<strong>", "").replace("<\\/strong>", "")
      );
      console.log(imageUrlList);
      console.log(titleList);

      total = titleList.length;

      // 创建存储图片文件
      mkImageDir("images");

      bar1.start(total, 0);

      imageUrlList.forEach((url, index) => {
        const promise = downloadImage(url, titleList[index], index);
        promise.then(() => {});
      });
    }
  });
