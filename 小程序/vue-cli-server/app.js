const Koa = require("koa");
const KoaRouter = require("koa-router");
const KoaStatic = require("koa-static");
const mockData = require("./mock.js");

const app = new Koa();
const router = new KoaRouter();

router.get("/shopList", (ctx) => {
  ctx.body = mockData;
});

router.get("/getShopInfoById", (ctx) => {
  const { id } = ctx.query;
  let item = null;
  const ind = mockData.findIndex((i) => (i.Id = id));
  if (ind > -1) {
    item = mockData[ind];
  }
  ctx.body = item || {};
});

app.use(router.routes());

const staticServer = KoaStatic(`${__dirname}/public`);
app.use(staticServer);

app.listen(8080, () => {
  console.log("开始监听页面");
});
