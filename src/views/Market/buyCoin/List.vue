<!-- 订单列表 -->
<template>
  <div v-if="token" class="buycoin_list" :style="props.from == 'orderCenter'
      ? 'width: 100%; padding: 0'
      : 'width: 7.5rem; padding: 0.08rem 0.32rem;'
    ">
    <div class="list">
      <!-- 当前订单 -->
      <div v-for="(item, i) in showList" :key="i"
        class="relative mb-[0.2rem] h-[2.3rem] w-full rounded-4 bg-[#f5f7fc] px-4 py-[0.2rem]"
        @click="openOrderInfo(item)">
        <!-- 消息右上角小红点 -->
        <div v-if="unreadMessage[item.order_no] > 0"
          class="w-[0.24rem] h-[0.24rem] top-[0] right-[0] rounded-[0.12rem] bg-[#e8503a] text-[0.16rem] text-[#fff] flex justify-center items-center absolute">
          {{ unreadMessage[item.order_no] }}
        </div>
        <div v-if="c2cUnread[item.order_no]"
          class="absolute right-[-0.06rem] top-0 flex size-4 items-center justify-center rounded-50 bg-[#e8503a] text-8 text-white">
          <!-- {{ c2cUnread[item.order_no] > 99 ? '+99' : c2cUnread[item.order_no] }} -->
        </div>
        <div class="mb-[0.2rem] flex items-center justify-between border-b border-[#EFF3F8] pb-[0.2rem]">
          <!-- order_no 订单号 -->
          <div class="text-14 text-[#666]">{{ item.order_no }}</div>
          <div class="text-14" :style="{ color: statusEnum[item.status].color }">
            <!-- {{ statusEnum[item.status].name }} -->
            {{
              item.status == "waitpayment"
                ? t("market.market_buy_list_wait_pay")
                : item.status == "waitconfirm"
                  ? t("market.market_buy_list_wait_confirm")
                  : item.status == "done"
                    ? t("market.market_buy_list_complete")
                    : item.status == "cancel"
                      ? t("market.market_buy_list_cancel")
                      : '--'
            }}
          </div>
        </div>
        <!-- 交易信息展示 -->
        <div class="flex items-center justify-between">
          <!-- 加密货币信息 -->
          <div class="text-12">
            <div class="mb-[0.2rem] flex items-center text-16 font-semibold">
              <!-- 根据交易类型显示“购入”或“售出” -->
              {{
                item.offset == "buy"
                  ? t("market.market_buy_list_buy")
                  : t("market.market_buy_list_sell")
              }}&nbsp;{{ item.crypto }}&nbsp;
              <!-- 加密货币图标 -->
              <img class="!h-4 !w-4 rounded-50"
                :src="getStaticImgUrl(`/static/img/crypto/${item.crypto.toUpperCase()}.png`)" alt="currency" />
            </div>
            <!-- 价格信息 -->
            <div class="mb-[0.12rem] text-[#666D80]">
              {{ $t("market.market_buy_list_price") }}&nbsp;{{
                item.price
              }}&nbsp;{{ item.currency }}
            </div>
            <!-- 数量信息 -->
            <div class="text-[#666D80]">
              {{ $t("market.market_buy_list_amount") }}&nbsp;{{
                item.volume
              }}&nbsp;{{ item.crypto }}
            </div>
          </div>

          <!-- 交易总额 -->
          <div class="flex items-center text-18">
            <!-- 根据交易类型显示正负号 -->
            {{ item.offset == "buy" ? "-" : "+" }}{{ item.totalprice }}
            <!-- 货币类型 -->
            <span class="ml-2 text-12 font-normal text-[#121826]">{{
              item.currency
            }}</span>
          </div>
        </div>
      </div>

      <NoData v-if="!loading && !list.length && token" />
      <LoadingMore v-if="(finish && list.length) || !finish" class-n="buycoin_self" :loading="loading"
        :finish="finish" />
    </div>
  </div>
  <UnLogin v-show="!token" @loginfinish="loginfinish" />

  <!-- 订单弹窗 -->
  <!-- <Popup v-model:show="showPopupInfo" teleport="body" round position="bottom" closeable>
    <div class="buycoin_orderinfo_dialog">
      <div class="orderinfo_dialog_title">{{ $t('订单详情') }}</div>
      <OrderInfo v-if="showPopupInfo" ref="OrderInfoRef" @success-hanlde="successOrder" />
    </div>
  </Popup> -->
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import store, { useMapState } from "@/store";
import NoData from "@/components/NoData.vue";
import UnLogin from "@/components/UnLogin.vue";
import { _c2cOrderInfo, _c2cOrderList } from "@/api/api";
import LoadingMore from "@/components/LoadingMore.vue";
import router from "@/router";
import { useBuyCoinState } from "./state";
import { computed, provide } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  from: {
    type: String,
    default: "",
  },
});

const statusEnum = {
  waitpayment: { name: t('market.market_buy_list_wait_pay'), color: "var(--main-color)" },
  waitconfirm: { name: t('market.market_buy_list_wait_confirm'), color: "var(--main-color)" },
  done: { name: t('market.market_already_done'), color: "#18B762" },
  cancel: { name: t('market.market_already_done'), color: "#8F92A1" },
};
const { active, subs } = useBuyCoinState();
const scrollData = inject("scrollData");

// 解构赋值，分别获取c2cList（上次的c2c列表），token（用户令牌），c2cUnread（未读的c2c消息数）
const {
  c2cList: c2cLasttime,
  token,
  c2cUnread,
} = useMapState(["c2cList", "token", "c2cUnread"]);

const loginfinish = () => {
  setTimeout(() => {
    init();
  }, 100);
};

const unreadMessage = computed(() => store.state.unreadMessage);
console.log("unread message list ==========> ", unreadMessage.value);

let onOrderNoValue = {};
const openOrderInfo = ({ order_no, ...row }) => {
  onOrderNoValue = { order_no, ...row };
  setTimeout(() => {
    router.push({
      name: "orderDetails",
      query: { order_no },
    });
  }, 100);
};
// 列表
const loading = ref(false);
const finish = ref(false);
/** 
interface Order {
  order_no: string; // 订单号
  offset: 'buy' | 'sell'; // 方向
  crypto: string; // 加密货币
  currency: string; // 计价货币
  price: number; // 价格
  volume: number; // 数量
  totalprice: number; // 总价
  status: 'waitpayment' | 'waitconfirm' | 'done' | 'cancel'; // 状态
  endtime?: string; // 结束时间
  date: string; // 订单时间，格式：MM-dd hh:mm
}
*/
const list = ref([]);
const page = ref(0);
const getData = (isBottom) => {
  if (loading.value || finish.value) return;
  loading.value = true;
  if (isBottom) page.value += 1;
  _c2cOrderList({
    page: page.value,
  })
    .then((res) => {
      setTimeout(() => {
        loading.value = false;
      }, 100);
      if (!isBottom) {
        list.value = res.data;
      } else {
        list.value.push(...(res.data || []));
      }
      subs();

      if (!res.data?.length) {
        finish.value = true;
      }

      // setTimeout(() => {
      //   const obj = {}
      //   list.value.forEach(item => {
      //     if (c2cLasttime.value[item.order_no]) {
      //       obj[item.order_no] = c2cLasttime.value[item.order_no]
      //     } else {
      //       obj[item.order_no] = Date.now()
      //     }
      //   })
      //   store.commit('setC2cLasttime', obj)
      // }, 0)
    })
    .catch(() => {
      loading.value = false;
    });
};
const init = () => {
  page.value = 0;
  loading.value = false;
  finish.value = false;
  if (token.value) {
    getData(false);
  }
};

const showList = computed(() => {
  return [...c2cLasttime.value, ...list.value];
});

// 监听
const scrollHandle = (bottom) => {
  if (active.value !== "2") return;
  // 加载更多
  if (bottom) getData(true);
};

const getC2cOrderInfo = async () => {
  const res = await _c2cOrderInfo({
    order_no: onOrderNoValue.order_no,
  });
  if (!res.data) return;
  list.value.forEach((element, i) => {
    if (element.order_no === onOrderNoValue.order_no) {
      list.value[i] = res.data;
      onOrderNoValue = {};
      throw new Error("break");
    }
  });
};
watch(() => scrollData.arrivedState.bottom, scrollHandle);
init();

onActivated(() => {
  if (active.value !== "2") return;
  const { status } = onOrderNoValue;
  if (status === "waitpayment" || status === "waitconfirm") {
    getC2cOrderInfo();
  }
});

defineExpose({
  init,
});
</script>

<style lang="less" scoped>
.buycoin_orderinfo_dialog {
  position: relative;

  .orderinfo_dialog_title {
    font-size: 0.32rem;
    line-height: 0.6rem;
    text-align: center;
    margin-bottom: 0.2rem;
    margin-top: 0.2rem;
    font-weight: bold;
  }
}

.buycoin_list {
  // width: 7.5rem;
  // padding: 0.08rem 0.32rem;

  .list {
    .item {
      padding: 0.24rem 0.32rem;
      border-bottom: 1px dashed #e8e8e8;
      display: flex;
      align-items: center;
      line-height: 0.36rem;

      .avatar {
        width: 0.64rem;
        height: 0.64rem;
        margin-right: 0.4rem;
        flex-shrink: 0;
        position: relative;

        .nav_num {
          width: 0.28rem;
          height: 0.28rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ff3b30;
          font-size: 0.2rem;
          color: #fff;
          font-weight: 400;
          border-radius: 50%;
          position: absolute;
          top: -0.1rem;
          right: -0.12rem;
        }
      }

      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;

        .type {
          margin-right: 0.32rem;
          color: #000;
        }

        .no {
          font-size: 0.24rem;
          color: #999;
          padding: 0.05rem 0;
        }
      }

      .right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;

        .right_top {
          display: flex;
          align-items: center;
        }

        .amount {
          font-size: 0.36rem;
          font-weight: bold;
        }

        .unit {
          margin-left: 0.1rem;
        }

        .status {
          margin-top: 0.24rem;
          font-size: 0.24rem;
          padding: 0.05rem 0.32rem;
          background-color: #f6f6f6;
          color: #888888;
        }

        .status_waitpayment {
          color: #ffaf2a;
          background-color: #fffaf2;
        }

        .status_waitconfirm {
          color: #ffaf2a;
          background-color: #fffaf2;
        }

        .status_done {
          color: #30bf87;
          background-color: #ebfeed;
        }
      }
    }
  }
}
</style>
