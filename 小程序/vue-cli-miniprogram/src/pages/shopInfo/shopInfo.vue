<template>
  <view>
    <swiper :autoplay="true" class="swiper-content">
      <swiper-item v-for="(item, index) in info.bigImage" :key="index">
        <image class="image-content" :src="item"></image>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { get } from "../../utils/http";
export default {
  data() {
    return {
      info: {},
    };
  },
  onLoad(e) {
    console.log("routerParams log:", e);
    this.getShopInfoById(e.id);
  },
  methods: {
    async getShopInfoById(id) {
      const res = await get("getShopInfoById", { id }, {});
      console.log(res);
      if (res.statusCode !== 200) {
        return;
      }
      this.info = Object.assign({}, this.info, res.data);
    },
  },
};
</script>

<style scoped>
.swiper-content {
  height: calc(50vh);
  background-color: antiquewhite;
}

.image-content {
  display: block;
  margin: 0 auto;
  height: calc(50vh);
}
</style>
