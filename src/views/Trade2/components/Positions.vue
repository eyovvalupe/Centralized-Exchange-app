<!-- 持仓 -->
<template>
  <div v-if="token" class="positions">
    <div class="tr th">
      <div class="td td-5">{{ t("trade.stock_position_stock") }}</div>
      <div class="td td-4">{{ t("trade.stock_position_open") }}</div>
      <div class="td td-4">{{ t("trade.stock_position_cost") }}</div>
      <div class="td td-4" style="text-align: end !important">
        {{ t("trade.stock_position_profit") }}
      </div>
    </div>
    <NoData v-if="!positionsList.length && !loading" />
    <Loaidng size="0.32rem" :loading="loading" v-if="!positionsList.length && loading" />

    <div class="tr" @click="OpeningForm(item)" v-for="(item, i) in positionsList" :key="i">

      <div
        style="margin-top: 0.2rem;background-color: var(--ex-bg-color3);border-radius: 0.4rem;display: flex;width: 100%;padding: 0.24rem;">
        <div class="td td-5">
          <div class="name van-omit1">{{ item.symbol }}</div>
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

    <!-- 订单详情 -->
    <Popup v-model:show="showInfo" position="right" style="width: 100%; height: 100%" teleport="body">
      <OrderInfo :curr-stock="currStock" @update="update" @sell="sell" @cancel="cancel" @back="showInfo = false" />
    </Popup>

    <!-- 平仓 -->
    <Popup v-model:show="showSell" position="bottom" round closeable teleport="body">
      <div class="van-popup-custom-title">
        {{ t("trade.stock_position_close") }}
      </div>
      <div class="order_sell_box">
        <div class="form">
          <div class="subtitle">
            <span>{{ t("trade.stock_position_amount") }}</span>
            <span class="subtitle-tip">{{ t("trade.stock_position_ongoing_amount") }}
              {{ currStock.unsold_volume }}</span>
          </div>
          <div class="item">
            <input @focus="amountFocus = true" @blur="amountFocus = false" v-model="sellForm.volume"
              @input="changeValue" type="number" class="ipt" />
            <span :style="{
              opacity: amountFocus ? '1' : '0',
              visibility: amountFocus ? '' : 'hidden',
            }" style="
                color: var(--ex-primary-color);
                word-break: keep-all;
                transition: all ease 0.3s;
              " @click="onSliderChange(100)">{{ t("trade.stock_position_all") }}</span>
          </div>
          <div style="height: 0.47rem"></div>

          <!-- 拖动 -->
          <SlideContainer v-model="sliderValue" @change="onSliderChange" />

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

          <!-- <div class="subtitle" style="margin-top: 0.2rem;">请输入交易密码</div>
                    <div class="item">
                        <input v-model="sellForm.safeword" type="password" class="ipt">
                    </div> -->

          <Button class="submit" @click="goSellDialog" round :loading="sellLoading" type="primary" size="large"
            color="var(--ex-primary-color)">
            {{ t("trade.stock_position_btn") }}
          </Button>
        </div>
      </div>
    </Popup>

    <!-- 更新 -->
    <Popup v-model:show="showUpdate" position="bottom" round closeable teleport="body">
      <div class="van-popup-custom-title">
        {{ t("trade.stock_position_update") }}
      </div>
      <div class="order_sell_box">
        <div class="form">
          <div class="item_box">
            <div class="item_box_right">
              <FormItem input-type="number" :placeholder="t('trade.stock_opening_stop')" :min="0" :max="updateForm.stop_profit_type == 'ratio' ? 100 : 99999999999999
                " size="large" v-model="updateForm.stop_loss_price" :percent-tags="currStock.offset == 'long'
                  ? [
                    { label: '-20%', value: 20 },
                    { label: '-15%', value: 15 },
                    { label: '-10%', value: 10 },
                  ]
                  : [
                    { label: '+20%', value: 20 },
                    { label: '+15%', value: 15 },
                    { label: '+10%', value: 10 },
                  ]
                  " @percentTagClick="setPriceStop" />
            </div>
          </div>
          <div class="subtitle">
            <span>{{ t("trade.stock_position_add_deposit") }}</span>
            <span class="subtitle-tip">≤ {{ stockWalletAmount }}</span>
          </div>
          <div class="item">
            <input @focus="amountFocus = true" @blur="amountFocus = false" @input="changeAmount"
              v-model="updateForm.amount" type="number" class="ipt" />
            <span :style="{
              opacity: amountFocus ? '1' : '0',
              visibility: amountFocus ? '' : 'hidden',
            }" style="
                color: var(--ex-primary-color);
                word-break: keep-all;
                transition: all ease 0.3s;
              " @click="onSliderChange(100)">{{ t("trade.stock_position_all") }}</span>
          </div>
          <div style="height: 0.47rem"></div>
          <!-- 拖动 -->
          <SlideContainer v-model="sliderValue" @change="onSliderChange" />

          <!-- <div class="subtitle" style="margin-top: 0.2rem;">请输入交易密码</div>
                    <div class="item">
                        <input v-model="updateForm.safeword" type="password" class="ipt">
                    </div> -->

          <Button @click="goUpdateDialog" class="submit" round size="large" :loading="updateLoading" type="primary"
            color="var(--ex-primary-color)">
            {{ t("trade.stock_position_btn") }}
          </Button>
        </div>
      </div>
    </Popup>

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
import { onMounted, onUnmounted, computed, ref, watch } from "vue";
import store from "@/store";
import NoData from "@/components/NoData.vue";
import Decimal from "decimal.js";
import { _stocksSell, _stocksUpdate, _stocksCancel } from "@/api/api";
import UnLogin from "@/components/UnLogin.vue";
import SafePassword from "@/components/SafePassword.vue";
import SlideContainer from "@/components/SlideContainer.vue";
import OrderInfo from "./OrderInfo.vue";
import FormItem from "@/components/Form/FormItem.vue";
import { useI18n } from "vue-i18n";
import Loaidng from "@/components/Loaidng.vue"

const { t } = useI18n();
const loginfinish = () => { };

const safeRef = ref();
const safeRef2 = ref();

const token = computed(() => store.state.token);
const positionsList = computed(() => store.state.positionsList);

const elseWallet = computed(() => store.state.elseWallet || []);
const stockWalletAmount = computed(() => {
  // 股票账户余额
  const target = elseWallet.value.find((item) => item.account == "stock");
  if (target) return target.amount;
  return 0;
});

const items = ref();
const clickDom = (e, i) => {
  if (e == "cell" && items.value[i]) {
    items.value[i]._opened = !items.value[i]._opened;
    if (items.value[i]._opened) {
      setTimeout(() => {
        items.value[i].open("right");
      }, 0);
    }
  }
};
const closeDom = (i) => {
  if (items.value[i]) items.value[i]._opened = false;
};

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
    socket && socket.off("stockorder");
    socket && socket.emit("user", store.state.token);
    socket && socket.emit("stockorder", "#all");
    loading.value = true;
    socket.on("stockorder", (res) => {
      store.commit("setPositionsList", res.data || []);
      loading.value = false;
    });
  });
};
// 取消订阅
const cancelSubs = () => {
  const socket = startSocket(() => {
    socket && socket.off("user");
    socket && socket.off("stockorder");
    socket && socket.emit("user", "");
    socket && socket.emit("stockorder", "");
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
  if (!sellForm.value.volume)
    return showToast(t("trade.stock_position_no_close_amount"));
  // if (!sellForm.value.safeword) return showToast('请输入交易密码')
  showSell.value = false;
  safeRef2.value && safeRef2.value.open();
};
const goSell = (s) => {
  sellLoading.value = true;
  _stocksSell({
    ...sellForm.value,
    safeword: s,
    order_no: currStock.value.order_no,
    token: sessionToken.value,
  })
    .then((res) => {
      if (res && res.code == 200) {
        showToast(t("trade.stock_position_success"));
        store.dispatch("updateWallet");
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
  if (!updateForm.value.amount)
    return showToast(t("trade.stock_position_no_deposit"));
  // if (!updateForm.value.safeword) return showToast('请输入交易密码')
  showUpdate.value = false;
  safeRef.value && safeRef.value.open();
};
const goUpdate = (s) => {
  updateLoading.value = true;
  _stocksUpdate({
    ...updateForm.value,
    safeword: s,
    order_no: currStock.value.order_no,
    token: sessionToken.value,
  })
    .then((res) => {
      if (res && res.code == 200) {
        showToast(t("trade.stock_position_success"));
        store.dispatch("updateWallet");
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
const setPriceStop = (tag) => {
  // 设置止损价格
  const i = tag.value;
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
const percentages = [25, 50, 75, 100];
const sliderValue = ref(0);
const onSliderChange = (newValue) => {
  sliderValue.value = newValue;
  if (showSell.value) {
    // 平仓
    sellForm.value.volume = new Decimal(currStock.value.unsold_volume)
      .mul(newValue)
      .div(100)
      .toNumber();
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
    sellForm.value.volume = 0;
    return;
  }
  if (val > currStock.value.unsold_volume) {
    sliderValue.value = 100;
    if (showSell.value) sellForm.value.volume = currStock.value.unsold_volume;
    return;
  }
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
  })
    .then(() => {
      showLoadingToast({
        duration: 0,
        loadingType: "spinner",
      });
      _stocksCancel({
        order_no: item.order_no,
        token: sessionToken.value,
      })
        .then((res) => {
          if (res && res.code == 200) {
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
  padding: 0 0.32rem;

  .tr {
    padding: 0.24rem 0;
    border-bottom: 1px solid var(--ex-border-color);
    display: flex;
    align-items: stretch;
  }

  .tr:last-child {
    border-bottom: 0px;
  }

  .th {
    color: var(--ex-text-color3);
    font-size: 0.22rem;
    padding: 0.48rem 0 0.24rem 0;
  }

  .td {
    text-align: center;
    flex-shrink: 0;
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
      display: block;
    }

    .lever {
      display: flex;
      align-items: center;
      position: relative;
      bottom: -0.02rem;
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
  transition: all ease 0.3s;
  border-radius: 0.3rem;
  background: rgba(33, 104, 246, 0.1);
  font-size: 0.24rem;
  padding: 0 0.14rem;
  height: 0.4rem;
  line-height: 0.4rem;
}
</style>
