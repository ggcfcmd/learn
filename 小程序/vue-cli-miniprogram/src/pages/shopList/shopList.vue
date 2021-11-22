<template>
  <view>
    <view
      v-for="(item, index) in list"
      :key="index"
      @click="goShopInfo(item.Id)"
    >
      <Item
        :name="item.name"
        :imageUrl="item.thumImage"
        :rmb="item.rmb"
        :monthSall="item.monthSall"
      />
    </view>
  </view>
</template>

<script>
import Item from "./components/item/item";
import { get } from "../../utils/http";
export default {
  components: {
    Item,
  },
  data() {
    return {
      list: [],
      finishTag: true,
    };
  },
  mounted() {
    this.getShopList();
  },
  onReachBottom() {
    console.log("下拉刷新触发---");
    this.getShopList();
  },
  methods: {
    goShopInfo(id) {
      console.log("goShopInfo---");
      uni.navigateTo({
        url: `../../pages/shopInfo/shopInfo?id=${id}`,
      });
    },
    async getShopList() {
      if (!this.finishTag) {
        return;
      }
      this.finishTag = false;
      const res = await get("shopList", {}, {});
      this.finishTag = true;
      console.log("shopList data log:", res);
      if (res.statusCode !== 200) {
        uni.showToast({
          title: "请求错误",
        });
      }
      const { data } = res;
      this.list = [...this.list, ...data];
    },
  },
};
</script>

<style></style>
