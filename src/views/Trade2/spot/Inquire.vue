<!-- 查询 -->
<template>
  <div class="inquire" v-if="token">
    <div class="tr th">
      <div class="td td-5">{{ t("trade.contract_opening_contract") }}</div>
      <div class="td td-2">{{ t('trade.stock_open') }}</div>
      <div class="td td-6" style="text-align: end !important; margin-right: 0.2rem !important">
        {{ t('market.market_buy_list_wait_amount') + '/' + t('trade.trade_deal_price') }}
      </div>
    </div>
    <NoData v-if="!loading && !contractInquireList.length" />

    <SwipeCell ref="items" v-for="(item, i) in contractInquireList" :key="i" disabled>
      <div class="tr mask-btn" @click="OpeningForm(item)">
        <div class="td td-5">
          <div class="name">{{ item.name }}</div>
        </div>
        <div class="td td-2">
          <div class="state" :class="'state-' + item.offset">
            <!-- {{ offsetMap[item.offset] || "--" }} -->
            {{
              item.offset == "buy"
                ? '买入'
                : item.offset == "sell"
                  ? '卖出'
                  : "--"
            }}
          </div>
        </div>
        <div class="td td-6" style="text-align: right;">
          <div class="price">{{ item.volume || "--" }}</div>
          <div class="price">{{ item.settled_price || "--" }}</div>
        </div>
      </div>
    </SwipeCell>
    <div style="height:0.56rem"></div>
    <LoadingMore :loading="loading" :finish="finish" v-if="(finish && contractInquireList.length) || !finish" />
  </div>

  <!-- 订单详情 -->
  <Popup v-model:show="showInfo" position="right" style="width: 100%; height: 100%" teleport="body">
    <OrderInfo type="spot" :curr-stock="currStock" @back="showInfo = false" />
  </Popup>

  <UnLogin @loginfinish="loginfinish" v-show="!token" />
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { SwipeCell, Popup } from "vant";
import store from "@/store";
import NoData from "@/components/NoData.vue";
import LoadingMore from "@/components/LoadingMore.vue";
import { _spotList } from "@/api/api";
import UnLogin from "@/components/UnLogin.vue";
import OrderInfo from "../components/OrderInfo.vue";
import Decimal from "decimal.js";
import { useI18n } from "vue-i18n";

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  mode: { // constract-加密货币 foreign-外汇 commodities-大宗交易
    type: String,
    default: 'constract'
  }
})


const { t } = useI18n();
const loginfinish = () => {
  setTimeout(() => {
    init();
  }, 100);
};

const contractInquireList = computed(
  () => store.state.contractInquireList || []
);
const token = computed(() => store.state.token);

const statusMap = ref({
  // 仓位状态
  none: "开仓",
  lock: "锁定",
  open: "持仓",
  done: "平仓",
  fail: "失败",
  cancel: "已取消",
});
const offsetMap = ref({
  // 涨跌状态
  long: "买涨",
  short: "买跌",
});
const leverTypeap = ref({
  // 仓位
  cross: "全仓",
  isolated: "逐仓",
});
const priceTypeMap = ref({
  // 价格类型
  market: "市价",
  limit: "限价",
});
const stopMap = ref({
  // 止损类型
  price: "价格",
  amount: "金额",
  ratio: "百分比",
});
const getRatio = (num) => {
  if (!num) return "--";
  return new Decimal(num) + "%";
};

const page = ref(0);
const loading = ref(false);
const finish = ref(false);
const timeMap = ref({
  start_time: null,
  end_time: null,
});
const init = (times) => {
  if (token.value) {
    if (times) {
      timeMap.value = times;
    }
    page.value = 0;
    loading.value = false;
    finish.value = false;
    setTimeout(() => {
      getList();
    }, 0);
  }
};
const getList = () => {
  if (loading.value || finish.value) return;
  page.value++;
  const params = {
    ...timeMap.value,
    page: page.value,
  };
  loading.value = true;
  _spotList(params)
    .then((res) => {
      res.data = res.data || [];
      if (page.value == 1) {
        store.commit("setContractInquireList", res.data);
      } else {
        const arr = contractInquireList.value.concat(res.data);
        store.commit("setContractInquireList", arr);
      }
      if (!res.data.length) {
        finish.value = true;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const showInfo = ref(false);
const currStock = ref({});
const OpeningForm = (item) => {
  currStock.value = item;
  showInfo.value = true;
};

let moreDom = null;
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
  const rect = moreDom.getBoundingClientRect();
  if (rect.top <= totalHeight) {
    // 加载更多
    getList();
  }
};
onMounted(() => {
  setTimeout(() => {
    try {
      moreDom = document.querySelector(".loading_more");
      document
        .querySelector(".page")
        .addEventListener("scroll", scrolHandle);
    } catch { }
  }, 500);
});
onUnmounted(() => {
  try {
    document
      .querySelector(".page")
      .removeEventListener("scroll", scrolHandle);
  } catch { }
});

defineExpose({
  getList,
  init,
});
</script>

<style lang="less" scoped>
.inquire {
  .tr {
    padding: 0.24rem;
    background-color: var(--ex-bg-color3);
    display: flex;
    align-items: stretch;
    border-radius: 0.32rem;
    margin-top: 0.2rem;
  }

  .th {
    color: var(--ex-text-color3);
    font-size: 0.22rem;
    border-bottom: 1px solid var(--ex-border-color);
    padding: 0.48rem 0 0.24rem 0;
    background: none;
    margin-top: 0px;
    border-radius: 0px;
  }

  .td {
    text-align: center;
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    line-height: 0.3rem;

    .name {
      font-size: 0.32rem;
      color: var(--ex-text-color);
      line-height: 0.32rem;
      margin-bottom: 0.28rem;
    }

    .lever {
      display: flex;
      align-items: center;
    }

    .status {
      height: 0.3rem;
      padding: 0 0.08rem;
      border-radius: 0.3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.22rem;
      margin-right: 0.08rem;
      border-width: 1px;
      border-style: solid;
    }

    .state {
      width: 0.68rem;
      height: 0.36rem;
      border-radius: 0.12rem;
      color: var(--ex-up-color);
      background-color: rgb(var(--ex-up-color-rgb) / 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.24rem;
      margin: 0 auto;
    }

    .state-short, .state-sell {
      background: rgb(var(--ex-down-color-rgb) / 0.1);
      color: var(--ex-down-color);
    }

    .amount {
      color: var(--ex-text-color);
      font-size: 0.28rem;
    }

    .price {
      color: var(--ex-text-color);
      font-size: 0.28rem;
      font-weight: 600;
      line-height: 0.36rem;
    }


    .num {
      color: var(--ex-text-color2);
      font-weight: 600;
      font-size: 0.24rem;
      text-align: right;
    }

    .num:first-child {
      font-size: 0.28rem;
      line-height: 0.36rem;
    }
  }

  .td-5 {
    flex: 5;
    text-align: left;
  }

  .td-2 {
    flex: 2;
  }
  .td-4 {
    flex: 4;
  }
  .td-6 {
    flex: 6;
  }
}
</style>
