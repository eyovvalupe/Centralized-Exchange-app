<!-- 划转 -->
<template>
  <div class="page page_trnsfer">
    <Top :title="t('transfer.page_title')">
      <template #right>
        <div class="top-record" @click="goRecord">
          <div class="top-record-icon">
            <img v-lazy="getStaticImgUrl('/static/img/assets/record_sm.svg')" />
          </div>
        </div>
      </template>
    </Top>

    <!-- 表单 -->
    <div class="form">
      <div class="form_box mt-[0.4rem] mb-[0.2rem]">
        <div class="flex w-full flex-col">
          <div class="min-w-[1.52rem] h-[0.3rem] flex justify-start items-center mb-[0.28rem] ml-[0.08rem]">
            <span class="text-[0.28rem] text-color2 text-center">{{ $t("transfer.out") }}</span>
          </div>
          <div
            class="flex justify-between items-center bg-color3 w-full h-[1.12rem] rounded-[0.32rem] px-[0.28rem] mb-[0.2rem] bg-white1 ripple-btn"
            @click="openDialog('from')">
            <div class="flex items-center w-full justify-between">
              <div class="account_item  flex-shrink-0">
                <div class="item_content mr-[0.4rem]">
                  <span>{{ _accountMap[form.from] }}</span>
                </div>
                <div class="account_item_icon" v-if="!isEmpty(form.fromCurrency)">
                  <CryptoIcon :name="form.fromCurrency.name" />
                </div>
                <div class="item_content mr-[0.1rem]">
                  <span class="monty_span">{{
                    !isEmpty(form.fromCurrency) ? form.fromCurrency.name : ""
                  }}</span>
                </div>
              </div>

              <div class="account_item relative">
                
                <div class="w-[0.36rem] h-[0.36rem]">
                  <img v-lazy="getStaticImgUrl(`/static/img/common/more.svg`)" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full flex bg-white1 justify-between items-center h-[1.12rem] rounded-[0.32rem] px-[0.28rem] relative border-[0.02rem] transition" :class="{ form_box_active: clickKey == 'from' }">
          <div class="flex-2">
            <input v-model="form.amount" type="text" class="text-[0.32rem] w-full" :placeholder="$t('trade.stock_position_amount')"
              @focus="clickKey = 'from'" @blur="clickKey = ''" />
          </div>
          <div class="absolute text-white text-[0.28rem] right-[0.28rem]">
            {{ !isEmpty(form.fromCurrency) ? form.fromCurrency.name : '--' }}
          </div>
        </div>
      </div>

      <div class="form_box !h-[3.66rem]">
        <div class="trans_icon" @click="transAccount" :class="[transing ? 'transing_icon' : 'transing_stop']">
          <img v-lazy="getStaticImgUrl('/static/img/assets/convert.svg')" alt="img" />
        </div>
        <div class="flex flex-col w-full">
          <div class="min-w-[1.52rem] h-[0.3rem] flex justify-start items-center mb-[0.28rem] ml-[0.08rem]">
            <span class="text-[0.28rem] text-color2 text-center">{{ $t("transfer.in") }}</span>
          </div>
          <div
            class="flex justify-between items-center bg-color3 w-full h-[1.12rem] rounded-[0.32rem] px-[0.28rem] mb-[0.2rem] bg-white1 ripple-btn"
            @click="openDialog('to')">
            <div class="flex items-center w-full justify-between">
              <div class="account_item flex-shrink-0">
                <div class="item_content mr-[0.4rem]">
                  <span>{{ _accountMap[form.to] }}</span>
                </div>
                <div class="account_item_icon" v-if="!isEmpty(form.toCurrency)">
                  <CryptoIcon :name="form.toCurrency.name" />
                </div>
                <div class="item_content mr-[0.1rem]">
                  <span class="monty_span">{{ !isEmpty(form.toCurrency) ? form.toCurrency.name : "" }}</span>
                </div>
              </div>

              <div class="account_item">
                
                <div class="w-[0.36rem] h-[0.36rem]">
                  <img v-lazy="getStaticImgUrl(`/static/img/common/more.svg`)" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="w-full flex bg-white1 justify-between items-center h-[1.12rem] rounded-[0.32rem] px-[0.28rem] relative border-[0.02rem] transition" :class="{ form_box_active: clickKey == 'to' }">
          <div class="flex-2">
            <input v-model="form.amount" type="text" class="text-[0.32rem] w-full" :placeholder="$t('trade.stock_position_amount')"
              @focus="clickKey = 'to'" @blur="clickKey = ''" />
          </div>
          <div class="absolute text-white text-[0.28rem] right-[0.28rem]">
            {{ form.toCurrency ? form.toCurrency.name : '--' }}
          </div>
        </div>
      </div>

      <div class="rate_tip" v-if="!isEmpty(form.fromCurrency) && formType == 'swap'">
        1{{ form.fromCurrency.name }} ≈ {{ rateLoading ? "--" : rate }}
        {{ form.toCurrency.name }}
      </div>
    </div>

    <Button @click="openSafePass" :loading="loading" round class="submit ripple-btn" type="primary">{{
      $t("transfer.btn")
    }}</Button>

    <!-- 充提记录 -->
    <RecordList ref="RecordListRef" />

    <!-- 安全密码弹窗 -->
    <SafePassword @submit="submit" ref="safeRef" />

    <!-- 账户和币种 -->
    <BottomPopup :from="'account'" class="bg-color5" v-model:show="showPicker" closeable round position="bottom"
      @closed="clickKey = ''">
      <div class="van-popup-custom-title w-full text-center text-[0.32rem] relative top-[-0.05rem]">{{
        $t("transfer.confirm_con") }}</div>
        {{ console.log(columns, customFieldName) }}
      <Picker :swipe-duration="200" :show-toolbar="false" :columns="columns" :columns-field-names="customFieldName"
        @cancel="hideDialog" @change="onChange">
        <template #option="option">
          <div class="picker-item">
            <span class="picker-item__icon" v-if="!columnList.includes(option.key)">
              <CryptoIcon :name="option.key" />
            </span>
            <span class="picker-item__text">
              {{ option.value }}
            </span>
          </div>
        </template>
      </Picker>
    </BottomPopup>
    <!-- 账号验证 -->
    <AccountCheck ref="AccountCheckRef" />
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import { Button, Popup, showToast, Picker, Row, Col } from "vant";
import { ref, computed, onMounted, watch } from "vue";
import { _accountMap, _accountMapList } from "@/utils/dataMap";
import store from "@/store";
import SafePassword from "@/components/SafePassword.vue";
import { _transfer, _swapRate } from "@/api/api";
import RecordList from "@/components/RecordList.vue";
import FormItem from "@/components/Form/FormItem.vue";
import { useRoute } from "vue-router";
import router from "@/router";
import Decimal from "decimal.js";
import AccountCheck from "@/components/AccountCheck.vue";
import { useI18n } from "vue-i18n";
import BottomPopup from "@/components/BottomPopup.vue";
import { isEmpty } from "@/utils/isEmpty";
import CryptoIcon from '@/components/CryptoIcon.vue'

const { t } = useI18n();
const AccountCheckRef = ref();
const toAmount = ref("");
const route = useRoute();
const focus = ref(false); // 是否在输入中
const columnList = ref(['money', 'stock', 'futures'])
const blurInput = () => {
  setTimeout(() => {
    errStatus.value = focus.value = false;
  }, 0);
};
const wallet = computed(() => store.state.wallet || []); // 钱包
const elseWallet = computed(() => store.state.elseWallet || []); // 其他账户钱包
const userInfo = computed(() => store.state.userInfo)

// 表单
const loading = ref(false);
const form = ref({
  from: route.query.from || "money",
  fromCurrency: {},
  to: route.query.to || "futures",
  toCurrency: {},
  amount: "",
});
const formType = computed(() => {
  if (isEmpty(form.value.fromCurrency) || isEmpty(form.value.toCurrency)) return '';
  // 币种相同是划转  币种不同是兑换
  if (form.value.fromCurrency.currency == form.value.toCurrency.currency)
    return "transfer";
  return "swap";
});

// 设置默认货币
const fromCurrency = computed(() => (wallet.value[0]));

const t1 = computed(() => {
  const temp = elseWallet.value.find((item) => item.account == form.value.to);
  if (temp) return temp;
  return wallet.value[0]
})

const init = () => {
  form.value.fromCurrency = fromCurrency.value
  form.value.toCurrency = t1.value
}

setTimeout(() => {
  getRate();
}, 0);
const maxIpt = () => {
  form.value.amount = balance.value;
};

// 账户选择
const showPicker = ref(false);
const clickKey = ref(""); // 从哪里点开弹窗
const openDialog = (val) => {
  clickKey.value = val;
  showPicker.value = true;
};
const hideDialog = () => {
  clickKey.value = "";
  showPicker.value = false;
};
const columns1 = computed(() => {
  if (!isEmpty(form.value.fromCurrency) && !isEmpty(form.value.toCurrency)) {
    return _accountMapList.map((item) => {
      item.className =
        clickKey.value == "from"
          ? form.value.from == item.key
            ? "action-sheet-active"
            : ""
          : form.value.to == item.key
            ? "action-sheet-active"
            : "";
      if (item.key == "money") {
        // 现金账户
        item.currencys = wallet.value.map((w) => {
          return {
            key: w.currency,
            currency: w.currency,
            value: w.name,
            name: w.name,
            // className:
            //   clickKey.value == "from"
            //     ? form.value.fromCurrency.currency == w.currency
            //       ? "action-sheet-active"
            //       : ""
            //     : form.value.toCurrency.currency == w.currency
            //       ? "action-sheet-active"
            //       : "",
          };
        });
      } else {
        // 其他账户
        // const target = elseWallet.value.map((a) => a.account == item.key);
        item.currencys = elseWallet.value.reduce((acc, cur) => {
          if (cur.account == item.key) {
            acc.push({
              key: cur.currency,
              value: cur.name,
              currency: cur.currency,
              name: cur.name,
              className:
                clickKey.value == "from"
                  ? form.value.fromCurrency.currency == cur.currency
                    ? "action-sheet-active"
                    : ""
                  : form.value.toCurrency.currency == cur.currency
                    ? "action-sheet-active"
                    : "",
            })
          }
          return acc;
        }, [])

      }
      return item;
    });
  } else return []
});
const columns = computed(() => columns1.value.filter(item => {
  return item.key != 'forex'
}))
const customFieldName = {
  text: "value",
  value: "key",
  children: "currencys",
};

let selectedOption = {};

const onConfirm = () => {
  if (clickKey.value == "from") {
    form.value.from = selectedOption.key;
    form.value.fromCurrency = selectedOption.currency;
  } else {
    form.value.to = selectedOption.key;
    form.value.toCurrency = selectedOption.currency;
  }
  getRate();
  // hideDialog();
};
const onChange = ({ selectedOptions }) => {
  selectedOption.key = selectedOptions[0].key;
  selectedOption.currency = selectedOptions[1];
  onConfirm()
};

const balance = computed(() => {
  // 余额
  if (form.value.from == "money") {
    // 转出
    const w = wallet.value.find(
      (item) => item.currency == form.value.fromCurrency.key
    );
    return w ? w.amount : 0;
  } else {
    // 转入
    const w = elseWallet.value.find((item) => item.account == form.value.from);
    return w ? w.amount : 0;
  }
});

// 表单提交
const safeRef = ref();
const errStatus = ref(false);
const openSafePass = () => {
  if (userInfo.value.role == 'guest' || userInfo.value.role != 'guest' && AccountCheckRef.value.check()) {
    if (!form.value.amount || form.value.amount <= 0) {
      errStatus.value = true;
      return showToast(t('transfer.no_amount'));
    }
    if (balance.value < form.value.amount) {
      return showToast(t('transfer.no_enough_balance'));
    }
    if (
      form.value.from == form.value.to &&
      form.value.fromCurrency.currency == form.value.toCurrency.currency
    ) {
      return showToast(t('transfer.account_same'));
    }
    if (userInfo.value.role == 'user') safeRef.value.open();
    if (userInfo.value.role == 'guest') submit('000000');
  }
};
const submit = (s) => {
  const params = {
    // ...form.value,
    account_from: form.value.from,
    from: form.value.fromCurrency.currency,
    account_to: form.value.to,
    to: form.value.toCurrency.currency,
    amount: form.value.amount,
    safeword: s,
    token: sessionToken.value,
  };
  if (loading.value) return;
  loading.value = true;
  _transfer(params)
    .then((res) => {
      if (res.code == 200) {
        showToast(t('transfer.success'));
        form.value.amount = "";
        store.dispatch("updateAssets");
        store.dispatch("updateWallet"); // 更新资产
        setTimeout(() => {
          router.back();
        }, 500);
      }
    })
    .finally(() => {
      getSessionToken();
      loading.value = false;
    });
};

// 弹窗
const transing = ref(false); // 转换动画中
const goTransing = () => {
  transing.value = true;
  setTimeout(() => {
    transing.value = false;
  }, 500);
};
const transAccount = () => {
  goTransing();
  const to = form.value.to;
  form.value.to = form.value.from;
  form.value.from = to;
  const currency = form.value.toCurrency;
  form.value.toCurrency = form.value.fromCurrency;
  form.value.fromCurrency = currency;
  setTimeout(() => {
    getRate();
  }, 0);
};

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || "");
const getSessionToken = () => {
  loading.value = true;
  store.dispatch("updateSessionToken").finally(() => {
    loading.value = false;
  });
};
getSessionToken();

const rate = ref(0);
const rateLoading = ref(false);
const getRate = () => {
  // 获取汇率
  rateLoading.value = true;
  if (formType.value == "swap") {
    _swapRate({
      from: form.value.fromCurrency.currency,
      to: form.value.toCurrency.currency,
      amount: 0,
    })
      .then((res) => {
        if (res.code == 200) {
          rate.value = res.data.exchange_rate;
        }
      })
      .finally(() => {
        rateLoading.value = false;
      });
  } else {
    rate.value = 1;
    setTimeout(() => {
      rateLoading.value = false;
    }, 100);
  }
};

// 跳转记录
const RecordListRef = ref();
const goRecord = () => {
  router.push({
    name: "recordList",
    query: {
      tab: 2,
    },
  });
};

const changeAmount = (val) => {
  if (val == "to") {
    form.value.amount = Number(
      parseFloat(toAmount.value) / parseFloat(rate.value)
    );
  }
  if (val == "from") {
    toAmount.value = Number(
      parseFloat(form.value.amount) * parseFloat(rate.value)
    );
  }
};

store.dispatch('updateWallet')

watch(wallet, (val) => {
  init()
})
</script>

<style lang="less" scoped>
.page_trnsfer {
  padding: 1rem 0.32rem 1.44rem 0.32rem;
  position: relative;

  :deep(.top) {
    z-index: 10;
  }

  :deep(.van-picker-column__item) {
    justify-content: start;
  }

  .top-record {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--ex-bg-color3);

    .top-record-icon {
      width: 0.36rem;
      height: 0.36rem;
    }
  }

  .form {
    .form_box {
      border-radius: 0.32rem;
      background-color: var(--ex-bg-white2);
      padding: 0.24rem 0.28rem;
      position: relative;
      height: 4.06rem;
      border: 1px solid var(--ex-border-color);
      transition: .3s;

      :deep(.item) {
        height: 1.12rem;
      }
    }

    .form_text {
      color: var(--ex-text-color2);
      margin-right: 0.32rem;
    }

    .form_box_active {
      border: 1px solid var(--ex-border-color3);
    }

    .err_ipt {
      border: 1px solid var(--ex-error-color);
    }

    .account_item {
      display: flex;
      align-items: center;

      .account_item_icon {
        width: 0.48rem;
        height: 0.48rem;
        margin-right: 0.16rem;

        img {
          border-radius: 50%;
        }
      }
    }

    .account_item+.account_item {
      margin-left: 0.4rem;
    }

    .trans_icon {
      width: 0.84rem;
      height: 0.84rem;
      position: absolute;
      left: 50%;
      margin-left: -0.5rem;
      top: -0.52rem;
    }

    .transing_icon {
      transition: all ease-in 0.5s;
      transform: rotate(360deg);
    }

    .transing_stop {
      transition: none;
      transform: rotate(0deg);
    }

    .rate_tip {
      font-size: 0.24rem;
      margin-top: 0.2rem;
      line-height: 0.4rem;
      color: var(--ex-text-color3);
    }

    .tip {
      font-weight: 400;
      font-size: 0.24rem;
      color: var(--ex-text-color2);
      line-height: 0.4rem;
      margin-top: 0.12rem;

      .num {
        color: var(--ex-text-color);
        margin-left: 0.04rem;
        font-weight: 500;
      }
    }
  }

  .submit {
    width: 100%;
    height: 1.12rem;
    margin-top: 0.6rem;
    font-size: 0.36rem;
    border-radius: 0.4rem;
  }

  .picker-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 0.6rem;

    &__icon {
      width: 0.48rem;
      height: 0.48rem;
      margin-right: 0.16rem;

      img {
        border-radius: 50%;
      }
    }
  }
}
</style>
