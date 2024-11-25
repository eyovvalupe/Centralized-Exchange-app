<template>
  <div class="mb-[0.32rem]" v-if="slideArr.length > 0">
    <div class="flex justify-between items-center mb-[0.24rem]">

      <div class="flex items-center gap-1">
          <div class="font-bold text-[0.32rem]">热卖</div>
          <div class="custom-heart-icon"></div>
      </div>
     
      <div class="flex items-center gap-1">
        <div
          v-for="(arr,index) in slideArr"
          :key="index"
          :class="[
            currentSlide == index ? 'bg-[#014CFA]' : 'bg-[#014CFA] opacity-20',
          ]"
          class="w-[0.12rem] h-[0.06rem] rounded-[0.2rem]"
        ></div>
      </div>
    </div>
   
    <Carousel v-bind="config" v-model="currentSlide">
      <Slide v-for="(arr,slide) in slideArr" :key="slide">
        <div class="w-full flex ml-[-0.1rem]">
          <div
            v-for="(item, i) in arr"
            :key="i"
            :class="item.ratio > 0 ? 'up_price' : 'down_price'"
            class="w-[2.22rem] h-[1.48rem] p-[0.16rem] ml-[0.1rem] rounded-[0.32rem] bg-[#F5F7FC]"
            @click="goInfo(item)"
          >
            <div class="font-medium text-[0.28rem] text-[#061023] mb-[0.1rem] text-center">
              {{ item["symbol"].length > 8 ? item["symbol"].substring(0, 8) + '...' : item["symbol"] }}
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
      </Slide>
    </Carousel>
  </div>
</template>
<script setup>
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
    market:market
  })
    .then((res) => {
      if (res.code == 200) {
        if(store.state.marketCurrent != market){
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
  store.commit("setMarketVolumeList",[])
  getData(
    marketVolumeList,
    "setMarketVolumeList",
    "volume",
    "marketVolumeList"
  );
}

if(!marketVolumeList.value.length){
  recommendLoading.value = true;
}
getData(
  marketVolumeList,
  "setMarketVolumeList",
  "volume",
  "marketVolumeList"
);

const slideArr = computed(()=>{
  const len = 3
  const val = Math.ceil(store.state.marketVolumeList.length/len)
  const arr = []
  for(let i=0;i<val;i++){
    arr.push([])
    let index = i*len
    for(let s=0;s<len;s++){
      if(store.state.marketVolumeList[index+s]){
        arr[i].push(store.state.marketVolumeList[index+s])
      }
    }
  }
  return arr
})

watch(()=>store.state.marketCurrent,()=>{
  currentSlide.value = 0
  update()
})


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

</script>
<style lang="less">
.up_price {
  color: #18b762;
}
.down_price {
  color: #e8503a;
}
.custom-heart-icon {
  width: 0.24rem;
  height: 0.28rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 14"><path d="M4.49621 13.9937C4.49621 13.9937 -1.73347 12.5172 0.936838 5.875C1.24621 6.15938 1.43371 6.65625 1.57903 6.94531C1.91496 3.4625 4.5259 3.12344 4.1509 0C5.16028 0.359375 8.34309 1.41875 8.8384 5.31719C9.3134 4.42812 10.0447 3.95469 10.5993 3.86094C10.4603 4.56094 10.6868 5.76719 11.1931 7.00156C11.9743 8.9125 12.0243 12.7156 8.08684 13.7016C8.68059 12.3188 8.91809 10.0766 5.9509 8.17656C5.4259 10.5797 2.7759 11.2188 4.49621 13.9937Z" fill="%23E53E00"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
