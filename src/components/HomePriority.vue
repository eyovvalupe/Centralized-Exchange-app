<template>
  <div class="mb-[0.32rem]" v-if="marketCountryStockList.length > 0">
    <div class="flex justify-between items-center mb-[0.2rem]">
      <div class="font-bold text-[0.32rem]">优选</div>
      <div class="flex items-center gap-1">
        <div
          class="bg-[#014CFA] w-[0.12rem] h-[0.06rem] rounded-[0.2rem]"
        ></div>
        <div
          class="bg-[#cad7f333] w-[0.12rem] h-[0.06rem] rounded-[0.2rem]"
        ></div>
      </div>
    </div>
    <div class="flex justify-between">
      <div
        v-for="(item, i) in marketCountryStockList"
        :key="i"
        :class="item.ratio > 0 ? 'up_price' : 'down_price'"
        class="w-[2.22rem] h-[1.48rem] p-[0.16rem] rounded-[0.32rem] bg-[#F5F7FC]"
        @click="goInfo(item)"
      >
        <div class="font-medium text-[0.28rem] mb-[0.1rem] text-center">
          {{ item.symbol }}
        </div>
        <div class="flex justify-between mb-[0.1rem]">
          <div class="text-[0.24rem] font-bold">
            {{ item.price }}
          </div>
          <div class="text-[0.22rem]">
            {{ item.ratio > 0 ? "+" : ""
            }}{{ ((item.ratio || 0) * 100).toFixed(2) }}%
          </div>
        </div>
        <SparkLine
          v-if="item.points"
          :points="item.points"
          :ratio="item.ratio"
          :style="'width: 100%; height: 0.5rem'"
          :xtimes="1.5"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import store from "@/store";
import { onMounted } from "vue";
import SparkLine from "@/components/SparkLine.vue";
import router from "@/router";

const marketCountryStockList = computed(
  () => store.state.marketCountryStockList || []
);

const goInfo = (item) => {
  store.commit("setCurrStock", item);
  setTimeout(() => {
    router.push({
      name: "market_info",
      query: {
        symbol: item.symbol,
        type: "stock",
      },
    });
  }, 100);
};

onMounted(() => {
  console.log(marketCountryStockList.value);
});
</script>
<style lang="less">
.up_price {
  color: #18b762;
}
.down_price {
  color: #e8503a;
}
</style>
