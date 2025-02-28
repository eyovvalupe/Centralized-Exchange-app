<!-- 首页推荐 -->
<template>
  <div class="recommend_list relative">
    <div v-if="recommendLoading" class="loading_box">
      <Loading :loading="true" />
    </div>
    <Carousel v-bind="config" v-else v-model="currentSlide">
      <Slide v-for="(list, i) in slideList" :key="i">
        <div class="carousel__item" v-for="(item, index) in list" :key="index">
          <div class="w-[3.33rem] h-[1.92rem] p-[0.24rem] rounded-[0.32rem] bg-color2 relative" @click="goInfo(item)">
            <div
              class="font-medium text-[0.3rem] text-color font-medium mb-[0.15rem] flex justify-between items-center">
              {{ item.symbol }}
            </div>
            <div class="flex justify-between text-up mb-[0.24rem]">
              <div class="text-[0.28rem] font-medium">
                {{ getRealtime(item.symbol, 'price') }}
              </div>
              <div class="text-[0.28rem] font-normal">
                {{
                  getRealtime(item.symbol, 'ratio', 0) > 0
                    ? "+" + getRealtime(item.symbol, 'ratio', 0)
                    : getRealtime(item.symbol, 'ratio', 0)
                }}%
              </div>
            </div>
            <div class="flex item-center">
              <SparkLine v-if="item.points" :points="item.points" :ratio="item.ratio"
                :style="'width: 100%; height: 0.5rem'" :xtimes="1.2" />
              <div class="flex-1 float-right">
                <div
                  class="border-[0.02rem] rounded-[0.32rem] border-primary text-primary text-[0.22rem] items-center justify-center flex px-[0.2rem]"
                  style="width: max-content; height: 0.48rem; float: right;" @click.stop="collect(item)">
                  <span class="text-[0.22rem]">+{{ t('home.optional') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slide>
    </Carousel>
    <div class="carousel_pagination absolute flex gap-[0.05rem] transition-all right-0 mr-[0.32rem] mt-[0.4rem]">
      <div v-for="(item, index) in slideList" :key="index" @click="() => (currentSlide = index)"
        class="h-[0.06rem] w-[0.12rem] rounded-[0.2rem] transition-all" :class="[
          currentSlide == index ? 'bg-primary' : 'bg-primary opacity-20',
        ]"></div>
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
import eventBus from "@/utils/eventBus";
import { Carousel, Slide } from "vue3-carousel";

import "vue3-carousel/dist/carousel.css";
import { useI18n } from "vue-i18n";
import { flat } from "vant/lib/utils";

const { t } = useI18n();
const watchlist = computed(() => store.state.marketWatchList);
const isInWatchList = ref(false);
const currentSlide = ref(0);
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
const marketSrockRecommendList = computed(() => store.state.marketSrockRecommendList || [])
const marketContractRecommendList = computed(() => store.state.marketContractRecommendList || [])
const getRealtime = (symbol, k, _default = '') => {
  for (let i = 0; i < store.state.realtimeData.length; i++) {
    if (store.state.realtimeData[i].symbol == symbol) {
      return store.state.realtimeData[i][k] || _default
    }
  }
  return _default
}

const token = computed(() => store.state.token || "");

const slideList = computed(() => {
  const slides = [];
  marketSrockRecommendList.value.map((item, i) => {
    if (i < 6) {
      if (
        slides.length == 0 ||
        (slides[slides.length - 1] && slides[slides.length - 1].length == 2)
      ) {
        slides.push([item]);
      } else {
        slides[slides.length - 1].push(item);
      }
    }
  });
  marketContractRecommendList.value.map((item, i) => {
    if (i < 6) {
      if (
        slides.length == 0 ||
        (slides[slides.length - 1] && slides[slides.length - 1].length == 2)
      ) {
        slides.push([item]);
      } else {
        slides[slides.length - 1].push(item);
      }
    }
  });
  return slides;
});

const goInfo = (item) => {
  if (item.type == "stock") {
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
  } else {
    store.commit("setCurrConstract", item);
    setTimeout(() => {
      router.push({
        name: "tradeInfo",
        query: {
          symbol: item.name,
          type: "crypto",
        },
      });
    }, 100);
  }
};

// const subs = () => {
//   store.commit("setMarketWatchKeysByPage");
//   // 订阅 ws
//   store.dispatch("subList", {});
// };

const recommendLoading = ref(false);
// const openRecommendList = () => {
//   if (!slideList.value.length) {
//     recommendLoading.value = true;
//   }
//   _watchlistDefault()
//     .then((res) => {
//       if (res.code == 200) {
//         // 股票
//         if (res.data?.stock) {
//           const newarr = res.data.stock.map((item) => {
//             const target = store.state.marketSrockRecommendList.find(
//               (a) => a.symbol == item.symbol
//             );
//             return target || item;
//           });
//           const arr = newarr.map((item) => {
//             return { ...item, type: "stock" };
//           });
//           store.commit("setMarketSrockRecommendList", arr || []);
//         }

//         // 合约
//         if (res.data?.crypto) {
//           const newarr2 = res.data.crypto.map((item) => {
//             const target = store.state.marketContractRecommendList.find(
//               (a) => a.symbol == item.symbol
//             );
//             return target || item;
//           });
//           const arr2 = newarr2.map((item) => {
//             return { ...item, type: "crypto" };
//           });
//           store.commit("setMarketContractRecommendList", arr2 || []);
//         }
//         subs();
//       }
//     })
//     .finally(() => {
//       recommendLoading.value = false;
//     });
// };

const collectLoading = ref(false);

const collect = (item) => {
  collectLoading.value = false;
  isInWatchList.value = false;
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
      loadingType: "circular",
    });
    watchlist.value.map((i) => {
      if (i.symbol == item.symbol) {
        isInWatchList.value = true;
      }
    });
    if (isInWatchList.value) {
      showToast("已添加");
      return;
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

// onMounted(() => {
//   openRecommendList();
// });
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

.loading_box {
  min-height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
