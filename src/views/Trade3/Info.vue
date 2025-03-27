<!-- 交易页 -->
<template>
  <!-- 头部 -->
  <HeaderTabs type="normal" @change="changeTab" v-model:active="headActiveTab"
    :tabs="[t('home.trade'), t('home.finance')]">
    <template #after>
      <div class="flex items-center gap-[0.16rem] mr-[0.34rem]">
        <div class="size-[0.72rem] bg-white1 rounded-full ripple-btn flex items-center justify-center transition"
          @click="openOrderList">
          <div class="size-[0.44rem]">
            <img v-lazy="getStaticImgUrl('/static/img/common/right_order.svg')" alt="" />
          </div>
        </div>

        <div class="size-[0.72rem] bg-white1 rounded-full ripple-btn flex items-center justify-center transition"
          @click="openRightMenu" :class="{ 'bg-primary': showRightMenu }">
          <div class="size-[0.44rem]">
            <img v-lazy="getStaticImgUrl('/static/home2/menu.svg')" alt="" />
          </div>
        </div>
      </div>
    </template>
  </HeaderTabs>

  <div class="page-marketinfo2" v-if="headActiveTab == 0">
    <div v-if="!item.symbol">
      <div style="height: 2rem"></div>
      <Loaidng :loading="true" />
    </div>
    <div class="market-trade-body mt-[0.12rem]" v-if="item.symbol && !chartLoading">
      <Tabs @change="changeTab2" :key="'main'" class="van-tabs--top" :sticky="true" :color="'var(--ex-primary-color)'"
        v-model:active="activeTab" animated shrink>
        <!-- 股票 -->
        <Tab :name="4" :title="t('common.stock')">
          <div class="dialog-market-box" v-if="activeTab == 4 && !chartLoading">
            <div class="top-box">
              <!-- 标题 -->
              <div class="title" @click="openSearch">
                <div style="display: flex;align-items: center;">
                  <div style="margin-right: 0.08rem;">
                    <div class="title_name">
                      {{ item.symbol || "--" }}
                    </div>
                    <div
                      style="font-size: 0.24rem;color: var(--ex-text-color3);margin-top: 0.1rem; text-overflow: ellipsis;white-space: nowrap; max-width: 5rem;overflow: hidden;">
                      {{ item.name }}
                    </div>
                  </div>
                  <Icon name="arrow-down" />
                </div>
              </div>
              <div style="flex: 1"></div>
              <div @click="goMaret">
                <div class="size-[0.48rem] mr-[0.24rem]">
                  <img v-lazy="getStaticImgUrl('/static/img/market/market.svg')" alt="" />
                </div>
              </div>
              <!-- 详情 -->
              <div class="search star" @click="addCollect(activeTab)" :style="{ opacity: loading ? '0.5' : '1' }">
                <div class="size-[0.48rem]">
                  <img v-if="item.watchlist == 1" v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="" />
                  <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="" />
                </div>
              </div>
            </div>
            <div class="charts-box" :class="[hideChart ? 'hide-charts-box' : '']"
              v-if="!showInfoDialog && !openInfoStatus">
              <Chart @switch="(e) => (hideChart = e)" :type="'stock'" :mini="true" />
            </div>
            <!-- 内容1 -->
            <div style="
                margin: 0.1rem;
                background-color: var(--ex-bg-color3);
                border-radius: 0.32rem;
              ">
              <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg van-tabs--market2"
                :color="'var(--ex-primary-color)'" v-model:active="activeTab2" animated shrink>
                <Tab :name="11" :title="$t('trade.stock_open')">
                  <OpeningStock :item="item" :from="'trade'" />
                </Tab>
                <Tab :title="t('trade.trade_orders_current')" :name="44">
                  <div style="height: 0.2rem"></div>
                  <div class="dialog-market-bg" v-if="activeTab2 == 44">
                    <PositionsStock />
                  </div>
                </Tab>
                <Tab :title="t('trade.trade_order_history')" :name="55">
                  <div style="height: 0.2rem"></div>
                  <div class="dialog-market-bg" v-if="activeTab2 == 55">
                    <InquireStock :scrollDom="'.dialog-market-box'" ref="InquireRef" />
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div style="height: 0.4rem"></div>
          </div>
        </Tab>
        <!-- 现货 -->
        <Tab :name="1" :title="$t('common.spot')">
          <div class="dialog-market-box" v-if="activeTab == 1 && !chartLoading">
            <div class="top-box">
              <!-- 标题 -->
              <div class="title" @click="openSearch">
                <div class="title_name">
                  {{ item.name || '--' }}
                  <Icon name="arrow-down" />
                </div>
              </div>
              <div style="flex: 1"></div>
              <div @click="goMaret">
                <div class="size-[0.48rem] mr-[0.24rem]">
                  <img v-lazy="getStaticImgUrl('/static/img/market/market.svg')" alt="" />
                </div>
              </div>
              <!-- 详情 -->
              <div class="search star" @click="addCollect(activeTab)" :style="{ opacity: loading ? '0.5' : '1' }">
                <div class="size-[0.48rem]">
                  <img v-if="item.watchlist == 1" v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="" />
                  <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="" />
                </div>
              </div>
            </div>
            <div class="charts-box" :class="[hideChart ? 'hide-charts-box' : '']"
              v-if="!showInfoDialog && !openInfoStatus">
              <Chart @switch="(e) => (hideChart = e)" :type="'constract'" :mini="true" />
            </div>
            <!-- 内容1 -->
            <div style="
                margin: 0.1rem;
                background-color: var(--ex-bg-color3);
                border-radius: 0.32rem;
              ">
              <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg van-tabs--market2"
                :color="'var(--ex-primary-color)'" v-model:active="activeTab2" animated shrink>
                <Tab :name="11" :title="$t('trade.stock_open')">
                  <OpeningSpot :type="'spot'" :item="item" ref="openingRef2" :from="'trade'" />
                </Tab>
                <Tab :name="22" :title="$t('market.market_item_order')" v-if="item.type == 'crypto'">
                  <div style="height: 0.08rem"></div>
                  <div class="market-box">
                    <OrderingSpot :tradeType="'spot'" v-if="activeTab2 == 22" :key="'o'" type="nomal" />
                  </div>
                </Tab>
                <Tab :name="33" :title="$t('market.market_item_news')" v-if="item.type == 'crypto'">
                  <div class="market-box">
                    <OrderingSpot :tradeType="'spot'" v-if="activeTab2 == 33" :key="'n'" type="news" />
                  </div>
                </Tab>
                <Tab :title="t('trade.trade_orders_current')" :name="44">
                  <div style="height: 0.2rem"></div>
                  <div class="dialog-market-bg" v-if="activeTab2 == 44">
                    <PositionsSpot :tradeType="'spot'" />
                  </div>
                </Tab>
                <Tab :title="t('trade.trade_order_history')" :name="55">
                  <div style="height: 0.2rem"></div>
                  <div class="dialog-market-bg" v-if="activeTab2 == 55">
                    <InquireSpot :scrollDom="'.dialog-market-box'" :tradeType="'spot'" ref="InquireRef" />
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div style="height: 0.4rem"></div>
          </div>
        </Tab>
        <!-- 加密货币 -->
        <Tab :name="2" :title="t('trade.crypto_exchange')">
          <div class="dialog-market-box" v-if="activeTab == 2 && !chartLoading">
            <div class="top-box">
              <!-- 标题 -->
              <div class="title" @click="openSearch">
                <div class="title_name">
                  {{ item.name || '--' }}
                  <Icon name="arrow-down" />
                </div>
              </div>
              <div style="flex: 1"></div>
              <div @click="goMaret">
                <div class="size-[0.48rem] mr-[0.24rem]">
                  <img v-lazy="getStaticImgUrl('/static/img/market/market.svg')" alt="" />
                </div>
              </div>
              <!-- 详情 -->
              <div class="search star" @click="addCollect(activeTab)" :style="{ opacity: loading ? '0.5' : '1' }">
                <div class="size-[0.48rem]">
                  <img v-if="item.watchlist == 1" v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="" />
                  <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="" />
                </div>
              </div>
            </div>
            <div class="charts-box" :class="[hideChart ? 'hide-charts-box' : '']"
              v-if="!showInfoDialog && !openInfoStatus">
              <Chart @switch="(e) => (hideChart = e)" :from="'constract'" :type="'constract'" :mini="true" />
            </div>
            <!-- 内容1 -->
            <div style="
                margin: 0.1rem;
                background-color: var(--ex-bg-color3);
                border-radius: 0.32rem;
              ">
              <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg van-tabs--market2"
                :color="'var(--ex-primary-color)'" v-model:active="activeTab2" animated shrink>
                <Tab :name="11" :title="$t('trade.stock_open')">
                  <OpeningContract :type="'crypto'" :item="item" ref="openingRef2" :from="'trade'" />
                </Tab>
                <Tab :name="22" :title="$t('market.market_item_order')" v-if="item.type == 'crypto'">
                  <div style="height: 0.08rem"></div>
                  <div class="market-box">
                    <OrderingSpot :tradeType="'constract'" v-if="activeTab2 == 22" :key="'o'" type="nomal" />
                  </div>
                </Tab>
                <Tab :name="33" :title="$t('market.market_item_news')" v-if="item.type == 'crypto'">
                  <div class="market-box">
                    <OrderingSpot :tradeType="'constract'" v-if="activeTab2 == 33" :key="'n'" type="news" />
                  </div>
                </Tab>
                <Tab :title="t('trade.trade_orders_current')" :name="44">
                  <div style="height: 0.2rem"></div>
                  <div class="dialog-market-bg" v-if="activeTab2 == 44">
                    <PositionsContract :tradeType="'constract'" />
                  </div>
                </Tab>
                <Tab :title="t('trade.trade_order_history')" :name="55">
                  <div style="height: 0.2rem"></div>
                  <div class="dialog-market-bg" v-if="activeTab2 == 55">
                    <InquireContract :scrollDom="'.dialog-market-box'" :tradeType="'constract'" ref="InquireRef" />
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div style="height: 0.4rem"></div>
          </div>
        </Tab>
        <!-- ai -->
        <Tab :name="3" :title="$t('trade.left_bot')">
          <div class="dialog-market-box" v-if="activeTab == 3 && !chartLoading">
            <div class="top-box">
              <!-- 标题 -->
              <div class="title" @click="openSearch">
                <div class="title_name">
                  {{ item.type == 'stock' ? item.symbol : item.name || '--' }}
                  <Icon name="arrow-down" />
                </div>
              </div>
              <div style="flex: 1"></div>
              <div @click="goMaret">
                <div class="size-[0.48rem] mr-[0.24rem]">
                  <img v-lazy="getStaticImgUrl('/static/img/market/market.svg')" alt="" />
                </div>
              </div>
              <!-- 详情 -->
              <div class="search star" @click="addCollect(activeTab)" :style="{ opacity: loading ? '0.5' : '1' }">
                <div class="size-[0.48rem]">
                  <img v-if="item.watchlist == 1" v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="" />
                  <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="" />
                </div>
              </div>
            </div>
            <div class="charts-box" :class="[hideChart ? 'hide-charts-box' : '']"
              v-if="!showInfoDialog && !openInfoStatus">
              <Chart @switch="(e) => (hideChart = e)" :type="'ai'" :mini="true" />
            </div>
            <!-- 内容1 -->
            <div style="
                margin: 0.1rem;
                background-color: var(--ex-bg-color3);
                border-radius: 0.32rem;
              ">
              <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg van-tabs--market2"
                :color="'var(--ex-primary-color)'" v-model:active="activeTab2" animated shrink>
                <Tab :name="11" :title="$t('trade.stock_open')">
                  <div style="height: 0.32rem"></div>
                  <OpeningAi :tradeType="'ai'" ref="openingRef2" :type="'ai'" />
                </Tab>
                <Tab :title="t('trade.trade_orders_current')" :name="44">
                  <div style="height: 0.2rem"></div>
                  <div class="dialog-market-bg" v-if="activeTab2 == 44">
                    <PositionsAi />
                  </div>
                </Tab>
                <Tab :title="t('trade.trade_order_history')" :name="55">
                  <div style="height: 0.2rem"></div>
                  <div class="dialog-market-bg" v-if="activeTab2 == 55">
                    <InquireAi :scrollDom="'.dialog-market-box'" ref="InquireRef" />
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div style="height: 0.4rem"></div>
          </div>
        </Tab>
        <!-- 外汇 -->
        <Tab :name="5" :title="t('assets.over_view_forex')">
          <div class="dialog-market-box" v-if="activeTab == 5 && !chartLoading">
            <div class="top-box">
              <!-- 标题 -->
              <div class="title" @click="openSearch">
                <div class="title_name">
                  {{ item.name || '--' }}
                  <Icon name="arrow-down" />
                </div>
              </div>
              <div style="flex: 1"></div>
              <div @click="goMaret">
                <div class="size-[0.48rem] mr-[0.24rem]">
                  <img v-lazy="getStaticImgUrl('/static/img/market/market.svg')" alt="" />
                </div>
              </div>
              <!-- 详情 -->
              <div class="search star" @click="addCollect(activeTab)" :style="{ opacity: loading ? '0.5' : '1' }">
                <div class="size-[0.48rem]">
                  <img v-if="item.watchlist == 1" v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="" />
                  <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="" />
                </div>
              </div>
            </div>
            <div class="charts-box" :class="[hideChart ? 'hide-charts-box' : '']"
              v-if="!showInfoDialog && !openInfoStatus">
              <Chart @switch="(e) => (hideChart = e)" :from="'constract'" :type="'constract'" :mini="true" />
            </div>
            <!-- 内容1 -->
            <div style="
                margin: 0.1rem;
                background-color: var(--ex-bg-color3);
                border-radius: 0.32rem;
              ">
              <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg van-tabs--market2"
                :color="'var(--ex-primary-color)'" v-model:active="activeTab2" animated shrink>
                <Tab :name="11" :title="$t('trade.stock_open')">
                  <OpeningContract :type="'foreign'" :item="item" ref="openingRef2" :from="'trade'" />
                </Tab>
                <Tab :title="t('trade.trade_orders_current')" :name="44">
                  <div style="height: 0.2rem"></div>
                  <div class="dialog-market-bg" v-if="activeTab2 == 44">
                    <PositionsContract :tradeType="'foreign'" />
                  </div>
                </Tab>
                <Tab :title="t('trade.trade_order_history')" :name="55">
                  <div style="height: 0.2rem"></div>
                  <div class="dialog-market-bg" v-if="activeTab2 == 55">
                    <InquireContract :scrollDom="'.dialog-market-box'" :tradeType="'foreign'" ref="InquireRef" />
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div style="height: 0.4rem"></div>
          </div>
        </Tab>
        <!-- 大宗商品 -->
        <Tab :name="6" :title="t('assets.over_view_trade')">
          <div class="dialog-market-box" v-if="activeTab == 6 && !chartLoading">
            <div class="top-box">
              <!-- 标题 -->
              <div class="title" @click="openSearch">
                <div class="title_name">
                  {{ item.name || '--' }}
                  <Icon name="arrow-down" />
                </div>
              </div>
              <div style="flex: 1"></div>
              <div @click="goMaret">
                <div class="size-[0.48rem] mr-[0.24rem]">
                  <img v-lazy="getStaticImgUrl('/static/img/market/market.svg')" alt="" />
                </div>
              </div>
              <!-- 详情 -->
              <div class="search star" @click="addCollect(activeTab)" :style="{ opacity: loading ? '0.5' : '1' }">
                <div class="size-[0.48rem]">
                  <img v-if="item.watchlist == 1" v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="" />
                  <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="" />
                </div>
              </div>
            </div>
            <div class="charts-box" :class="[hideChart ? 'hide-charts-box' : '']"
              v-if="!showInfoDialog && !openInfoStatus">
              <Chart @switch="(e) => (hideChart = e)" :from="'constract'" :type="'constract'" :mini="true" />
            </div>
            <!-- 内容1 -->
            <div style="
                margin: 0.1rem;
                background-color: var(--ex-bg-color3);
                border-radius: 0.32rem;
              ">
              <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg van-tabs--market2"
                :color="'var(--ex-primary-color)'" v-model:active="activeTab2" animated shrink>
                <Tab :name="11" :title="$t('trade.stock_open')">
                  <OpeningContract :type="'commodities'" :item="item" ref="openingRef2" :from="'trade'" />
                </Tab>
                <Tab :title="t('trade.trade_orders_current')" :name="44">
                  <div style="height: 0.2rem"></div>
                  <div class="dialog-market-bg" v-if="activeTab2 == 44">
                    <PositionsContract :tradeType="'commodities'" />
                  </div>
                </Tab>
                <Tab :title="t('trade.trade_order_history')" :name="55">
                  <div style="height: 0.2rem"></div>
                  <div class="dialog-market-bg" v-if="activeTab2 == 55">
                    <InquireContract :scrollDom="'.dialog-market-box'" :tradeType="'commodities'" ref="InquireRef" />
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div style="height: 0.4rem"></div>
          </div>
        </Tab>
      </Tabs>
    </div>



    <!-- 详情 -->
    <BottomPopup round v-model:show="showInfoDialog" position="bottom" closeable teleport="body">
      <div class="page_trade_info" style="max-height: calc(var(--vh) * 90); overflow-y: auto"
        v-if="showInfoDialog && !openInfoStatus">
        <div style="height: 0.32rem"></div>
        <div
          style="text-align: center;color: var(--ex-text-color);font-size: 0.32rem;padding: 0.1rem 0 0.2rem 0;font-weight: bold;">
          {{
            item.type == 'stock' ? item.symbol : item.name }}</div>
        <MarketInfo2 :innerPage="true" />
      </div>
    </BottomPopup>

    <!-- 菜单 -->
    <Popup round v-model:show="showNavDialog" position="left" :style="{ width: '85%', height: '100%' }">
      <Index @handleClick="handleClickIndex" ref="IndexRef" :innerPage="true" />
    </Popup>


  </div>
  <div class="pt-[0.32rem]" v-else>
    <Finance />
  </div>
  <BottomPopup round :show="showOrderList" @close="closeOrderList()">
    <div class="absolute right-[0.22rem] p-[0.1rem] top-[0.3rem] z-10">
      <div class="size-[0.32rem]" @click="closeOrderList">
        <img :src="getStaticImgUrl('/static/img/common/close2.svg')" />
      </div>
    </div>
    <OrderCenter />
  </BottomPopup>

  <!-- 搜索 -->
  <SearchDialog @click="handleClick" :item="item" :activeTab="activeTab" ref="searchDialogRef" />
</template>

<script setup>
import ciper from "@/utils/ciper.js"
import { ref, computed, onMounted, onActivated, onDeactivated } from 'vue';
import { Tabs, Tab, Icon, Popup } from 'vant';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import store from '@/store';
import { getStaticImgUrl, _formatNumber } from '@/utils/index.js';
import { _futures, _basic, _add, _del, _stock, _aiquant2, _trade } from '@/api/api';
import BottomPopup from '@/components/BottomPopup.vue';
import Loaidng from '@/components/Loaidng.vue';
import router from '@/router';
import LoadingMore from '@/components/LoadingMore.vue';
import eventBus from '@/utils/eventBus.js';
// 公共
import StockTable from '@/components/StockTable.vue';
import OrderingSpot from '@/views/Market/OrderingSpot.vue';
import Chart from '@/views/Market/Chart.vue';
// 股票
import OpeningStock from '@/views/Trade2/components/Opening.vue';
import PositionsStock from '@/views/Trade2/components/Positions.vue';
import InquireStock from '@/views/Trade2/components/Inquire.vue';
// 现货
import OpeningSpot from '@/views/Trade2/spot/Opening.vue';
import PositionsSpot from '@/views/Trade2/spot/Positions.vue';
import InquireSpot from '@/views/Trade2/spot/Inquire.vue';
// 合约
import OpeningContract from '@/views/Trade2/contract/Opening.vue';
import PositionsContract from '@/views/Trade2/contract/Positions.vue';
import InquireContract from '@/views/Trade2/contract/Inquire.vue';
// 交易机器人
import OpeningAi from '@/views/Trade2/ai/Opening.vue';
import PositionsAi from '@/views/Trade2/ai/Positions.vue';
import InquireAi from '@/views/Trade2/ai/Inquire.vue';
// 详情
import MarketInfo2 from '@/views/Market/MarketInfo2.vue';
// 导航
import Index from './Index.vue';
import HeaderTabs from '../../components/HeaderTabs.vue';
import Finance from '@/views/Finance/Index.vue';
import OrderCenter from './OrderCenter.vue';
import SearchDialog from "./SearchDialog.vue"


const props = defineProps({
  type: {
    type: String,
    default: '',
  },
});


const openInfoStatus = computed(() => store.state.openInfoStatus);
const showRightMenu = computed(() => store.state.showRightMenu);
const { t } = useI18n();
const route = useRoute();
const token = computed(() => store.state.token);
const headActiveTab = ref(Number(sessionStorage.getItem("tradeType")));
const showOrderList = ref(false);


// 搜索弹窗
const searchDialogRef = ref()
const openSearch = () => {
  searchDialogRef.value && searchDialogRef.value.open()
}

const changeTab = (val) => {
  store.commit('setTradeTypeTab', val);
  sessionStorage.setItem('tradeType', val);
  headActiveTab.value = val;
};

const openOrderList = () => {
  showOrderList.value = true;
};

const closeOrderList = () => {
  showOrderList.value = false;
};

// 详情弹窗
const showInfoDialog = ref(false);
const goMaret = () => {
  showInfoDialog.value = true;
};
// 分类
const activeTab = ref(1); // 一级
const setTab = () => {
  if (route.query.tradeType == "constract" || route.query.tradeType == "crypto") {
    activeTab.value = 2;
  } else if (route.query.tradeType == "spot") {
    activeTab.value = 1;
  } else if (route.query.tradeType == "ai") {
    activeTab.value = 3;
  } else if (route.query.tradeType == "stock") {
    activeTab.value = 4;
  } else if (
    route.query.tradeType == "foreign" ||
    route.query.tradeType == "forex"
  ) {
    activeTab.value = 5;
  } else if (
    route.query.tradeType == "commodities" ||
    route.query.tradeType == "blocktrade"
  ) {
    activeTab.value = 6;
  } else {
    if (sessionStorage.getItem("tradeinfo-tab")) {
      activeTab.value = Number(sessionStorage.getItem("tradeinfo-tab"));
    }
  }
}
watch(route, (val) => {
  if (val.name == "tradeInfo" && val.query.tradeType) {
    if (['copy', 'borrow', 'stake', 'ipo'].includes(val.query.tradeType)) { // 理财
      headActiveTab.value = 1
    } else {
      headActiveTab.value = 0
      setTab()
      setTimeout(() => {
        changeTab2(activeTab.value)
      }, 0)
    }
  }
}, { immediate: true })

const activeTab2 = ref(11); // 二级
const hideChart = ref(false); // 折叠图表

const tradeTypeMap = {
  1: 'spot',
  2: 'constract',
  3: 'ai',
  4: 'stock',
  5: 'foreign',
  6: 'commodities',
};

const activeTradeTab = ref(0);

const changeActiveTab = (val) => {
  activeTradeTab.value = val;
};

const changeTab2 = (e) => {
  activeTab.value = e;
  activeTab2.value = 11
  hideChart.value = false;
  sessionStorage.setItem('tradeinfo-tab', e);
  setTimeout(() => {
    router.replace({
      name: 'tradeInfo',
      query: {
        symbol: ciper.encrypt(item.value.symbol),
        type: tradeTypeMap[e] == 'spot' ? 'constract' : tradeTypeMap[e],
        tradeType: tradeTypeMap[e],
      },
    });
    if (searchDialogRef.value) {
      searchDialogRef.value.searchDialogStr = ''
      searchDialogRef.value.initTabList();
    }
  }, 0);
};

// 股票信息
const item = computed(() => {
  return {
    1: store.state.currSpot, // 现货
    2: store.state.currConstact, // 合约 
    3: store.state.currAi,
    4: store.state.currStockItem,
    5: store.state.currForeign,
    6: store.state.currCommodities
  }[activeTab.value] || {}
});

// 获取股票最新信息
const getBasic = (obj, tab) => {
  _basic({ symbol: obj.symbol }).then((res) => {
    if (res.code == 200) {
      if (res.data.symbol == item.value.symbol) {
        switch (tab) {
          case 4: // 股票
            store.commit('setCurrStockItem', {
              ...obj,
              ...res.data,
            });
            break;
          case 1: // 现货
            store.commit('setCurrSpot', {
              ...obj,
              ...res.data,
            });
            break;
          case 2: // 合约
            store.commit('setCurrConstract', {
              ...obj,
              ...res.data,
            });
            break;
          case 3: // ai
            store.commit('setCurrAi', {
              ...obj,
              ...res.data,
            });
            break;
          case 5: // 外汇
            store.commit('setCurrForeign', {
              ...obj,
              ...res.data,
            });
            break;
          case 6: // 大宗商品
            store.commit('setCurrCommodities', {
              ...obj,
              ...res.data,
            });
            break;
        }
      }
    }
  });
};
if (item.value.symbol) {
  getBasic(item.value, activeTab.value);
}
const chartLoading = ref(true);
onMounted(() => {
  setTimeout(() => {
    chartLoading.value = false;
  }, 500);
});
const handleClick = (obj) => {
  obj = JSON.parse(JSON.stringify(obj));
  chartLoading.value = true;
  if (activeTab.value == 1) {
    store.commit('setCurrSpot', obj);
  }
  if (activeTab.value == 2) {
    store.commit('setCurrConstract', obj);
  }
  if (activeTab.value == 3) {
    store.commit('setCurrAi', obj);
  }
  if (activeTab.value == 4) {
    store.commit('setCurrStockItem', obj);
  }
  if (activeTab.value == 5) {
    store.commit('setCurrForeign', obj);
  }
  if (activeTab.value == 6) {
    store.commit('setCurrCommodities', obj);
  }
  setTimeout(() => {
    router.replace({
      name: 'tradeInfo',
      query: {
        symbol: ciper.encrypt(obj.symbol),
        type:
          tradeTypeMap[activeTab.value] == 'spot'
            ? 'constract'
            : tradeTypeMap[activeTab.value],
        tradeType: tradeTypeMap[activeTab.value],
      },
    });
  }, 100);
  setTimeout(() => {
    getBasic(obj, activeTab.value);
    chartLoading.value = false;
  }, 200);
};
const handleClickIndex = ({ item, type }) => {
  if (type) {
    switch (type) {
      case 'stock':
        activeTab.value = 4;
        break;
      case 'spot':
        activeTab.value = 1;
        break;
      case 'constract':
        activeTab.value = 2;
        break;
      case 'ai':
        activeTab.value = 3;
        break;
      case 'foreign':
        activeTab.value = 5;
        break;
      case 'commodities':
        activeTab.value = 6;
        break;
    }
  }
  setTimeout(() => {
    handleClick(item);
    showNavDialog.value = false;
  }, 300);
};

// 添加自选
const loading = ref(false);
const addCollect = (tab) => {
  if (!token.value) return store.commit('setIsLoginOpen', true);
  if (loading.value) return;
  loading.value = true;
  if (!item.value.watchlist) {
    _add({
      symbol: item.value.symbol,
    })
      .then((res) => {
        if (res.code == 200) {
          store.dispatch('updateMarketWatchList');
          switch (tab) {
            case 1: // 现货
              store.commit('setCurrSpot', { watchlist: 1 });
              break;
            case 2: // 合约
              store.commit('setCurrConstract', { watchlist: 1 });
              break;
            case 3: // ai
              store.commit('setCurrAi', { watchlist: 1 });
              break;
            case 4: // 股票
              store.commit('setCurrStockItem', { watchlist: 1 });
              break;
            case 5:
              store.commit('setCurrForeign', { watchlist: 1 });
              break;
            case 6:
              store.commit('setCurrCommodities', { watchlist: 1 });
              break;
          }
        }
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    _del({
      symbol: item.value.symbol,
    })
      .then((res) => {
        if (res.code == 200) {
          store.dispatch('updateMarketWatchList');
          switch (tab) {
            case 1: // 现货
              store.commit('setCurrSpot', { watchlist: 0 });
              break;
            case 2: // 合约
              store.commit('setCurrConstract', { watchlist: 0 });
              break;
            case 3: // ai
              store.commit('setCurrAi', { watchlist: 0 });
              break;
            case 4: // 股票
              store.commit('setCurrStockItem', { watchlist: 0 });
              break;
            case 5:
              store.commit('setCurrForeign', { watchlist: 0 });
              break;
            case 6:
              store.commit('setCurrCommodities', { watchlist: 0 });
              break;
          }
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

// 侧边弹框
const showNavDialog = ref(false);
const IndexRef = ref();
const openMenu = () => {
  showNavDialog.value = true;
  setTimeout(() => {
    IndexRef.value && IndexRef.value.act();
  }, 0);
};

// 选择股票
const clickStockHandle = () => {
  chartLoading.value = true;
  setTimeout(() => {
    chartLoading.value = false;
  }, 200);
};

// 打开右侧菜单
const openRightMenu = () => {
  store.commit("setShowRightMenu", !showRightMenu.value);
};

watch(
  () => store.state.isLoginOpen,
  (v) => {
    if (v) {
      closeOrderList();
    }
  },
);

onActivated(() => {
  eventBus.on('clickStock', clickStockHandle);
  setTimeout(() => {
    chartLoading.value = false;
  }, 500);

  setTimeout(() => {
    if (!route.query.tradeType) {
      router.replace({
        name: 'tradeInfo',
        query: {
          tradeType: {
            1: 'spot',
            2: 'constract',
            3: 'ai',
            4: 'stock',
            5: 'forex',
            6: 'commodities'
          }[activeTab.value]
        }
      })
    }
  }, 300)
});
onDeactivated(() => {
  chartLoading.value = true;
  eventBus.off('clickStock', clickStockHandle);
});
</script>

<style lang="less" scoped>
.right-menu-popup {
  height: 100%;
  background-color: var(--ex-bg-color3);
  padding: 0.24rem 0;
  overflow-y: auto;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.4rem;
    height: 0.92rem;

    &:active {
      background-color: var(--ex-bg-white2);
    }

    .subitem {
      padding: 0.1rem 0;
    }

    .icon {
      width: 0.48rem;
      height: 0.48rem;
      margin-right: 0.16rem;
    }

    .name {
      flex: 1;
      text-align: left;
      font-size: 0.32rem;
      color: var(--ex-white);
    }

    .more {
      width: 0.28rem;
      height: 0.28rem;
      transition: all ease-in .2s;
    }

    .open {
      transform: rotate(-180deg);
    }
  }
}

.search_dialog_trade {
  .lists {
    height: calc(var(--vh) * 60);
    overflow-y: auto;
    margin-top: 0.32rem;
    padding-bottom: 0.2rem;
  }

  .search_box {
    height: 1rem;
    padding: 0 0.32rem;
    margin: 0.4rem 0.3rem 0 0.3rem;
    display: flex;
    align-items: center;
    background-color: var(--ex-bg-white1);
    border-radius: 0.6rem;
    // border: 1px solid var(--ex-border-color2);

    .search_icon {
      width: 0.48rem;
      height: 0.48rem;
      margin-right: 0.24rem;
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


.page-marketinfo2 {
  // padding: 1.8rem 0 0 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: var(--ex-bg-color);

  .icon {
    position: absolute;
    width: 0.72rem;
    height: 0.72rem;
    border-radius: 50%;
    background-color: var(--ex-bg-color3);
    z-index: 99;
    top: 0.08rem;
    right: 0.2rem;
  }

  .icon2 {
    padding: 0.16rem;
  }

  .icon_active {
    background-color: var(--ex-primary-color);
  }

  .right-icon {
    position: absolute;
    right: 0.24rem;
    top: 0.08rem;
    z-index: 99;
    width: 0.72rem;
    height: 0.72rem;
  }

  .left-icon {
    height: 0.88rem;
    display: flex;
    align-items: center;
    position: absolute;
    left: 0.2rem;
    top: 0rem;
    z-index: 99;
  }

  .market-trade-body {

    .dialog-market-box {
      margin-top: 0.1rem;
      height: calc(var(--vh) * 100 - 1rem);
      overflow-y: auto;
      padding-bottom: 1rem;

      :deep(.van-tabs--market2) {
        &>.van-tabs__wrap {
          border-bottom: 1px solid var(--ex-border-color4);

          .van-tabs__nav {
            background: var(--ex-none);

            .van-tab {
              span {
                font-size: 0.32rem;
              }
            }
          }

          .van-tabs__line {
            width: 0.4rem;
            height: 0.06rem;
            background-color: var(--ex-primary-color);
          }
        }
      }

      .top-box {
        border-radius: 0.32rem;
        background-color: var(--ex-bg-color3);
        margin: 0.1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.28rem;
        height: 0.96rem;
      }

      .charts-box {
        padding: 0 0.1rem;
        height: 5rem;
      }

      .hide-charts-box {
        height: 1rem;
      }

      .dialog-market-bg {
        background-color: var(--ex-bg-color3);
        border-radius: 0.32rem;
        padding: 0 0.24rem 0.24rem 0.24rem;
      }
    }
  }

  .bottom-box {
    margin-top: 0.32rem;
    height: 1.4rem;
    background-color: var(--ex-bg-color3);
    border-radius: 0.32rem 0.32rem 0 0;
    padding: 0.18rem 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--ex-bg-white1);

    .info {
      .name {
        font-size: 0.32rem;
      }

      .type {
        margin-top: 0.16rem;
        color: var(--ex-text-color5);
        height: 0.36rem;
        align-items: center;
        justify-content: center;
        border-radius: 0.4rem;
        padding: 0 0.16rem;
        display: inline-flex;
        border: 1px solid var(--ex-text-color5);
      }
    }

    .btn {
      background-color: var(--ex-status-color3);
      width: 2.88rem;
      height: 0.92rem;
      border-radius: 1rem;
      color: var(--ex-white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.32rem;
    }
  }

  .market-box {
    margin-top: 0.1rem;
    height: calc(var(--vh) * 100 - 6rem) // border-radius: 0.32rem;
      // background-color: var(--ex-bg-color3);
  }


  .has_padding_x {
    padding: 0 0.3rem;
  }

}
</style>
