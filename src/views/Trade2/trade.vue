<!-- 交易 -->
<template>
  <div class="page page_trade" v-if="pageActive">
    <!-- <PullRefresh :disabled="disabled" class="refresh_box" v-model="loading" @refresh="onRefresh"> -->

    <!-- <div class="title">交易</div> -->
    <!-- 头部 -->

    <HeaderTabs
      :tabs="[
        t('trade.header_stock'),
        t('trade.header_contract'),
        t('trade.header_aibot'),
        t('trade.header_ipo'),
      ]"
      v-model:active="activeTab"
      @change="changeActiveTab(activeTab, true)"
    >
      <template #before>
        <div class="tab_icon" @click="showNavDialogFunc()">
          <img :src="getStaticImgUrl('/static/img/trade/open.png')" alt="img" />
        </div>
      </template>
    </HeaderTabs>

    <Swipe
      :autoplay="0"
      :initial-swipe="initialSwipe"
      :show-indicators="false"
      ref="swipeRef"
      @change="swipeChange"
    >
      <SwipeItem>
        <div
          class="trade_body"
          ref="stockTradeBody"
          @scroll="tradeBodyScroll('stockTradeBody')"
        >
          <StockBlock
            :activeTab="Number(activeTab + 1)"
            @showNavDialog="showNavDialogFunc"
            ref="StockBlockRef"
            v-if="loadedTab.includes(0)"
          />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div
          class="trade_body"
          ref="contractTradeBody"
          @scroll="tradeBodyScroll('contractTradeBody')"
        >
          <ContractBlock
            :activeTab="Number(activeTab + 1)"
            :key="'constract'"
            :mode="'constract'"
            @showNavDialog="showNavDialogFunc"
            ref="ContractBlockRef"
            v-if="loadedTab.includes(1)"
          />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div class="trade_body">
          <AiBlock
            :activeTab="Number(activeTab + 1)"
            @showNavDialog="showNavDialogFunc"
            ref="AiBlockRef"
            v-if="loadedTab.includes(2)"
          />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div class="trade_body">
          <IpoBlock
            :activeTab="Number(activeTab + 1)"
            ref="IpoBlockRef"
            v-if="loadedTab.includes(3)"
          />
        </div>
      </SwipeItem>
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
    <Popup
      round
      v-model:show="showNavDialog"
      position="left"
      :style="{ width: '85%', height: '100%' }"
    >
      <div class="trade_option_list">
        <!-- 搜索 -->
        <div class="search_box_wrap">
          <div class="item search_box">
            <div class="search_icon">
              <img
                :src="getStaticImgUrl('/static/img/common/search.png')"
                alt="🔍"
              />
            </div>
            <input
              v-model.trim="searchStr"
              @keyup="goSearch(navActiveTab)"
              type="text"
              class="ipt"
              :placeholder="t('trade.left_search')"
            />
          </div>
        </div>

        <!-- 切换 -->
        <Tabs
          @change="changeTab"
          class="van-tabs--sub"
          :lazy-render="false"
          v-model:active="navActiveTab"
          animated
          shrink
        >
          <Tab :title="t('trade.left_mine')" name="option">
            <div class="lists">
              <StockTable
                :showSparkLine="false"
                :handleClick="handleClick"
                :loading="optionLoading"
                :key="'option'"
                :list="watchList"
              />
            </div>
          </Tab>
          <Tab :title="t('trade.left_stock')" name="stock">
            <div class="lists">
              <Tabs
                @change="changeTab('stock')"
                type="oval-sub-small"
                class="mt-[0.2rem]"
                :lazy-render="false"
                v-model:active="stockActiveTab"
                shrink
              >
                <Tab :title="t('trade.left_all')" name="all">
                  
                </Tab>
                <Tab
                  style="min-width: 2rem"
                  :title="
                    marketItem.market == 'us'
                      ? t('market.market_stock_country_us')
                      : marketItem.market == 'japan'
                      ? t('market.market_stock_country_japan')
                      : marketItem.market == 'india'
                      ? t('market.market_stock_country_india')
                      : marketItem.market == 'korea'
                      ? t('market.market_stock_country_korea')
                      : marketItem.market == 'germany'
                      ? t('market.market_stock_country_germany')
                      : marketItem.market == 'uk'
                      ? t('market.market_stock_country_uk')
                      : marketItem.market == 'singapore'
                      ? t('market.market_stock_country_singapore')
                      : marketItem.market == 'hongkong'
                      ? t('market.market_stock_country_hongkong')
                      : marketItem.market == 'malaysia'
                      ? t('market.market_stock_country_malaysia')
                      : ''
                  "
                  :name="marketItem.market"
                  v-for="marketItem in marketList"
                  :key="marketItem.market"
                >
                </Tab>
              </Tabs>
              <StockTable
                :showSparkLine="false"
                :handleClick="handleClick"
                :loading="searchLoading"
                :list="marketSearchList"
              />
            </div>
          </Tab>

          <Tab :title="t('market.market_header_contract')" name="contract">
            <div class="lists">
              <StockTable
                :showSparkLine="false"
                :handleClick="handleClickContract"
                :loading="searchLoading"
                :list="futuresSearchList"
              />
            </div>
          </Tab>

          <Tab :title="t('trade.left_bot')" name="ai">
            <div class="lists">
              <StockTable
                :showSparkLine="false"
                :handleClick="handleClick"
                :loading="searchLoading"
                :list="aiquantSearchList"
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    </Popup>

    <!-- 持仓价值 -->
    <Popup
      :safe-area-inset-top="true"
      :safe-area-inset-bottom="true"
      v-model:show="showPrice"
      position="top"
    >
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

import router from "@/router";

const { t } = useI18n();
const AiBlockRef = ref();
const IpoBlockRef = ref();
const ForeignBlockRef = ref();
const CommoditiesBlockRef = ref();

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
const loadedTab = ref([activeTab.value]);
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

  console.log("activeTab", activeTab.value);
  initialSwipe.value = activeTab.value;

  setTimeout(() => {
    changeActiveTab(activeTab.value, prevActiveTabVal != activeTab.value, true);
  }, 300);
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
  forexSearchList,
  blocktardeSearchList,
  aiquantSearchList,
  showNavDialog,
  navActiveTab,
  stockActiveTab,
  searchStr,
  optionLoading,
  goSearch,
  showNavDialogFunc,
  changeTab
} = useNavDialog(activeTab);

// 选择股票
const StockBlockRef = ref();
const handleClick = (item) => {
  showNavDialog.value = false;
  if (item.type == "crypto") {
    ContractBlockRef.value && ContractBlockRef.value.choose(item);
  } else {
    StockBlockRef.value && StockBlockRef.value.choose(item);
  }
};

// 选择合约
const ContractBlockRef = ref();
const handleClickContract = (item) => {
  showNavDialog.value = false;
  ContractBlockRef.value && ContractBlockRef.value.choose(item);
};

const swipeResize = () => {
  setTimeout(() => {
    swipeRef.value && swipeRef.value.resize();
  }, 300);
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
</script>

<style lang="less" scoped>
.page_trade {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(span.van-tab__text) {
    font-size: 0.32rem;
  }

  :deep(.van-tab--shrink) {
    padding: 0 0.28rem;
  }

  .title {
    padding: 0 0.24rem 0 0.32rem;
    height: 1.12rem;
    font-weight: 600;
    color: #0d0d12;
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
    height: calc(100vh - 2.52rem);
  }

  .trade_option_list {
    height: 100%;
    padding-bottom: 0.4rem;
    display: flex;
    flex-direction: column;

    .van-tabs--sub :deep(.van-tabs__wrap) {
      padding: 0 0.32rem;
    }

    .lists {
      overflow-y: auto;
      height: calc(100vh - 2rem);
    }

    .search_box_wrap {
      padding: 0.24rem 0.32rem 0.28rem 0.32rem;
    }

    .search_box {
      height: 0.8rem;
      display: flex;
      align-items: center;
      background-color: #f5f7fc;
      border-radius: 0.6rem;
      border: 1px solid #d0d8e2;
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
        color: #a4acb9;
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
    color: #0d0d12;
    font-size: 0.56rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.5rem;
    padding-top: 0.3rem;
    margin-bottom: 0.32rem;
  }

  .total-value {
    color: #061023;
    text-align: center;
    font-size: 0.36rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.3rem;
  }

  .num {
    color: #061023;
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
      color: #333;
      text-align: center;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.3rem;
      margin-bottom: 0.2rem;
    }

    .b-num {
      color: #333;
      text-align: center;
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.3rem;
    }
  }
}
</style>
