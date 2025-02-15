<!-- 自选 -->
<template>
  <div v-if="watchList.length" :loading="loading">
    <OptionCategory />
    <StockTable style="margin-top: 0.1rem" v-if="watchList.length" :loading="loading" @remove="remove"
      :deleteItem="!!token" class="market_optional" :list="watchList" :marketType="marketType" :page="'market'" />
    <div class="addBtn_container">
      <Button round icon="plus" plain type="primary" hairline="" class="addBtn px-[0.1rem]" @click="jump('search')">
        {{ t('market.market_optional_add') }}
      </Button>
    </div>
  </div>
  <div v-else-if="!watchList.length && !loading" style="position: relative; margin-bottom: 1rem">
    <div class="no_self_selection_block">
      <div class="no_data_icon">
        <img v-lazy="getStaticImgUrl('/static/img/common/no_data.svg')" alt="暂无数据" />
      </div>
      <p class="text">{{ t('market.market_optional_no_optional') }}</p>
    </div>
    <Teleport to=".page_market">
      <div class="one_click_to_favorite_container"
        v-show="stockList.length + contractList.length > 0 && showFavoriteBtn">
        <Button round block type="primary" size="large" class="one_click_to_favorite" :loading="addLoading"
          @click="addOptional">
          <span style="color: var(--ex-text-color);">{{ t('market.market_optional_add_all') }}</span>
          (<i class="tag">{{
            stockList.length + contractList.length
          }}</i>)
        </Button>
      </div>
    </Teleport>

    <Loaidng v-if="
      !marketSrockRecommendList.length &&
      !marketContractRecommendList.length &&
      recommendLoading
    " :loading="recommendLoading" :type="'circular'" />
    <NoData v-if="
      !marketSrockRecommendList.length &&
      !marketContractRecommendList.length &&
      !loading &&
      !recommendLoading
    " />

    <div class="recommend_block">
      <div class="item_block" v-if="marketSrockRecommendList.length">
        <div class="item_block_title flex justify-between">
          <div>{{ t('market.market_optional_recommend_stock') }}</div>
          <div @click="changeAllCheckState">
            <div style="width: 0.4rem;height: 0.4rem">
              <img v-if="allCheckState" v-lazy="getStaticImgUrl('/static/img/market/checked.svg')" alt="">
              <img v-else v-lazy="getStaticImgUrl('/static/img/market/uncheckTicket.svg')" alt="">
            </div>
          </div>
        </div>
        <StockRecommend :key="'stock'" :keyStr="'stock'" :loading="recommendLoading" :newState="newState" :flag="flag"
          @change="changeStockList" @init="init" :list="marketSrockRecommendList" />
      </div>

      <div class="item_block" v-if="marketContractRecommendList.length">
        <div class="item_block_title">
          <span>{{ t('market.market_optional_recommend_crypto') }}</span>
        </div>
        <StockRecommend :key="'recommend'" :keyStr="'recommend'" :loading="recommendLoading" :newState="newState"
          :flag="flag" @change="changeContractList" @init="init" :list="marketContractRecommendList" />
      </div>
    </div>
  </div>

  <Loaidng v-else :loading="loading" :type="'circular'" />
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Loaidng from "@/components/Loaidng.vue";
import NoData from "@/components/NoData.vue";
import StockTable from "@/components/StockTable.vue";
import StockRecommend from "@/components/StockRecommend.vue";
import OptionCategory from "@/components/OptionCategory.vue";
import router from "@/router";
import store from "@/store";
import { computed, onMounted, ref, watch } from "vue";
import { _watchlist, _del, _watchlistDefault, _add } from "@/api/api";
import {
  showLoadingToast,
  closeToast,
  showToast,
  Tabs,
  Tab,
  Button,
} from "vant";
import { useSocket } from "@/utils/ws";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { startSocket } = useSocket();

const props = defineProps({
  showFavoriteBtn: Boolean
})

const active = ref(0);

const watchList = computed(() => store.state.marketWatchList || []);
const loading = ref(true);
const token = computed(() => store.state.token || "");
const subs = () => {
  // 订阅 ws
  store.dispatch("subList", {
    commitKey: "setMarketWatchList",
    listKey: "marketWatchList",
    // proxyListValue: watchList.value
  });
};

const getWatchList = () => {
  // 获取订阅列表
  loading.value = true;
  // if (watchList.value.length) {
  //     subs()
  // }
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

// 推荐列表
const marketType = computed(() => store.getters.getMarketType);
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
const changeStockList = (arr) => {
  stockList.value = arr;
};
const changeContractList = (arr) => {
  contractList.value = arr;
};
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
        showToast(t('market.market_optional_add_success'));
        init();
      }
    })
    .finally(() => {
      addLoading.value = false;
    });
};

defineExpose({
  init,
});

// 移除收藏
const removeLoading = ref(false);
const remove = (item) => {
  if (removeLoading.value) return;
  removeLoading.value = true;
  showLoadingToast({
    duration: 0,
    loadingType: "circular",
  });
  _del({
    symbol: item.symbol,
  })
    .then((res) => {
      if (res.code == 200) {
        setTimeout(() => {
          showToast(t('market.market_optioanl_del_success'));
        }, 300);
        const i = watchList.value.findIndex((a) => a.symbol == item.symbol);
        if (i >= 0) {
          watchList.value.splice(i, 1);
          store.commit("setMarketWatchList", watchList.value);
          init();
          // 这里要移除监听，否则数据没同步会多出来
          const socket = startSocket(() => {
            socket && socket.off("realtime");
          });
        }
      }
    })
    .finally(() => {
      closeToast();
      removeLoading.value = false;
    });
};

const allCheckState = computed(() => store.state.checkState);

store.commit("setCheckState", true);
const newState = ref(true);
const flag = ref(null);
const changeAllCheckState = () => {
  if (newState.value == !allCheckState.value) {
    flag.value = false;
    newState.value = !newState.value;
    store.commit("setCheckState", !newState.value);
  } else {
    flag.value = true;
    newState.value = !allCheckState.value;
    store.commit("setCheckState", newState.value);
  }
};

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
  color: var(--ex-text-color4);
  font-size: 0.253rem;
  font-weight: 400;
  line-height: 0.253rem;

  .no_data_icon {
    width: 2.16rem;
    height: 1.6rem;
  }

  .text {
    margin-bottom: 0.307rem;
    font-size: 0.28rem;
    font-weight: 400;
    line-height: 0.28rem;
  }
}

.addBtn {
  color: var(--ex-primary-color);
  border-color: var(--ex-primary-color);

  height: 0.68rem;
  font-size: 0.28rem;
  font-weight: 400;
  line-height: 0.28rem;
  padding: 0 0.2rem;

  :deep(.van-button__icon) {
    font-size: 0.28rem;
  }

  :deep(.van-button__text) {
    margin-left: 0 !important;
  }
}

.recommend_block {
  padding: 0.2rem 0.4rem;

  .item_block {
    margin-bottom: 0.471rem;

    .item_block_title {
      font-size: 0.36rem;
      font-weight: 600;
      line-height: 0.36rem;
      margin-bottom: 0.36rem;

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
    background-color: var(--ex-primary-color);
    color: var(--ex-text-color--bg-primary);

    i {
      font-style: normal;
    }
  }
}

.addBtn_container {
  margin-top: 0.4rem;
  margin-bottom: 0.1rem;
  display: flex;
  justify-content: center;
}

.search_block {
  background-color: var(--ex-bg-color2);
  // border: 1px solid var(--ex-border-color);
  height: 0.8rem;
  border-radius: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 0.32rem;
  font-size: 0.28rem;
  color: var(--ex-text-color3);
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
    border-bottom: 1px solid var(--ex-primary-color) !important;
    margin: 0 0.32rem;
  }

  :deep(.van-tabs__line) {
    bottom: -1px;
  }
}
</style>
