<!-- 市场行情 -->
<template>
  <div class="page-marketinfo2">
    <!-- 头部 -->
    <div class="max-width info_header">
      <div class="top">
        <div v-if="!props.innerPage" class="back" @click="router.back">
          <Icon name="arrow-left" />
        </div>

        <!-- 标题 -->
        <div class="title" v-if="route.query.type == 'stock'">
          <div class="title_name">{{ item.symbol || "--" }} </div>
          <div v-if="showDate" class=" leading-[0.4rem]">
            {{ showDate }}
          </div>
        </div>
        <div class="title" v-else @click="showSearchDialog = true">
          <div class="title_name">{{ item.name || "--" }}
            <Icon name="arrow-down" />
          </div>
        </div>
        <!-- 详情 -->
        <div class="title_shadow"></div>
        <div v-if="!props.innerPage" class="search star" @click="addCollect"
          :style="{ opacity: loading ? '0.5' : '1' }">
          <div class="size-[0.48rem]">
            <img v-if="item.watchlist == 1" v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="">
            <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="">
          </div>
        </div>

      </div>
      <div style="background-color: var(--ex-bg-color3);border-radius: 0.32rem;padding: 0.28rem">

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
                {{ updown === 0 ? "" : updown > 0 ? "+" : "" }}
                {{ item.change ? item.change : '--' }}
              </div>
              <div class="text-[0.24rem] ml-[0.16rem]" v-if="item.ratio">
                {{
                  item.ratio === undefined
                    ? "--"
                    : item.ratio > 0
                      ? "+" + item.ratio + "%"
                      : item.ratio + "%"
                }}
              </div>
            </div>
          </div>
          <div class="count flex-1">
            <div class="count_item">
              <span class="text-color3">{{ t('market.market_marketinfo_high') }}</span>
              <span class="num text-white" >{{ item.high || '--' }}</span>
            </div>
            <div class="count_item">
              <span class="text-color3">{{ t('market.market_marketinfo_low') }}</span>
              <span class="num text-white" >{{ item.low || '--' }}</span>
            </div>
            <div class="count_item">
              <span class="text-color3">{{ t('market.market_marketinfo_open') }}</span>
              <span class="num text-white" >{{ item.open || '--' }}</span>
            </div>
            <div class="count_item">
              <span class="text-color3">{{ t('market.market_marketinfo_close') }}</span>
              <span class="num text-white" >{{ item.close || '--'
                }}</span>
            </div>
          </div>
        </div>
        <div class="flex text-[0.24rem] pt-[0.2rem] gap-[0.2rem]">
          <div class="w-[2.6rem] flex-shrink-0">
            <span class="text-color3">{{ t('market.market_marketinfo_value') }}</span>
            <span class="text-color ml-[0.12rem]">{{ _formatNumber(item.amount) }}</span>
          </div>
          <div class="flex-1">
            <span class="text-color3">{{ t('market.market_marketinfo_amount') }}</span>
            <span class="text-color ml-[0.12rem]">{{ _formatNumber(item.volume) }}</span>
          </div>

        </div>
      </div>
    </div>

    <!-- 内容 -->
    <div style="padding: 0 0.1rem;background-color:var(--ex-bg-color);margin-top: 0.1rem;">
      <Tabs style="background-color: var(--ex-bg-color3);border-radius: 0.32rem 0.32rem 0 0;" class="van-tabs--sub_line van-tabs--sub_bg" :sticky="true" :color="'var(--ex-primary-color)'"
        v-model:active="activeTab" animated shrink>
        <!-- <Tab :name="1" :title="'开仓'">
          <div class="market-box" style="height: calc(var(--vh) * 100 - 2.2rem);overflow-y: auto;">
            <Opening :item="item" v-if="tradeType == 'constract'" ref="openingRef" 
              :from="'trade'" />
            <OpeningSpot :item="item" v-if="tradeType == 'spot'" ref="openingRef2" 
              :from="'trade'" />
          </div>
        </Tab> -->
        <Tab :name="2" :title="'行情'">
          <div class="market-box">
            <Chart ref="chartRef" v-if="!chartLoading" :type="'constract'" />
          </div>
        </Tab>
        <Tab :name="3" :title="'订单薄'" v-if="item.type == 'crypto'">
          <div class="market-box">
            <OrderingSpot v-if="activeTab == 3" :key="'o'" type="nomal" />
          </div>
        </Tab>
        <Tab :name="4" :title="'最新成交'" v-if="item.type == 'crypto'">
          <div class="market-box">
            <OrderingSpot v-if="activeTab == 4" :key="'n'" type="news" />
          </div>
        </Tab>
      </Tabs>
    </div>

    <!-- 去交易按钮 -->
    <div class="bottom-box">
      <div class="info">
        <div class="name">{{ item.name || "--" }}</div>
        <div class="type" v-if="chartRef">{{ chartRef.timeType }}</div>
      </div>
      <div style="flex: 1;"></div>
      <div class="data" @click="showInfo = true">数据</div>
      <div class="btn" @click="gotrade">交易</div>
    </div>


    <!-- 搜索列表 -->
    <BottomPopup round v-model:show="showSearchDialog" position="bottom" closeable teleport="body">
      <div class="van-popup-custom-title">
        {{ t("trade.stock_opening_search") }}
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
              {{ updown === 0 ? "" : updown > 0 ? "+" : ""
              }}{{ item.change }}
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
                  ? ""
                  : updown > 0
                    ? "+"
                    : ""
              }}{{ item.ratio === undefined ? "--" : item.ratio + "%" }}
            </div>
          </div>
        </div>
        <div class="info_items">
          <div class="info_item"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/common/price_bg.svg')})` }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t("market.market_marketinfo_open") }}</div>
            <div class="info_item__value">{{ item.open }}</div>
          </div>
          <div class="info_item"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/common/price_bg.svg')})` }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t("market.market_marketinfo_high") }}</div>
            <div class="info_item__value">{{ item.high }}</div>
          </div>
          <div class="info_item"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/common/price_bg.svg')})` }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t("market.market_marketinfo_amount") }}</div>
            <div class="info_item__value">{{ _formatNumber(item.volume) }}</div>
          </div>
          <div class="info_item"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/common/price_bg.svg')})` }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t("market.market_marketinfo_close") }}</div>
            <div class="info_item__value">{{ item.close }}</div>
          </div>
          <div class="info_item"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/common/price_bg.svg')})` }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t("market.market_marketinfo_low") }}</div>
            <div class="info_item__value">{{ item.low }}</div>
          </div>
          <div class="info_item"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/common/price_bg.svg')})` }" style="
              background-repeat: no-repeat;
              background-position: center bottom;
            ">
            <div class="name">{{ t("market.market_marketinfo_value") }}</div>
            <div class="info_item__value">{{ _formatNumber(item.amount) }}</div>
          </div>
        </div>
      </div>
    </BottomPopup>

  </div>

</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import router from "@/router/index"
import store from "@/store";
import { getStaticImgUrl, _formatNumber } from "@/utils/index.js"
import { Tab, Tabs, Icon, showToast } from "vant";
import { _futures, _basic, _add, _del } from "@/api/api";
import BottomPopup from "@/components/BottomPopup.vue";
import StockTable from "@/components/StockTable.vue";
import OrderingSpot from "./OrderingSpot.vue"
import Chart from "./Chart.vue"



const props = defineProps({
  type: {
    type: String,
    default: "",
  },
});

const { t } = useI18n();
const route = useRoute();
const token = computed(() => store.state.token);
const chartRef = ref()

// 跳转交易
const gotrade = () => {
  router.push({
    name: 'tradeInfo',
    query: route.query
  })
}


const activeTab = ref(2)
const showInfo = ref(false);

// 股票信息
const item = computed(() => {
  let it = {};
  const type = route.query.type || props.type;
  switch (type) {
    case "constract": // 合约
      it = store.state.currConstact || {};
      break;
    case "ai": // 合约
      it = store.state.currAi || {};
      break;
    default:
      it = store.state.currStock || {};
  }
  return it;
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
          case "constract": // 合约
            store.commit("setCurrConstract", {
              ...obj,
              ...res.data,
            });
            break;
        }
      }
    }
  });
}
if (item.value.symbol) {
  getBasic(item.value)
}
const chartLoading = ref(true)
onMounted(() => {
  setTimeout(() => {
    chartLoading.value = false
  }, 300)
})
const handleClick = (obj) => {
  if (obj.type != 'crypto' && ['3', '4'].includes(activeTab.value)) { // 非加密货币的没有订单薄
    activeTab.value = 1
  }
  showSearchDialog.value = false
  chartLoading.value = true
  store.commit("setCurrConstract", obj);
  getBasic(obj)
  setTimeout(() => {
    chartLoading.value = false
  }, 100)
};


// 添加自选
const loading = ref(false);
const addCollect = () => {
  if (!token.value) return store.commit("setIsLoginOpen", true);
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
            case "constract": // 合约
              store.commit("setCurrConstract", { watchlist: 1 });
              break;
            default:
              store.commit("setCurrStock", { watchlist: 1 });
          }
          // showToast(t('market.market_optional_add_success'));
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
            case "constract": // 合约
              store.commit("setCurrConstract", { watchlist: 0 });
              break;
            default:
              store.commit("setCurrStock", { watchlist: 0 });
          }
          // showToast(t('market.market_optioanl_del_success'));
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
};


// 搜索
const marketSearchList = computed(() => store.state.futuresSearchList)
const showSearchDialog = ref(false);
const searchDialogStr = ref("");
let searchTimeout = null;
const searchLoading = ref(false);
const goDialogSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchLoading.value = true;
  let s = searchDialogStr.value;
  searchTimeout = setTimeout(() => {
    _futures({
      name: s,
      type: "",
    })
      .then((res) => {
        if (searchDialogStr.value == s) {
          let arr = (res.data || []).map((item) => {
            const target = marketSearchList.value.find(
              (a) => a.symbol == item.symbol
            );
            if (target)
              return {
                ...target,
                ...item,
              };
            return item;
          });
          store.commit("setFuturesSearchList", arr);
          store.dispatch("subList", {
            commitKey: "setFuturesSearchList",
            listKey: "futuresSearchList",
          });
        }
      })
      .finally(() => {
        searchLoading.value = false;
      });
  }, 100);
};
setTimeout(() => {
  goDialogSearch()
}, 2000)
</script>

<style lang="less" scoped>
.search_dialog_trade {
  .lists {
    height: calc(var(--vh) * 60);
    overflow-y: auto;
    margin-top: 0.32rem;
    padding: 0 0.32rem;
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


.page-marketinfo2 {
  // padding: 1.8rem 0 0 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: var(--ex-bg-color);

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
    .data {
      background-color: var(--ex-bg-white1);
      height: 0.92rem;
      border-radius: 1rem;
      color: var(--ex-white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.32rem;
      padding: 0 0.4rem;
      margin-right: 0.12rem;
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
    height: calc(var(--vh) * 100 - 6rem)
    // border-radius: 0.32rem;
    // background-color: var(--ex-bg-color3);
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



  @media (min-width: 751px) {


    .info_header {
      max-width: 375px;
    }
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