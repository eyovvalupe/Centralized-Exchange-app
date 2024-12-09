<!-- 交易 -->
<template>
  <div class="page page_trade">
    <!-- <PullRefresh :disabled="disabled" class="refresh_box" v-model="loading" @refresh="onRefresh"> -->

    <!-- <div class="title">交易</div> -->
    <!-- 头部 -->
    <div class="trade_header">
      <!-- <div class="menu" @click="showNavDialog = true">
                    <img src="/static/img/trade/open.png" alt="menu" />
                </div> -->
      <div class="tabs" :class="[openTab ? 'open_tabs' : 'close_tabs']">
        <div class="tab_icon my_icon2" @click="showNavDialog = true">
          <img src="/static/img/trade/open.png" alt="img" />
        </div>
        <div class="tab_body">
          <div class="tab" :class="{ active_tab: activeTab == 0 }" @click="changeActiveTab(0, true)">
            <span class="tab-name">{{ t('trade.header_stock') }}</span>
          </div>
          <div class="tab" :class="{ active_tab: activeTab == 1 }" @click="changeActiveTab(1, true)">
            <span class="tab-name">{{ t('trade.header_contract') }}</span>
          </div>
          <div class="tab" :class="{ active_tab: activeTab == 2 }" @click="changeActiveTab(2, true)">
            <span class="tab-name">{{ t('trade.header_aibot') }}</span>
          </div>
          <div class="tab" :class="{ active_tab: activeTab == 3 }" @click="changeActiveTab(3, true)">
            <span class="tab-name">{{ t('trade.header_ipo') }}</span>
          </div>
          <div class="tab" :class="{ active_tab: activeTab == 4 }" @click="changeActiveTab(4, true)">
            <span class="tab-name">{{ t('trade.header_forex') }}</span>
          </div>
          <div class="tab" :class="{ active_tab: activeTab == 5 }" @click="changeActiveTab(5, true)">
            <span class="tab-name">{{ t('trade.header_block') }}</span>
          </div>
        </div>
      </div>
    </div>
    <Swiper
        style="width:100%;overflow:hidden;"
        v-if="initialSwipe > -1" 
        :show-indicators="false"
        :autoHeight="true"
        :loop="false"
        :initial-slide="initialSwipe"
        :speed="500"
        @swiper="setTradeSwiper"
        @slideChange="swipeChange"
    >
      <SwiperSlide>
        <div class="trade_body" ref="stockTradeBody"
          @scroll="tradeBodyScroll('stockTradeBody')">
          <StockBlock @showNavDialog="showNavDialogFunc" ref="StockBlockRef" v-if="loadedTab.includes(0)" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="trade_body" ref="contractTradeBody" 
          @scroll="tradeBodyScroll('contractTradeBody')">
          <ContractBlock @showNavDialog="showNavDialogFunc" ref="ContractBlockRef" v-if="loadedTab.includes(1)" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="trade_body">
          <AiBlock @showNavDialog="showNavDialogFunc" ref="AiBlockRef" v-if="loadedTab.includes(2)" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="trade_body" >
          <IpoBlock ref="IpoBlockRef" v-if="loadedTab.includes(3)" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="trade_body">
          <ForeignBlock @showNavDialog="showNavDialogFunc" ref="ForeignBlockRef" v-if="loadedTab.includes(4)" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="trade_body">
          <CommoditiesBlock @showNavDialog="showNavDialogFunc" ref="CommoditiesBlockRef" v-if="loadedTab.includes(5)" />
        </div>
      </SwiperSlide>
    </Swiper>


    <!-- </PullRefresh> -->

    <!-- 自选列表 -->
    <Popup round v-model:show="showNavDialog" position="left" :style="{ width: '85%', height: '100%' }">
      <div class="trade_option_list">
        <!-- 搜索 -->
        <div class="search_box_wrap">
          <div class="item search_box">
            <div class="search_icon">
              <img src="/static/img/common/search.png" alt="🔍" />
            </div>
            <input v-model.trim="searchStr" @keyup="goSearch(navActiveTab)" type="text" class="ipt"
              :placeholder="t('trade.left_search')" />
          </div>
        </div>
        <!-- 切换 -->
        <Tabs @change="changeTab" class="van-tabs--sub" :lazy-render="false" v-model:active="navActiveTab" animated
          shrink>
          <Tab :title="t('trade.left_mine')" name="option">
            <OptionCategory class="option-category" />
            <div class="lists" style="height: calc(100vh - 3.3rem)">
              <StockTable :showSparkLine="false" :handleClick="handleClick" :loading="optionLoading" :key="'option'"
                :list="watchList" />
            </div>
          </Tab>
          <Tab :title="t('trade.left_stock')" name="stock">
            <div class="lists">
              <!-- 搜索列表 -->
              <StockTable :showSparkLine="false" :handleClick="handleClick" :loading="searchLoading" :key="'search'"
                :list="marketSearchList" />
            </div>
          </Tab>
          <Tab :title="t('trade.left_contract')" name="contract">
            <div class="lists">
              <StockTable :showSparkLine="false" :handleClick="handleClickContract" :loading="searchLoading"
                :key="'search'" :list="futuresSearchList" />
            </div>
          </Tab>
          <Tab :title="t('trade.left_bot')" name="ai">
            <div class="lists">
              <StockTable :showSparkLine="false" :handleClick="handleClick" :loading="searchLoading" :key="'search'"
                :list="aiquantSearchList" />
            </div>
          </Tab>
          <Tab :title="t('trade.left_forex')" name="out">
            <div class="lists">
              <StockTable :showSparkLine="false" :handleClick="handleClick" :loading="searchLoading" :key="'search'"
                :list="forexSearchList" />
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
import "swiper/css"
import { Swiper,SwiperSlide } from "swiper/vue"
import { PullRefresh, Popup, Tabs, Tab } from "vant";
import {
  ref,
  watch,
  computed,
  onActivated,
  onDeactivated,
  onMounted,
  nextTick,
} from "vue";

import IpoBlock from "./pages/IpoBlock.vue";
import StockBlock from "./pages/StockBlock.vue";
import AiBlock from "./pages/AiBlock.vue";
import ContractBlock from "./pages/ContractBlock.vue";
import ForeignBlock from "./pages/ForeignBlock.vue"
import CommoditiesBlock from "./pages/CommoditiesBlock.vue"
import store from "@/store";
import StockTable from "@/components/StockTable.vue";
import { _search, _watchlist } from "@/api/api";
import { useRoute } from "vue-router";
import OptionCategory from "@/components/OptionCategory.vue";
import eventBus from "@/utils/eventBus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const AiBlockRef = ref();
const IpoBlockRef = ref();
const ForeignBlockRef = ref()
const CommoditiesBlockRef = ref()

const route = useRoute();
const openTab = ref(false);
const token = computed(() => store.state.token);

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
let swipe = null
const setTradeSwiper = (_swiper)=>{
  swipe = _swiper
}
const changeActiveTab = (val, slideSwipe = false) => {
  activeTab.value = val;
  if (loadedTab.value.indexOf(val) == -1) {
    loadedTab.value.push(val);
  } else {
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
  }
  localStorage.tradeActiveTab = val;
  if (slideSwipe && swipe) {
    swipe.slideTo(val);
  }
};

const reDir = () => {
  let prevActiveTabVal = activeTab.value;
  if (route.query.to == "stock") {
    activeTab.value = 0;
  } else if (route.query.to == "constract") {
    activeTab.value = 1;
  } else if (route.query.to == "ai") {
    activeTab.value = 2;
  } else if (localStorage.tradeActiveTab > 0) {
    activeTab.value = Number(localStorage.tradeActiveTab);
  }else{
    activeTab.value = 0
  }
  if(initialSwipe.value == -1){
    initialSwipe.value = activeTab.value;
  }
  nextTick(() => {
    changeActiveTab(activeTab.value, prevActiveTabVal != activeTab.value);
  });
};

const swipeChange = (e) => {
  if (activeTab.value !== e.realIndex) {
    changeActiveTab(e.realIndex);
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
// 左侧列表弹窗
const showNavDialog = ref(false);
const navActiveTab = ref("option");
const showNavDialogFunc = (val) => {
  navActiveTab.value = val || "option";
  showNavDialog.value = true;
  setTimeout(() => {
    goSearch();
  }, 300);
};

const marketType = computed(() => store.getters.getMarketType);
const watchList = computed(() => {
  const marketWatchList = store.state.marketWatchList || [];

  const watchListResult = [];
  marketWatchList.map((item) => {
    if (
      (marketType.value == "all" || item.type == marketType.value) &&
      (!searchStr.value ||
        (item.symbol && item.symbol.indexOf(searchStr.value) > -1))
    ) {
      watchListResult.push(item);
    }
  });
  return watchListResult;
});
const marketSearchList = computed(() => store.state.marketSearchList || []);
const futuresSearchList = computed(() => store.state.futuresSearchList || []);
const aiquantSearchList = computed(() => store.state.aiquantSearchList || []);
const forexSearchList = computed(() => store.state.forexSearchList || []);

// 自选列表
const optionLoading = ref(false);
const getOptionList = () => {
  if (!token.value) return;
  optionLoading.value = true;
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
        setTimeout(() => {
          store.dispatch("subList", {
            commitKey: "setMarketWatchList",
            listKey: "marketWatchList",
          });
        }, 100);
      }
    })
    .finally(() => {
      optionLoading.value = false;
    });
};

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

const changeTab = (val) => {
  goSearch(val);
};

// 搜索列表
const searchStr = ref("");
let searchTimeout = null;
const searchLoading = ref(false);
const goSearch = (market) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  let s = searchStr.value;
  // if (!s) {
  //     store.commit('setMarketSearch', {
  //         search: '',
  //         market: '',
  //         list: []
  //     })
  //     searchLoading.value = false
  // }
  searchTimeout = setTimeout(() => {
    searchLoading.value = true;
    _search({
      market: market || "",
      symbol: s,
      page: 1,
    })
      .then((res) => {
        if (searchStr.value == s) {
          switch (market) {
            case "stock": // 股票
              store.commit("setMarketSearch", {
                search: s,
                market: market,
                list: res.data || [],
              });
              setTimeout(() => {
                store.dispatch("subList", {
                  commitKey: "setMarketSearchList",
                  listKey: "marketSearchList",
                });
              }, 100);
              break;
            case "futures": // 合约
              store.commit("setMarketSearch", {
                search: s,
                market: market,
                futuresSearchList: res.data || [],
              });
              setTimeout(() => {
                store.dispatch("subList", {
                  commitKey: "setFuturesSearchList",
                  listKey: "futuresSearchList",
                });
              }, 100);
              break;
            case "aiquant": // ai
              store.commit("setMarketSearch", {
                search: s,
                market: market,
                aiquantSearchList: res.data || [],
              });
              setTimeout(() => {
                store.dispatch("subList", {
                  commitKey: "setAiquantSearchList",
                  listKey: "aiquantSearchList",
                });
              }, 100);
              break;
            case "forex": // 外汇
              store.commit("setMarketSearch", {
                search: s,
                market: market,
                forexSearchList: res.data || [],
              });
              setTimeout(() => {
                store.dispatch("subList", {
                  commitKey: "setForexSearchList",
                  listKey: "forexSearchList",
                });
              }, 100);
              break;
          }
        }
      })
      .finally(() => {
        searchLoading.value = false;
      });
  }, 500);
};

const pageActive = ref(true);
onActivated(() => {
  reDir();
  pageActive.value = true;
  getOptionList();
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

  .trade_header {
    height: 1.12rem;
    padding: 0 0 0 0.24rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    // .menu {
    //     width: 0.4rem;
    //     height: 0.4rem;
    // }

    .tabs {
      flex: 1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      overflow-x: auto;
      // padding: 0 0.4rem;

      .tab {
        font-size: 0.28rem;
        color: #666d80;
        padding: 0 0.22rem;
        height: 0.66rem;
        line-height: 0;
        border-radius: 0.48rem;
        display: flex;
        padding-bottom: 0.06rem;
        align-items: center;
        cursor: pointer;
        white-space: nowrap;
        position: relative;

        .mytab_title_icon {
          width: 0.32rem;
          height: 0.32rem;
          line-height: 1;
          position: relative;
          top: -0.02rem;
        }

        .tab_icon {
          width: 0.32rem;
          height: 0.32rem;
        }

        .tab-name {
          position: relative;
          z-index: 1;
          transition: 0.3s;
        }

        &::after {
          content: "";
          width: 0.6rem;
          height: 0.2rem;
          background-color: #014cfa;
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -0.3rem;
          border-radius: 0.6rem;
          transition: 0.3s;
          opacity: 0;
          transform: scale(0);
        }
      }

      .active_tab {
        color: #061023;
        font-weight: 700;
        opacity: 1;

        .tab-name {
          font-size: 0.56rem;
        }

        &::after {
          opacity: 1;
          transform: scale(1);
        }
      }

      .tab_icon {
        width: 0.48rem;
        height: 0.48rem;
      }

      .my_icon {
        position: absolute;
        top: 0.1rem;
        right: 0;
        padding-right: 0 !important;
      }

      .my_icon2 {
        position: absolute;
        top: 0.1rem;
        left: 0;
        transition: all ease 0.3s;
      }
    }

    .open_tabs {
      height: 1.6rem;
      padding-top: 0.2rem;
      padding-bottom: 0.2rem;
      padding-right: 0.4rem;
      padding-left: 0.6rem;

      .my_icon2 {
        top: 0.3rem;
      }

      .tab_body {
        flex: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
    }

    .close_tabs {
      padding-right: 0;
      padding-left: 0.4rem;

      .tab_body {
        flex: 1;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        overflow-x: auto;
        margin: 0 0.2rem;
      }
    }

    .value {
      display: flex;
      align-items: center;
      color: #0953fa;
      font-size: 0.24rem;
      font-weight: 400;

      .value_icon {
        width: 0.52rem;
        height: 0.52rem;
      }
    }
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
