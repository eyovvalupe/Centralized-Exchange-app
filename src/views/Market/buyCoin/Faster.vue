<!-- 快捷区 -->
<template>
  <div class="page_fasters">
    <div class="form relative">
      <div class="tabs">
        <div class="tab" :class="{ active_tab: form1.offset == 'buy' }" @click="changeTab('buy')">
          {{ t('market.market_buy_fast_buy') }}
        </div>
        <div class="tab" :class="{ active_tab: form1.offset == 'sell' }" @click="changeTab('sell')">
          {{ t(('market.market_buy_fast_sell')) }}
        </div>
      </div>

      <div class="absolute left-0 top-0 w-full h-full flex items-center justify-center z-10 bg-color bg-opacity-30" v-if="!rate">
        <Loading color="var(--van-primary-color)" />
      </div>
      <div class="flex" :class="[form1.offset == 'buy' ? 'flex-col' : 'flex-col-reverse']">
        <!-- 支付 -->
        <div class="item_box">
          <div class="item_box_left">
            <div class="subtitle">
              <span>{{ form1.offset == "buy" ? t('market.market_buy_fast_pay') : t('market.market_buy_fast_receive')
                }}</span>
            </div>
            <div class="item">
              <input v-model="money" :disabled="!rate" @input="moneyInput" @blur="moneyBlur" type="number" class="ipt" />
            </div>
          </div>
          <div class="item_box_right">
            <div class="subtitle"><span>&nbsp;</span></div>
            <div class="item justify-between"
              @click="openDialog(2)">
              <div class="flex items-center">
                <div v-if="currIn.name" class="icon">
                  <img class="rounded-50" :src="handleUrl(currIn.name)" alt="currency" />
                </div>
                <span>{{ currIn.name || "--" }}</span>
              </div>
              <div class="more_icon">
                <img :src="getStaticImgUrl('/static/icons/more.svg')" alt="↓" />
              </div>
            </div>
          </div>
        </div>

        <!-- 收到 -->
        <div class="item_box">
          <div class="item_box_left">
            <div class="subtitle">
              <span>{{ form1.offset == "buy" ? t('market.market_buy_fast_receive') : t('market.market_buy_fast_sell')
                }}</span>
              <span v-if="form1.offset == 'sell' && currWallet.amount > 0">
                <span style="color: #014cfa; font-size: 12px" @click="openConfirmBox"><span style="color: #666d80">{{ t('assets.wallet_available_sim') }}</span>
                {{ currWallet.amount }} {{ currOut.name }}</span>
                <Icon name="arrow" class="ml-[0.1rem]" color="#666D80" size="0.2rem" />
              </span>
            </div>
            <div class="item">
              <input v-model="form1.volume" :disabled="!rate" type="number" @focus="volumeIsFocus=true;" @input="volumeInput" @blur="volumeBlur" class="ipt"  />
              <span class="text-primary text-[0.3rem] px-[0.1rem]" @click="putAll" :style="{opacity:volumeIsFocus ? 1 : 0}" v-if="form1.offset == 'sell' && currWallet.amount > 0">{{
               t('trade.stock_position_all')
              }}</span>
            </div>
          </div>

          <div class="item_box_right">
            <div v-if="token" class="subtitle">
              <!--  @click="jump('transfer')" -->
              <span>&nbsp;</span>
              <!-- <span class="link">划转</span> -->
            </div>
            <div v-if="!token" class="subtitle">&nbsp;</div>
            <div class="item justify-between" 
              @click="openDialog(1)">
              <div class="flex items-center">
                <div v-if="currOut.name" class="icon">
                  <img class="rounded-50" :src="getStaticImgUrl(`/static/img/crypto/${currOut.name}.svg`)"
                    alt="currency" />
                </div>
                <span>{{ currOut.name || "--" }}</span>
              </div>
              <div class="more_icon">
                <img :src="getStaticImgUrl('/static/icons/more.svg')" alt="↓" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="rate" class="tip absolute">
        1&nbsp;{{ currOut.name }} ≈
        {{ rate || "--" }}&nbsp;{{ currIn.name }}
      </div>

      <Button size="large" class="submit" :class="['submit--'+form1.offset]" round :loading="loading" @click="sell">{{ form1.offset == "sell" ?
          t('market.market_buy_fast_sell_btn') : t('market.market_buy_fast_buy_btn') }}</Button>

      <!-- <Button v-if="!token" size="large" color="#014cfa" round style="margin-bottom: 0.34rem; margin-top: 1.6rem" @click="store.commit('setIsLoginOpen', true)">登录</Button>
      <Button v-if="!token" size="large" color="#f2f2f2" round style="color: #999999" @click="jump('register')">注册</Button> -->
    </div>
  </div>

  <!-- 售出币种 -->
  <Popup v-model:show="showDialog" :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup"
    position="bottom" teleport="body">
    <div class="withdraw_accounr_dialog">
      <div class="close_icon" @click="showDialog = false">
        <img :src="getStaticImgUrl('/static/img/common/close.svg')" alt="x" />
      </div>
      <div class="search_box">
        <div class="icon">
          <img :src="getStaticImgUrl('/static/img/common/search.svg')" alt="🔍" />
        </div>
        <input ref="iptRef" v-model.trim="searchValue" :placeholder="t('market.market_buy_fast_search_input')"
          type="text" enterkeyhint="search" class="search" />
      </div>
      <div class="title">{{ t('market.market_buy_fast_search_title') }}</div>
      <div v-for="(item, i) in showDialogType == 1 ? outWallet : inWallet" :key="i" class="swap_dialog_item" :class="{
        swap_dialog_item_active:
          showDialogType == 1
            ? currOut.name == item.name
            : currIn.name == item.name,
      }" @click="clickItem(item)">
        <div class="icon">
          <img class="rounded-50" :src="handleUrl(item.name)" alt="currency" />
        </div>
        <span>{{ item.name }}</span>
        <Icon v-if="
          showDialogType == 1
            ? currOut.name == item.name
            : currIn.name == item.name
        " class="check_icon" name="success" />
      </div>
    </div>
  </Popup>

  <BuyCoinConfirm ref="safeRef" :offset="form1.offset" :loading="loading" :volume="form1.volume" :currency="currOut.name" :pay-currency="currIn.name" :money="money" @submit="submitSell" />


  <!-- 余额提示 -->
   <AmountDialog v-model:show="showAmountDialog" :currency="currOut.name" :account="t('assets.wallet_cash_value')" :amount="currWallet.amount" />

</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { ref, computed, onBeforeUnmount, onMounted } from "vue";
import { Button, Popup, Icon, showToast, showConfirmDialog,Loading } from "vant";
import Decimal from "decimal.js";
import store, { useMapState } from "@/store";
import { _swapRate, _orderFast } from "@/api/api";
import AmountDialog from "@/components/AmountDialog.vue";
import eventBus from "@/utils/eventBus";
import BuyCoinConfirm from './components/BuyCoinConfirm.vue'
import { useBuyCoinState } from "./state";
import router from "@/router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { handleUrl, active } = useBuyCoinState();
const safeRef = ref();
const {
  sessionToken,
  token
} = useMapState(["sessionToken", "token"]);
const wallet = computed(() => store.state.wallet); // 所有钱包
const currWallet = computed(() => {
  let target = wallet.value.find(
    (item) => item.currency == currOut.value.currency
  );
  return target || {};
});
const searchValue = ref("");
// 售出
const loading = ref(false);
const money = ref("")
const form1 = ref({
  offset: "buy",
  volume: "",
  crypto: "",
  currency: "",
  account_id: "",
});
const currOut = ref({}); // 当前售出钱包
const currIn = ref({}); // 当前收到钱包

// 币种弹窗
const showDialog = ref(false);
const showDialogType = ref(1); // 1-售出 2-收到

//  获取汇率
const rateLoading = ref(false);
const rate = ref("");

const filterSearchValue = (data) => {
  return data.filter((item) =>
    item.name.toLowerCase().includes(searchValue.value.toLowerCase())
  );
};
const inWallet = computed(() => {
  // 收到钱包
  let data;
  // if (form1.value.offset == 'buy') {
  //   data = wallet.value.filter(item => item.type == 'crypto')
  //   // 模糊查询
  // } else {
  // eslint-disable-next-line prefer-const
  data = store.state.deWeightCurrencyList.filter((item) => item.type == "fiat");
  // }
  // 模糊查询
  return filterSearchValue(data);
});
// 购买按钮触发
const sell = () => {
  if (!token.value) return store.commit("setIsLoginOpen", true);
  if (!form1.value.volume || form1.value.volume <= 0)
    return showToast(t('market.market_buy_fast_no_amount'));
  if (form1.value.offset == "sell") {
    if (form1.value.volume > (currWallet.value.amount || 0)) {
      showConfirmDialog({
        title: t('market.market_buy_fast_noti_title'),
        message: t('market.market_buy_fast_noti_con'),
        cancelButtonText: t('market.market_buy_fast_noti_cancel'),
        confirmButtonText: t('market.market_buy_fast_noti_confirm'),
        cancelButtonColor: "var(--main-color)",
        confirmButtonColor: "var(--main-color)",
        closeOnClickOverlay: !0,
      })
        .then(() => {
          router.push({ name: "transfer" });
        })
        .catch(() => {
          router.push({ name: "topUpCrypto" });
        });
      return;
    }
    safeRef.value.open();
  } else {
    safeRef.value.open();
  }
};
const submitSell = (obj) => {
  loading.value = true;
  store.dispatch("updateSessionToken").then((st) => {
    if (st) {
      const params = {
        offset: form1.value.offset,
        account_id:
          form1.value.offset == "sell" ? obj.account_id : null,
        volume: form1.value.volume,
        crypto: currOut.value.currency,
        currency: currIn.value.currency,
        token: sessionToken.value,
        safeword: obj.safeword,
      };
      _orderFast(params)
        .then(({ data: { order_no } }) => {
          showToast(t('market.market_buy_fast_success'));
          form1.value.volume = "";
          safeRef.value.close();
          setTimeout(() => {
            router.push({
              name: "orderDetails",
              query: { order_no },
            });
          }, 300);
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      setTimeout(() => {
        submitSell(s);
      }, 1000);
    }
  });
};

const outWallet = computed(() => {
  // 售出钱包
  let data;
  // if (form1.value.offset == 'buy') {
  // data = wallet.value.filter(item => item.type == 'fiat')
  // console.log('store.state.deWeightCurrencyList', store.state.deWeightCurrencyList)
  // data = store.state.deWeightCurrencyList.filter(item => item.type == 'fiat')
  // } else {
  // eslint-disable-next-line prefer-const
  data = store.state.deWeightCurrencyList.filter((item) => item.type == "crypto");
  // }
  return filterSearchValue(data);
});
const openDialog = (type) => {
  showDialogType.value = type;
  showDialog.value = true;
};
const clickItem = (item) => {
  if (showDialogType.value == 1) {
    currOut.value = item;
  } else {
    currIn.value = item;
  }
  showDialog.value = false;

  setTimeout(async () => {
    await getRate();
    if (showDialogType.value == 1) {
      volumeInput()
    }else{
      moneyInput()
    }
  }, 100);
};

const moneyInput = ()=>{
  if(isNaN(money.value) || money.value <= 0){
    form1.value.volume = ''
    return
  }
  const val = new Decimal(money.value).div(rate.value).toNumber().toFixed(currOut.value.tpp + 1)
  form1.value.volume = val.substring(0,val.length-1)
}

const moneyBlur = ()=>{
  if(isNaN(money.value) || money.value <= 0){
    money.value = ''
    return
  }
  const val = new Decimal(money.value).toFixed(3)
  money.value = val.substring(0,val.length-1)
  const val2 = new Decimal(money.value).div(rate.value).toFixed(currOut.value.tpp + 1)
  form1.value.volume = val2.substring(0,val2.length-1)
}
const volumeIsFocus = ref(false)
const volumeBlur = ()=>{
  volumeIsFocus.value = false
  if(isNaN(form1.value.volume) || form1.value.volume <= 0){
    form1.value.volume = ''
    return
  }
  if(form1.value.offset == 'sell' && form1.value.volume > currWallet.value.amount){
    form1.value.volume = currWallet.value.amount
  }
}

const volumeInput = ()=>{
  if(isNaN(form1.value.volume) || form1.value.volume <= 0){
    money.value = ''
    return
  }

  const val = new Decimal(form1.value.volume).mul(rate.value).toFixed(3);
  money.value = val.substring(0,val.length-1)
}
const putAll = ()=>{
  form1.value.volume = currWallet.value.amount;
  volumeInput()
}

const showAmountDialog = ref(false)
const openConfirmBox = () => {
  showAmountDialog.value = true
};

// 切换方向
const changeTab = (val) => {
  form1.value.offset = val;
  money.value = ''
  form1.value.volume = ''
  
};

const getRate = () => {
  rateLoading.value = true;
  rate.value = "";
  return _swapRate({
    from: currOut.value.currency,
    to: currIn.value.currency,
    amount: 0,
  })
    .then((res) => {
      if (res.data.exchange_rate) {
        rate.value = res.data.exchange_rate;
      }
    })
    .finally(() => {
      rateLoading.value = false;
    });
};


// 跳转添加
// const goAddAccount = () => {
//   // google检测
//   if (!userInfo.value.googlebind) {
//     return showConfirmDialog({
//       title: '谷歌验证器',
//       message: '你还未绑定谷歌验证器，是否去绑定?',
//     }).then(() => {
//       jump('google')
//     })
//   }
//   router.push({
//     name: 'account',
//   })
// }

const onInit = ()=>{
  if(!currOut.value.currency){
    currOut.value = outWallet.value[0] || {}
  }
  if(!currIn.value.currency){
    currIn.value = inWallet.value[0] || {}
  }
  if (currOut.value.currency && currIn.value.currency) {
    getRate();
  }
}
onInit()

watch(()=>store.state.deWeightCurrencyList,()=>{
  onInit()
})

</script>

<style lang="less" scoped>
.page_fasters {
  width: 7.5rem;
  margin-top: -0.32rem;

  .form {
    padding: 0 0.32rem;

    .tabs {
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 0.68rem;
      margin-top:0.4rem;
      border: 0.5px solid #d0d8e2;
      width: 47%;
      border-radius: 0.68rem;

      .tab {
        color: #666d80;
        margin: 0;
        width: 1.6rem;
        text-align: center;
        border-radius: 0.68rem;
      }

      .active_tab {
        font-weight: bold;
        color: white;
        background: #014cfa;
        text-align: center;
      }
    }

    .tip {
      color: #666d80;
      font-size: 0.24rem;
      margin-top: 0.3rem;
    }

    .subtitle {
      color: #333;
      font-size: 0.28rem;
      margin-bottom: 0.15rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .link {
        color: #034cfa;
      }
    }

    .item_box {
      display: flex;
      align-items: stretch;
      margin-top: 0.5rem;

      .item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        height: 1rem;
        border-radius: 0.32rem;
        border: 1px solid #d0d8e2;
        padding: 0 0.2rem;
        font-size: 0.32rem;

        .icon {
          margin-right: 0.12rem;
          width: 0.64rem;
          height: 0.64rem;
          position: relative;
          top: -0.02rem;
        }

        .info {
          flex: 1;
          text-align: right;
          margin-left: 0.2rem;
          font-size: 0.28rem;
          font-weight: 400;
          color: #333;
          position: absolute;
          right: 0.24rem;
          pointer-events: none;
        }

        .ipt_tip {
          color: #b7b7b7;
          font-size: 0.24rem;
          position: absolute;
          left: 0.24rem;
          transition: all ease 0.3s;
        }

        .ipt_tip2 {
          left: auto;
          right: 0.24rem;
        }

        .ipt {
          flex: 1;
          height: 100%;
          width: 2rem;
          font-size: 0.28rem;
          padding: 0;
          color: #034cfa;
          position: relative;
          z-index: 1;
        }

        .base_ipt {
          font-size: 0.28rem;
          color: #b7b7b7;
          position: absolute;
          left: 0.24rem;
          z-index: 0;
        }

        .more_icon {
          width: 0.32rem;
          height: 0.32rem;
          margin-left: 0.08rem;
        }
      }

      .disabled_item {
        background-color: #f5f5f5;
      }

      .item_focus {
        // height: 1.12rem;
        // padding-top: 0.2rem;
        border: 1px solid #034cfa;

        .ipt_tip {
          font-size: 0.2rem;
          transform: translateY(-0.36rem);
        }
      }

      .item_box_left {
        width: 4.08rem;
        margin-right: 0.2rem;
        display: flex;
        flex-direction: column;
      }

      .item_box_right {
        flex: 1;
      }

      .mode_btn {
        padding: 0 0.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1.26rem;
        background: #f2f2f2;
        height: 0.72rem;
        color: #999;
        text-align: center;
        font-size: 0.28rem;
        font-weight: 600;
        margin-left: 0.16rem;
        margin-top: 0.08rem;
      }

      .active_btn {
        background: #014cfa;
        color: #fff;
      }
    }
  }

  .submit {
    margin-top: 1.12rem;
    color:#fff;
  }
  .submit--sell{
    background-color: #E8503A;
  }
  .submit--buy{
    background-color: #014CFA;
  }
}
</style>

<style lang="less" scoped>
.withdraw_accounr_dialog {
  background-color: #fff;
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;
  overflow: hidden;
  padding: 1.2rem 0.32rem 0.8rem 0.32rem;
  position: relative;

  .search_box {
    display: flex;
    align-items: center;
    padding: 0 0.4rem;
    margin-bottom: 0.15rem;
    height: 0.8rem;
    background-color: #f4f5f7;
    border-radius: 0.8rem;

    input {
      padding-top: 0.06rem;
    }

    input::placeholder {
      // color: #014cfa; /* 占位符颜色 */
      color: #9ea3ae;
      font-size: 0.3rem;
    }

    .type_select {
      right: 0;
      display: flex;
      align-items: center;
      color: #253146;
      font-size: 0.24rem;

      .type_icon {
        width: 0.28rem;
        height: 0.28rem;
        opacity: 0.8;
        margin-left: 0.06rem;
      }
    }

    &:has(.search:focus) {
      border: 1px solid #014cfa;
    }

    .icon {
      width: 0.4rem;
      height: 0.4rem;
    }

    .close {
      width: 0.24rem;
      height: 0.24rem;
      color: #121826;
    }

    .search {
      flex: 1;
      margin: 0 0.16rem;
      font-size: 0.32rem;
      font-weight: 400;
    }
  }

  .title {
    height: 1rem;
    position: absolute;
    top: 0.3rem;
    left: 0;
    text-align: center;
    line-height: 1rem;
    font-size: 0.32rem;
    width: 100%;
    color: #121826;
    pointer-events: none;
    font-weight: bold;
  }

  .close_icon {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    top: 0.24rem;
    right: 0.32rem;
  }

  .swap_dialog_item {
    height: 1.12rem;
    line-height: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    overflow: hidden;
    position: relative;
    color: #333333;

    .icon {
      width: 0.6rem;
      height: 0.6rem;
      margin-right: 0.24rem;
    }
  }

  .swap_dialog_item_active {
    color: #014cfa;

    .check_icon {
      position: absolute;
      right: 0.24rem;
      color: #014cfa;
      font-size: 0.4rem;
    }
  }

  .tabs {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 0.4rem;

    .tab {
      height: 0.72rem;
      border-radius: 0.72rem;
      display: flex;
      align-items: center;
      padding: 0 0.4rem;
      color: #061023;
      font-size: 0.32rem;
      font-weight: 400;
    }

    .active_tab {
      background-color: #f6f8ff;
      color: #014cfa;
      font-weight: 500;
    }
  }

  .list {
    max-height: 70vh;
    overflow-y: auto;

    .add_account {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem 0;
    }
  }

  .add_item {
    margin-bottom: 0.36rem;
    border: 1px dashed #ccd7fd;
    border-radius: 0.12rem;
    height: 1.44rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dialog_account_item {
    border-radius: 0.12rem;
    height: 1.44rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    background-color: #f6f7fa;
    padding: 0 0.4rem 0 0.36rem;
    overflow: hidden;
    margin-bottom: 0.36rem;

    .card_icon {
      background-color: #d9e4ff;
      width: 0.96rem;
      height: 0.96rem;
      border-radius: 0.16rem;
      display: flex;
      align-items: center;
      justify-content: center;

      >img {
        width: 0.64rem !important;
        height: 0.64rem !important;
      }
    }

    .card {
      flex: 1;
      margin: 0 0.2rem 0 0.36rem;
      text-align: left;
      font-size: 0.24rem;
      color: #061023;
      font-weight: 500;
      line-height: 1;

      .code {
        font-size: 0.28rem;
        margin-bottom: 0.1rem;
        font-weight: 400;
      }
    }
  }

  .dialog_account_item_active {
    border: 1px solid #1a59f6;

    .checked {
      position: absolute;
      top: -0.04rem;
      right: -0.04rem;
      background-size: 100% 100%;
      width: 0.46rem;
      height: 0.42rem;

      >img {
        width: 0.18rem !important;
        height: 0.12rem !important;
        position: absolute;
        right: 0.06rem;
        top: 0.08rem;
      }
    }
  }
}
</style>
