<!-- ai量化交易 -->
<template>
  <div class="trade_ai" :class="['trade_ai--' + mode]">
    <Top :title="t('trade.ai_opening_trade')" :backFunc="backFunc" v-if="mode == 'popup'" />

    <div style="height: 1.12rem" v-if="mode == 'popup'"></div>
    <div class="tabs-container">
      <div class="type_tabs">
        <div @click="tab = 1" class="type_tab tab_ani" :class="{ active_type_tab: tab == 1 }">
          <span class="type_tab_text">{{ t('trade.ai_opening_long') }}</span>
        </div>
        <div @click="tab = 2" class="type_tab tab_ani" :class="{ active_type_tab: tab == 2 }">
          <span class="type_tab_text">{{ t('trade.ai_opening_short') }}</span>
        </div>
      </div>

      <div class="scroller">
        <!-- 品种 -->
        <!-- <div class="item_content">
          <div class="item item_box" :class="{ 'item_box_name': form1.name }" @click="showNavDialog">
            <div class="placeholder">{{ t("trade.ai_opening_product_type") }}</div>
            <div class="name">{{ form1.name }}</div>
            <div class="more_icon">
              <img v-lazy="getStaticImgUrl('/static/img/common/more.svg')" alt="↓" />
            </div>
          </div>
        </div> -->

        <!-- 时间 -->
        <div class="item_content" style="margin-bottom: 0.2rem;" v-if="times.length">
          <div class="subtitle">{{ t("trade.ai_opening_time_zone") }}</div>
          <!-- <div class="item item_box disabled_item item_time" @click="showTime=true;">
                        <span>{{ currTime.time }}{{ _dateUnitMap[currTime.unit] }}</span>
                        
                    </div> -->
          <div class="time_list">
            <div class="time block_ani" @click="currTime = obj" :class="{
              curr_time:
                currTime.time == obj.time && currTime.unit == obj.unit,
            }" v-for="(obj, i) in times" :key="i">
              <span>{{ obj.time }}{{ _dateUnitMap[obj.unit] }}</span>
            </div>
          </div>
        </div>
        <!-- 数量 -->
        <FormItem style="height: 3.6rem;" :hasBot="true" :hasRT="true" :hasScroll="true" input-type="number"
          v-model="form1.grid" :tip="maxgrid > 0 ? '≤' + maxgrid : ''"
          :placeholder="t('trade.ai_opening_network_amount')" btn-show-mode="focus" :max="maxgrid" @change="changeGrid">

          <template #right-content-title>
            <div class="subtitle">{{ t('trade.ai_opening_profit_margin') }}</div>
          </template>

          <template #bottom-con>
            <div style="padding-left: 0.24rem;width: 100%;padding-top: 0.08rem;">
              <div style="font-size: 0.24rem;color: var(--ex-text-color3);">{{ t('trade.ai_opening_profit_ratio') }}
              </div>
              <div style="font-size: 0.28rem;color: var(--ex-white);font-weight: bold;margin-top: 0.08rem;">{{
                getPercent() }}</div>
            </div>
          </template>


          <template #scroll>
            <SlideContainer v-model="sliderValue2" @change="onSliderChange2" />
          </template>
        </FormItem>


        <!-- 投资额 -->
        <div style="height: 0.2rem;"></div>
        <FormItem :hasScroll="true" input-type="number" v-model="form1.volume"
          :placeholder="t('trade.ai_opening_invest_amount')" btn-show-mode="focus" :tip="'≥' + minamount"
          :show-btn="usdt.amount > 0" @change="changePercent" @btnClick="onSliderChange(100)">
          <!-- <template #title-right>
            <span v-if="token" style="color: var(--ex-primary-color); font-size: 12px" @click="openConfirmBox"><span
                style="color: var(--ex-text-color2)">{{
                  t("trade.ai_opening_balance")
                }}</span>
              {{ usdt.amount }} USDT</span>
          </template> -->

          <!-- <template #rt>
            <div @click="openConfirmBox">
              <div
                style="color: var(--ex-text-color2); font-size: 0.24rem;padding: 0.12rem 0.16rem;border-radius: 0.4rem;background-color: var(--ex-bg-color);">
                <span>{{ t("trade.ai_opening_balance") }}</span>
                <span style="color: var(--ex-primary-color);margin:0 0.08rem">{{ usdt.amount || '--' }} </span>
                <span>USDT</span>
              </div>
            </div>
          </template> -->

          <template #scroll>
            <SlideContainer v-model="sliderValue" @change="onSliderChange" />
          </template>
        </FormItem>

        <div v-if="!token" style="margin-top: 0.6rem;" class="unlogin-box pb-[0.4rem]">
          <div class="flex justify-between mb-[0.32rem] gap-[0.2rem]">
            <div
              class="flex-1 h-[0.8rem]   rounded-[0.4rem] flex items-center justify-center text-[0.3rem] btn ripple-primary"
              @click="store.commit('setIsLoginOpen', true), emits('success')">
              {{ t("trade.stock_opening_token_login") }}
            </div>
            <div
              class="flex-1 h-[0.8rem]  rounded-[0.4rem] flex items-center justify-center  text-[0.3rem] btn btn2 ripple-primary"
              @click="jump('register')">
              {{ t("trade.stock_opening_token_register") }}
            </div>
          </div>
          <!-- <div
          class="w-full h-[0.8rem]   rounded-[0.4rem] flex items-center justify-center text-[0.3rem] btn ripple-primary"
          @click="() => router.push({ name: 'register', query: { guest: 'guest' } })
            ">
          {{ t("trade.contract_create_guest_btn") }}
        </div> -->
        </div>
        <div class="btns" v-else>
          <Button :loading="loading || submitLoading" @click="checkForm" v-if="token" size="large"
            class="btn ripple-btn" :color="tab == 1 ? 'var(--ex-primary-color)' : 'var(--ex-down-color)'" round>
            <span style="color: var(--ex-white);">{{
              tab == 1 ? t("trade.stock_open_long") : t("trade.stock_open_short")
            }}</span>
          </Button>
        </div>
      </div>

      <div class="account-box" v-if="token">
        <div class="title">{{ t('assets.wallet_header_contract') }}</div>
        <div class="info">
          <div>{{ t('market.market_faster_available') }}</div>
          <div>
            <span style="font-size: 0.32rem;color:var(--ex-primary-color)">{{ usdt.amount || '0' }}</span>
            <span style="color:var(--ex-white)">USDT</span>
          </div>
        </div>

        <div class="btns">
          <div class="btn ripple-primary" @click="jump('topUpCrypto')">{{ t('assets.recharge') }}</div>
          <div class="btn ripple-primary" style="margin-left: 0.28rem;" @click="jump('transfer')">{{
            t('assets.transfer') }}
          </div>
        </div>
      </div>

    </div>

    <!-- 开仓确认弹窗 -->
    <BottomPopup teleport="body" v-model:show="showModel" position="bottom" round closeable>
      <div class="van-popup-custom-title">
        {{ t("trade.ai_opening_confirm_order") }}
      </div>

      <div class="stock_submit_box">
        <div class="stock_submit_box_inner">
          <div class="item">
            <div class="item_name">{{ t("trade.ai_opening_product_type") }}</div>
            <div class="item_val">
              <div style="width: 0.4rem;height: 0.4rem;margin-right: 0.16rem;"
                v-if="form1.name && form1.name.replace('/USDT', '')">
                <CryptoIcon :name="form1.name.replace('/USDT', '').toUpperCase()" />
              </div>
              <div class="item_val_text">{{ form1.name }}</div>
            </div>
          </div>
          <div class="item">
            <div class="item_name">{{ t("trade.ai_opening_time_zone") }}</div>
            <div class="item_val">
              <div class="item_val_text">
                {{ currTime.time }}{{ _dateUnitMap[currTime.unit] }}
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item_name">
              {{ t("trade.ai_opening_network_amount") }}
            </div>
            <div class="item_val">
              <div class="item_val_text">{{ form1.grid }}</div>
            </div>
          </div>
          <div class="item">
            <div class="item_name">{{ t("trade.ai_opening_invest_amount") }}</div>
            <div class="item_val">
              <div class="item_val_text">{{ form1.volume }}</div>
              <div class="item_val_unit">USDT</div>
            </div>
          </div>
          <div class="item">
            <div class="item_name">
              {{ t("trade.ai_opening_predict_profit") }}
            </div>
            <div class="item_val">
              <div class="item_val_text">{{ getRange() }}</div>
              <div class="item_val_unit">USDT</div>
            </div>
          </div>
        </div>

        <FormItem style="margin-top: 0.4rem;" v-model="form1.safeword" v-if="userInfo.role != 'guest'" size="large"
          input-type="password" :placeholder="t('trade.stock_opening_trade_pw')">
        </FormItem>

        <Button :loading="submitLoading" @click="submitForm(form1.safeword)" size="large" class="submit ripple-btn"
          color="var(--ex-primary-color)" round><span style="color: var(--ex-white);">{{
            t("trade.ai_opening_confirm_btn")
          }}</span></Button>
      </div>
    </BottomPopup>

    <!-- ai订单详情 -->
    <AiInfo ref="infoRef" />
    <!-- 开仓-安全密码弹窗 -->
    <SafePassword @submit="submitForm" ref="safeRef" :key="'open'"></SafePassword>

    <!-- 股票行情弹窗 -->
    <BottomPopup teleport="body" v-model:show="showStockModel" position="bottom" round closeable>
      <StockPopup type="ai" style="height: calc(var(--vh) * 90)" v-if="showStockModel" />
    </BottomPopup>

    <!-- ai列表 -->
    <BottomPopup teleport="body" v-model:show="showBottom" round closeable position="bottom">
      <div class="trade_ai_list">
        <div class="trade_ai_list_title">
          {{ t("trade.ai_opening_ai_quantifi_list") }}
        </div>
        <div class="list">
          <AiItem @click.stop="chooseItem(item)" v-for="(item, i) in marketAiList" :key="i" :item="item" />
        </div>
      </div>
    </BottomPopup>
  </div>

  <!-- 账户余额弹窗 -->
  <AmountPopup ref="AmountPopupRef" :name="t('trade.ai_opening_cash_wallet')" :amount="usdt.amount"
    :currency="'USDT'" />
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Button,
  showToast,
} from "vant";
import Decimal from "decimal.js";
import store from "@/store";
import router from "@/router";
import AiInfo from "../components/AiInfo.vue";
import AiItem from "../../Market/components/AiItem.vue";
import { useRoute } from "vue-router";
import { _aipara, _aibuy, _aiquant2 } from "@/api/api";
import SafePassword from "@/components/SafePassword.vue";
import { _dateUnitMap } from "@/utils/dataMap";
import StockPopup from "../../trade/StockPopup.vue";
import FormItem from "@/components/Form/FormItem.vue";
import SlideContainer from "@/components/SlideContainer.vue";
import Top from "@/components/Top.vue";
import AmountPopup from "../AmountPopup.vue";
import { useI18n } from "vue-i18n";
import BottomPopup from "@/components/BottomPopup.vue";
import { getStaticImgUrl } from "@/utils/index.js"


const { t } = useI18n();
const props = defineProps({
  mode: {
    type: String,
    default: "page",
  },
  type: {
    type: String,
    default: "page",
  },
  tradeType: {
    type: [String, Number],
    default: ''
  }
});

const goLogin = () => {
  store.commit("setIsLoginOpen", true);
  // eventBus.on('loginSuccess', () => {
  //     eventBus.off('loginSuccess')
  // })
};
// onBeforeUnmount(() => {
//     eventBus.off('loginSuccess')
// })

// 详情
const infoRef = ref();
const openInfo = (item) => {
  infoRef.value && infoRef.value.open(item);
};

const route = useRoute();
const wallet = computed(() => store.state.wallet || []);
const usdt = computed(
  () => wallet.value.find((item) => item.currency == "USDT") || {}
);

const emits = defineEmits(["showNavDialog", "back", 'success']);
const showNavDialog = () => {
  // emits('showNavDialog', 'ai')
  showBottom.value = true;
};

const backFunc = () => {
  emits("back");
};

const safeRef = ref();

const token = computed(() => store.state.token);
const userInfo = computed(() => store.state.userInfo);
const tab = ref(1); // 1-看涨 2-看跌
const showModel = ref(false);

// 表单

const form1 = ref({
  name: "",
  symbol: "",
  grid: "",
  volume: "",
  safeword: "",
});

if (props.tradeType == 3) { // 机器人
  form1.value.name = route.query.name || ""
  form1.value.symbol = route.query.symbol || ""
}

// 缓存
let obj = {}
try {
  obj = JSON.parse(sessionStorage.getItem('currAi') || '{}')
} catch {
  obj = {}
}
if (obj.symbol) {
  form1.value.name = obj.name;
  form1.value.symbol = obj.symbol;
  store.commit("setCurrAi", obj);
}


const changeGrid = () => {
  setTimeout(() => {
    form1.value.grid = parseInt(form1.value.grid);
    if (form1.value.grid > maxgrid.value) {
      form1.value.grid = maxgrid.value;
    }
    if (form1.value.grid <= 1) {
      form1.value.grid = 1;
    }

    changePercent2()
  }, 0);
};

// 拖动
const sliderValue = ref(0);
const maxStockNum = computed(() => usdt.value.amount);
const step = computed(() => 1);
const onSliderChange = (newValue) => {
  sliderValue.value = newValue;
  if (maxStockNum.value == "--") return (sliderValue.value = 0);
  let v = new Decimal(maxStockNum.value).mul(newValue).div(100);
  v = v.sub(v.mod(step.value));
  form1.value.volume = v.toNumber();
  setTimeout(() => {
    changePercent();
  }, 0);
};
const changePercent = () => {
  if (maxStockNum.value == "--" || !form1.value.volume)
    return (sliderValue.value = 0);
  let v = new Decimal(form1.value.volume);
  form1.value.volume = v.sub(v.mod(step.value));
  let p = new Decimal(form1.value.volume)
    .div(maxStockNum.value)
    .mul(100)
    .toNumber();
  if (p < 0) p = 0;
  if (p > 100) p = 100;
  sliderValue.value = Number(p);
};

// 开仓
const error1 = ref(false);
const error2 = ref(false);
const checkForm = () => {
  if (!form1.value.symbol) return showToast(t("trade.ai_opening_no_product"));
  if (!form1.value.grid) {
    error1.value = true;
    showToast(t("trade.ai_opening_no_net"));
    return;
  }
  if (!form1.value.volume || form1.value.volume < 0) {
    error2.value = true;
    showToast(t("trade.ai_opening_no_invest_amount"));
    return;
  }
  if (form1.value.volume < minamount.value) {
    error2.value = true;
    showToast(`${t("trade.ai_opening_min_invest_amount")}: ` + minamount.value);
    return;
  }
  getSessionToken();
  showModel.value = true;
};

const submitLoading = ref(false);
const submitForm = (s) => {
  if (userInfo.value.role == 'guest') {
    s = '000000'
  }
  if (submitLoading.value) return;
  if (!s) {
    return showToast(t("trade.ai_opening_trade_password"));
  }
  submitLoading.value = true;
  _aibuy({
    symbol: form1.value.symbol,
    offset: tab.value == 1 ? "long" : "short",
    time: currTime.value.time,
    unit: currTime.value.unit,
    lever: form1.value.grid,
    amount: form1.value.volume,
    token: sessionToken.value,
    safeword: s,
  })
    .then((res) => {
      if (res && res.code == 200) {
        showModel.value = false;
        store.dispatch("updateWallet");
        showToast(t("trade.ai_opening_success"));
        emits('success')
        setTimeout(() => {
          openInfo(res.data);
        }, 500);
        form1.value.safeword = "";
        form1.value.volume = "";
        form1.value.grid = "";
        sliderValue.value = 0;
      }
    })
    .finally(() => {
      getSessionToken();
      setTimeout(() => {
        submitLoading.value = false;
      }, 500);
    });
};

// 交易参数
const loading = ref(false);
const minamount = ref(0); // 最小投资额
const maxgrid = ref(0); // 最大网格
const currTime = ref({}); // 当前时间选项
const getPercent = () => {
  // 获取利润展示文案
  if (!currTime.value.rangereturn || !form1.value.grid) return "--";
  const rangereturn = currTime.value.rangereturn;
  let rs = "--";
  try {
    const arr = rangereturn.split(" - ");
    rs = `${new Decimal(arr[0]).mul(form1.value.grid)}% - ${new Decimal(arr[1]).mul(form1.value.grid)}%`;
  } catch { }

  return rs;
};
// 拖动
const sliderValue2 = ref(0);
const onSliderChange2 = (newValue) => {
  sliderValue2.value = newValue;
  if (maxgrid.value == "--") return (sliderValue2.value = 0);
  let v = new Decimal(maxgrid.value).mul(newValue).div(100);
  v = v.sub(v.mod(1));
  form1.value.grid = v.toNumber();
  setTimeout(() => {
    changePercent2();
  }, 0);
};
const changePercent2 = () => {
  if (maxgrid.value == "--" || !form1.value.grid)
    return (sliderValue2.value = 0);
  let v = new Decimal(form1.value.grid);
  form1.value.grid = v.sub(v.mod(1));
  let p = new Decimal(form1.value.grid)
    .div(maxgrid.value)
    .mul(100)
    .toNumber();
  if (p < 0) p = 0;
  if (p > 100) p = 100;
  sliderValue2.value = Number(p);
};
const getRange = () => {
  // 获取预计盈亏
  if (!currTime.value.rangereturn) return "--";
  if (!form1.value.volume) return "--";
  const rangereturn = currTime.value.rangereturn;
  let rs = "--";
  try {
    const arr = rangereturn.split(" - ");
    const start = new Decimal(form1.value.volume).mul(Number(arr[0])).div(100);
    const end = new Decimal(form1.value.volume).mul(Number(arr[1])).div(100);
    rs = `${start} - ${end}`;
  } catch { }

  return rs;
};
const times = ref([]); // 时间选项
const getParams = () => {
  if (!form1.value.symbol) return;
  loading.value = true;
  _aipara({
    symbol: form1.value.symbol,
  })
    .then((res) => {
      if (!res.data) return;
      minamount.value = res.data.minamount;
      maxgrid.value = res.data.maxgrid;
      times.value = res.data.list || [];
      if (times.value[0]) {
        currTime.value = times.value[0];
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
getParams();

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || "");
const getSessionToken = () => {
  store.dispatch("updateSessionToken");
};

// 打开行情
const showStockModel = ref(false);
const openStockModel = () => {
  store.commit("setCurrAi", form1.value);
  showStockModel.value = true;
};

const AmountPopupRef = ref();
const openConfirmBox = () => {
  AmountPopupRef.value && AmountPopupRef.value.open();
};

// 跳转
const jump = (name) => {
  router.push({
    name,
  });
};

// ai列表
const showBottom = ref(false);
const marketAiList = computed(() => store.state.marketAiList || []); // ai量化默认列表
const chooseItem = (item) => {
  form1.value.name = item.name;
  form1.value.symbol = item.symbol;
  store.commit("setCurrAi", item);
  showBottom.value = false;
  getParams();
  sessionStorage.setItem('currAi', JSON.stringify(item))
};
if (!marketAiList.value.length) {
  _aiquant2({
    name: "",
    page: 1,
  }).then((res) => {
    store.commit("setMarketAiList", res.data || []);
    setTimeout(() => {
      store.dispatch("subList", {
        commitKey: "setMarketAiList",
        listKey: "marketAiList",
      });
    }, 500);
  });
}


const init = () => {
  error1.value = false;
  error2.value = false;
  form1.value = {
    name: route.query.name || "",
    symbol: route.query.symbol || "",
    grid: "",
    volume: "",
  };
  getParams();
};

defineExpose({
  init,
  choose: chooseItem
});
</script>

<style lang="less" scoped>
.scroller {
  box-sizing: border-box;
  padding: 0.2rem 0.16rem 0.4rem 0.16rem;
  border-radius: 0.32rem;
  background-color: var(--ex-bg-color3);
  border-bottom: 1px solid var(--ex-bg-white2);
}

.account-box {
  border-radius: 0.32rem;
  background-color: var(--ex-bg-color3);
  padding: 0.36rem 0.32rem;
  margin-top: 0.1rem;

  .title {
    font-size: 0.32rem;
    color: var(--white);
    margin-bottom: 0.4rem;
  }

  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--ex-placeholder-color);
  }

  .btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.52rem;

    .btn {
      flex: 1;
      height: 0.68rem;
      border-radius: 1rem !important;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ex-white);
      font-size: 0.28rem;
      background-color: var(--ex-bg-white1);
    }
  }
}

.time_popup {
  :deep(.van-popup__close-icon) {
    right: inherit;
    left: 0.32rem;
    top: 0.28rem;
  }
}

.time_popup_btn {
  width: 1.2rem;
  height: 0.6rem;
  flex-shrink: 0;
  border-radius: 1rem;
  background: var(--ex-primary-color);
  line-height: 0.6rem;
  position: absolute;
  right: 0.3rem;
  top: 0.22rem;
  color: var(--ex-text-color--bg-primary);
  text-align: center;
  font-size: 0.3rem;
  font-weight: 500;
}

.item_time {
  display: flex;
  justify-content: space-between;
}

.time_list {
  margin-left: -0.2rem;

  .time {
    width: 25%;
    float: left;
    box-sizing: border-box;
    padding: 0.1rem 0 0.1rem 0.2rem;

    span {
      border-radius: 0.7rem;
      display: block;
      border: 1px solid var(--ex-text-color5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.28rem;
      color: var(--ex-text-color2);
      height: 0.6rem;
      box-sizing: border-box;
    }
  }

  .curr_time span {
    background-color: var(--ex-primary-color);
    border-color: var(--ex-primary-color);
    color: var(--ex-text-color--bg-primary);
  }

  &::after {
    content: "";
    display: block;
    clear: both;
  }
}

.trade_ai--popup {
  padding: 0.28rem 0.32rem 0 0.32rem;

  .scroller {
    height: calc(var(--vh) * 100 - 2.42rem);
    overflow-y: auto;
    padding-bottom: 2rem;
  }

  .btns {
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;

    background-color: rgba(255, 255, 255, 0.7);
    z-index: 1000;
  }

}

.trade_ai {

  .btns {
    // padding: 0.32rem 0.16rem 0.4rem 0.16rem;
    padding: 0.32rem 0 0.08rem 0;
    display: flex;

    .btn {
      flex: 1;
      // margin: 0.2rem 0.16rem 0.6rem 0.16rem;
      border-radius: 1rem;
    }
  }

  .unlogin-box {
    .btn {
      background-color: var(--ex-white);
      color: var(--ex-bg-color);
    }

    .btn2 {
      background-color: var(--ex-primary-color);
      color: var(--ex-white);
    }
  }

  .subtitle {
    color: var(--ex-text-color);
    font-size: 0.28rem;
    margin-bottom: 0.12rem;
    line-height: 0.36rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .stock_icon {
      width: 0.36rem;
      height: 0.36rem;
    }
  }

  .item_content {
    background-color: var(--ex-bg-white1);
    border-radius: 0.32rem;
    padding: 0.24rem 0.28rem;

    .subtitle {
      color: var(--ex-text-color3);
    }
  }

  .put_all {
    color: var(--ex-primary-color);
    position: absolute;
    right: 0.32rem;
    font-size: 0.3rem;
    z-index: 9;
    transition: all ease-in 0.3s;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    .ipt {
      flex: 1;
      height: 100%;
      width: 2rem;
      font-size: 0.28rem;
      padding: 0;
      position: relative;
      z-index: 1;
    }

    .select {
      height: 0.88rem;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-left: 0.32rem;
      padding: 0 0.32rem;
      border: 1px solid var(--ex-border-color2);
      border-radius: 0.12rem;

      .select_more {
        width: 0.32rem;
        height: 0.32rem;
        margin-left: 1rem;
      }
    }
  }

  .item_box {
    position: relative;
    height: 1.12rem;
    border-radius: 0.32rem;
    padding: 0 0.24rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    .placeholder {
      position: absolute;
      color: var(--ex-text-color3);
      font-size: 0.28rem;
      top: 50%;
      transform: translateY(-50%);
      left: 0.28rem;
    }

    .more_icon {
      width: 0.32rem;
      height: 0.32rem;
      margin-left: 0.08rem;
      transform: rotate(-90deg);
    }
  }

  .item_box_name {
    height: 0.64rem;

    .placeholder {
      font-size: 0.24rem;
      transform: translateY(-150%);
    }

    .name {
      position: relative;
      top: 0.16rem;
    }
  }

  .disabled_item {
    background-color: var(--ex-bg-color2);
  }

  .error_border {
    border: 1px solid var(--ex-border-error) !important;
  }
}

.stock_submit_box {
  padding: 0.2rem 0.5rem 0.6rem;

  .stock_submit_box_inner {
    padding: 0.28rem;
    border-radius: 0.32rem;
    background-color: var(--ex-bg-white1);
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.36rem 0 0.2rem 0;
    border-bottom: 1px solid var(--ex-border-color);

    .item_name {
      color: var(--ex-text-color3);
      font-size: 0.28rem;
      font-weight: 400;
    }

    .item_val {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: var(--ex-text-color);
      font-size: 0.28rem;
      font-weight: 600;

      &_unit {
        margin-left: 0.06rem;
        font-size: 0.24rem;
        line-height: 100%;
        margin-top: 0.04rem;
      }
    }
  }

  .subtitle {
    font-size: 0.24rem;
    margin-bottom: 0.2rem;
    color: var(--ex-text-color);
    font-weight: 400;
  }

  .pass_ipt {
    margin-bottom: 0.4rem;
    border-radius: 0.12rem;
    border: 1px solid var(--ex-border-color2);
    padding: 0 0.24rem;

    .ipt {
      height: 0.8rem;
    }
  }

  .submit {
    margin-top: 0.5rem;
  }
}

.trade_ai_list {
  .trade_ai_list_title {
    font-size: 0.32rem;
    line-height: 0.6rem;
    text-align: center;
    margin-bottom: 0.2rem;
    font-weight: bold;
  }

  .list {
    max-height: calc(var(--vh) * 80);
    padding: 0 0.32rem 0.4rem 0.32rem;
    overflow-y: auto;
  }
}

.tabs-container {
  padding-top: 0.1rem;

  .type_tabs {
    height: 0.96rem;
    display: flex;
    align-items: center;
    z-index: 99;
    border-radius: 1rem;
    background-color: var(--ex-bg-white1);
    margin: 0 0.2rem;

    .type_tab {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ex-text-color2);
      font-size: 0.3rem;
    }

    .type_tab_text {
      position: relative;
      z-index: 1;
    }

    .active_type_tab {
      color: var(--ex-text-color--bg-primary);
      position: relative;
      height: 100%;
      background-color: var(--ex-primary-color);
      border-radius: 1rem;

      &:nth-child(2) {
        background-color: var(--ex-down-color);
      }
    }
  }
}
</style>
