<!-- 持仓 -->
<template>
  <div v-if="token" class="positions">
    <div class="tr th">
      <div class="td td-5">{{ t("common.spot")+'/'+t('trade.trade_orders_status') }}</div>
      <div class="td td-3">{{ t('trade.trade_deal_price') }}</div>
      <div class="td td-4" style="text-align: end !important; margin-right: 0.2rem !important">
        {{ t('market.market_buy_list_amount') }}
      </div>
    </div>
    <NoData v-if="!contractPositionsList.length && !loading" />
    <Loaidng size="0.32rem" :loading="loading" v-if="!contractPositionsList.length && loading" />
    <div class="tr mask-btn" @click="OpeningForm(item)" v-for="(item, i) in contractPositionsList" :key="i">
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
      <div class="td td-3">
        <div>{{ item.price || "--" }}</div>
      </div>
      
      <div class="td td-4">
        <div>{{ item.volume || "--" }}</div>
      </div>
    </div>

    <!-- 订单详情 -->
    <Popup v-model:show="showInfo" position="right" style="width: 100%; height: 100%" teleport="body">
      <OrderInfo type="spot" :curr-stock="currStock" @update="update" @sell="sell" @cancel="cancel"
        @back="showInfo = false" />
    </Popup>

    <!-- 平仓 -->
    <BottomPopup v-model:show="showSell" position="bottom" round closeable teleport="body">
      <div class="van-popup-custom-title">
        {{ t("trade.stock_position_close_order") }}
      </div>
      <div class="order_sell_box">
        <div class="form">
          <FormItem :placeholder="t('trade.contract_opening_amount_title')" :max="currStock.unsold_volume" size="large"
            btn-show-mode="focus" v-model="sellForm.volume" input-type="digit" @change="changeValue"
            @btnClick="onSliderChange(100)">
            <template #right-con>
              <div style="color:var(--ex-text-color2);font-size: 0.28rem;">
                {{ t("trade.contract_position_ongoing_amount") }}
                <span style="color: var(--ex-primary-color);">{{ currStock.unsold_volume }}</span>
              </div>
            </template>
          </FormItem>


          <!-- 拖动 -->
          <div style="padding: 0.2rem 0.24rem 0.4rem 0.24rem">
            <SlideContainer v-model="sliderValue" @change="onSliderChange" />
          </div>



          <!-- 收益分析 -->
          <!-- <div class="total_box">
                        <div class="total_item">
                            <div class="total_num total_big"
                                :class="!currStock.profit ? '' : (currStock.profit > 0 ? 'up' : 'down')">{{
                                    currStock.profit }}
                            </div>
                        </div>
                        <div class="total_item">
                            <div class="total_name">盈亏/盈亏比</div>
                            <div class="total_num total_big"
                                :class="!currStock.profit ? '' : (currStock.profit > 0 ? 'up' : 'down')">{{
                                    getRatio(currStock.ratio) }}</div>
                        </div>
                        <div class="total_item" style="border-top: 1px dashed var(--ex-border-color2)">
                            <div class="total_name">手续费</div>
                            <div class="total_num">{{ currStock.fee || 0 }}</div>
                        </div>
                    </div> -->

          <FormItem v-model="sellForm.safeword" size="large" input-type="password" v-if="userInfo.role != 'guest'"
            :placeholder="t('trade.stock_opening_trade_pw')">
          </FormItem>

          <Button class="submit ripple-btn" @click="goSellDialog" round :loading="sellLoading" type="primary"
            size="large" color="var(--ex-primary-color)">
            <span style="color: var(--ex-white);">{{ t("trade.stock_position_btn") }}</span>
          </Button>
        </div>
      </div>
    </BottomPopup>

    <!-- 更新 -->
    <BottomPopup v-model:show="showUpdate" position="bottom" round closeable teleport="body">
      <div class="van-popup-custom-title">
        {{ t("trade.stock_position_update") }}
      </div>
      <div class="order_sell_box">
        <div class="form">

          <div class="item_box">
            <div class="item_box_right">
              <div class="item">
                <input :placeholder="t('trade.stock_opening_stop')" @focus="priceFocus3 = true"
                  @blur="priceFocus3 = false" @input="inputStop(2)" v-model="updateForm.stop_loss_price" type="number"
                  class="ipt" />
                <span class="num-tag" @click="setPriceStop(20)" v-show="currStock.open_price"
                  :style="{ visibility: priceFocus3 ? '' : 'hidden' }">{{ currStock.offset == "long" ? "-" : "+"
                  }}20%</span>
                <span class="num-tag" @click="setPriceStop(15)" v-show="currStock.open_price"
                  :style="{ visibility: priceFocus3 ? '' : 'hidden' }">{{ currStock.offset == "long" ? "-" : "+"
                  }}15%</span>
                <span class="num-tag" @click="setPriceStop(10)" v-show="currStock.open_price"
                  :style="{ visibility: priceFocus3 ? '' : 'hidden' }">{{ currStock.offset == "long" ? "-" : "+"
                  }}10%</span>
                <!-- <span v-if="updateForm.stop_loss_type == 'ratio'">%</span> -->
              </div>
            </div>
          </div>
          <FormItem size="large" input-type="number" v-model="updateForm.amount"
            :placeholder="t('trade.stock_position_add_deposit')" btn-show-mode="focus"
            :tip="stockWalletAmount > 0 ? '≤ ' + stockWalletAmount : ''" :show-btn="stockWalletAmount > 0"
            @change="changeAmount" @btnClick="onSliderChange(100)">
            <template #right-con>
              <div style="font-size: 0.28rem;color: var(--ex-text-color3);">≤ {{ stockWalletAmount }} {{
                currStock.currency }}</div>
            </template>
          </FormItem>

          <!-- 拖动 -->
          <div style="padding: 0.2rem 0.24rem 0.4rem 0.24rem">
            <SlideContainer v-model="sliderValue" @change="onSliderChange" />
          </div>

          <FormItem v-model="updateForm.safeword" size="large" input-type="password" v-if="userInfo.role != 'guest'"
            :placeholder="t('trade.stock_opening_trade_pw')">
          </FormItem>

          <Button @click="goUpdateDialog" class="submit ripple-btn" round size="large" :loading="updateLoading"
            type="primary" color="var(--ex-primary-color)">
            <span style="color: var(--ex-white);">{{ t('trade.stock_position_btn') }}</span>
          </Button>
        </div>
      </div>
    </BottomPopup>

    <!-- 止盈类型选择 -->
    <ActionSheet teleport="body" v-model:show="showUpModelDialog" @select="onSelectUpMode" :actions="upModeList"
      :title="t('trade.stock_opening_take')">
    </ActionSheet>

    <!-- 止损类型选择 -->
    <ActionSheet teleport="body" v-model:show="showDownModelDialog" @select="onSelectDownMode" :actions="downModeList"
      :title="t('trade.stock_opening_stop')">
    </ActionSheet>
  </div>

  <UnLogin @loginfinish="loginfinish" v-show="!token" />

  <!-- 更新订单-安全密码弹窗 -->
  <SafePassword @submit="goUpdate" ref="safeRef" :key="'update'"></SafePassword>
  <!-- 平仓-安全密码弹窗 -->
  <SafePassword @submit="goSell" ref="safeRef2" :key="'sell'"></SafePassword>
</template>

<script setup>
import {
  SwipeCell,
  Popup,
  Button,
  Slider,
  showToast,
  ActionSheet,
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
  onActivated,
  onDeactivated,
} from "vue";
import store from "@/store";
import NoData from "@/components/NoData.vue";
import Decimal from "decimal.js";
import { _futuresSell, _futuresUpdate, _spotCancel } from "@/api/api";
import UnLogin from "@/components/UnLogin.vue";
import SafePassword from "@/components/SafePassword.vue";
import SlideContainer from "@/components/SlideContainer.vue";
import OrderInfo from "../components/OrderInfo.vue";
import FormItem from "@/components/Form/FormItem.vue";
import { useI18n } from "vue-i18n";
import Loaidng from "@/components/Loaidng.vue"
import BottomPopup from "@/components/BottomPopup.vue"

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
const loginfinish = () => { };

const safeRef = ref();
const safeRef2 = ref();

const token = computed(() => store.state.token);
const userInfo = computed(() => store.state.userInfo);

const contractPositionsList = computed(() => store.state.positionSpotList);
const elseWallet = computed(() => store.state.elseWallet || []);
const stockWalletAmount = computed(() => {
  // 合约账户余额
  const target = elseWallet.value.find((item) => item.account == "futures" && item.currency == currStock.value.currency);
  if (target) return target.amount;
  return 0;
});

const statusMap = ref({
  // 仓位状态
  none: t("trade.stock_position_status_none"),
  lock: t("trade.stock_position_status_lock"),
  open: t("trade.stock_position_status_open"),
  done: t("trade.stock_position_status_done"),
  fail: t("trade.stock_position_status_fail"),
  cancel: t("trade.stock_position_status_cancel"),
});
const offsetMap = ref({
  // 涨跌状态
  long: t("trade.stock_position_offset_long"),
  short: t("trade.stock_position_offset_short"),
});
const leverTypeap = ref({
  // 仓位
  cross: t('trade.stock_opening_position_mode_cross'),
  isolated: t('trade.stock_opening_position_mode_isolated'),
});
const priceTypeMap = ref({
  // 价格类型
  market: t('trade.stock_opening_price_market'),
  limit: t('trade.stock_opening_price_limit'),
});
const stopMap = ref({
  // 止损类型
  price: t("trade.stock_position_stop_price"),
  amount: t("trade.stock_position_stop_amount"),
  ratio: t("trade.stock_position_stop_ratio"),
});

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

const getRatio = (num) => {
  if (!num) return "--";
  return new Decimal(num) + "%";
};

// 详情
const showInfo = ref(false);
const currStock = ref({});
const OpeningForm = (item) => {
  currStock.value = item;
  showInfo.value = true;
};

// 平仓
const amountFocus = ref(false);
const sellForm = ref({
  volume: "",
  safeword: "",
});
const showSell = ref(false);
const sell = (item) => {
  if (!["none", "lock", "open"].includes(item.status)) return;
  getSessionToken();
  currStock.value = item;
  showSell.value = true;
  sellForm.value = {
    volume: "",
    safeword: "",
  };
  sliderValue.value = 0;
};
const sellLoading = ref(false);
const goSellDialog = () => {
  if (sellLoading.value) return;
  if (userInfo.value.role == 'guest') {
    sellForm.value.safeword = '000000'
  }
  if (!sellForm.value.volume) return showToast(t('trade.contract_position_no_close_amount'));
  if (!sellForm.value.safeword) return showToast(t('trade.stock_opening_trade_pw_placeholder'));
  goSell(sellForm.value.safeword);
};
const goSell = (s) => {
  sellLoading.value = true;
  _futuresSell({
    ...sellForm.value,
    safeword: s,
    order_no: currStock.value.order_no,
    token: sessionToken.value,
  })
    .then((res) => {
      if (res && res.code == 200) {
        store.dispatch("updateWallet");
        showToast(t("trade.stock_position_success"));
        showSell.value = false;
      }
    })
    .finally(() => {
      sellLoading.value = false;
      getSessionToken();
    });
};

// 更新
const showUpdate = ref(false);
const updateForm = ref({
  amount: "",
  stop_profit_type: null,
  stop_profit_price: null,
  stop_loss_type: null,
  stop_loss_price: null,
  safeword: "",
});
const update = (item) => {
  if (!["none", "lock", "open"].includes(item.status)) return;
  getSessionToken();
  currStock.value = item;
  showUpdate.value = true;
  updateForm.value = {
    amount: "",
    stop_profit_type: currStock.value.stop_profit_type || "price",
    stop_profit_price: currStock.value.stop_profit_price,
    stop_loss_type: currStock.value.stop_loss_type || "price",
    stop_loss_price: currStock.value.stop_loss_price,
    safeword: "",
  };
  sliderValue.value = 0;
};
const updateLoading = ref(false);
const goUpdateDialog = () => {
  if (updateLoading.value) return;
  if (userInfo.value.role == 'guest') {
    updateForm.value.safeword = '000000'
  }
  if (!updateForm.value.amount) return showToast(t("trade.stock_position_no_deposit"));
  if (!updateForm.value.safeword) return showToast(t('trade.stock_opening_trade_pw_placeholder'));
  goUpdate(updateForm.value.safeword);
};
const goUpdate = (s) => {
  updateLoading.value = true;
  _futuresUpdate({
    ...updateForm.value,
    safeword: s,
    order_no: currStock.value.order_no,
    token: sessionToken.value,
  })
    .then((res) => {
      if (res && res.code == 200) {
        store.dispatch("updateWallet");
        showToast(t("trade.stock_position_success"));
        showUpdate.value = false;
      }
    })
    .finally(() => {
      updateLoading.value = false;
      getSessionToken();
    });
};
const showUpModelDialog = ref(false);
const showDownModelDialog = ref(false);
const upModeList = computed(() => {
  const list = [];
  for (let key in stopMap.value) {
    list.push({
      name: stopMap.value[key],
      value: key,
      className:
        updateForm.value.stop_profit_type == key ? "action-sheet-active" : "",
    });
  }
  return list;
});
const downModeList = computed(() => {
  const list = [];
  for (let key in stopMap.value) {
    list.push({
      name: stopMap.value[key],
      value: key,
      className:
        updateForm.value.stop_loss_type == key ? "action-sheet-active" : "",
    });
  }
  return list;
});
const onSelectUpMode = (item) => {
  // 选择止盈类型
  showUpModelDialog.value = false;
  updateForm.value.stop_profit_type = item.value;
  updateForm.value.stop_profit_price = "";
};
const onSelectDownMode = (item) => {
  // 选择止损类型
  showDownModelDialog.value = false;
  updateForm.value.stop_loss_type = item.value;
  updateForm.value.stop_loss_price = "";
};
const inputStop = (key) => {
  // 输入止盈止损
  if (key == 1) {
    // 止盈
    updateForm.value.stop_profit_price =
      updateForm.value.stop_profit_price < 0
        ? 0
        : updateForm.value.stop_profit_price;
    if (updateForm.value.stop_profit_type == "ratio") {
      updateForm.value.stop_profit_price =
        updateForm.value.stop_profit_price > 100
          ? 100
          : updateForm.value.stop_profit_price;
    }
  } else {
    // 止损
    updateForm.value.stop_loss_price =
      updateForm.value.stop_loss_price < 0
        ? 0
        : updateForm.value.stop_loss_price;
    if (updateForm.value.stop_loss_type == "ratio") {
      updateForm.value.stop_loss_price =
        updateForm.value.stop_loss_price > 100
          ? 100
          : updateForm.value.stop_loss_price;
    }
  }
};
const priceFocus3 = ref(false);
const setPriceStop = (i) => {
  // 设置止损价格
  if (currStock.value.offset == "long") {
    // 买涨
    updateForm.value.stop_loss_price = new Decimal(currStock.value.open_price)
      .mul(100 - i)
      .div(100)
      .toNumber();
  } else {
    // 买跌
    updateForm.value.stop_loss_price = new Decimal(currStock.value.open_price)
      .mul(100 + i)
      .div(100)
      .toNumber();
  }
};

// 拖动
const sliderValue = ref(0);
const onSliderChange = (newValue) => {
  sliderValue.value = newValue;
  if (showSell.value) {
    // 平仓
    sellForm.value.volume = new Decimal(currStock.value.unsold_volume)
      .mul(newValue)
      .div(100)
      .floor();
  }
  if (showUpdate.value) {
    // 更新
    updateForm.value.amount = new Decimal(stockWalletAmount.value)
      .mul(newValue)
      .div(100)
      .toNumber();
  }
};
const changeValue = () => {
  let val = 0;
  if (showSell.value) val = sellForm.value.volume;
  if (!val || val < 0) {
    sliderValue.value = 0;
    sellForm.value.volume = "";
    return;
  }
  if (val > currStock.value.unsold_volume) {
    sliderValue.value = 100;
    if (showSell.value) sellForm.value.volume = currStock.value.unsold_volume;
    return;
  }
  sellForm.value.volume = Math.floor(sellForm.value.volume);
  sliderValue.value = Number(
    new Decimal(val).mul(100).div(currStock.value.unsold_volume).floor()
  );
};
const changeAmount = () => {
  let val = 0;
  if (showUpdate.value) val = updateForm.value.amount;
  if (!val || val < 0) {
    sliderValue.value = 0;
    updateForm.value.amount = 0;
    return;
  }
  if (val > stockWalletAmount.value) {
    sliderValue.value = 100;
    if (showUpdate.value) updateForm.value.amount = stockWalletAmount.value;
    return;
  }
  sliderValue.value = Number(
    new Decimal(val).mul(100).div(stockWalletAmount.value).floor()
  );
};

// 撤单
const cancel = (item) => {
  if (!["none"].includes(item.status)) return;
  showConfirmDialog({
    title: t("trade.stock_position_cancel_title"),
    message: t("trade.stock_position_cancel_con"),
    confirmButtonText: t("trade.stock_position_confirm_btn"),
    cancelButtonText: t("trade.stock_position_cancel_btn"),
    theme: 'round-button'
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
