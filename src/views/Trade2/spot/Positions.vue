<!-- 持仓 -->
<template>
  <div v-if="token" class="positions">
    <div class="tr th">
      <div class="td td-5">{{ t("common.spot") + '/' + t('trade.trade_orders_status') }}</div>
      <div class="td td-3">{{ t('trade.trade_deal_price') }}</div>
      <div class="td td-4" style="text-align: end !important; margin-right: 0.2rem !important">
        {{ t('market.market_buy_list_amount') }}
      </div>
    </div>
    <NoData v-if="!contractPositionsList.length && !loading" />
    <Loaidng size="0.32rem" :loading="loading" v-if="!contractPositionsList.length && loading" />
    <div class="tr mask-btn" :class="{order: from == 'order'}" @click="OpeningForm(item)" v-for="(item, i) in contractPositionsList" :key="i">
      <div class="td td-5">
        <div class="name van-omit1">{{ item.name }}</div>
        <div class="flex items-center pt-[0.16rem] gap-[0.08rem]">
          <div class="state" :class="'state-' + item.offset">
            {{
              item.offset == "buy"
                ? t('market.market_buy_fast_buy')
                : item.offset == "sell"
                  ? t('market.market_buy_fast_sell')
                  : "--"
            }}
          </div>
          <div class="status-color status" :class="'status-' + item.status">
            {{
              item.status == "none"
                ? t("委托中")
                : item.status == "lock"
                  ? t("trade.stock_position_status_lock")
                  : item.status == "open"
                    ? t("trade.stock_position_status_open")
                    : item.status == "done"
                      ? t("已完成")
                      : item.status == "fail"
                        ? t("trade.stock_position_status_fail")
                        : item.status == "cancel"
                          ? t("已撤单")
                          : "--"
            }}
          </div>
        </div>
      </div>
      <div class="td td-3">
        <div>{{ item.price || "--" }}</div>
      </div>
      <div class="td td-4">
        <div>{{ item.volume || "--" }}</div>
      </div>
    </div>

    <!-- 订单详情 -->
    <Popup v-model:show="showInfo" position="right" style="width: 100%; height: 100%" teleport="body">
      <OrderInfo :tradeType="'spot'" :currSpot="currStock"  @cancel="cancel"
        @back="showInfo = false" />
    </Popup>

  </div>

  <UnLogin @loginfinish="loginfinish" v-show="!token" />

</template>

<script setup>
import {
  Popup,
  showToast,
  showConfirmDialog,
  showLoadingToast,
  closeToast,
} from "vant";
import { useSocket } from "@/utils/ws";
import {
  onMounted,
  onUnmounted,
  computed,
  ref,
  watch,
} from "vue";
import store from "@/store";
import NoData from "@/components/NoData.vue";
import { _futuresSell, _futuresUpdate, _spotCancel } from "@/api/api";
import UnLogin from "@/components/UnLogin.vue";
import OrderInfo from "./OrderInfo.vue";
import { useI18n } from "vue-i18n";
import Loaidng from "@/components/Loaidng.vue"

const props = defineProps({
  tradeType: {
    type: String,
    default: ''
  },
  mode: { // constract-加密货币 foreign-外汇 commodities-大宗交易
    type: String,
    default: 'constract'
  },
  from: {
    type: String,
    default: ''
  }
})

const { t } = useI18n();
const loginfinish = () => { };

const token = computed(() => store.state.token);

const contractPositionsList = computed(() => store.state.positionSpotList);

const { startSocket } = useSocket();
// 订阅
const loading = ref(false);

const subs = () => {
  const socket = startSocket(() => {
    socket && socket.off("user");
    socket && socket.off("tradeorder");
    socket && socket.emit("user", store.state.token);
    socket && socket.emit("tradeorder", "#all");
    loading.value = true;
    socket.on("tradeorder", (res) => {
      store.commit(
        "setPositionsSpotList",
        (res.data || []).map((item) => {
          if (!item.order_no && item.father_username) {
            item.order_no = item.father_username;
          }
          return item;
        })
      );
      loading.value = false;
    });
  });
};
// 取消订阅
const cancelSubs = () => {
  const socket = startSocket(() => {
    socket && socket.off("user");
    socket && socket.off("tradeorder");
    socket && socket.emit("user", "");
    socket && socket.emit("tradeorder", "");
  });
};

onMounted(() => {
  if (store.state.token) {
    subs();
  }
});

onUnmounted(() => {
  cancelSubs();
});

watch(
  () => store.state.token,
  () => {
    if (store.state.token) {
      subs();
    } else {
      cancelSubs();
    }
  }
);
// 详情
const showInfo = ref(false);
const currStock = ref({});
const OpeningForm = (item) => {
  currStock.value = item;
  showInfo.value = true;
};

// 撤单
const cancel = (item) => {
  if (!["none"].includes(item.status)) return;
  showConfirmDialog({
    title: t("trade.stock_position_cancel_title"),
    message: t("trade.stock_position_cancel_con"),
    confirmButtonText: t("trade.stock_position_confirm_btn"),
    cancelButtonText: t("trade.stock_position_cancel_btn"),
  })
    .then(() => {
      showLoadingToast({
        duration: 0,
        loadingType: "circular",
      });
      _spotCancel({
        order_no: item.order_no,
        token: sessionToken.value,
      })
        .then((res) => {
          if (res && res.code == 200) {
            showInfo.value = false
            setTimeout(() => {
              store.dispatch("updateWallet");
              showToast(t("trade.stock_position_success"));
            }, 100);
          }
        })
        .finally(() => {
          getSessionToken();
          closeToast();
        });
    })
    .catch(() => { });
};

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || "");
const getSessionToken = () => {
  store.dispatch("updateSessionToken");
};
getSessionToken();
</script>


<style lang="less" scoped>
.positions {
  .tr {
    padding: 0.24rem;
    background-color: var(--ex-bg-white2);
    display: flex;
    align-items: stretch;
    border-radius: 0.32rem;
    margin-top: 0.2rem;
  }

  .th {
    color: var(--ex-text-color3);
    font-size: 0.22rem;
    border-bottom: 1px solid var(--ex-bg-white2);
    padding: 0.4rem 0 0.24rem 0;
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
    justify-content: center;
    line-height: 0.3rem;

    .name {
      font-size: 0.3rem;
      color: var(--ex-text-color);
      font-weight: 600;
      line-height: 0.32rem;
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
      padding: 0 0.12rem;
      height: 0.36rem;
      border-radius: 0.24rem;
      color: var(--ex-up-color);
      background-color: rgb(var(--ex-up-color-rgb) / 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.24rem;
    }

    .state-short,
    .state-sell {
      color: var(--ex-down-color);
      background: rgb(var(--ex-down-color-rgb) / 0.1);
    }

    .amount {
      color: var(--ex-text-color);
      font-size: 0.28rem;
    }

    .price {
      color: var(--ex-text-color2);
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
  .td-3 {
    flex: 3;
  }
  .td-4 {
    flex: 4;
    text-align: right;
  }

  .td-2 {
    flex: 2;
  }
}

.order_sell_box {
  padding: 0.32rem 0.32rem 0.64rem 0.32rem;

  .title {
    text-align: center;
    font-size: 0.28rem;
    color: var(--ex-text-color);
    font-weight: 600;
  }

  .form {
    .subtitle {
      color: var(--ex-text-color);
      font-weight: 400;
      font-size: 0.28rem;
      margin-bottom: 0.12rem;
      line-height: 0.42rem;
      align-items: center;
      display: flex;
      justify-content: space-between;
    }

    .subtitle-tip {
      color: var(--ex-text-color2);
    }

    .submit {
      margin-top: 0.6rem;
    }

    .item_box {
      display: flex;
      align-items: stretch;
      margin-bottom: 0.4rem;

      .item_box_left {
        width: 1.8rem;
        margin-right: 0.2rem;
        display: flex;
        flex-direction: column;
      }

      .item_box_right {
        flex: 1;
      }

      .more_icon {
        width: 0.32rem;
        height: 0.32rem;
        margin-left: 0.08rem;
      }
    }

    .item {
      width: 100%;
      height: 1.12rem;
      border: 1px solid var(--ex-border-color2);
      background-color: var(--ex-bg-white1);
      border-radius: 0.32rem;
      padding: 0 0.24rem;
      display: flex;
      align-items: center;

      .ipt {
        width: 100%;
        height: 100%;
      }
    }

    .tip {
      text-align: right;
      font-size: 0.24rem;
      color: var(--ex-text-color3);

      .num {
        color: var(--ex-text-color);
      }
    }

    .total_box {
      margin: 0.4rem 0;
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .total_item {
        width: 50%;
        display: flex;
        align-items: center;
        font-size: 0.24rem;
        color: var(--ex-text-color);
        font-weight: 400;
        padding: 0.08rem 0.1rem 0.08rem 0;

        .total_name {
          text-align: right;
          flex: 1;
        }

        .total_num {
          flex: 1;
          text-align: right;
          font-weight: 500;
          font-size: 0.28rem;
        }

        .total_big {
          font-size: 0.36rem;
          font-weight: 600;
        }
      }
    }
  }
}

.num-tag {
  color: var(--ex-primary-color);
  margin-left: 0.08rem;
  transition: all ease-in 0.3s;
  border-radius: 0.3rem;
  background: rgba(33, 104, 246, 0.1);
  font-size: 0.24rem;
  padding: 0 0.14rem;
  height: 0.4rem;
  line-height: 0.4rem;
}
</style>
