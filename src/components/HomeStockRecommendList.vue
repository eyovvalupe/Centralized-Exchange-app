<!-- 首页推荐 -->
<template>
  <div class="recommend_list relative">
    <Loading v-show="props.loading" />
    <Carousel v-bind="config" v-model="currentSlide">
      <Slide v-for="slide in 2" :key="slide">
        <div class="carousel__item">
          <div
            class="w-[3.33rem] h-[1.92rem] p-[0.24rem] rounded-[0.32rem] bg-[#F5F7FC] relative"
            v-if="!props.loading"
          >
            <div
              class="font-medium text-[0.3rem] text-[#061023] font-medium mb-[0.15rem] flex justify-between items-center"
            >
              {{ totalList[slide].symbol }}
            </div>
            <div class="flex justify-between text-[#18B762] mb-[0.24rem]">
              <div class="text-[0.28rem] font-medium">
                {{ totalList[slide].price }}
              </div>
              <div class="text-[0.28rem] font-normal">
                {{
                  ((totalList[slide].ratio || 0) * 100).toFixed(2) > 0
                    ? "+" + ((totalList[slide].ratio || 0) * 100).toFixed(2)
                    : ((totalList[slide].ratio || 0) * 100).toFixed(2)
                }}%
              </div>
            </div>
            <div class="flex justify-between item-center">
              <SparkLine
                v-if="totalList[slide].points"
                :points="totalList[slide].points"
                :ratio="totalList[slide].ratio"
                :style="'width: 100%; height: 0.5rem'"
                :xtimes="1.2"
              />
              <div
                class="border-[0.02rem] rounded-[0.32rem] border-[#014CFA] text-[#014CFA] text-[0.22rem] items-center justify-center flex"
                style="width: 1.4rem; height: 0.48rem"
              >
                <span class="text-[0.22rem]" @click="add(totalList[slide])"
                  >+自选</span
                >
              </div>
            </div>
          </div>
          <div
            class="w-[3.33rem] h-[1.92rem] p-[0.24rem] rounded-[0.32rem] bg-[#F5F7FC] relative"
            v-if="!props.loading"
          >
            <div
              class="font-medium text-[0.3rem] text-[#061023] font-medium mb-[0.15rem] flex justify-between items-center"
            >
              {{ totalList[slide].symbol }}
            </div>
            <div class="flex justify-between text-[#18B762] mb-[0.24rem]">
              <div class="text-[0.28rem] font-medium">
                {{ totalList[slide].price }}
              </div>
              <div class="text-[0.28rem] font-normal">
                {{
                  ((totalList[slide].ratio || 0) * 100).toFixed(2) > 0
                    ? "+" + ((totalList[slide].ratio || 0) * 100).toFixed(2)
                    : ((totalList[slide].ratio || 0) * 100).toFixed(2)
                }}%
              </div>
            </div>
            <div class="flex justify-between item-center">
              <SparkLine
                v-if="totalList[slide].points"
                :points="totalList[slide].points"
                :ratio="totalList[slide].ratio"
                :style="'width: 100%; height: 0.5rem'"
                :xtimes="1.2"
              />
              <div
                class="border-[0.02rem] rounded-[0.32rem] border-[#014CFA] text-[#014CFA] text-[0.22rem] items-center justify-center flex"
                style="width: 1.4rem; height: 0.48rem"
              >
                <span class="text-[0.22rem]" @click="add(totalList[slide])"
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
import { Button, showToast, showLoadingToast, closeToast } from "vant";
import store from "@/store";
import router from "@/router";
import { _add, _del } from "@/api/api";
import { defineComponent } from "vue";
import { Carousel, Navigation, Slide, Pagination } from "vue3-carousel";

import "vue3-carousel/dist/carousel.css";
import { breakpointsTailwind } from "@vueuse/core";

const emits = defineEmits(["init", "addWatchList"]);
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

const add = (item) => {
  emits("addWatchList", item);
};

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

const updown = (item) => {
  if (item.ratio === undefined) return 0;
  return item.ratio > 0 ? 1 : -1;
};

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
console.log(totalList.value);

const loading = ref(false);
const disabled = computed(
  () => !checkedList.value.some((item) => item == true)
);

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

// const collectLoading = ref(false);
// const reqMap = {
//   0: _add,
//   1: _del,
// };

// const collect = (item) => {
//   if (!token.value) {
//     store.commit("setIsLoginOpen", true);
//     eventBus.on("loginSuccess", () => {
//       eventBus.off("loginSuccess");
//     });
//   } else {
//     if (collectLoading.value) return;
//     collectLoading.value = true;
//     if (!reqMap[item.watchlist || 0]) return (collectLoading.value = false);
//     showLoadingToast({
//       duration: 0,
//       loadingType: "spinner",
//     });
//     reqMap[item.watchlist || 0]({
//       symbol: item.symbol,
//     })
//       .then((res) => {
//         if (res.code == 200) {
//           setTimeout(() => {
//             showToast(item.watchlist ? "移除成功" : "添加成功");
//           }, 300);
//           const i = props.list.find((a) => a.symbol == item.symbol);
//           if (i) {
//             i.watchlist = i.watchlist == 1 ? 0 : 1;
//             emits("change", props.list);
//           }
//         }
//       })
//       .finally(() => {
//         closeToast();
//         collectLoading.value = false;
//       });
//   }
// };
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
