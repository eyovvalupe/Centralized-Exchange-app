<!-- 开仓表单 -->
<template>
  <div class="form">

    <!-- 价格 -->
    <FormItem class="mb-[0.2rem]" input-type="number" :placeholder="t('trade.stock_opening_price_title')"
      :tip="t('trade.stock_opening_price_tip')" v-model="form1.price" :percent-tags="props.activeType == 1
        ? [
          { label: '-3%', value: 3 },
          { label: '-2%', value: 2 },
          { label: '-1%', value: 1 },
          { label: `${t('trade.stock_opening_price_label')}`, value: 0 },
        ]
        : [
          { label: '+3%', value: 3 },
          { label: '+2%', value: 2 },
          { label: '+1%', value: 1 },
          { label: `${t('trade.stock_opening_price_label')}`, value: 0 },
        ]
        " @percentTagClick="percentTagClick" v-if="props.activeTab == 1" />
    <FormItem class="mb-[0.2rem]" v-else input-type="number" custom
      :tip="''" :disabled="true">
      <div class="w-full flex items-center justify-between">
        <div class="text-color4">{{ t('trade.stock_opening_price') }}</div>
        <div class="flex items-center">
          <div class="text-[0.28rem] text-color3">{{ t('trade.spot_trade_market_price') }}</div>
          <div class="ml-[0.12rem]">USDT</div>
        </div>
      </div>
    </FormItem>

    <FormItem class="mb-[0.2rem]" input-type="number"
      :placeholder="`${t('market.market_marketinfo_value')}`" :tip="''"
      v-model="form1.amount" :digits="2" @input="changeAmount">
      <template #right-con>
        USDT
      </template>
    </FormItem>

    <!-- 数量 -->
    <div class="item_box">
      <div class="item_box_right">
        <FormItem :hasScroll="true" :placeholder="t('trade.stock_position_amount')" v-model="form1.volume" :show-btn="maxStockNum >= 1" btn-show-mode="focus"
          @btnClick="putAll" @input="changePercent" :tip="maxStockNum > 0 ? '≤' + maxStockNum + ' ' + currName.split('/')[0] : ''" tip-align="right"
          input-type="number">
          
          <template #scroll>
            <!-- 拖动 -->
            <SlideContainer v-model="sliderValue" @change="onSliderChange" />
          </template>
         
        </FormItem>
      </div>
    </div>

    <!-- 按钮 -->
    <Button v-if="token" :loading="configLoading || submitLoading" size="large" @click="submit1"
      class="submit ripple-btn" :color="props.activeType == 1 ? 'var(--ex-up-color)' : 'var(--ex-down-color)'"
      round>
      <span style="color: var(--ex-white);">{{
        props.activeType == 1
          ? $t('market.market_buy_fast_buy_btn')
          : $t('market.market_buy_fast_sell_btn')
      }}</span>
    </Button>

    <div v-if="!token" style="margin-top: 0.4rem;">
      <Button :color="'rgba(255, 255, 255, 0.10)'" @click="store.commit('setIsLoginOpen', true)" size="large" round>
        <span class="font-[600] text-color">登录/注册</span></Button>
    </div>
  </div>

  <!-- 开仓确认弹窗 -->
  <BottomPopup teleport="body" v-model:show="showModel" position="bottom" round closeable>
    <div class="van-popup-custom-title">
      {{ $t('market.market_buy_confirm_coin') }}
    </div>
    <div class="stock_submit_box">

      <div class="bg-white2 mb-[0.2rem] mx-[0.32rem] p-[1px] rounded-[0.32rem]">
        <!-- 股票 -->
        <div class="h-[1.06rem] flex items-center gap-[0.16rem] px-[0.28rem]">
          <div class="size-[0.4rem]">
            <CryptoIcon :name="currStock.name.split('/')[0]" />
          </div>
          <div class="text-[0.32rem] font-[600]">
            {{ currStock.name }}
          </div>
        </div>
        <div class="flex flex-col gap-[0.32rem] rounded-[0.32rem] bg-color9 px-[0.4rem] py-[0.28rem]">
          
          <div class="item">
            <div class="item_name">{{ t("trade.stock_open") }}</div>
            <div class="item_val">
              <div class="tag" :class="props.activeType == 1 ? 'green_tag' : 'red_tag'">
                {{
                  props.activeType == 1
                    ? $t('market.market_buy_fast_buy')
                    : $t('market.market_buy_fast_sell')
                }}
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item_name">{{ t("trade.stock_opening_price") }}</div>
            <div class="item_val">
              <div class="tag">
                {{
                  params.price_type == "market"
                    ? t("trade.stock_opening_price_market")
                    : t("trade.stock_opening_price_limit")
                }}
              </div>
              <div class="ml-[0.08rem]" v-if="params.price">{{ params.price }} USDT</div>
            </div>
          </div>
          <div class="item">
            <div class="item_name">
              {{ t("交易额") }}
            </div>
            <div class="item_val">
              {{ orderAmount }} USDT
            </div>
          </div>
          <div class="item">
            <div class="item_name">{{ t("trade.stock_opening_amount") }}</div>
            <div class="item_val">{{ params.volume }} {{ currName.split('/')[0] }}</div>
          </div>
        </div>
        
      </div>
      <div class="money_box">
        <!-- 支付 -->
        <div class="amount" v-if="props.activeType == 1">
          {{ t("trade.stock_opening_pay") }} <strong>{{ payAmount }}</strong>
        </div>
        <!-- 收到 -->
        <div class="amount" v-if="props.activeType == 2">
          {{ $t('market.market_buy_optional_estreceive') }} <strong>{{ getAmount }}</strong>
        </div>
        <div class="fee">
          {{ t("交易额") }} <span>{{ orderAmount }}</span> {{ props.activeType == 1 ? '+' : '-' }}
          {{ t("trade.stock_opening_fee") }} <span>{{ payFee }}</span>
        </div>
      </div>
      <div class="h-[1px] bg-white2 my-[0.4rem]"></div>
      <div class="px-[0.32rem]">
        <div class="subtitle">{{ t("trade.stock_opening_trade_pw") }}</div>
        <div class="item pass_ipt">
          <input style="width: 100%; height: 100%" v-model="safePass"
            :placeholder="t('trade.stock_opening_trade_pw_placeholder')" :type="showPassword ? 'text' : 'password'"
            class="ipt" />
          <img v-if="!showPassword" v-lazy="getStaticImgUrl('/static/img/common/close_eye.svg')"
            @click="showPassword = true" alt="off" />
          <img v-else v-lazy="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="open"
            @click="showPassword = false" />
        </div>
        <Button :loading="submitLoading" @click="submitFormDialog" size="large" class="submit ripple-btn"
          color="var(--ex-primary-color)" round><span style="color: var(--ex-white);">{{ t("trade.stock_open")
          }}</span></Button>
      </div>
    </div>
  </BottomPopup>
  
  <BottomPopup :title="t('充值/划转')" round :show="showNotEnoughBalance" closeable @closed="showNotEnoughBalance = false">
    <NotEnoughBalance :alert="true" :type="'spot'" :balance="params.offset == 'buy' ? stockWalletAmount : currencyAmount" :currency="params.offset == 'buy' ? paramCurrency : currName.split('/')[0]" />
  </BottomPopup>

</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js";
import {
  Button,
  showToast,
} from "vant";
import { ref, computed, watch, nextTick } from "vue";
import { _futures, _basic, _spotPara, _spotBuy } from "@/api/api";
import store from "@/store";
import Decimal from "decimal.js";
import { useRoute } from "vue-router";
import CryptoIcon from '@/components/CryptoIcon.vue'
import SlideContainer from "@/components/SlideContainer.vue";
import FormItem from "@/components/Form/FormItem.vue";
import { useI18n } from "vue-i18n";
import BottomPopup from "@/components/BottomPopup.vue";
import eventBus from "@/utils/eventBus.js"
import NotEnoughBalance from "../components/NotEnoughBalance.vue";

const props = defineProps({
  activeTab: null, // 0-市价 1-限价
  activeType: null, 
  type: {
    type: String,
    default: "",
  },
  tradeType: {
    type: [String, Number],
    default: "",
  },
});

const showNotEnoughBalance = ref(false)
const { t } = useI18n();
const showPassword = ref(false);
const paramCurrency = ref("USDT"); // 交易使用的货币

// 下单限制的参数
const openFee = ref(0); // 开仓手续费
const closeFee = ref(0); // 平仓手续费

const configLoading = ref(false);

const userInfo = computed(() => store.state.userInfo);


const emits = defineEmits(["success"]);


const route = useRoute();
const token = computed(() => store.state.token);

const wallet = computed(() => store.state.wallet || []); // 现金钱包

const stockWalletAmount = computed(() => {
  // 现金账户余额
  const target = wallet.value.find(
    (item) => item.currency == paramCurrency.value
  );
  if (target) return target.amount;
  return 0;
});
const currencyAmount = computed(() => {
  // 持有币种数量
  const target = wallet.value.find(
    (item) => item.currency == currStock.value.symbol.replace('usdt', '').toUpperCase()
  );
  if (target) return target.amount;
  return 0;
});

const maxStockNum = computed(() => {
  if(!token.value){
    return '--'
  }
  if (props.activeType == 1) {
    // 买入 市价/限价
    if (props.activeTab == 1 && !form1.value.price) return 0
    return new Decimal(stockWalletAmount.value || 0).mul(1 - openFee.value).div((props.activeTab == 1 ? form1.value.price : currStock.value.price) || 1).toNumber()
  } else {
    return currencyAmount.value || 0
  }

});

// 限价
const setNowPrice = () => {
  // 设置为当前价格
  form1.value.price = currStock.value.price || "";
};


const setPricePercent = (i) => {
  // 设置浮动价格
  if (props.activeType == 1) {
    // 买涨
    form1.value.price = new Decimal(currStock.value.price || 0)
      .mul(100 - i)
      .div(100)
      .toNumber();
  } else {
    // 买跌
    form1.value.price = new Decimal(currStock.value.price || 0)
      .mul(100 + i)
      .div(100)
      .toNumber();
  }
};

const percentTagClick = (percent) => {
  if (percent.value == 0) {
    setNowPrice();
  } else {
    setPricePercent(percent.value);
  }
};

// 市价
const currStock = computed(() => {
  return  store.state.currSpot || [];
});
// 当前
const currName = computed(() => {
  let str = '/'
  if (currStock.value.name) {
    str = currStock.value.name
  }
  return str
})

const form1 = ref({
  leverType: "cross",
  lever: 1,
  volume: "",
  amount: "",
  price: "",
  price_type: props.activeTab == 1 ? "limit" : "market"
});


const submit1 = () => {
  if (!currStock.value.trade) return showToast(t('trade.stock_opening_closed'));
  if (!form1.value.volume)
    return showToast('请输入数量');

  // 限价校验
  if (props.activeTab == 1) {
    if (!form1.value.price)
      return showToast(t("trade.stock_opening_err_price"));
  }
  getSessionToken();
  // 打开确认弹窗
  params.value = {
    symbol: currStock.value.symbol,
    offset: props.activeType == 1 ? "buy" : "sell",
    volume: Number(form1.value.volume),
    price_type: form1.value.price_type,
    price: form1.value.price_type == "market" ? (currStock.value.price || '') : (form1.value.price || ""),
  };
  safePass.value = "";
  if (userInfo.value.role == "user") showModel.value = true;
  if (userInfo.value.role == "guest") submitForm("000000");
};

// 全部
const putAll = () => {
  onSliderChange(100);
};
// 市价-拖动
const sliderValue = ref(0);
const onSliderChange = (newValue) => {
  sliderValue.value = newValue;
  if (!maxStockNum.value || maxStockNum.value == "--"){
    nextTick(()=>{
      sliderValue.value = 0
    })
    
    return 
  }
  let v = new Decimal(maxStockNum.value || 0).mul(newValue).div(100);
  form1.value.volume = v.toNumber();
  setTimeout(() => {
    changePercent();
  }, 0);
};
const updatePercent = ()=>{
  if (
    maxStockNum.value == "--" ||
    !form1.value.volume ||
    form1.value.volume == 0
  ) {
    return (sliderValue.value = 0);
  }
  let p = new Decimal(form1.value.volume || 0)
    .div(maxStockNum.value || 1)
    .mul(100)
    .toNumber();
  if (p < 0) p = 0;
  if (p > 100) p = 100;
  sliderValue.value = Number(p);
}

const changePercent = () => {
  if(form1.value.price){
    form1.value.price = Number(form1.value.price).toFixed(3).slice(0,-1)
  }
  updatePercent()

  // 成交额
  setTimeout(() => {
    if (!form1.value.volume) return form1.value.amount = ''
    if (props.activeTab == 1) { // 限价
      if (!form1.value.price) return form1.value.amount = ''
      form1.value.amount = new Decimal(form1.value.volume || 0).mul(form1.value.price).toFixed(3).slice(0,-1)
    } else { // 市价
      form1.value.amount = new Decimal(form1.value.volume || 0).mul(currStock.value.price).toFixed(3).slice(0,-1)
    }
  }, 0)
};
watch(()=>maxStockNum.value,()=>{
  setTimeout(()=>{
    changePercent()
  }, 0)
})
const changeAmount = () => {
  if (!form1.value.amount) return form1.value.volume = ''
  form1.value.amount = Number(form1.value.amount || 0).toFixed(3).slice(0,-1)
  setTimeout(() => {
    if (props.activeTab == 1) { // 限价
      if (!form1.value.price) return form1.value.volume = ''
      form1.value.volume = new Decimal(form1.value.amount || 0).div(form1.value.price || 1)
    } else { // 市价
      form1.value.volume = new Decimal(form1.value.amount || 0).div(currStock.value.price || 1)
    }
    updatePercent()
  })
}
const paramHandle = (data) => {
  configLoading.value = false;
  form1.value.volume = "";
  if(props.activeTab == 1){
      setNowPrice()
  }else{
    form1.value.price = "";
  }
  sliderValue.value = 0;
  if (data.fee) {
    openFee.value = data.fee || 0;
    closeFee.value = data.fee || 0;
  }

};
const getParam = () => {
  configLoading.value = true;
  _spotPara({
    symbol: currStock.value.symbol,
  })
    .then((res) => {
      if (res && res.data) {
        paramHandle(res.data);
      }
    })
    .finally(() => {
      configLoading.value = false;
    });
};


const initParam = () => {
  if (currStock.value.symbol) {
    getParam()
  } else {
    form1.value.price = "";
    openFee.value = 0;
    closeFee.value = 0;
  }
};

const setCurrStockFunc = (item) => {
  switch (props.type) {
    case "spot":
      sessionStorage.setItem("currSpot", JSON.stringify(item));
      store.commit("setCurrSpot", item);
      break;
    case "ai":
      sessionStorage.setItem("currAi", JSON.stringify(item));
      store.commit("setCurrAi", item);
      break;
    case 'crypto':
    case "constract":
      sessionStorage.setItem("currConstract", JSON.stringify(item));
      store.commit("setCurrConstract", item);
      break;
    case 'forex': // 外汇
    case "foreign":
      store.commit("setCurrForeign", item);
      sessionStorage.setItem("currForeign", JSON.stringify(item));
      break;
    case 'blocktrade': // 大宗
    case "commodities":
      store.commit("setCurrCommodities", item);
      sessionStorage.setItem("currCommodities", JSON.stringify(item));
      break;
  }
};

const handleClick = (item) => {
  setCurrStockFunc(item);
  initParam();
  _basic({ symbol: currStock.value.symbol }).then((r) => {
    if (
      r &&
      r.data &&
      r.data.symbol &&
      currStock.value.symbol == r.data.symbol
    ) {
      setCurrStockFunc({
        ...currStock.value,
        ...r.data,
      });
    }
  });
};

// 初始化
setTimeout(() => {
  if (currStock.value.symbol) {
    handleClick(currStock.value)
  }
}, 500)

// url参数处理
if (props.tradeType == 2) {
  // 合约
  if (route.query.symbol) {
    handleClick({
      symbol: route.query.symbol,
    });
  } else {
    let obj = {};
    try {
      switch (props.type) {
        case "constract":
          obj = JSON.parse(sessionStorage.getItem("currConstract") || "{}");
          break;
        case "foreign":
          obj = JSON.parse(sessionStorage.getItem("currForeign") || "{}");
          break;
        case "commodities":
          obj = JSON.parse(sessionStorage.getItem("currCommodities") || "{}");
          break;
      }
    } catch {
      obj = {};
    }
    if (obj.symbol) {
      handleClick(obj);
    } else {
      initParam();
    }
  }
}

// 开仓
const params = ref({});
const showModel = ref(false);
const safePass = ref("");

const payFee = computed(() => {
  // 手续费
  return new Decimal(orderAmount.value || 0).mul(openFee.value).toFixed(3).slice(0,-1);
});

const payAmount = computed(() => {
  // 需要支付
  return new Decimal(orderAmount.value || 0).add(payFee.value).toFixed(3).slice(0,-1);
});
const getAmount = computed(() => {
  // 预计得到
  return new Decimal(orderAmount.value || 0).sub(payFee.value).toFixed(3).slice(0,-1);
});

const orderAmount = computed(() => {
  return new Decimal(params.value.volume || 0).mul(props.activeTab == 1 ? form1.value.price : currStock.value.price).toFixed(3).slice(0,-1);
});

const submitLoading = ref(false);
const submitFormDialog = () => {
  if (!safePass.value) {
    return showToast(t("trade.stock_opening_trade_pw_placeholder"));
  }
  submitForm(safePass.value)
};
const submitForm = (s) => {
  if (submitLoading.value) return;
  submitLoading.value = true;
  _spotBuy({
    ...params.value,
    token: sessionToken.value,
    safeword: s,
  })
    .then((res) => {
      if (res && res.code == 200) {
        showModel.value = false;
        store.dispatch("updateWallet");
        showToast(t("trade.stock_opening_success"));
        form1.value.volume = "";
        sliderValue.value = 0;
        setTimeout(() => {
          emits("success");
        }, 1500);
      }
    })
    .catch(err => {
      if (err.code == 1010) { // 余额不足
        showNotEnoughBalance.value = true
      }
    })
    .finally(() => {
      getSessionToken();
      setTimeout(() => {
        submitLoading.value = false;
      }, 500);
    });
};

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || "");
const getSessionToken = () => {
  store.dispatch("updateSessionToken");
};
getSessionToken();

defineExpose({
  // 选择某个股票
  choose: handleClick,
  stockWalletAmount,
  currencyAmount,
});
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
    background-color: var(--ex-bg-color2);
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

.form {
  position: relative;
  border-radius: 0.32rem;
  background-color: var(--ex-bg-color3);
  margin-top: 0.32rem;

  .subtitle {
    color: var(--ex-text-color);
    font-size: 0.32rem;
    margin-bottom: 0.24rem;
    line-height: 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  :deep(.form-item-title) {
    margin-top: 0rem;
  }

  .item_box {
    display: flex;
    align-items: stretch;
    margin-bottom: 0.2rem;

    .item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      flex-wrap: wrap;
      height: 1.12rem;
      border-radius: 0.32rem;
      border: 1px solid var(--ex-border-color2);
      padding: 0.06rem 0.24rem;
      background-color: var(--ex-bg-color2);

      .tip-title {
        color: var(--ex-text-color3);
        width: 100%;
        font-size: 0.28rem;
        margin-bottom: 0rem;
        line-height: 0.36rem;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

      }

      .info {
        font-size: 0.28rem;
        font-weight: 400;
        width: 100%;
        left: 0;
        box-sizing: border-box;
        pointer-events: none;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .more_icon {
          // margin-right: 0.3rem;
        }
      }

      .info-symbol {
        color: var(--ex-text-color);
        font-size: 0.3rem;
      }

      .ipt {
        flex: 1;
        height: 100%;
        width: 2rem;
        font-size: 0.28rem;
        padding: 0;
        color: var(--ex-primary-color);
        position: relative;
        z-index: 1;
      }

      .more_icon {
        width: 0.32rem;
        height: 0.32rem;
        margin-left: 0.08rem;
        transform: rotate(-90deg);
      }

      .more_icon2 {
        position: absolute;
        right: 0.32rem;
        top: 50%;
        transform: translateY(-50%) rotate(-90deg);
      }
    }

    .disabled_item {
      background-color: var(--ex-border-color2);
    }

    .item_box_left {
      width: 2.2rem;
      margin-right: 0.2rem;
      display: flex;
      flex-direction: column;
    }

    .item_box_right {
      flex: 1;
    }

    .pricetype-modes {
      height: 0.6rem;
      border-radius: 0.2rem;
      margin-left: 0.32rem;
      overflow: hidden;
      display: flex;
      align-items: stretch;
      z-index: 99;
      background-color: var(--ex-bg-color3);

      .pricetype-mode {

        color: var(--ex-text-color2);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.16rem;
        font-size: 0.24rem;
        line-height: 400;
      }

      .pricetype-mode-active {
        background-color: var(--ex-white);
        color: var(--ex-bg-color);
        border-radius: 0.2rem;
      }
    }


    .mode_btn {
      padding: 0 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1.26rem;
      background: var(--ex-bg-color2);
      height: 0.72rem;
      color: var(--ex-text-color3);
      text-align: center;
      font-size: 0.28rem;
      font-weight: 600;
      margin-left: 0.16rem;
      margin-top: 0.08rem;
    }

    .active_btn {
      background: var(--ex-primary-color);
      color: var(--ex-text-color--bg-primary);
    }
  }

  .item_box_big {
    .item {
      // height: 1.48rem;
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

  .submit {
    margin-top: 0.2rem;
    border-radius: 1rem;
  }
}

.stock_submit_box {
  padding: 0.4rem 0 0.8rem 0;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 0.44rem;
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
      font-weight: 500;
      text-align: right;
      max-width: 4.4rem;
      .tag {
        height: 0.44rem;
        color: var(--ex-text-color);
        background-color: var(--ex-bg-white2);
        line-height: 0.44rem;
        padding: 0 0.16rem;
        border-radius: 0.4rem;
        margin-left: 0.2rem;
        font-size: 0.28rem;
      }

      .red_tag {
        background-color: rgb(var(--ex-down-color-rgb) / 0.08);
        color: var(--ex-down-color);
      }

      .green_tag {
        background-color: rgb(var(--ex-up-color-rgb) / 0.08);
        color: var(--ex-up-color);
      }

      .lever {
        min-width: 0.7rem;
        text-align: right;
      }
    }
  }

  .subtitle {
    font-size: 0.28rem;
    margin-bottom: 0.12rem;
    color: var(--ex-text-color);
    font-weight: 400;
    line-height: 150%;
  }

  .pass_ipt {
    margin-bottom: 0.4rem;
    border-radius: 0.32rem;
    padding: 0 0.24rem;
    height: 1.12rem;
    padding: 0.16rem 0.32rem;
    box-sizing: border-box;
    position: relative;
    background-color: var(--ex-bg-white1);
    border: 1px solid transparent;
    img {
      width: 0.4rem;
      height: 0.4rem;
      position: absolute;
      right: 0.32rem;
      top: 50%;
      transform: translateY(-50%);
      z-index: 9999;
    }
  }

  .money_box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--ex-bg-white2);
    border-radius: 0.32rem;
    height: 1.4rem;
    text-align: center;
    margin: 0.2rem 0.32rem 0 0.32rem;
    position: relative;


    .amount {
      color: var(--ex-text-color2);
      line-height: 0.56rem;

      strong {
        color: var(--ex-text-color);
        font-size: 0.36rem;
        font-weight: 600;
        margin-left: 0.12rem;
      }
    }

    .fee {
      color: var(--ex-text-color2);
      font-size: 0.24rem;
      font-weight: 400;
      line-height: 0.36rem;
      padding: 0.04rem 0 0 0.2rem;

      span {
        color: var(--ex-text-color);
      }
    }
  }
}
</style>
