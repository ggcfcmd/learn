# 使用 node.js 实现一个带 CLI 的爬虫应用

## 什么是爬虫

自动浏览万维网的网络机器人

- 网络引擎使用爬虫更新自己的网站内容，以及对其他网站的索引

* 个人使用爬虫去获取网站内容

## 爬虫可以肆无忌惮的爬取所有网站的内容么？

不是的

爬虫访问网站会消耗对方网站的流量、带宽、服务器资源

robots.txt

1. 放在哪里

存在网站的根目录，是一个 ascii 编码的文件

2. robots.txt 的作用是什么？

指定当前网站哪些内容能爬，哪些不能爬

3. 允许所有爬虫？

User-agent: \*
Disallow:

4. 允许指定的爬虫

User-agent: baidu_spider
Allow:

5. 拦截所有的爬虫

User-agent: \*
Disallow: /

## 如何开始一个爬虫应用？

1. 确定要爬取的网站/页面

2. 分析网站的数据接口以及 DOM 结构

3. 确定技术选型

   - 模拟浏览器端请求
     - superagent

   * 解析 DOM
     - cheerio 类似于 jquery 的 api
     - jsdom
