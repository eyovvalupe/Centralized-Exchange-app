<!-- 查询 -->
<template>

  <div>
    <div class="inquire" v-if="token">
      <div class="tr th">
        <div class="td td-5">{{ t("trade.stock_position_stock") }}</div>
        <div class="td td-4">{{ t("trade.stock_position_open") }}</div>
        <div class="td td-4">{{ t("trade.stock_position_cost") }}</div>
        <div class="td td-4" style="text-align: end !important">
          {{ t("trade.stock_position_profit") }}
        </div>
      </div>
      <NoData v-if="!loading && !inquireList.length" />

      <SwipeCell ref="items" v-for="(item, i) in inquireList" :key="i" disabled>
        <div class="tr" @click="OpeningForm(item)">

          <div class="mask-btn"
            style="margin-top: 0.2rem;background-color: var(--ex-bg-white2);border-radius: 0.4rem;display: flex;width: 100%;padding: 0.24rem;">
            <div class="td td-5">
              <div class="name">{{ item.symbol }}</div>
              <div class="lever">
                <div class="status-color status tag-default">{{ item.lever }}X</div>
                <div class="status-color status" :class="'status-' + item.status">
                  <!-- {{ statusMap[item.status] || "--" }} -->
                  {{
                    item.status == "none"
                      ? t("trade.stock_position_status_none")
                      : item.status == "lock"
                        ? t("trade.stock_position_status_lock")
                        : item.status == "open"
                          ? t("trade.stock_position_status_open")
                          : item.status == "done"
                            ? t("trade.stock_position_status_done")
                            : item.status == "fail"
                              ? t("trade.stock_position_status_fail")
                              : item.status == "cancel"
                                ? t("trade.stock_position_status_cancel")
                                : "--"
                  }}
                </div>
              </div>
            </div>
            <div class="td td-4">
              <div class="state" :class="'state-' + item.offset">
                <!-- {{ offsetMap[item.offset] || "--" }} -->
                {{
                  item.offset == "long"
                    ? t("trade.stock_position_offset_long")
                    : item.offset == "short"
                      ? t("trade.stock_position_offset_short")
                      : "--"
                }}
              </div>
              <div class="amount">{{ item.unsold_volume || "--" }}</div>
            </div>
            <div class="td td-4">
              <div class="price">{{ item.settled_price || "--" }}</div>
              <div class="price">{{ item.open_price || "--" }}</div>
            </div>
            <div class="td td-4">
              <div class="num" :class="!item.profit ? '' : item.profit > 0 ? 'up' : 'down'">
                {{ item.profit || "--" }}
              </div>
              <div class="num" :class="!item.ratio ? '' : item.ratio > 0 ? 'up' : 'down'">
                {{ getRatio(item.ratio) }}
              </div>
            </div>
          </div>

        </div>
      </SwipeCell>
      <div style="height:0.56rem"></div>
      <LoadingMore :loading="loading" :finish="finish" v-if="(finish && inquireList.length) || !finish" />
    </div>

    <UnLogin @loginfinish="loginfinish" v-else />
  </div>



  <!-- 订单详情 -->
  <Popup v-model:show="showInfo" position="right" style="width: 100%; height: 100%" teleport="body">
    <OrderInfo :tradeType="'stock'" :curr-stock="currStock" @back="showInfo = false" />
  </Popup>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { SwipeCell, Popup } from "vant";
import store from "@/store";
import NoData from "@/components/NoData.vue";
import LoadingMore from "@/components/LoadingMore.vue";
import { _stocksList } from "@/api/api";
import UnLogin from "@/components/UnLogin.vue";
import Decimal from "decimal.js";
import OrderInfo from "./OrderInfo.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const loginfinish = () => {
  setTimeout(() => {
    init();
  }, 100);
};

const inquireList = computed(() => store.state.inquireList || []);
const token = computed(() => store.state.token);
const props = defineProps({
  scrollDom: { // 滚动的父级
    type: String,
    default: '.page'
  }
})

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
    page.value = false;
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
  _stocksList(params)
    .then((res) => {
      if (page.value == 1) {
        store.commit("setInquireList", res.data || []);
      } else {
        const arr = inquireList.value;
        arr.push(...(res.data || []));
        store.commit("setInquireList", arr);
      }
      if (!res.data?.length) {
        finish.value = true;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

// 详情
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
  if (rect && rect.top <= totalHeight) {
    // 加载更多
    getList();
  }
};
onMounted(() => {
  init();
  setTimeout(() => {
    try {
      moreDom = document.querySelector(".loading_more");
      document
        .querySelector(props.scrollDom)
        .addEventListener("scroll", scrolHandle);
    } catch { }
  }, 500);
});
onUnmounted(() => {
  try {
    document
      .querySelector(props.scrollDom)
      .removeEventListener("scroll", scrolHandle);
  } catch { }
});

defineExpose({
  init,
});
</script>

<style lang="less" scoped>
.inquire {
  padding-bottom: 1.6rem;

  .tr {
    display: flex;
    align-items: stretch;
  }

  .tr:last-child {
    border-bottom: 0px;
  }

  .th {
    color: var(--ex-text-color3);
    font-size: 0.22rem;
    padding: 0.4rem 0 0.24rem 0;
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
      border-width: 1px;
      border-style: solid;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.22rem;
      margin-right: 0.08rem;
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

    .state-short {
      color: var(--ex-down-color);
      background: rgb(var(--ex-down-color-rgb) / 0.1);
    }

    .amount {
      color: var(--ex-text-color);
      font-size: 0.28rem;
    }

    .price {
      color: var(--ex-text-color3);
      font-size: 0.24rem;
    }

    .price:first-child {
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

  .td-4 {
    flex: 4;
  }
}
</style>
