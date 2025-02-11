<template>
  <div class="pledge_form">
    <div v-show="pageLoading" class="w-full h-full absolute left-0 top-0 flex items-center justify-center">
      <Loading :type="'circular'" :size="44" color="var(--ex-primary-color)" />
    </div>

    <!-- 验资数量 -->
    <div class="item_box mt-[0.1rem]">
      <div class="item_box_right">
        <FormItem :hasLT="true" :hasRT="true" :hasScroll="true" :placeholder="t('finance.defi_verif_qty')"
          :max="walletAmount" v-model="numb" @change="changePercent2" @btnClick="onSliderChange2(100)"
          class="yz-form-item" input-type="number">

          <template #lt>
            <div class="pt-[0.12rem] text-color2 text-[0.24rem]">
              <span>{{ t('finance.defi_verifiable_qty') }}</span>
              <span class="text-primary mx-[0.08rem]">{{ walletAmount || '--' }} </span>
              <span>{{ currIn.currency }}</span>
            </div>

          </template>
          <template #rt>
            <div
              class="flex items-center bg-color3 h-[0.88rem] rounded-[0.32rem] justify-between px-[0.2rem]  ripple-btn"
              @click="showDialog = true;">
              <div class="flex items-center">
                <div v-if="currIn.name" class="size-[0.52rem] mr-[0.16rem]">
                  <CryptoIcon class="rounded-50" :name="currIn.name" />
                </div>
                <span class="text-[0.3rem] w-[1rem]">{{ currIn.name || "--" }}</span>
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
        </FormItem>
      </div>
    </div>
    <!-- 可借数量 -->
    <div class="item_box mt-[0.1rem]">
      <div class="item_box_right">
        <FormItem :hasScroll="true" :placeholder="t('finance.defi_avail_qty')" :max="maxLoan" v-model="loan"
          :tip="maxLoan > 0 ? '≤' + maxLoan : ''" @change="changePercent" @btnClick="onSliderChange(100)" input-type="number">

          <template #scroll>
            <!-- 拖动 -->
            <SlideContainer v-model="sliderValue" @change="onSliderChange" />
          </template>
        </FormItem>
      </div>
    </div>
    <div class="px-[0.28rem]  py-[0.24rem] rounded-[0.32rem] bg-color2 border-color border-[1px] mt-[0.1rem]">
      <div class="text-[0.28rem] leading-[0.28rem] text-color2">{{ t('finance.defi_borrow_period') }}</div>
      <div class="flex flex-wrap gap-[0.12rem] gap-y-[0.2rem] pt-[0.2rem]">
        <div
          class="px-[0.4rem] h-[0.6rem] text-color2 rounded-full text-[0.28rem] bg-color3 leading-[0.6rem]  ripple-btn"
          :class="{ 'active-day': param.days == item.days }" v-for="item in paraData" :key="item.days"
          @click="setParam(item)">
          {{ item.days }}{{ t('finance.portfolio_day_multi') }}
        </div>
      </div>
    </div>
    <div class="bg-color3 mt-[0.1rem] p-[0.12rem] text-[0.28rem] rounded-[0.32rem]">
      <div class="p-[0.16rem]">
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
      <div class="flex items-center justify-between h-[1.2rem] mt-[0.12rem] bg-color2 rounded-[0.32rem] px-[0.28rem]">
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
    
    <div class="h-[2.2rem]"></div>

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
        :days="param.days" @success="visible = false;" />
    </BottomPopup>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
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
  const data = store.state.wallet.filter((item) => item.type == "crypto");
  if (!currIn.value.currency && data[0]) {
    currIn.value = data[0]
  }
  return filterSearchValue(data);
});

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
  const target = wallet.value.find(
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

const maxLoan = computed(()=>{
    return walletAmount.value * (param.lever || 1)
})

const step = computed(()=>{
    let d = '1'
    if(tpp.value > 0){
        let s = ''
        for(let i=1;i<tpp.value;i++){
            s += '0'
        }
        d = '0.'+s+'1'
    }
    return Number(d)
})
const sliderValue = ref(0);
const sliderValue2 = ref(0);

const onSliderChange = (newValue) => {
  sliderValue.value = newValue;
  if (!maxLoan.value) return (sliderValue.value = 0);
  let v = new Decimal(maxLoan.value).mul(newValue).div(100);
  v = v.sub(v.mod(step.value));
  loan.value = v.toNumber();
  setTimeout(() => {
    changePercent();
  }, 0);
};

const changePercent = () => {
  if (!maxLoan.value || !loan.value){
    sliderValue.value = 0
    sliderValue2.value = 0
    numb.value = ''
    return
  }
  if(loan.value > maxLoan.value){
    loan.value = maxLoan.value
  }
  let v = new Decimal(loan.value);
  loan.value = v.sub(v.mod(step.value));

  numb.value = new Decimal(loan.value).div(param.lever || 1);
  const v2 = new Decimal(numb.value)
  numb.value = v2.sub(v2.mod(step.value));

  let p = new Decimal(loan.value)
    .div(maxLoan.value)
    .mul(100)
    .toNumber();
  if (p < 0) p = 0;
  if (p > 100) p = 100;
  sliderValue.value = Number(p);
  sliderValue2.value = sliderValue.value

};


const onSliderChange2 = (newValue) => {
  sliderValue2.value = newValue;
  if (!walletAmount.value) return (sliderValue2.value = 0);
  let v = new Decimal(walletAmount.value).mul(newValue).div(100);
  v = v.sub(v.mod(step.value));
  numb.value = v.toNumber();
  setTimeout(() => {
    changePercent2();
  }, 0);
};

const changePercent2 = () => {
  if (!walletAmount.value || !numb.value){
    sliderValue2.value = 0
    loan.value = ''
    sliderValue.value = 0
    return 
  }
  const v = new Decimal(numb.value)
  numb.value = v.sub(v.mod(step.value));
  let p = new Decimal(numb.value)
    .div(walletAmount.value)
    .mul(100)
    .toNumber();
  if (p < 0) p = 0;
  if (p > 100) p = 100;
  sliderValue2.value = Number(p);
  loan.value = numb.value.mul(param.lever || 1)
  const v2 = new Decimal(loan.value)
  loan.value = v2.sub(v2.mod(step.value));
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
    return showToast("请先输入验资数量")
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
    border-radius: 0.32rem;
    height: 1.12rem;
    width: 100%;
  }
}

.yz-form-item {
  height: 3.12rem;

  :deep(.form-item-box .form-item-con .item) {
    padding-top: 1.12rem;
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
    background-color: var(--ex-bg-color2);
    border-radius: 0.8rem;
    border: 1px solid var(--ex-border-color);

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
    background-color: rgb(var(--ex-bg-color3-rgb) / 0.6);
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
    background: var(--ex-bg-color3);

    .check_icon {
      position: absolute;
      right: 0.24rem;
      color: var(--ex-primary-color);
      font-size: 0.4rem;
    }
  }
}
</style>