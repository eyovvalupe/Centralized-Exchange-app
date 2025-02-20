<template>
  <div class="pledge_form px-[0.32rem]">
    <div v-show="pageLoading" class="w-full h-full absolute left-0 top-0 flex items-center justify-center">
      <Loading :type="'circular'" :size="44" color="var(--ex-primary-color)" />
    </div>

    <!-- 质押数量 -->
    <div class="item_box mt-[0.32rem]">
      <div class="item_box_right">
        <FormItem :hasLT="true" :hasScroll="true" :hasBot="true" :placeholder="t('finance.defi_borrow_stake_amount')"
          v-model="numb" @input="changePercent2" @btnClick="onSliderChange2(100)" class="yz-form-item"
          input-type="number">

          <template #lt>
            <div
              class="flex w-[6.3rem] items-center bg-white2 h-[0.8rem] rounded-[0.32rem] justify-between px-[0.28rem] ripple-btn"
              @click="showDialog = true;">
              <div class="flex items-center">
                <div v-if="currIn.name" class="size-[0.52rem] mr-[0.16rem]">
                  <CryptoIcon class="rounded-50" :name="currIn.name" />
                </div>
                <span class="text-[0.3rem] w-[1rem] text-white">{{ currIn.name || "--" }}</span>
              </div>
              <div class="more_icon">
                <img v-lazy="getStaticImgUrl('/static/img/common/more.svg')" alt="↓" />
              </div>
            </div>
          </template>
          <template #scroll>
            <!-- 拖动 -->
            <SlideContainer v-model="sliderValue2" @change="onSliderChange2" />

          </template>
          <template #bottom-con>
            <div class="h-[0.84rem] text-color2 flex items-center justify-between px-[0.28rem] text-[0.28rem]">
              <span>{{ t('finance.defi_verifiable_qty') }}</span>
              <span>
                <span class="text-primary mx-[0.08rem]">{{ walletAmount || '--' }} </span>
                <span class="text-white">{{ currIn.currency }}</span>
              </span>
            </div>
          </template>
        </FormItem>
      </div>
    </div>
    <!-- 可借数量 -->
    <div class="item_box mt-[0.32rem]">
      <div class="item_box_right">
        <FormItem :hasScroll="true" :placeholder="t('finance.defi_avail_qty')" v-model="loan" @input="changePercent"
          input-type="number">
          <template #right-con>
            {{ currIn.currency }}
          </template>
          <template #scroll>
            <!-- 拖动 -->
            <SlideContainer v-model="sliderValue" @change="onSliderChange" />
          </template>
        </FormItem>
      </div>
    </div>
    <div class="px-[0.28rem]  py-[0.24rem] rounded-[0.32rem] bg-white1 mt-[0.32rem]">
      <div class="text-[0.28rem] leading-[0.28rem] text-color2">{{ t('finance.defi_borrow_period') }}</div>
      <div class="flex flex-wrap gap-[0.12rem] gap-y-[0.2rem] pt-[0.2rem]">
        <div
          class="px-[0.4rem] h-[0.6rem] text-color2 rounded-full text-[0.28rem] bg-white1 leading-[0.6rem]  ripple-btn"
          :class="{ 'active-day': param.days == item.days }" v-for="item in paraData" :key="item.days"
          @click="setParam(item)">
          {{ item.days }}{{ t('finance.portfolio_day_multi') }}
        </div>
      </div>
    </div>
    <div class="bg-white1 mt-[0.32rem] p-[0.12rem] text-[0.28rem] rounded-[0.32rem]">
      <div class="p-[0.12rem]">
        <div class="flex justify-between items-center leading-[0.44rem]">
          <span class="text-color2">{{ t('finance.defi_daily_interest') }}</span>
          <span class="text-color">{{ Math.round(param.interest * 1000) / 10 }}%</span>
        </div>
        <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
          <span class="text-color2">{{ t('finance.defi_total_interest') }}</span>
          <span class="text-color">{{ totalInterest }} <span class="text-[0.24rem]">{{ currIn.currency }}</span></span>
        </div>
        <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
          <span class="text-color2">{{ t('finance.defi_service_charge') }}</span>
          <span class="text-color">{{ fee }} <span class="text-[0.24rem]">{{ currIn.currency }}</span></span>
        </div>
      </div>
      <div class="flex items-center justify-between h-[1.2rem] mt-[0.12rem] bg-white2 rounded-[0.32rem] px-[0.28rem]">
        <span class="text-color2">{{ t('finance.defi_repayment_due') }}</span>
        <span class="text-color text-[0.32rem]">{{ total }} <span class="text-[0.24rem]">{{ currIn.currency
        }}</span></span>
      </div>
    </div>
    <div class="px-[0.1rem]">
      <!-- 协议 -->
      <label class="pledge_doc">
        <div :class="checked ? 'checked_icon_blue' : 'unchecked_icon'" class="mr-[0.2rem]" @click="checked = !checked">
          <img v-if="checked" v-lazy="getStaticImgUrl('/static/img/user/checked_white.svg')" alt="">
          <img v-else v-lazy="getStaticImgUrl('/static/img/user/uncheck_primary.svg')" alt="">
        </div>
        {{ t('finance.defi_borrow_agreement1') }}<span>“{{ t('finance.defi_borrow_agreement2') }}”</span>
      </label>

      <Button type="primary" class="submit ripple-btn" @click="openConfirm">
        <span class="text-[0.32rem] font-bold">{{ t('finance.defi_borrow_now') }}</span>
      </Button>
    </div>

    <div class="h-[0.6rem]"></div>

    <!-- 售出币种 -->
    <BottomPopup v-model:show="showDialog" closeable :safe-area-inset-top="true" :safe-area-inset-bottom="true"
      :title="t('market.market_buy_fast_search_title')">
      <div class="pledge_accounr_dialog">
        <div class="search_box">
          <div class="icon">
            <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="🔍" />
          </div>
          <input ref="iptRef" v-model.trim="searchValue" :placeholder="t('market.market_buy_fast_search_input')"
            type="text" enterkeyhint="search" class="search" />
        </div>
        <div class="swap_dialog_list">
          <div v-for="(item, i) in wallet" :key="i" class="swap_dialog_item ripple-btn" :class="{
            swap_dialog_item_active: currIn.name == item.name,
          }" @click="clickItem(item)">
            <div class="icon">
              <CryptoIcon class="rounded-50" :name="item.name" />
            </div>
            <span>{{ item.name }}</span>

            <div v-if="currIn.name == item.name" class="check_icon">
              <img v-lazy="getStaticImgUrl('/static/img/common/ok.svg')" alt="img" />
            </div>
          </div>
        </div>
      </div>
    </BottomPopup>
    <BottomPopup closeable v-model:show="visible" :title="t('finance.defi_borrow_confirm')">
      <PledgeConfirm :paramCurrency="currIn.currency" :numb="numb" :fee="fee"
        :interest="Math.round(param.interest * 1000) / 10" :totalInterest="totalInterest" :total="total" :loan="loan"
        :days="param.days" @success="onPledgeSuccess" v-if="visible" />
    </BottomPopup>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { Button, Loading, showToast } from 'vant'
import SlideContainer from "@/components/SlideContainer.vue";
import FormItem from "@/components/Form/FormItem.vue";
import { useI18n } from "vue-i18n";
import store from "@/store";
import Decimal from "decimal.js";
import { getStaticImgUrl } from "@/utils/index.js"
import { _pledgePara } from '@/api/api'
import BottomPopup from '@/components/BottomPopup.vue'
import PledgeConfirm from './PledgeConfirm.vue'
import router from '@/router';

const pageLoading = ref(true)
const searchValue = ref("");
const filterSearchValue = (data) => {
  return data.filter((item) =>
    item.name.toLowerCase().includes(searchValue.value.toLowerCase())
  );
};
const currIn = ref({}); // 当前收到钱包
const token = computed(() => store.state.token)
const wallet = computed(() => {
  // 现金钱包列表
  const data = store.state.deWeightCurrencyList || []
  return filterSearchValue(data);
});
const initCurr = () => {
  if (currIn.value.currency) {
    return
  }
  const data = store.state.deWeightCurrencyList
  if (data && data[0]) {
    currIn.value = data[0]
  }
}
initCurr()
watch(() => store.state.deWeightCurrencyList, () => {
  initCurr()
})

const tpp = computed(() => {
  const target = store.state.deWeightCurrencyList.find((item) => item.currency == currIn.value.currency);
  if (target) return target.tpp;
  return 0
});

const { t } = useI18n();

const visible = ref(false)
const checked = ref(true)
const walletAmount = computed(() => {
  // 钱包余额
  const target = store.state.wallet.find(
    (item) => item.currency == currIn.value.currency
  );
  if (target) return target.amount;
  return 0;
});

const numb = ref('')

const showDialog = ref(false)
const clickItem = (item) => {
  currIn.value = item;
  showDialog.value = false;

};
const loan = ref('')
const param = reactive({
  days: '',
  interest: '',
  fee: '',
  lever: ''
})

const totalInterest = computed(() => {
  if (!param.interest || !loan.value) {
    return 0
  }
  const val = new Decimal(loan.value).mul(param.interest).mul(param.days)
  if (tpp.value > 0) {
    return val.toFixed(tpp.value + 1).slice(0, -1)
  }
  return val
})

const fee = computed(() => {
  if (!param.fee || !loan.value) {
    return 0
  }
  const val = new Decimal(loan.value).mul(param.fee)
  if (tpp.value > 0) {
    return val.toFixed(tpp.value + 1).slice(0, -1)
  }
  return val
})

const total = computed(() => {
  if (!loan.value) {
    return 0
  }
  const val = new Decimal(totalInterest.value).add(loan.value)
  if (tpp.value > 0) {
    return val.toFixed(tpp.value + 1).slice(0, -1)
  }
  return val
})

const setParam = (par) => {
  param.days = par.days
  param.interest = par.interest
  param.fee = par.fee
  param.lever = par.lever
  changePercent2()
}
const paraData = ref([])

const getPara = () => {
  _pledgePara().then(res => {
    paraData.value = res.data || []
    if (paraData.value[0]) {
      setParam(paraData.value[0])
    }
    pageLoading.value = false
  })
}

getPara()

const maxLoan = computed(() => {
  return walletAmount.value * (param.lever || 1)
})

const step = computed(() => {
  let d = '1'
  if (tpp.value > 0) {
    let s = ''
    for (let i = 1; i < tpp.value; i++) {
      s += '0'
    }
    d = '0.' + s + '1'
  }
  return Number(d)
})

const sliderValue = ref(0);
const sliderValue2 = ref(0);

const onSliderChange = (newValue) => {
  sliderValue.value = newValue;
  if (!maxLoan.value) {
    nextTick(() => {
      sliderValue.value = 0
    })
    return
  }
  let v = new Decimal(maxLoan.value).mul(newValue).div(100);
  v = v.sub(v.mod(step.value));
  loan.value = v.toNumber();
  setTimeout(() => {
    changePercent();
  }, 0);
};

const onPledgeSuccess = () => {
  visible.value = false
  numb.value = ''
  changePercent2()
}

const changePercent = () => {
  if (!loan.value) {
    sliderValue.value = 0
    sliderValue2.value = 0
    numb.value = ''
    return
  }

  let v = new Decimal(loan.value);
  loan.value = v.sub(v.mod(step.value));

  numb.value = new Decimal(loan.value).div(param.lever || 1);
  const v2 = new Decimal(numb.value)
  numb.value = v2.sub(v2.mod(step.value)).toNumber();

  if (!token.value) {
    sliderValue.value = 0
  } else {
    let p = new Decimal(loan.value)
      .div(maxLoan.value)
      .mul(100)
      .toNumber();
    if (p < 0) p = 0;
    if (p > 100) p = 100;
    sliderValue.value = Number(p);
  }
  sliderValue2.value = sliderValue.value
};


const onSliderChange2 = (newValue) => {
  sliderValue2.value = newValue;
  if (!walletAmount.value) {
    nextTick(() => {
      sliderValue2.value = 0
    })
    return
  }
  let v = new Decimal(walletAmount.value).mul(newValue).div(100);
  v = v.sub(v.mod(step.value));
  numb.value = v.toNumber();
  setTimeout(() => {
    changePercent2();
  }, 0);
};

const changePercent2 = () => {
  if (!numb.value) {
    sliderValue2.value = 0
    loan.value = ''
    sliderValue.value = 0
    return
  }
  const v = new Decimal(numb.value)
  numb.value = v.sub(v.mod(step.value)).toNumber();

  if (!token.value) {
    sliderValue2.value = 0;
  } else {
    let p = new Decimal(numb.value)
      .div(walletAmount.value)
      .mul(100)
      .toNumber();
    if (p < 0) p = 0;
    if (p > 100) p = 100;
    sliderValue2.value = Number(p)
  }

  loan.value = new Decimal(numb.value).mul(param.lever || 1)
  const v2 = new Decimal(loan.value)
  loan.value = v2.sub(v2.mod(step.value)).toNumber();
  sliderValue.value = sliderValue2.value
};

const openConfirm = () => {
  if (!token.value) {
    showToast('请先登录再借币')
    setTimeout(() => {
      router.push({
        name: 'login'
      })
    }, 50);
    return;
  } else if (!numb.value) {
    return showToast("请先输入质押数量")
  }
  visible.value = true
}

</script>
<style lang="less" scoped>
.pledge_form {
  .pledge_doc {
    overflow: hidden;
    display: flex;
    margin-top: 0.28rem;
    align-items: center;
    justify-content: flex-start;
    color: var(--ex-text-color5);
    font-weight: 400;
    font-size: 0.28rem;
    line-height: 0.32rem;
    margin-bottom: 0.64rem;

    .checked_icon_blue {
      width: 0.32rem;
      height: 0.32rem;
      border: 0.02rem solid var(--ex-border-color2);
      background-size: contain;
      border-radius: 0.08rem;
      background-repeat: no-repeat;
    }

    .unchecked_icon {
      width: 0.32rem;
      height: 0.32rem;
      background-color: transparent;
      border: 0.02rem solid var(--ex-border-color2);
      border-radius: 0.08rem;
    }

    .pledge_doc_check {
      margin-right: 0.24rem;
    }

    >span {
      color: var(--ex-primary-color);
    }
  }

  .active-day {
    background-color: var(--ex-primary-color);
    color: var(--ex-text-color);
  }

  .submit {
    border-radius: 0.7rem;
    height: 1.12rem;
    width: 100%;
  }
}

.yz-form-item {
  height: 4.1rem !important;

  :deep(.form-item-box .form-item-con .item) {
    padding-top: 1rem !important;
    padding-bottom: 2rem !important;

    .mid-scroll {
      height: 1.14rem !important;
      bottom: 0.84rem !important;
    }

    .bottom_content {
      height: 0.84rem !important;
    }

    .lt-box {
      top: 0.16rem;
      transform: scale(1) !important;
    }
  }


}

.item_box {
  :deep(.van-slider.slider-dom::after) {
    border-color: #26272f;
  }

  :deep(.van-slider.slider-dom::before) {
    background-color: #26272f;
  }
}

.pledge_accounr_dialog {
  overflow: hidden;
  padding: 0.32rem 0.32rem 0 0.32rem;
  position: relative;

  .search_box {
    display: flex;
    align-items: center;
    padding: 0 0.4rem;
    margin-bottom: 0.15rem;
    height: 1rem;
    background-color: var(--ex-bg-white2);
    border-radius: 0.8rem;

    input {
      padding-top: 0.06rem;
    }

    input::placeholder {
      color: var(--ex-text-color3);
      font-size: 0.3rem;
    }

    .type_select {
      right: 0;
      display: flex;
      align-items: center;
      color: var(--ex-text-color);
      font-size: 0.24rem;

      .type_icon {
        width: 0.28rem;
        height: 0.28rem;
        opacity: 0.8;
        margin-left: 0.06rem;
      }
    }

    &:has(.search:focus) {
      border: 1px solid var(--ex-primary-color);
    }

    .icon {
      width: 0.4rem;
      height: 0.4rem;
    }

    .close {
      width: 0.24rem;
      height: 0.24rem;
      color: var(--ex-text-color);
    }

    .search {
      flex: 1;
      margin: 0 0.16rem;
      font-size: 0.32rem;
      font-weight: 400;
    }
  }


  .swap_dialog_list {
    max-height: calc(var(--vh) * 60);
    overflow-y: auto;
    padding-bottom: 0.8rem;
  }

  .swap_dialog_item {
    height: 1rem;
    line-height: 0;
    display: flex;
    align-items: center;
    border-radius: 0.4rem;
    background-color: var(--ex-bg-white2);
    overflow: hidden;
    position: relative;
    padding: 0 0.28rem;
    margin-top: 0.2rem;
    color: var(--ex-text-color2);

    .icon {
      width: 0.64rem;
      height: 0.64rem;
      margin-right: 0.2rem;
    }
  }

  .swap_dialog_item_active {
    color: var(--ex-text-color);
    background: var(--ex-bg-white1);

    .check_icon {
      position: absolute;
      right: 0.24rem;
      color: var(--ex-primary-color);
      font-size: 0.4rem;
    }
  }
}
</style>