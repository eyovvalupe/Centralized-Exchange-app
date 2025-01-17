<!-- 交易 -->
<template>
  <div class="page page_trade" v-if="pageActive">
    <!-- <PullRefresh :disabled="disabled" class="refresh_box" v-model="loading" @refresh="onRefresh"> -->

    <!-- <div class="title">交易</div> -->
    <!-- 头部 -->

    <HeaderTabs :tabs="[
      '现货',
      t('trade.header_contract'),
      t('trade.header_aibot'),
      // t('trade.header_ipo'),
    ]" v-model:active="activeTab" @change="changeActiveTab(activeTab, true)">
      <!-- <template #before>
        <div class="tab_icon" @click="showNavDialogFunc()">
          <img v-lazy="getStaticImgUrl('/static/img/trade/open.svg')" alt="img" />
        </div>
      </template> -->
    </HeaderTabs>

    <Swipe :autoplay="0" :initial-swipe="initialSwipe" :show-indicators="false" ref="swipeRef" @change="swipeChange">
      <!-- <SwipeItem>
        <div class="trade_body" ref="stockTradeBody" @scroll="tradeBodyScroll('stockTradeBody')">
          <StockBlock :activeTab="Number(activeTab + 1)" @showNavDialog="showNavDialogFunc" ref="StockBlockRef"
            v-if="loadedTab.includes(0)" />
        </div>
      </SwipeItem> -->
      <SwipeItem>
        <div class="trade_body" ref="contractTradeBody" @scroll="tradeBodyScroll('contractTradeBody')">
          <ContractBlock :activeTab="Number(activeTab + 1)" :key="'constract'" :mode="'constract'"
            @showNavDialog="showNavDialogFunc" ref="ContractBlockRef" v-if="loadedTab.includes(0)" />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div class="trade_body" ref="contractTradeBody" @scroll="tradeBodyScroll('contractTradeBody')">
          <ContractBlock :activeTab="Number(activeTab + 1)" :key="'constract'" :mode="'constract'"
            @showNavDialog="showNavDialogFunc" ref="ContractBlockRef" v-if="loadedTab.includes(1)" />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div class="trade_body">
          <AiBlock :activeTab="Number(activeTab + 1)" @showNavDialog="showNavDialogFunc" ref="AiBlockRef"
            v-if="loadedTab.includes(2)" />
        </div>
      </SwipeItem>
      <!-- <SwipeItem>
        <div class="trade_body">
          <IpoBlock :activeTab="Number(activeTab + 1)" ref="IpoBlockRef" v-if="loadedTab.includes(3)" />
        </div>
      </SwipeItem> -->
      <!-- <SwipeItem>
        <div class="trade_body">
          <ContractBlock :key="'foreign'" :mode="'foreign'" @showNavDialog="showNavDialogFunc" ref="ForeignBlockRef"
            v-if="loadedTab.includes(4)" />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div class="trade_body">
          <ContractBlock :key="'commodities'" :mode="'commodities'" @showNavDialog="showNavDialogFunc"
            ref="CommoditiesBlockRef" v-if="loadedTab.includes(5)" />
        </div>
      </SwipeItem> -->
    </Swipe>

    <!-- </PullRefresh> -->

    <!-- 自选列表 -->
    <Popup round v-model:show="showNavDialog" position="left" :style="{ width: '85%', height: '100%' }">
      <div class="trade_option_list">
        <!-- 搜索 -->
        <div class="search_box_wrap">
          <div class="item search_box relative">
            <div class="search_icon">
              <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="🔍" />
            </div>
            <input v-model.trim="searchStr" @keyup="searchItem()" type="text" class="ipt"
              :placeholder="t('trade.left_search')" :onfocus="() => (isFocused = true)"
              :onblur="() => (isFocused = false)" />
          </div>
        </div>
        <div v-if="isFocused || searchStr" class="ml-[0.32rem] mb-[0.2rem] text-[0.32rem]">{{
          t('trade.left_search_result')
        }}</div>
        <!-- 切换 -->
        <Tabs id="option_left" @change="changeTab" type="custom-line" :lazy-render="false" v-model:active="navActiveTab"
          animated shrink>
          <Tab :title="t('trade.left_mine')" name="option">
            <div class="lists">
              <StockTable :showSparkLine="false" :handleClick="handleClick" :loading="optionLoading" :key="'option'"
                :list="isFocused ? searchResultList : watchList" />
            </div>
          </Tab>
          <Tab :title="t('trade.left_stock')" name="stock">
            <div class="lists">
              <Tabs v-if="!(isFocused || searchStr)" @change="changeTab('stock')"
                class="van-tabs--sub van-tabs--sub_mini mt-[0.2rem]" :lazy-render="false"
                v-model:active="stockActiveTab" shrink>
                <Tab :title="t('trade.left_all')" name="all"> </Tab>
                <Tab style="min-width: 2rem" :title="marketItem.market == 'us'
                  ? t('market.market_stock_country_us_long')
                  : marketItem.market == 'japan'
                    ? t('market.market_stock_country_japan_long')
                    : marketItem.market == 'india'
                      ? t('market.market_stock_country_india_long')
                      : marketItem.market == 'korea'
                        ? t('market.market_stock_country_korea_long')
                        : marketItem.market == 'germany'
                          ? t('market.market_stock_country_germany_long')
                          : marketItem.market == 'uk'
                            ? t('market.market_stock_country_uk_long')
                            : marketItem.market == 'singapore'
                              ? t('market.market_stock_country_singapore_long')
                              : marketItem.market == 'hongkong'
                                ? t('market.market_stock_country_hongkong_long')
                                : marketItem.market == 'malaysia'
                                  ? t('market.market_stock_country_malaysia_long')
                                  : ''
                  " :name="marketItem.market" v-for="marketItem in marketList" :key="marketItem.market">
                </Tab>
              </Tabs>
              <StockTable :showSparkLine="false" :handleClick="handleClick" :loading="searchLoading" :list="isFocused || searchStr ? searchResultList : marketSearchList
                " :page="'trade'" :type="'stock'" />
            </div>
          </Tab>

          <Tab :title="t('market.market_header_contract')" name="contract">
            <Tabs v-if="!(isFocused || searchStr)" @change="changeTab('future')"
              class="van-tabs--sub van-tabs--sub_mini mt-[0.2rem]" :lazy-render="false" v-model:active="futureActiveTab"
              shrink>
              <Tab :title="t('trade.left_all')" name="all"> </Tab>
              <Tab :title="t('account.crypto')" name="crypto"></Tab>
              <Tab :title="t('assets.over_view_forex')" name="forex"></Tab>
              <Tab :title="t('trade.header_block_long')" name="blocktrade"></Tab>
            </Tabs>
            <div class="lists">
              <StockTable :showSparkLine="false" :handleClick="handleClick" :loading="searchLoading" :list="isFocused || searchStr
                ? searchResultList
                : futureActiveTab == 'all'
                  ? futuresSearchList
                  : futureActiveTab == 'crypto'
                    ? cryptoList
                    : futureActiveTab == 'forex'
                      ? forexList
                      : futureActiveTab == 'blocktrade'
                        ? blocktradeList
                        : []
                " :page="'trade'" :type="'future'" />
            </div>
          </Tab>

          <Tab :title="t('trade.left_bot')" name="ai">
            <div class="lists" :class="searchStr || isFocused ? '' : 'px-[0.32rem]'">
              <StockTable v-if="isFocused || searchStr" :showSparkLine="false" :handleClick="handleClick"
                :loading="searchLoading" :list="searchResultList" :page="'trade'" :type="''" />
              <Ai v-if="!(isFocused || searchStr)" @clickItems="(item) => handleClickAi(item)" :page="'trade'"
                :list="aiquantSearchList" :propsLoading="searchLoading" />
            </div>
          </Tab>
        </Tabs>
      </div>
    </Popup>

    <!-- 持仓价值 -->
    <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showPrice" position="top">
      <div class="trade-popup_price">
        <div class="popup-title">交易</div>
        <div class="total-value">总持仓价值</div>
        <div class="num">98148.56</div>
        <div class="popup-flex">
          <div class="flex-box">
            <div class="t-flex">持仓收益</div>
            <div class="b-num">+4578.25</div>
          </div>
          <div class="flex-box">
            <div class="t-flex">持仓收益率</div>
            <div class="b-num">+48.23%</div>
          </div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js";
import { Swipe, SwipeItem } from "vant";
import { PullRefresh, Popup, Tabs, Tab } from "vant";
import {
  ref,
  watch,
  computed,
  onActivated,
  onDeactivated,
  onMounted,
  nextTick,
  onBeforeUnmount,
} from "vue";
import HeaderTabs from "@/components/HeaderTabs.vue";
import IpoBlock from "./pages/IpoBlock.vue";
import StockBlock from "./pages/StockBlock.vue";
import AiBlock from "./pages/AiBlock.vue";
import ContractBlock from "./pages/ContractBlock.vue";
import store from "@/store";
import StockTable from "@/components/StockTable.vue";
import { useRoute } from "vue-router";
import OptionCategory from "@/components/OptionCategory.vue";
import eventBus from "@/utils/eventBus";
import { useI18n } from "vue-i18n";
import { useNavDialog } from "./hooks/useNavDialog";
import Ai from "../Market/components/Ai.vue";
import router from "@/router";

const { t } = useI18n();
const AiBlockRef = ref();
const IpoBlockRef = ref();
const ForeignBlockRef = ref();
const CommoditiesBlockRef = ref();
const isFocused = ref(false);
const route = useRoute();

const stockTradeBody = ref(null);
const contractTradeBody = ref(null);

// 下拉刷新
const disabled = ref(false);
const loading = ref(false);
const onRefresh = () => {
  loading.value = false;
};

// 一级导航
const activeTab = ref(0);
const initialSwipe = ref(-1);
const loadedTab = ref([]);
const swipeRef = ref();

const changeActiveTab = (val, slideSwipe = false, init = false) => {
  activeTab.value = val;
  if (!init) {
    router.replace({
      name: "trade",
      query: {},
    });
  }
  if (loadedTab.value.indexOf(val) == -1) {
    loadedTab.value.push(val);
  } else {
    setTimeout(() => {
      switch (val) {
        case 0:
          StockBlockRef.value.handleMounted();
          break;
        case 1:
          ContractBlockRef.value.handleMounted();
          break;
        case 2:
          AiBlockRef.value.handleMounted();
          break;
        case 3:
          // IpoBlockRef.value.handleMounted()
          break;
      }
    });
  }
  localStorage.setItem("tradeActiveTab", val);
  if (slideSwipe && swipeRef.value) {
    swipeRef.value.swipeTo(val);
  }
  swipeResize();
};

const reDir = () => {
  let prevActiveTabVal = activeTab.value;
  const tradeActiveTab = localStorage.getItem("tradeActiveTab");
  if (route.query.to == "stock") {
    activeTab.value = 0;
  } else if (route.query.to == "constract") {
    activeTab.value = 1;
  } else if (route.query.to == "ai") {
    activeTab.value = 2;
  } else if (route.query.to == "ipo") {
    activeTab.value = 3;
  } else if (tradeActiveTab > 0) {
    activeTab.value = Number(tradeActiveTab);
  } else {
    activeTab.value = 0;
  }

  initialSwipe.value = activeTab.value;

  setTimeout(() => {
    changeActiveTab(activeTab.value, prevActiveTabVal != activeTab.value, true);
  }, 100);
};

const swipeChange = (index) => {
  if (activeTab.value !== index) {
    changeActiveTab(index);
  }
};

const transitionName = ref("slide-left");
watch([activeTab], (newActive, oldActive) => {
  if (newActive > oldActive) {
    transitionName.value = "slide-right";
  } else {
    transitionName.value = "slide-left";
  }
});

// 持仓价值
const showPrice = ref(false);

//左側窗口
const {
  marketList,
  watchList,
  searchLoading,
  marketSearchList,
  futuresSearchList,
  cryptoList,
  forexList,
  blocktradeList,
  forexSearchList,
  blocktardeSearchList,
  aiquantSearchList,
  showNavDialog,
  navActiveTab,
  stockActiveTab,
  futureActiveTab,
  searchStr,
  optionLoading,
  searchResultList,
  totalList,
  cleanItem,
  searchItem,
  goSearch,
  showNavDialogFunc,
  changeTab,
} = useNavDialog(activeTab);

// 选择股票
const StockBlockRef = ref();
const handleClickStock = (item) => {
  showNavDialog.value = false;
  if (activeTab.value != 0) {
    changeActiveTab(0, true);
  }
  setTimeout(() => {
    StockBlockRef.value && StockBlockRef.value.choose(item);
    searchStr.value = "";
    isFocused.value = false;
  }, 600);
};

// 选择合约
const ContractBlockRef = ref();
const handleClickContract = (item) => {
  showNavDialog.value = false;
  if (activeTab.value != 1) {
    changeActiveTab(1, true);
  }
  setTimeout(() => {
    ContractBlockRef.value && ContractBlockRef.value.choose(item);
    searchStr.value = "";
    isFocused.value = false;
  }, 600);
};

const handleClickAi = (item) => {
  showNavDialog.value = false;
  if (activeTab.value != 2) {
    changeActiveTab(2, true);
  }
  setTimeout(() => {
    AiBlockRef.value && AiBlockRef.value.choose(item);
    searchStr.value = "";
    isFocused.value = false;
  }, 600);
};

const handleClick = (item) => {
  if (
    item.type == "crypto" ||
    item.type == "forex" ||
    item.type == "blocktrade"
  ) {
    handleClickContract(item);
  } else if (item.type == "stock") {
    handleClickStock(item);
  } else {
    handleClickAi(item);
  }
  setTimeout(() => {
    searchStr.value = "";
    isFocused.value = false;
  }, 600);
};

let swiperTimeout = null
const swipeResize = () => {
  if (swiperTimeout) clearTimeout(swiperTimeout)
  swipeRef.value && swipeRef.value.swipeTo(activeTab.value)
  swiperTimeout = setTimeout(() => {
    swipeRef.value && swipeRef.value.resize();
  }, 500);
};

const pageActive = ref(false);
onActivated(() => {
  pageActive.value = true;
  reDir();
  swipeResize();
});
onDeactivated(() => {
  pageActive.value = false;
});

const tradeBodyScroll = (refName) => {
  if (refName == "stockTradeBody") {
  } else if (refName == "contractTradeBody") {
    if (
      contractTradeBody.value.scrollTop + 10 >
      contractTradeBody.value.scrollHeight -
      contractTradeBody.value.offsetHeight
    ) {
      eventBus.emit("contractTradeBodyScrollToBottom");
    }
  }
};

watch(showNavDialog, (val) => {
  if (!val) {
    searchStr.value = "";
    isFocused.value = false;
    cleanItem();
  }
});

watch(() => (isFocused.value || searchStr.value), (val) => {
  const tab = document.getElementById("option_left")
  const element = tab.querySelector('.van-tabs__wrap')
  if (val) element.style.display = "none"
  else element.style.display = "block"
})
</script>

<style lang="less" scoped>
.page_trade {
  height: 100%;
  display: flex;
  flex-direction: column;


  :deep(.van-tab--shrink) {
    padding: 0 0.28rem;
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
    position: relative;
  }

  .tab_icon {
    min-width: 0.48rem;
    height: 0.48rem;
    margin: 0 0.24rem;
  }

  .trade_body {
    overflow-y: auto;
    height: calc(var(--vh) * 100 - 2.52rem);
  }

  .trade_option_list {
    height: 100%;
    padding-bottom: 0.4rem;
    display: flex;
    flex-direction: column;


    .lists {
      overflow-y: auto;
      height: calc(var(--vh) * 100 - 2rem);
    }

    .search_box_wrap {
      padding: 0.24rem 0.32rem 0.28rem 0.32rem;
    }

    .search_box {
      height: 0.8rem;
      display: flex;
      align-items: center;
      background-color: var(--ex-bg-color2);
      border-radius: 0.6rem;
      border: 1px solid var(--ex-border-color2);
      position: relative;

      .search_icon {
        width: 0.48rem;
        height: 0.48rem;
        margin: 0 0.24rem;
      }

      .ipt {
        height: 100%;
        font-weight: 400;
      }

      .ipt::placeholder {
        color: var(--ex-text-color4);
      }
    }
  }

  .option-category {
    padding: 0.4rem 0.24rem 0.2rem 0.24rem;
    margin-bottom: 0px;
  }
}

.trade-popup_price {
  padding: 0 0.32rem 0.64rem 0.32rem;

  .popup-title {
    color: var(--ex-text-color);
    font-size: 0.56rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.5rem;
    padding-top: 0.3rem;
    margin-bottom: 0.32rem;
  }

  .total-value {
    color: var(--ex-text-color);
    text-align: center;
    font-size: 0.36rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.3rem;
  }

  .num {
    color: var(--ex-text-color);
    text-align: center;
    font-size: 0.6rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.3rem;
    margin-top: 0.48rem;
    margin-bottom: 0.6rem;
  }

  .popup-flex {
    display: flex;

    .flex-box {
      flex: 1;
      text-align: center;
    }

    .t-flex {
      color: var(--ex-text-color);
      text-align: center;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.3rem;
      margin-bottom: 0.2rem;
    }

    .b-num {
      color: var(--ex-text-color);
      text-align: center;
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.3rem;
    }
  }
}
</style>
