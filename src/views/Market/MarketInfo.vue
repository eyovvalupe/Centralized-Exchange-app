<!-- 市场详情 -->
<template>
  <div class="page page_marketinfo" :class="{ innerpage_marketinfo: props.innerPage }" :style="{
    backgroundColor: from == 'contract' ? 'var(--ex-bg-color9)' : '',
  }">
    <!-- 头部 -->
    <div class="max-width info_header">
      <div class="top">
        <div v-if="!props.innerPage" class="back" @click="backFunc">
          <Icon name="arrow-left" />
        </div>

        <!-- 标题 -->
        <div class="title" v-if="route.query.type == 'stock'">
          <div class="title_name">{{ item.symbol || '--' }}</div>
          <div v-if="showDate" class="leading-[0.4rem]">
            {{ showDate }}
          </div>
        </div>
        <div class="title" v-else @click="showSearchDialog = true">
          <div class="title_name">
            {{ item.name || '--' }}
            <Icon v-if="from != 'contract'" name="arrow-down" />
          </div>
        </div>
        <!-- 详情 -->
        <div class="title_shadow"></div>
        <div v-if="!props.innerPage" class="search star" @click="addCollect"
          :style="{ opacity: loading ? '0.5' : '1' }">
          <div class="size-[0.48rem]">
            <img v-if="item.watchlist == 1" v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="" />
            <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="" />
          </div>
        </div>
      </div>

      <div style="border-radius: 0.32rem; padding: 0.28rem" :style="from == 'contract'
        ? 'background-color: var(--ex-bg-white2);'
        : 'background-color: var(--ex-bg-color3);'
        ">
        <div class="flex items-center justify-center gap-[0.2rem]">
          <div class="w-[2.6rem] flex-shrink-0">
            <h1 class="flex items-center" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">
              <span class="text-[0.4rem] font-[600]" v-if="item.price || item.close">
                {{ item.price || item.close }}
              </span>
              <span class="text-[0.4rem] font-[600]" v-else>--</span>
              <span class="w-[0.24rem] h-[0.26rem] ml-[0.06rem] mt-[0.06rem]">
                <img v-lazy="getStaticImgUrl('/static/img/market/up_icon.svg')" v-if="updown > 0" />
                <img v-lazy="getStaticImgUrl('/static/img/market/down_icon.svg')" v-else-if="updown < 0" />
              </span>
            </h1>
            <div class="flex mt-[0.2rem]" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">
              <div class="text-[0.24rem]" v-if="item.price * (item.ratio || 0)">
                {{ updown === 0 ? '' : updown > 0 ? '+' : '' }}
                {{ item.change ? item.change : '--' }}
              </div>
              <div class="text-[0.24rem] ml-[0.16rem]" v-if="item.ratio">
                {{
                  item.ratio === undefined
                    ? '--'
                    : item.ratio > 0
                      ? '+' + item.ratio + '%'
                      : item.ratio + '%'
                }}
              </div>
            </div>
          </div>
          <div class="count flex-1">
            <div class="count_item">
              <span class="text-color3">{{
                t('market.market_marketinfo_high')
              }}</span>
              <span class="num" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">{{ item.high || '--' }}</span>
            </div>
            <div class="count_item">
              <span class="text-color3">{{
                t('market.market_marketinfo_low')
              }}</span>
              <span class="num" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">{{ item.low || '--' }}</span>
            </div>
            <div class="count_item">
              <span class="text-color3">{{
                t('market.market_marketinfo_open')
              }}</span>
              <span class="num" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">{{ item.open || '--' }}</span>
            </div>
            <div class="count_item">
              <span class="text-color3">{{
                t('market.market_marketinfo_close')
              }}</span>
              <span class="num" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">{{ item.close || '--'
              }}</span>
            </div>
          </div>
        </div>
        <div class="flex text-[0.24rem] pt-[0.2rem] gap-[0.2rem]">
          <div class="w-[2.6rem] flex-shrink-0">
            <span class="text-color3">{{
              t('market.market_marketinfo_value')
            }}</span>
            <span class="text-color ml-[0.12rem]">{{
              _formatNumber(item.amount)
            }}</span>
          </div>
          <div class="flex-1">
            <span class="text-color3">{{
              t('market.market_marketinfo_amount')
            }}</span>
            <span class="text-color ml-[0.12rem]">{{
              _formatNumber(item.volume)
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div style="
        border-radius: 0.32rem;
        margin: 0.1rem;
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      " :style="from == 'contract'
        ? 'background-color: var(--ex-bg-white2);'
        : 'background-color: var(--ex-bg-color3);'
        ">
      <div class="mt-[0.2rem] h-[0.2rem]"></div>
      <!-- 内容 -->
      <div class="market_content">
        <!-- 图表 -->
        <div class="chart_box">
          <div class="tabs">
            <div class="tab tab_ani" :class="{ active_tab: timeType == 'Time' }"
              :style="{ backgroundColor: from == 'contract' && timeType != 'Time' ? 'var(--ex-bg-white2)' : '', color: from == 'contract' && timeType != 'Time' ? 'var(--ex-white)' : '' }"
              @click="changeType('Time')">
              Time
            </div>
            <div class="tab tab_ani" @click="showPicker = true" :class="{ active_tab: minList.includes(timeType) }"
              :style="{ backgroundColor: from == 'contract' && !minList.includes(timeType) ? 'var(--ex-bg-white2)' : '', color: from == 'contract' && !minList.includes(timeType) ? 'var(--ex-white)' : '' }">
              {{ currMin }}
              <Icon style="transform: rotate(90deg)" size="0.16rem" class="ml-[0.06rem]" name="play" />
            </div>
            <div class="tab tab_ani" :class="{ active_tab: timeType == '1h' }" @click="changeType('1h')"
              :style="{ backgroundColor: from == 'contract' && timeType != '1h' ? 'var(--ex-bg-white2)' : '', color: from == 'contract' && timeType != '1h' ? 'var(--ex-white)' : '' }">
              1h
            </div>
            <div class="tab tab_ani" v-if="!['stocks', 'forex'].includes(periodType)"
              :class="{ active_tab: timeType == '4h' }" @click="changeType('4h')"
              :style="{ backgroundColor: from == 'contract' && timeType != '4h' ? 'var(--ex-bg-white2)' : '', color: from == 'contract' && timeType != '4h' ? 'var(--ex-white)' : '' }">
              4h
            </div>
            <div class="tab tab_ani" :class="{ active_tab: timeType == '1D' }" @click="changeType('1D')"
              :style="{ backgroundColor: from == 'contract' && timeType != '1D' ? 'var(--ex-bg-white2)' : '', color: from == 'contract' && timeType != '1D' ? 'var(--ex-white)' : '' }">
              1D
            </div>
            <div class="tab tab_ani" :class="{ active_tab: timeType == '1W' }" @click="changeType('1W')"
              :style="{ backgroundColor: from == 'contract' && timeType != '1W' ? 'var(--ex-bg-white2)' : '', color: from == 'contract' && timeType != '1W' ? 'var(--ex-white)' : '' }">
              1W
            </div>
            <div class="tab tab_ani" :class="{ active_tab: timeType == '1M' }" @click="changeType('1M')"
              :style="{ backgroundColor: from == 'contract' && timeType != '1M' ? 'var(--ex-bg-white2)' : '', color: from == 'contract' && timeType != '1M' ? 'var(--ex-white)' : '' }">
              1M
            </div>
            <div class="tab tab_ani" v-if="!['stocks', 'forex'].includes(periodType)"
              :class="{ active_tab: timeType == '1Y' }" @click="changeType('1Y')"
              :style="{ backgroundColor: from == 'contract' && timeType != '1Y' ? 'var(--ex-bg-white2)' : '', color: from == 'contract' && timeType != '1Y' ? 'var(--ex-white)' : '' }">
              1Y
            </div>
            <div style="flex: 1"></div>
            <div class="full-tab" @click="fullScreen(true)">
              <img v-lazy="getStaticImgUrl('/static/img/common/full.svg')" alt="" />
            </div>
          </div>
          <div v-if="!chartLoading" class="chart_container" :class="{ fullscreen_container: fullWindow }">
            <!-- 时区 -->
            <div v-if="showDate" class="chart_time"
              :style="{ backgroundColor: from == 'contract' ? 'var(--ex-bg-white2)' : '', color: from == 'contract' ? 'var(--ex-white)' : '' }">
              {{ showDate }}</div>
            <!-- 分时图 -->
            <AreaChart ref="AreaChartRef" v-if="timeType == 'Time'" :showY="true" :symbol="item.symbol" />
            <!-- K线图 -->
            <KlineChart ref="KlineChartRef" v-if="timeType != 'Time'" :symbol="item.symbol" :period="timeType" />
            <!-- 全屏关闭按钮 -->
            <div class="full_close" v-if="fullWindow" @click="fullScreen(false)">
              <Icon name="cross" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 操作 -->
    <div class="market_bottom" v-if="!props.innerPage">
      <div class="bottom_btn ripple-btn" @click="goBuy(true)" style="background-color: var(--ex-up-color)">
        <span class="bottom_btn_icon">
          <img v-lazy="getStaticImgUrl('/static/img/market/up.svg')" />
        </span>
        <span>{{
          tradeType == 'spot'
            ? t('market.market_buy_fast_buy')
            : t('market.market_marketinfo_long')
        }}</span>
      </div>
      <div class="bottom_btn ripple-btn" @click="goBuy(false)" style="background-color: var(--ex-down-color)">
        <span class="bottom_btn_icon">
          <img v-lazy="getStaticImgUrl('/static/img/market/down.svg')" />
        </span>
        <span>{{
          tradeType == 'spot'
            ? t('market.market_buy_fast_sell')
            : t('market.market_marketinfo_short')
        }}</span>
      </div>
    </div>
    <!-- 时间选择弹窗 -->
    <BottomPopup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showPicker">
      <div class="times_list">
        <div v-for="item in minList" :key="item" @click="chooseTime(item)" class="item"
          :class="{ active_item: currMin == item }">
          {{ item }}
        </div>
      </div>
    </BottomPopup>
    <!-- 交易弹窗 -->
    <BottomPopup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showBuy" closeable>
      <div class="buy_popup">
        <div class="buy_name">{{ t('market.market_marketinfo_trade') }}</div>
        <div class="buy_popup_btn" @click="goBuy(true)">
          <span>{{ t('market.market_marketinfo_long') }}</span>
          <div class="btn_icon">
            <img v-lazy="getStaticImgUrl('/static/img/market/market.svg')" alt="img" />
          </div>
        </div>
        <div class="buy_popup_btn buy_popup_btn2" @click="goBuy(false)">
          <span>{{ t('market.market_marketinfo_short') }}</span>
          <div class="btn_icon">
            <img v-lazy="getStaticImgUrl('/static/img/market/market.svg')" alt="img" />
          </div>
        </div>
      </div>
    </BottomPopup>

    <!-- 数据弹窗 -->
    <BottomPopup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showInfo"
      :title="t('market.market_marketinfo_data')" closeable>
      <div class="info_popup">
        <div class="info_price">
          <div class="info_num" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">
            <template v-if="item.price || item.close">
              {{ item.price || item.close }}
            </template>
            <span v-else>--</span>
          </div>
          <div style="display: flex; align-items: center" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">
            <div v-if="Number(item.change)" :class="[
              updown === 0 ? '' : updown > 0 ? 'price_up' : 'price_down',
            ]">
              {{ updown === 0 ? '' : updown > 0 ? '+' : '' }}{{ item.change }}
            </div>
            <div v-if="item.ratio" style="margin-left: 0.15rem" :class="[
              updown === 0
                ? ''
                : updown > 0
                  ? 'percentage_up'
                  : 'percentage_down',
            ]">
              {{
                updown === 0 || item.ratio === undefined
                  ? ''
                  : updown > 0
                    ? '+'
                    : ''
              }}{{ item.ratio === undefined ? '--' : item.ratio + '%' }}
            </div>
          </div>
        </div>
        <div class="info_items">
          <div class="info_item" :style="{
            backgroundImage: `url(${getStaticImgUrl(
              '/static/img/common/price_bg.svg',
            )})`,
          }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t('market.market_marketinfo_open') }}</div>
            <div class="info_item__value">{{ item.open }}</div>
          </div>
          <div class="info_item" :style="{
            backgroundImage: `url(${getStaticImgUrl(
              '/static/img/common/price_bg.svg',
            )})`,
          }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t('market.market_marketinfo_high') }}</div>
            <div class="info_item__value">{{ item.high }}</div>
          </div>
          <div class="info_item" :style="{
            backgroundImage: `url(${getStaticImgUrl(
              '/static/img/common/price_bg.svg',
            )})`,
          }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t('market.market_marketinfo_amount') }}</div>
            <div class="info_item__value">{{ _formatNumber(item.volume) }}</div>
          </div>
          <div class="info_item" :style="{
            backgroundImage: `url(${getStaticImgUrl(
              '/static/img/common/price_bg.svg',
            )})`,
          }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t('market.market_marketinfo_close') }}</div>
            <div class="info_item__value">{{ item.close }}</div>
          </div>
          <div class="info_item" :style="{
            backgroundImage: `url(${getStaticImgUrl(
              '/static/img/common/price_bg.svg',
            )})`,
          }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t('market.market_marketinfo_low') }}</div>
            <div class="info_item__value">{{ item.low }}</div>
          </div>
          <div class="info_item" :style="{
            backgroundImage: `url(${getStaticImgUrl(
              '/static/img/common/price_bg.svg',
            )})`,
          }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t('market.market_marketinfo_value') }}</div>
            <div class="info_item__value">{{ _formatNumber(item.amount) }}</div>
          </div>
        </div>
      </div>
    </BottomPopup>

    <!-- 交易弹窗 -->
    <Popup class="trade-popup" v-model:show="showDialog" :title="''" position="bottom" close-on-popstate>
      <div style="padding: 0.5rem 0.32rem 0 0.32rem; width: 100%; height: 100%">
        <div class="trade-popup-title">
          <div class="back" @click="showDialog = false">
            <Icon name="arrow-left" />
          </div>
          <div class="title">{{ item.name }}</div>
          <div style="width: 0.6rem; height: 0.6rem"></div>
        </div>
        <!-- 合约-->
        <Opening :item="item" v-if="tradeType == 'constract'" ref="openingRef" @success="showDialog = false"
          :from="'trade'" />
        <!-- 现货 -->
        <OpeningSpot :item="item" v-if="tradeType == 'spot'" ref="openingRef2" @success="showDialog = false"
          :from="'trade'" />
      </div>
    </Popup>

    <!-- 搜索列表 -->
    <BottomPopup round v-model:show="showSearchDialog" position="bottom" closeable teleport="body">
      <div class="van-popup-custom-title">
        {{ t('trade.stock_opening_search') }}
      </div>
      <div class="search_dialog_trade">
        <!-- 搜索 -->
        <div class="item search_box">
          <div class="search_icon">
            <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="🔍" />
          </div>
          <input v-model.trim="searchDialogStr" @keyup="goDialogSearch" type="text" class="ipt" style="width: 100%"
            :placeholder="t('trade.stock_opening_search')" />
        </div>

        <div class="lists">
          <StockTable :showIcon="true" theme="classic" :handleClick="handleClick" :loading="searchLoading"
            :key="'search'" :list="marketSearchList" />
        </div>
      </div>
    </BottomPopup>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from '@/utils/index.js';
import { Icon, Popup, showToast } from 'vant';
import router from '@/router';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import store from '@/store';
import AreaChart from '@/components/KlineCharts/AreaChart.vue';
import KlineChart from '@/components/KlineCharts/KlineChart.vue';
import { _formatNumber } from '@/utils/index';
import { _basic, _profile, _add, _del, _futures } from '@/api/api';
import { formatTimestamp } from '@/utils/time';
import { useI18n } from 'vue-i18n';
import BottomPopup from '@/components/BottomPopup.vue';
import Opening from '@/views/Trade2/contract/Opening.vue';
import OpeningSpot from '@/views/Trade2/spot/Opening.vue';
import StockTable from '@/components/StockTable.vue';

const { t } = useI18n();
const route = useRoute();
const token = computed(() => store.state.token);

// const activeTab = ref(1)
const props = defineProps({
  innerPage: {
    // 作为内置展示页
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: '',
  },
  from: {
    type: String,
    default: '',
  },
});

// 添加自选
const loading = ref(false);
const addCollect = () => {
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
          switch (route.query.type) {
            case 'constract': // 合约
              store.commit('setCurrConstract', { watchlist: 1 });
              break;
            default:
              store.commit('setCurrStockItem', { watchlist: 1 });
          }
          showToast(t('market.market_optional_add_success'));
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
          switch (route.query.type) {
            case 'constract': // 合约
              store.commit('setCurrConstract', { watchlist: 0 });
              break;
            default:
              store.commit('setCurrStockItem', { watchlist: 0 });
          }
          showToast(t('market.market_optioanl_del_success'));
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const periodType = computed(() => route.query.type || props.type);
const tradeType = ref(route.query.tradeType);
// 股票信息
const item = computed(() => {
  let it = {};
  const type = route.query.type || props.type;
  switch (type) {
    case 'constract': // 合约
      it = store.state.currConstact || {};
      break;
    case 'ai': // 合约
      it = store.state.currAi || {};
      break;
    default:
      it = store.state.currStockItem || {};
  }
  return it;
});

const showDate = computed(() => {
  // 展示的数据时间
  if (item.value.timestamp || item.value.ts) {
    return formatTimestamp(
      item.value.timestamp || item.value.ts,
      item.value.timezone,
    );
  }
  return '';
});

const updown = computed(() => {
  // 1-涨 -1-跌 0-平
  if (item.value.ratio === undefined) return 0;
  return item.value.ratio > 0 ? 1 : -1;
});

// 获取股票最新信息
const getBasic = (obj) => {
  _basic({ symbol: obj.symbol }).then((res) => {
    if (res.code == 200) {
      if (res.data.symbol == item.value.symbol) {
        const type = route.query.type || props.type;
        switch (type) {
          case 'constract': // 合约
            store.commit('setCurrConstract', {
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
  getBasic(item.value);
}

// 图表信息  Time 1m 5m 10m 15m 30m 1h 4h 1D 1W 1M 1Y
const timeType = ref('1h');
const showPicker = ref(false); // 时间选择弹窗
const currMin = ref('1m');
const minList = computed(() => {
  if (
    periodType.value == 'futures' ||
    periodType.value == 'aiquant' ||
    periodType.value == 'constract'
  ) {
    return ['1m', '5m', '15m', '30m'];
  }
  return ['1m', '5m', '10m', '15m', '30m'];
});
const chooseTime = (time) => {
  showPicker.value = false;
  currMin.value = time;
  changeType(time);
};
const changeType = (type) => {
  if (timeType.value == type) return;
  timeType.value = type;
};

// 投注折叠
const switchKey = ref(false);

// 全屏
store.commit('setFullscreen', false);
const fullWindow = computed(() => store.state.fullscreen);
const KlineChartRef = ref();
const AreaChartRef = ref();
const fullScreen = (key) => {
  store.commit('setFullscreen', key);
  if (KlineChartRef.value) KlineChartRef.value.resetSize();
  if (AreaChartRef.value) AreaChartRef.value.resetSize();
};

// 下单
const showDialog = ref(false);
const openingRef = ref();
const openingRef2 = ref();
const goBuy = (key) => {
  showDialog.value = true;
  setTimeout(() => {
    openingRef.value && openingRef.value.choose(item.value, key);
    openingRef2.value && openingRef2.value.choose(item.value, key);
  }, 300);
};

// 返回
const emits = defineEmits(['back']);
const backFunc = () => {
  if (props.innerPage) {
    emits('back');
  } else {
    router.back();
  }
};

// 弹窗
const showBuy = ref(false);
const showInfo = ref(false);

const chartLoading = ref(false);
const handleClick = (obj) => {
  console.error(obj);
  showSearchDialog.value = false;
  chartLoading.value = true;
  store.commit('setCurrConstract', obj);
  getBasic(obj);
  setTimeout(() => {
    chartLoading.value = false;
  }, 0);
};

// 搜索
const marketSearchList = computed(() => store.state.futuresSearchList);
const showSearchDialog = ref(false);
const searchDialogStr = ref('');
let searchTimeout = null;
const searchLoading = ref(false);
const goDialogSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchLoading.value = true;
  let s = searchDialogStr.value;
  searchTimeout = setTimeout(() => {
    _futures({
      name: s,
      type: '',
    })
      .then((res) => {
        if (searchDialogStr.value == s) {
          let arr = (res.data || []).map((item) => {
            const target = marketSearchList.value.find(
              (a) => a.symbol == item.symbol,
            );
            if (target)
              return {
                ...target,
                ...item,
              };
            return item;
          });
          store.commit('setFuturesSearchList', arr);
          store.dispatch('subList', {
            commitKey: 'setFuturesSearchList',
            listKey: 'futuresSearchList',
          });
        }
      })
      .finally(() => {
        searchLoading.value = false;
      });
  }, 100);
};
setTimeout(() => {
  goDialogSearch();
}, 2000);
</script>

<style lang="less" scoped>
.search_dialog_trade {
  .lists {
    height: calc(var(--vh) * 60);
    overflow-y: auto;
    margin-top: 0.32rem;
  }

  .search_box {
    height: 0.8rem;
    padding: 0 0.32rem;
    margin: 0.4rem 0.3rem 0 0.3rem;
    display: flex;
    align-items: center;
    background-color: var(--ex-bg-white1);
    border-radius: 0.6rem;
    border: 1px solid var(--ex-border-color2);

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

.page_marketinfo {
  // padding: 1.8rem 0 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;

  :deep(.trade-popup) {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 0;

    .trade-popup-title {
      width: 100%;
      top: 0.18rem;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .back {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background-color: var(--ex-bg-white);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.32rem;
      }

      .title {
        text-align: center;
        font-size: 0.32rem;
        color: var(--ex-white);
      }
    }
  }

  .has_padding_x {
    padding: 0 0.3rem;
  }

  .info_header {
    width: 100%;
    background-color: var(--ex-bg-color);
    padding: 0 0.1rem;
    z-index: 100;

    .top {
      display: flex;
      min-height: 1rem;
      align-items: center;
      justify-content: space-between;
      position: relative;
      height: 0.88rem;
      margin-bottom: 0.1rem;
      padding: 0 0.2rem;

      .back {
        width: 0.6rem;
        height: 0.6rem;
        font-size: 0.32rem;
        background-color: var(--ex-bg-color3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .title_shadow {
        flex: 1;
      }

      .star {
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .title {
        // pointer-events: none;
        position: absolute;
        width: calc(100% - 1.6rem);
        top: 50%;
        transform: translateY(-50%) translateX(-50%);
        left: 50%;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 0.24rem;
        line-height: 0.332rem;
        font-weight: 400;
        color: var(--ex-text-color3);

        .title_name {
          color: var(--ex-text-color);
          font-size: 0.32rem;
          line-height: 0.432rem;
          font-weight: 500;
        }
      }
    }

    .count {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;

      .count_item {
        color: var(--ex-text-color2);
        font-size: 0.24rem;
        font-weight: 400;
        line-height: 0.36rem;
        width: 50%;
        margin-top: 0.18rem;

        .num {
          margin-left: 0.1rem;
        }
      }
    }
  }

  .submit {
    color: var(--ex-white);
    height: 0.8rem;
    border-radius: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.28rem;
    z-index: 100;
    margin-right: 0.2rem;
  }

  .btn-green {
    background: var(--ex-success-color);
  }

  .btn-red {
    background: var(--ex-error-color);
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    vertical-align: middle;
    font-size: 0.6rem;
    font-weight: 600;
    line-height: 0.8rem;
  }

  .ratio {
    font-size: 0.4rem;
    line-height: 0.5rem;
  }

  .sell_key_open {
    transform: translateY(0);

    .sell_key {
      background-color: rgba(0, 0, 0, 0);

      .sell_key_icon {
        transform: rotate(0deg);
      }
    }
  }

  .ratio_price,
  .ratio_percentage {
    height: 0.56rem;
    display: inline-flex;
    align-items: center;
    font-size: 0.32rem;
    font-weight: 400;
    line-height: 0.42;
    margin-right: 0.2rem;
    padding: 0.1rem 0.25rem;
    border-radius: 1.25rem;
  }

  .up .ratio_price,
  .up .ratio_percentage {
    background: rgb(var(--ex-up-color-rgb) / 0.1);
  }

  .down .ratio_price,
  .down .ratio_percentage {
    background: rgb(var(--ex-down-color-rgb) / 0.1);
  }

  .align-content {
    align-content: center;
  }

  .txt-center {
    text-align: center;
  }

  .icon-heyue {
    display: block;
    height: 0.6rem;
  }

  @media (min-width: 751px) {
    .submit {
      max-width: 375px;
    }

    .info_header {
      max-width: 375px;
    }
  }

  .market_content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .funcs {
      display: flex;
      align-items: center;

      .tab {
        color: var(--ex-text-color);
        font-size: 0.28rem;
        font-weight: 400;
        margin-right: 0.32rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.2rem;
      }

      .active_tab {
        border-radius: 0.48rem;
        color: var(--ex-white);
        font-weight: bold;
        color: var(--ex-text-color--bg-light);
      }

      .icon {
        width: 0.5rem;
        height: 0.5rem;
        margin-left: 0.2rem;
      }

      .submit_btn {
        padding: 0.12rem 0.4rem;
        color: var(--ex-text-color--bg-primary);
        background-color: var(--ex-primary-color);
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.26rem;
        margin-left: 0.3rem;
      }
    }

    .info {
      display: flex;
      align-items: stretch;
      margin-top: 0.16rem;
      margin-bottom: 0.3rem;

      .left {
        .price {
          font-size: 0.9rem;
          line-height: 1.06rem;
          color: var(--ex-text-color2);
          margin-bottom: 0.12rem;
        }

        .time {
          color: var(--ex-text-color2);
          font-size: 0.28rem;
          line-height: 0.48rem;

          span {
            color: var(--ex-text-color);
            margin-left: 0.2rem;
          }
        }
      }

      .mid {
        flex: 1;
        margin-left: 0.36rem;
        margin-right: 0.2rem;
        color: var(--ex-text-color2);
        font-size: 0.36rem;
        line-height: 0.48rem;
      }

      .right {
        font-size: 0.24rem;
        line-height: 0.48rem;
        color: var(--ex-text-color3);
        font-weight: 400;

        b {
          color: var(--ex-text-color);
          font-weight: 700;
          font-size: 0.28rem;
          line-height: 0.4rem;
        }
      }
    }

    .chart_box {
      width: 100%;
      // height: calc(var(--app-height) - 4.8rem);
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .tabs {
        padding: 0 0.2rem;
        height: 0.48rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .tab {
          height: 0.48rem;
          background-color: var(--ex-bg-color3);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.3rem;
          color: var(--ex-text-color2);
          font-size: 0.24rem;
          font-weight: 400;
          margin-right: 0.1rem;
          padding: 0 0.1rem;
          min-width: 0.64rem;
        }

        .active_tab {
          background-color: var(--ex-white);
          color: var(--ex-text-color--bg-light);
        }
      }

      .full-tab {
        color: var(--ex-text-color);
        font-size: 0.32rem;
        width: 0.48rem;
        height: 0.48rem;
        border-radius: 50%;
        display: center;
        align-items: center;
        justify-content: center;
        text-align: center;
        line-height: 0;
      }

      .chart_container {
        flex: 1;
        width: 100%;
        padding: 0 0.28rem;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .chart_time {
          position: absolute;
          display: flex;
          align-items: center;
          height: 0.38rem;
          z-index: 999;
          top: 0.24rem;
          left: 0.24rem;
          padding: 0.1rem 0.15rem;
          background: #00000080;
          border-radius: 0.15rem;
          color: var(--ex-white);
          font-size: 0.22rem;
          font-weight: 400;
          line-height: 0.22rem;
        }
      }

      .fullscreen_container {
        position: fixed;
        z-index: 9999;
        width: 100vw;
        height: var(--app-height);
        top: 0;
        // left: 100vw;
        left: 0;
        background-color: var(--ex-bg-color);
        // transform: rotate(90deg);
        // transform-origin: 0% 0%;

        .full_close {
          width: 0.4rem;
          height: 0.4rem;
          position: absolute;
          right: 0.4rem;
          top: 0.4rem;
          color: var(--ex-text-color);
          font-size: 0.4rem;
          z-index: 99999;
        }
      }

      @media (min-width: 751px) {
        .fullscreen_container {
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          transform: none;
        }
      }
    }
  }

  .market_bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.32rem;
    // border-top: 1px solid var(--ex-border-color);
    height: 1.4rem;
    background: linear-gradient(0deg,
        rgb(var(--ex-bg-color5-rgb) / 0.2) 0%,
        rgb(var(--ex-bg-color5-rgb) / 1) 95.61%);
    border-radius: 0.32rem 0.32rem 0px 0px;
    box-shadow: 0px -1px 1px 0px rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(25px);
    margin-top: 0.22rem;

    .symbol {
      color: var(--ex-text-color);
      margin-bottom: 0.12rem;
    }

    .time_type {
      height: 0.36rem;
      padding: 0 0.1rem;
      display: inline-flex;
      align-items: center;
      text-align: center;
      box-sizing: border-box;
      color: var(--ex-text-color3);
      border-radius: 0.4rem;
      border: 0.5px solid var(--ex-border-color2);
      font-size: 0.24rem;
    }

    .bottom_line {
      flex: 1;
      height: 0.32rem;
      border-left: 1px solid var(--ex-border-color);
    }

    .bottom_btn {
      width: 3.27rem;
      height: 0.9rem;
      color: var(--ex-text-color--bg-primary);
      border-radius: 0.8rem;
      font-size: 0.32rem;
      display: flex;
      font-weight: 600;
      align-items: center;
      justify-content: center;

      .bottom_btn_icon {
        margin-right: 0.08rem;
        width: 0.48rem;
        height: 0.48rem;
      }
    }
  }

  .intro_box {
    padding-top: 0.4rem;

    .intro_title {
      color: var(--ex-text-color);
      font-size: 0.36rem;
      font-weight: 600;
      margin-bottom: 0.2rem;
    }

    .intro_content {
      font-size: 0.28rem;
      font-weight: 400;
      color: var(--ex-text-color);
      line-height: 0.54rem;
      margin-bottom: 0.4rem;
    }

    .intro_area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 0.6rem;
      margin-bottom: 0.28rem;
      font-size: 0.28rem;
      color: var(--ex-text-color);
      font-weight: 400;

      .intro_area_box {
        width: 2.6rem;
        font-size: 0.2rem;
        font-weight: 500;
        color: var(--ex-text-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}

.innerpage_marketinfo {
  width: 100%;
  height: 100%;
  padding-top: 0;

  .info_header {
    position: relative;
    background-color: rgba(0, 0, 0, 0);
    pointer-events: none;
  }

  .market_content {
    height: calc(100% - 1.8rem);

    .chart_box {
      height: 100%;
    }
  }
}

.times_list {
  padding: 0.5rem 0.32rem;

  .item {
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.28rem;
    color: var(--ex-text-color2);
    overflow: hidden;
  }

  .active_item {
    background-color: var(--ex-bg-color2);
    color: var(--ex-primary-color);
    border-radius: 0.32rem;
  }
}

.buy_popup {
  padding: 0.8rem 0.32rem 0.2rem 0.32rem;

  .buy_name {
    color: var(--ex-text-color);
    margin-bottom: 0.54rem;
    padding-left: 0.24rem;
  }

  .buy_popup_btn {
    height: 0.9rem;
    border-radius: 0.9rem;
    background-color: var(--ex-down-color);
    color: var(--ex-white);
    font-size: 0.28rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.54rem;
    position: relative;

    .btn_icon {
      width: 0.4rem;
      height: 0.4rem;
      position: absolute;
      right: 0.64rem;
    }
  }

  .buy_popup_btn2 {
    background-color: var(--ex-up-color);
  }
}

.info_popup {
  padding: 0.4rem 0.32rem 0.2rem 0.32rem;

  .info_name {
    font-size: 0.32rem;
    line-height: 0.44rem;
    color: var(--ex-text-color);
    margin-bottom: 0.54rem;
    text-align: center;
  }

  .info_price {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 0.32rem;
    height: 1.3rem;
    padding: 0.24rem;
    background: var(--ex-bg-color3);
    border-radius: 0.4rem;

    .info_num {
      font-size: 0.6rem;
      line-height: 0.81rem;
      font-weight: 600;
      margin-right: 0.2rem;
    }

    .price_up,
    .percentage_up {
      height: 0.56rem;
      display: flex;
      align-items: center;
      background: rgb(var(--ex-up-color-rgb) / 0.1);
      border-radius: 1.25rem;
      padding: 0.075rem 0.25rem;
    }

    .price_down,
    .percentage_down {
      height: 0.56rem;
      display: flex;
      align-items: center;
      background: rgb(var(--ex-down-color-rgb) / 0.1);
      border-radius: 1.25rem;
      padding: 0.075rem 0.25rem;
    }
  }

  .info_items {
    margin: 0.32rem 0 0 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    .info_item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 0.32rem;
      width: 31%;
      background-color: var(--ex-bg-color2);
      border-radius: 0.4rem;
      height: 1.26rem;

      .name {
        margin-top: 0.2rem;
      }

      .info_item__value {
        font-weight: 600;
      }
    }
  }
}
</style>
