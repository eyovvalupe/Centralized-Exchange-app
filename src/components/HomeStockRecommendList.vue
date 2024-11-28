<!-- 首页推荐 -->
<template>
  <div class="recommend_list relative">
    <Loading v-show="props.loading" />
    <Carousel v-bind="config" v-model="currentSlide" >
      <Slide v-for="slide in 2" :key="slide">
        <div class="carousel__item">
          <div
            class="w-[3.33rem] h-[1.92rem] p-[0.24rem] rounded-[0.32rem] bg-[#F5F7FC] relative"
            v-if="!props.loading"
            @click="goInfo(totalList[slide * 2 - 1])"
          >
            <div
              class="font-medium text-[0.3rem] text-[#061023] font-medium mb-[0.15rem] flex justify-between items-center"
            >
              {{ totalList[slide * 2 - 1].symbol }}
            </div>
            <div class="flex justify-between text-[#18B762] mb-[0.24rem]">
              <div class="text-[0.28rem] font-medium">
                {{ totalList[slide * 2 - 1].price }}
              </div>
              <div class="text-[0.28rem] font-normal">
                {{
                  (totalList[slide * 2 - 1].ratio || 0) > 0
                    ? "+" + (totalList[slide * 2 - 1].ratio || 0) 
                    : (totalList[slide * 2 - 1].ratio || 0)
                }}%
              </div>
            </div>
            <div class="flex justify-between item-center">
              <SparkLine
                v-if="totalList[slide * 2 - 1].points"
                :points="totalList[slide * 2 - 1].points"
                :ratio="totalList[slide * 2 - 1].ratio"
                :style="'width: 100%; height: 0.5rem'"
                :xtimes="1.2"
              />
              <div
                class="border-[0.02rem] rounded-[0.32rem] border-[#014CFA] text-[#014CFA] text-[0.22rem] items-center justify-center flex"
                style="width: 1.5rem; height: 0.48rem"
                @click.stop="collect(totalList[slide * 2 - 1])"
              >
                <span class="text-[0.22rem]"
                  >+自选</span
                >
              </div>
            </div>
          </div>
          <div
            class="w-[3.33rem] h-[1.92rem] p-[0.24rem] rounded-[0.32rem] bg-[#F5F7FC] relative"
            v-if="!props.loading"
            @click="goInfo(totalList[slide * 2])"
          >
            <div
              class="font-medium text-[0.3rem] text-[#061023] font-medium mb-[0.15rem] flex justify-between items-center"
            >
              {{ totalList[slide * 2].symbol }}
            </div>
            <div class="flex justify-between text-[#18B762] mb-[0.24rem]">
              <div class="text-[0.28rem] font-medium">
                {{ totalList[slide * 2].price }}
              </div>
              <div class="text-[0.28rem] font-normal">
                {{
                  (totalList[slide * 2].ratio || 0)  > 0
                    ? "+" + (totalList[slide * 2].ratio || 0)
                    : (totalList[slide * 2].ratio || 0) 
                }}%
              </div>
            </div>
            <div class="flex justify-between item-center">
              <SparkLine
                v-if="totalList[slide * 2].points"
                :points="totalList[slide * 2].points"
                :ratio="totalList[slide * 2].ratio"
                :style="'width: 100%; height: 0.5rem'"
                :xtimes="1.2"
              />
              <div
                class="border-[0.02rem] rounded-[0.32rem] border-[#014CFA] text-[#014CFA] text-[0.22rem] items-center justify-center flex"
                style="width: 1.4rem; height: 0.48rem"
                @click.stop="collect(totalList[slide * 2])"
              >
                <span class="text-[0.22rem]"
                  >+自选</span
                >
              </div>
            </div>
          </div>
        </div>
      </Slide>
    </Carousel>
    <div
        class="carousel_pagination absolute flex gap-[0.05rem] transition-all right-0 mr-[0.32rem] mt-[0.4rem]"
      >
        <div
          v-for="(index) in 2"
          :key="index"
          @click="() => (currentSlide = index)"
          class="h-[0.06rem] w-[0.12rem] rounded-[0.2rem] transition-all"
          :class="[
            currentSlide+1 == index ? 'bg-[#014CFA]' : 'bg-[#014CFA] opacity-20',
          ]"
        ></div>
      </div>
  </div>
</template>

<script setup>
import SparkLine from "@/components/SparkLine.vue";
import Loading from "@/components/Loaidng.vue";
import { ref, computed, onMounted } from "vue";
import { showToast, showLoadingToast, closeToast } from "vant";
import store from "@/store";
import router from "@/router";
import { _add, _del, _watchlistDefault } from "@/api/api";
import eventBus from '@/utils/eventBus'
import { Carousel, Slide } from "vue3-carousel";

import "vue3-carousel/dist/carousel.css";
import { fixLittleNum } from "@/utils/fixLittleNum";

const emits = defineEmits(["init", "addWatchList"]);
const watchlist = computed(() => store.state.marketWatchList)
const isInWatchList = ref(false)
const currentSlide = ref(0)
const config = {
  itemsToShow: 2,
  // snapAlign: 'center',
  breakpoints: {
    200: {
      itemsToShow: 1,
      // snapAlign: 'center',
    },
    // 400px and up
    400: {
      itemsToShow: 1,
      snapAlign: "start",
    },
  },
};

const token = computed(() => store.state.token || "");

const props = defineProps({
  keyStr: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: true,
  },
  newState: {
    type: Boolean,
    default: true,
  },
  flag: {
    type: Boolean,
    default: true,
  },
});

const totalList = ref([]);
const marketSrockRecommendList = computed(
  () => store.state.marketSrockRecommendList
);
const marketContractRecommendList = computed(
  () => store.state.marketContractRecommendList
);
totalList.value = [
  ...marketSrockRecommendList.value,
  ...marketContractRecommendList.value,
];

const goInfo = (item) => {
  if (item.type == "stock") {
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
  } else {
    store.commit("setCurrConstract", item);
    setTimeout(() => {
      router.push({
        name: "market_info",
        query: {
          symbol: item.name,
          type: "crypto",
        },
      });
    }, 100);
  }
};

const recommendLoading = ref(false);
const openRecommendList = () => {
  recommendLoading.value = true;
  _watchlistDefault()
    .then((res) => {
      if (res.code == 200) {
        // 股票
        if (res.data?.stock) {
          const newarr = res.data.stock.map((item) => {
            const target = marketSrockRecommendList.value.find(
              (a) => a.symbol == item.symbol
            );
            return target || item;
          });
          const arr = newarr.map((item) => {
            return { ...item, type: "stock" };
          });
          store.commit("setMarketSrockRecommendList", arr || []);
          setTimeout(() => {
            store.dispatch("subList", {
              commitKey: "setMarketSrockRecommendList",
              listKey: "marketSrockRecommendList",
            });
          }, 500);
        }

        // 合约
        if (res.data?.crypto) {
          const newarr2 = res.data.crypto.map((item) => {
            const target = marketContractRecommendList.value.find(
              (a) => a.symbol == item.symbol
            );
            return target || item;
          });
          const arr2 = newarr2.map((item) => {
            return { ...item, type: "crypto" };
          });
          store.commit("setMarketContractRecommendList", arr2 || []);
          setTimeout(() => {
            store.dispatch("subList", {
              commitKey: "setMarketContractRecommendList",
              listKey: "marketContractRecommendList",
            });
          }, 1000);
        }
      }
    })
    .finally(() => {
      recommendLoading.value = false;
    });
};

const collectLoading = ref(false);

const collect = (item) => {
  collectLoading.value = false
  isInWatchList.value = false
  if (!token.value) {
    store.commit("setIsLoginOpen", true);
    eventBus.on("loginSuccess", () => {
      eventBus.off("loginSuccess");
    });
  } else {
    if (collectLoading.value) return;
    // alert('dffdf')
    collectLoading.value = true;
    showLoadingToast({
      duration: 0,
      loadingType: "spinner",
    });
    watchlist.value.map(i => {
      if (i.symbol == item.symbol) {
        isInWatchList.value = true
      }
    })
    if (isInWatchList.value) {
      showToast("已添加");
      return ;
    } else {
      _add({
      symbol: item.symbol,
    })
      .then((res) => {
        if (res.code == 200) {
          setTimeout(() => {
            showToast("添加成功");
          }, 300);
        }
      })
      .finally(() => {
        closeToast();
        collectLoading.value = false;
      });
    }
    
  }
};

onMounted(() => {
  openRecommendList()
})
</script>

<style>
  .recommend_list .carousel__item {
    display: flex;
    width: 6.87rem;
    justify-content: space-between;
  }

  .recommend_list .carousel_pagination {
    position: absolute;
    top: -0.8rem;
    left: calc(50% - 0.13rem);
  }
</style>
