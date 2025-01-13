<!-- 市场 -->
<template>
  <div class="page page_market">
    <IPODetail v-if="detail == '1'" @close-open-detail="closeOpenDetail" />
    <Subscription v-else-if="detail == '2'" @close-open-detail="closeOpenDetail" />
    <div
      class="bg-color2 absolute right-4 top-[0.25rem] z-20 flex size-[0.6rem] items-center justify-center rounded-50"
      @click="jump('search')">
      <div style="width: 0.32rem;height: 0.32rem;">
        <img v-lazy="getStaticImgUrl('/static/img/home/search_icon.svg')" alt="">
      </div>
    </div>
    
    <HeaderTabs v-model:active="active" class="w-[6.28rem]" :tabs="[
      $t('market.market_header_optional'),
      $t('market.market_header_buy'),
      $t('market.market_header_stock'),
      $t('market.market_header_contract'),
      $t('market.market_header_ai'),
    ]" @change="(e) => changeTab(e, true)" />

    <Swipe :autoplay="0" :initial-swipe="marketActiveTab" :show-indicators="false" ref="swipe" @change="swipeChange">
      <SwipeItem>
        <div class="assets_body">
          <!-- 自选 -->
          <Optional ref="OptionalRef" :showFavoriteBtn="active == 0" v-if="loadedTab.includes(0)" />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div ref="marketPageRef" class="assets_body">
          <!-- 买币 -->
          <buyCoin ref="BuyCoinRef" v-if="loadedTab.includes(1)" />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div class="assets_body stock_tab_scroller">
          <!-- 股票 -->
          <Stock v-if="loadedTab.includes(2)" />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div class="assets_body">
          <!-- 合约 -->
          <Constract v-if="loadedTab.includes(3)" />
        </div>
      </SwipeItem>

      <SwipeItem>
        <div class="assets_body">
          <AiBlockList v-if="loadedTab.includes(4)" />
        </div>
      </SwipeItem>
      <!-- <SwipeItem>
        <div class="assets_body">
          <Foreign v-if="loadedTab.includes(5)" />
        </div>
      </SwipeItem> -->
    </Swipe>

    <!-- </PullRefresh> -->
    <!-- </transition> -->
  </div>
</template>

<script setup>
import { ref, onDeactivated, computed, onActivated } from "vue";

import { Swipe, SwipeItem } from 'vant';
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import Optional from "./components/Optional.vue";
import Stock from "./components/Stock.vue";
// import Financial from './components/Financial.vue'
import Foreign from "./components/Foreign.vue";
// import IPO from './components/IPO.vue'
import store, { useMapState } from "@/store";
import IPODetail from "@/views/trade/IPODetail.vue";
import Subscription from "@/views/trade/Subscription.vue";
// import NoData from '@/components/NoData.vue'
import Constract from "./components/Constract.vue";
// import Ai from './components/Ai.vue'
import buyCoin from "./buyCoin/index.vue";
import AiBlockList from "../Trade2/pages/AiBlockList.vue";
import { useBuyCoinState } from "./buyCoin/state";
import HeaderTabs from "@/components/HeaderTabs.vue";

const {
  setScrollData,
  cancelSubs,
  active: activeTwo,
  onChange,
} = useBuyCoinState();
const { bottomTabBarValue } = useMapState(["bottomTabBarValue"]);
const marketPageRef = ref();
const scrollData = useScroll(marketPageRef, {
  throttle: 200,
  onScroll: scrollHandler,
});
const marketActiveTab = ref(store.state.marketActiveTab || 0);

const openTab = ref(false);

const active = ref(marketActiveTab.value);
const OptionalRef = ref();
const BuyCoinRef = ref();
// const StockRef = ref()
// const IPORef = ref()
// const reloading = ref(false)
const detail = ref(null);
const swipe = ref(null)

// const detailTransition = ref('slide-right')
const loadedTab = ref([active.value]);
provide("scrollData", scrollData);
setScrollData(scrollData);
const changeTab = (key, slideSwipe = false) => {
  store.commit("setMarketActiveTab", key);
  active.value = key;
  openTab.value = false;
  if (!loadedTab.value.includes(key)) {
    loadedTab.value.push(key);
  } else {
    if (key == 1) {
      setTimeout(() => {
        BuyCoinRef.value && BuyCoinRef.value.handleMounted();
      }, 300);
    }
  }
  if (slideSwipe && swipe.value) swipe.value.swipeTo(key);
  setTimeout(() => {
    switch (key) {
      case 0:
        OptionalRef.value && OptionalRef.value.init();
        break;
      case 1:
        onChange(activeTwo.value);
        break;
      // case 'stock':
      //   // StockRef.value && StockRef.value.init()
      //   break
      // case 'ipo':
      //   IPORef.value && IPORef.value.init()
      //   break
      default:
        cancelSubs();
        break;
    }
  }, 100);
};

function scrollHandler() {
  if (openTab.value) {
    openTab.value = false;
  }
}
// 跳转
const jump = (name) => {
  router.push({
    name,
  });
};
watch(
  () => store.state.bottomTabBarValue,
  (newValue) => {
    if (newValue === "market" && active.value == 1) {
      onChange(activeTwo.value);
    }
  }
);


const swipeChange = (index) => {
  changeTab(index);
};


onActivated(() => {
  changeTab(active.value);
});
onDeactivated(() => {
  loadedTab.value = [1] //只留下买币，其他销毁缓存
  // 取消订阅
  if (bottomTabBarValue.value !== "market") {
    cancelSubs();
  }
});

// 预加载页面
Promise.all([
  import("@/views/Market/MarketInfo.vue"),
  import("@/views/Market/Search.vue"),
  import("@/views/Market/IpoSubscription.vue"),
])


</script>

<style lang="less" scoped>
.page_market {
  padding-bottom: 1.4rem;
  height: 100%;
  // overflow-y: auto;
  position: relative;
  width: 7.5rem;

  &:has(.open_tabs) {
    :deep(.addBtn) {
      top: 1.76rem;
    }
  }

  .assets_body {
    overflow-y: auto;
    height: calc(var(--vh) * 100 - 2.52rem);
    padding-bottom: 1rem
  }

  :deep(.van-sticky) {
    background-color: var(--ex-bg-color);
    padding-top: 0.2rem;
  }

  .mytab_title {
    display: flex;
    align-items: center;
    transition: all ease-in 0.3s;

    >span {
      margin-left: 0.08rem;
    }

    .mytab_title_icon {
      width: 0.32rem;
      height: 0.32rem;
      line-height: 1;
      position: relative;
      top: -0.02rem;
    }
  }

  .mytab_title_active {
    .mytab_title_icon {
      width: 0.28rem;
      height: 0.28rem;
    }
  }

  .title {
    padding: 0 0.24rem 0 0.32rem;
    height: 1.12rem;
    font-weight: 600;
    color: var(--ex-text-color);
    line-height: 0.5rem;
    font-size: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.1rem;
    position: relative;
  }

  .search_block {
    background-color: var(--ex-bg-color);
    border: 1px solid var(--ex-border-color);
    height: 0.8rem;
    border-radius: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0.32rem;
    font-size: 0.28rem;
    color: var(--ex-text-color3);
    margin: 0 0.32rem 0.12rem 0.32rem;

    .search_icon {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.2rem;
    }
  }

  .search_box {
    position: absolute;
    z-index: 9;
    top: 0.2rem;
    right: 0.24rem;
    width: 0.64rem;
    height: 0.64rem;
  }

  .tabs {
    position: relative;
    overflow-x: auto;

    :deep(.tab_item) {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      position: relative;

      .tab_item_icon {
        width: 0.3rem;
        height: 0.3rem;
        margin-right: 0.04rem;
        font-size: 0.3rem;
      }

    }

    .tab_icon {
      width: 100%;
      height: 100%;
      line-height: 0;
      position: absolute;
      top: 0;
      left: 0;
      padding: 0.1rem;
    }

    :deep(.my_icon) {
      position: absolute;
      top: 0;
      right: 1rem;
      padding-right: 0 !important;
      padding-left: 0 !important;
      border-radius: 50%;
      border: 1px solid var(--ex-border-color);
      width: 0.6rem;
      height: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--ex-bg-color);
    }

    :deep(.my_icon2) {
      position: absolute;
      top: 0;
      right: 0.2rem;
      padding-right: 0 !important;
    }

    :deep(.van-tabs__nav--card) {
      border: none;
    }

    :deep(.van-tab--card) {
      border-right: none;
      color: var(--ex-text-color2);
    }

    :deep(.van-tab--card.van-tab--active) {
      background-color: transparent;
      color: var(--ex-text-color);
      font-weight: 600;
      font-size: 0.5rem;
      position: relative;

      // border-bottom: 3px solid var(--ex-primary-color);
      // border-width: 10px;
      .tab_item {
        z-index: 1;
      }

      &::after {
        content: "";
        position: absolute;
        width: 0.6rem;
        height: 0.2rem;
        background-color: var(--ex-primary-color);
        border-radius: 0.2rem;
        position: absolute;
        bottom: 0.06rem;
        padding-left: 0;
      }
    }

    :deep(.van-tab--shrink) {
      padding-left: 0;
      padding-right: 0.4rem;
    }

    :deep(.van-tabs__wrap) {
      height: 0.8rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0);
      position: relative;
      padding-right: 1.7rem;
      // 源14 多8
      margin-top: 0.12rem;
      margin-bottom: 0.24rem;
    }

    :deep(.van-tabs__nav--card) {
      height: 0.8rem;
      width: 100%;
      position: static;
    }

    :deep(.van-tab) {
      line-height: 0.6rem;
      font-size: 0.28rem;
    }
  }

  .open_tabs {
    z-index: 999;
    position: relative;

    :deep(.my_icon) {
      right: 0.2rem;
    }

    :deep(.van-sticky) {
      height: 1.6rem !important;
      border-bottom-left-radius: 0.6rem;
      border-bottom-right-radius: 0.6rem;
      // position: relative;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
    }

    :deep(.van-tabs__wrap) {
      height: 1.4rem;
      padding-right: 1.2rem;
    }

    :deep(.van-tabs__nav--card) {
      height: 1.2rem;
      flex-wrap: wrap;
      overflow: hidden;
    }
  }
}
</style>
