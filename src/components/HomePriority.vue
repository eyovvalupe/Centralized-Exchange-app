<template>
  <div class="mb-[0.32rem]" v-if="slideArr.length > 0">
    <div class="flex justify-between items-center mb-[0.24rem]">

      <div class="flex items-center gap-1">
        <div class="font-bold text-[0.32rem]">{{ $t("home.hotSale") }}</div>
        <div class="custom-heart-icon">
          <img v-lazy="getStaticImgUrl('/static/img/home/fire.svg')" alt="">
        </div>
      </div>

      <div class="flex items-center gap-1">
        <div v-for="(arr, index) in slideArr" :key="index" :class="[
          currentSlide == index ? 'bg-primary' : 'bg-primary opacity-20',
        ]" class="w-[0.12rem] h-[0.06rem] rounded-[0.2rem]"></div>
      </div>
    </div>

    <Carousel v-bind="config" v-model="currentSlide">
      <Slide v-for="(arr, slide) in slideArr" :key="slide">
        <div class="w-full flex ml-[-0.1rem]">
          <div v-for="(item, i) in arr" :key="i" :class="item.ratio > 0 ? 'up_price' : 'down_price'"
            class="w-[2.22rem] h-[1.48rem] p-[0.16rem] ml-[0.1rem] rounded-[0.32rem] bg-color2" @click="goInfo(item)">
            <div class="font-medium text-[0.28rem] text-color mb-[0.1rem] text-center">
              {{ item["symbol"].length > 8 ? item["symbol"].substring(0, 8) + '...' : item["symbol"] }}
            </div>
            <div class="flex justify-between mb-[0.1rem]">
              <div class="text-[0.24rem] font-bold">
                {{ item.price }}
              </div>
              <div class="text-[0.22rem]">
                {{ item.ratio > 0 ? "+" : ""
                }}{{ (item.ratio || 0) }}%
              </div>
            </div>
            <SparkLine v-if="item.points" :points="item.points" :ratio="item.ratio"
              :style="'width: 100%; height: 0.5rem'" :xtimes="1.5" />
          </div>
        </div>
      </Slide>
    </Carousel>
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import store from "@/store";
import Loading from "@/components/Loaidng.vue";
import { computed, watch } from "vue";
import SparkLine from "@/components/SparkLine.vue";
import { Carousel, Slide } from "vue3-carousel";
import router from "@/router";
const currentSlide = ref(0)
const config = {
  itemsToShow: 1
};

import { _sort } from "@/api/api";
const recommendLoading = ref(false)

const marketVolumeList = computed(() => store.state.marketVolumeList || []); // 活跃列表

const subs = () => {
  // 订阅ws
  store.commit("setMarketWatchKeysByPage")
  store.dispatch("subList", {});
};

const getData = (list, key, query, listKey) => {
  if (!store.state.marketCurrent) return;
  const market = store.state.marketCurrent
  let arr = []
  _sort({
    orderby: query,
    page: 1,
    market: market
  })
    .then((res) => {
      if (res.code == 200) {
        if (store.state.marketCurrent != market) {
          return
        }
        res.data = res.data.map((item) => {
          item.ratio = undefined; // 弃用接口里的该字段
          return item;
        });
        const rs = res.data.map((item) => {
          const target = list.value.find((a) => a.symbol == item.symbol);
          if (target) {
            item = {
              ...target,
              ...item,
              ratio: target.ratio,
            };
          }
          item.type = 'stock'
          return item;
        });
        arr.push(...rs);
        store.commit(key, arr || []);
        subs()
      }
    })
    .finally(() => {
      recommendLoading.value = false;
    });
};
const update = () => {
  recommendLoading.value = true;
  store.commit("setMarketVolumeList", [])
  getData(
    marketVolumeList,
    "setMarketVolumeList",
    "volume",
    "marketVolumeList"
  );
}

if (!marketVolumeList.value.length) {
  recommendLoading.value = true;
}
getData(
  marketVolumeList,
  "setMarketVolumeList",
  "volume",
  "marketVolumeList"
);

const slideArr = computed(() => {
  const len = 3
  const val = Math.ceil(store.state.marketVolumeList.length / len)
  const arr = []
  for (let i = 0; i < val; i++) {
    arr.push([])
    let index = i * len
    for (let s = 0; s < len; s++) {
      if (store.state.marketVolumeList[index + s]) {
        arr[i].push(store.state.marketVolumeList[index + s])
      }
    }
  }
  return arr
})

watch(() => store.state.marketCurrent, () => {
  currentSlide.value = 0
  update()
})


const goInfo = (item) => {
  store.commit("setCurrStockItem", item);
  setTimeout(() => {
    router.push({
      name: "tradeInfo",
      query: {
        symbol: item.symbol,
        type: "stock",
      },
    });
  }, 100);
};

</script>
<style lang="less">
.up_price {
  color: var(--ex-up-color);
}

.down_price {
  color: var(--ex-down-color);
}

.custom-heart-icon {
  width: 0.24rem;
  height: 0.28rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
