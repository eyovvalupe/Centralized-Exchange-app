<!-- 自选 -->
<template>
    <div
    >
      <Loaidng
        v-if="
          !marketSrockRecommendList.length &&
          !marketContractRecommendList.length &&
          recommendLoading
        "
        :loading="recommendLoading"
        :type="'spinner'"
      />
      <div class="recommend_block">
        <div class="item_block" v-if="marketSrockRecommendList.length">
          <StockRecommendList
            :key="'stock'"
            :keyStr="'stock'"
            :loading="recommendLoading"
            :newState="newState"
            :flag="flag"
            @init="init"
            :list="marketSrockRecommendList"
          />
        </div>
  
        <div class="item_block" v-if="marketContractRecommendList.length">
          <StockRecommendList
            :key="'recommend'"
            :keyStr="'recommend'"
            :loading="recommendLoading"
            :newState="newState"
            :flag="flag"
            @init="init"
            :list="marketContractRecommendList"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Loaidng from "@/components/Loaidng.vue";
  import StockRecommendList from "@/components/StockRecommendList.vue";
  import router from "@/router";
  import store from "@/store";
  import { computed, onMounted, ref, watch } from "vue";
  import { _watchlist, _watchlistDefault, _add } from "@/api/api";
  import {
  showLoadingToast,
  closeToast,
  showToast,
  Tabs,
  Tab,
  Button,
} from "vant";
  
const watchList = computed(() => store.state.marketWatchList || []);
const loading = ref(true);
const totalList = ref([])
const token = computed(() => store.state.token || "");
const subs = () => {
  // 订阅 ws
  store.dispatch("subList", {
    commitKey: "setMarketWatchList",
    listKey: "marketWatchList",
  });
};

const getWatchList = () => {
  // 获取订阅列表
  loading.value = true;
  _watchlist()
    .then((res) => {
      if (res.code == 200) {
        if (watchList.value.length) {
          // 有历史数据就更新
          const rs = res.data.map((item) => {
            const target = watchList.value.find((a) => a.symbol == item.symbol);
            if (target) {
              Object.assign(target, item);
              item = target;
            }
            return item;
          });
          store.commit("setMarketWatchList", rs || []);
        } else {
          // 没有就直接提交
          store.commit("setMarketWatchList", res.data || []);
        }

        if (!res.data.length) {
          // 还没有添加自选
          setTimeout(() => {
            openRecommendList();
          }, 500);
        } else {
          // 有数据就订阅
          // setTimeout(() => {
          subs();
          // }, 1000);
        }
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
const init = () => {
  if (token.value) {
    getWatchList();
  } else {
    loading.value = false;
    // 打开推荐列表
    openRecommendList();
  }
};
const marketType = computed(() => store.getters.getMarketType);
  
  // 推荐列表
  const marketSrockRecommendList = computed(
    () => store.state.marketSrockRecommendList || []
  );
  const marketContractRecommendList = computed(
    () => store.state.marketContractRecommendList || []
  );
  const recommendLoading = ref(false);
  const openRecommendList = () => {
    recommendLoading.value = true;
    _watchlistDefault()
      .then((res) => {
        if (res.code == 200) {
          // 股票
          if (res.data?.stock) {
            const arr = res.data.stock.map((item) => {
              const target = marketSrockRecommendList.value.find(
                (a) => a.symbol == item.symbol
              );
              return target || item;
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
            const arr2 = res.data.crypto.map((item) => {
              const target = marketContractRecommendList.value.find(
                (a) => a.symbol == item.symbol
              );
              return target || item;
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
  // 推荐股票选择
  const stockList = ref([]);
  const contractList = ref([]);

  // 添加自选
  const addLoading = ref(false);
  const addOptional = () => {
    if (!token.value) return store.commit("setIsLoginOpen", true);
    if (!stockList.value.length && !contractList.value.length) return;
    const keys = [...stockList.value, ...contractList.value];
    if (addLoading.value) return;
    addLoading.value = true;
    _add({
      symbol: keys.join(","),
    })
      .then((res) => {
        if (res.code == 200) {
          showToast("添加成功");
          init();
        }
      })
      .finally(() => {
        addLoading.value = false;
      });
  };
  
  onMounted(() => {
    init();
  });
  
  store.commit("setCheckState", true);
  const newState = ref(true);
  const flag = ref(null);

  
  const jump = (name) => {
    router.push({
      name,
    });
  };
  </script>
  
  <style lang="less" scoped>
  .no_self_selection_block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 0.579rem;
    margin-bottom: 0.362rem;
    color: #a4acb9;
    font-size: 0.253rem;
    font-weight: 400;
    line-height: 0.253rem;
  
    .no_data_icon {
      width: 1.34rem;
      height: 1.16rem;
    }
  
    .text {
      margin-bottom: 0.307rem;
      font-size: 0.28rem;
      font-weight: 400;
      line-height: 0.28rem;
    }
  }
  
  .addBtn {
    color: #014cfa;
    border-color: #014cfa;
    // border-width: 10px;
    width: 1.82rem;
    height: 0.68rem;
    font-size: 0.28rem;
    font-weight: 400;
    line-height: 0.28rem;
    padding: 0;
  }
  
  .recommend_block {
    background-color: #f5f7fc;
    padding: 0.471rem 0.272rem;
    border-radius: 0.452rem;
  
    .item_block {
      margin-bottom: 0.471rem;
  
      .item_block_title {
        font-size: 0.36rem;
        font-weight: 600;
        line-height: 0.36rem;
        margin-bottom: 0.36rem;
  
        .checked_icon_blue {
          width: 0.4rem;
          height: 0.4rem;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="6" fill="%23014CFA"/><path d="M8.52645 13.3945C8.34635 13.3895 8.17542 13.3219 8.04962 13.2059L5.20301 10.6602C5.07277 10.5388 5 10.3767 5 10.208C5 10.0394 5.07277 9.87731 5.20301 9.7559C5.2686 9.69655 5.3466 9.64945 5.43253 9.61731C5.51845 9.58517 5.6106 9.56862 5.70367 9.56862C5.79674 9.56862 5.88889 9.58517 5.97481 9.61731C6.06074 9.64945 6.13874 9.69655 6.20433 9.7559L8.52645 11.8559L14.4581 7.18875C14.5229 7.12901 14.6004 7.08153 14.686 7.04912C14.7716 7.0167 14.8635 7 14.9564 7C15.0492 7 15.1412 7.0167 15.2267 7.04912C15.3123 7.08153 15.3898 7.12901 15.4547 7.18875C15.5207 7.2477 15.5731 7.31781 15.6088 7.39504C15.6446 7.47227 15.663 7.5551 15.663 7.63875C15.663 7.7224 15.6446 7.80523 15.6088 7.88246C15.5731 7.95969 15.5207 8.0298 15.4547 8.08875L9.02712 13.2059C8.89458 13.3258 8.71453 13.3937 8.52645 13.3945Z" fill="white"/></svg>');
          background-size: contain;
          background-repeat: no-repeat;
        }
        .unchecked_icon {
          width: 0.4rem;
          height: 0.4rem;
          background-color: transparent;
          border: 1px solid #d0d8e2;
          border-radius: 0.11rem;
        }
      }
    }
  }
  
  @media (min-width: 751px) {
    .one_click_to_favorite_container {
      max-width: 375px;
      overflow-y: auto;
    }
  }
  
  .one_click_to_favorite_container {
    position: fixed;
    bottom: 1.866rem;
    width: 100%;
    padding: 0 0.271rem;
    transition: all linear 3s;
    .one_click_to_favorite {
      background-color: #014cfa;
      color: #ffffff;
      
    }
  }
  
  .addBtn_container {
    margin-top: 0.4rem;
    margin-bottom: 0.1rem;
    display: flex;
    justify-content: center;
  }
  
  .search_block {
    background-color: #f4f5f7;
    // border: 1px solid #eeeff1;
    height: 0.8rem;
    border-radius: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0.32rem;
    font-size: 0.28rem;
    color: #9ea3ae;
    margin: 0.06rem 0.32rem 0 0.32rem;
  
    .search_icon {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.2rem;
    }
  }
  
  .option_tab {
    // :deep(.van-tab__panel) {
    // height: calc(var(--app-height) - 4.2rem) !important;
    // overflow-y: auto;
    // }
  
    :deep(.van-tabs__nav--line) {
      padding-bottom: 0;
      border-bottom: 1px solid #3b82f6 !important;
      margin: 0 0.32rem;
    }
  
    :deep(.van-tabs__line) {
      bottom: -1px;
    }
  }
  </style>
  