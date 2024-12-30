<template>
  <Popup round v-model:show="orderConfirmDialog" position="bottom" closeable teleport="body">
    <div class="van-popup-custom-title">
      {{ t('market.market_buy_confirm_coin') }}
    </div>

    <div class="px-[0.32rem] pt-[0.52rem]">
      <div class="flex justify-between items-center px-[0.32rem] h-[1.2rem] bg-color3 rounded-[0.32rem]">
        <template v-if="offset == 'buy'">
          <div class="text-[0.32rem] font-bold text-color">{{ t('market.market_buy_will_pay') }}</div>
          <div class="flex items-center">
            <strong class="text-primary text-[0.48rem]">{{ money }}</strong>
            <span class="text-[0.28rem] text-color ml-[0.1rem] relative top-[0.04rem]">{{ payCurrency }}</span>
          </div>
        </template>
        <template v-else>
          <div class="text-[0.32rem] font-bold text-color">{{ t('market.market_buy_will_sell') }}</div>
          <div class="flex items-center">
            <strong class="text-primary text-[0.48rem]">{{ volume }}</strong>
            <span class="text-[0.28rem] text-color ml-[0.1rem] relative top-[0.04rem]">{{ currency }}</span>
          </div>
        </template>
      </div>
      <div class="mt-[0.2rem] flex justify-between items-center px-[0.32rem] h-[1.2rem] bg-color3 rounded-[0.32rem]">
        <div class="text-[0.32rem] font-bold text-color">{{ t('market.market_buy_will_receive') }}</div>
        <div class="flex items-center" v-if="offset == 'buy'">
          <strong class="text-primary text-[0.48rem]">{{ volume }}</strong>
          <span class="text-[0.28rem] text-color ml-[0.1rem] relative top-[0.04rem]">{{ currency }}</span>
        </div>
        <div class="flex items-center" v-else>
          <strong class="text-primary text-[0.48rem]">{{ money }}</strong>
          <span class="text-[0.28rem] text-color ml-[0.1rem] relative top-[0.04rem]">{{ payCurrency }}</span>
        </div>
      </div>
      <div class="mt-[0.2rem] pt-[0.4rem] px-[0.32rem] border-solid border-[1px]  box-border rounded-[0.32rem]" v-if="offset == 'sell'">
        <div class="flex items-center justify-between h-[0.36rem]">
          <div class="text-[0.32rem] font-bold text-color">
            收款账户
          </div>
          <span class="text-primary" @click="showAccountDialog=true;" v-if="currentAccount.channel">{{ t('withdraw.change') }}</span>
        </div>
        <div  class="dialog_account_item h-[1.5rem]" v-if="currentAccount.channel">
          <div class="card_icon">
            <img v-if="currentAccount.channel === 'crypto'" class="rounded-50"
              :src="getStaticImgUrl(`/static/img/crypto/${currentAccount.symbol?.toUpperCase()}.svg`)" alt="currency" />
            <img v-else class="!size-[0.68rem]" :src="getStaticImgUrl('/static/img/bank/card_type_b.svg')" alt="img" />
          </div>
          <div class="card">
            <div class="code">{{ _hiddenAccount(currentAccount.bankCardNumber || currentAccount.address) }}</div>
            <div class="text-color2">{{ currentAccount.symbol ? `${currentAccount.symbol}-${currentAccount.network}` : `${currentAccount.bankName}` }} <span v-if="currentAccount.accountName">| {{ currentAccount.accountName }}</span></div>
          </div>
          
        </div>
        <div class="dialog_account_item h-[1.5rem] "  v-else>
          <div class="flex w-full flex-col items-center justify-center text-primary"
          @click="showAccountDialog=true;">
            <div class="mb-1 size-6 rounded-50 flex items-center justify-center border-[0.03rem] border-my text-20 leading-none">+</div>
            <span class="text-12 leading-22">{{ t('market.market_buy_fast_account_add') }}</span>
          </div>
        </div>
      </div>

      <FormItem size="large" :title="t('trade.stock_opening_trade_pw')" input-type="password" v-model="safeword" />
      <div class="pt-[0.6rem] pb-[0.32rem]">
        <Button size="large" round :loading="loading" @click="submit" type="primary">{{ t('trade.stock_opening_confirm') }}</Button>
      </div>
    </div>
    
  </Popup>

  <AccountSelectionPopUp v-model:show="showAccountDialog" :bank="currentAccount" currency-type="bank"
  @on-add-collection="clickAccountItem" />
  
</template>

<script setup>

import {ref} from 'vue'
import { Popup,Button,showToast } from 'vant'
import FormItem from '@/components/Form/FormItem.vue';
import { useI18n } from 'vue-i18n';
import { getStaticImgUrl } from "@/utils/index.js"
import { _hiddenAccount } from '@/utils/index'
import AccountSelectionPopUp from "./AccountSelectionPopUp.vue";

const { t } = useI18n();
const orderConfirmDialog = ref(false)
const safeword = ref('')

const props = defineProps({
  volume:[String,Number],
  money:[String,Number],
  currency:String,
  payCurrency:String,
  offset:String,
  loading:Boolean
})

const currentAccount = ref({})

const emit = defineEmits(['submit',''])

const submit = ()=>{
  if(props.offset == 'sell' && !currentAccount.value.id){
    return showToast("请选择收款账户");
  }
  if(!safeword.value){
    return showToast(t("assets.safety_trade_no_password"));
  }
  emit("submit",{
    account_id:currentAccount.value.id,
    safeword:safeword.value
  })

}

const showAccountDialog = ref(false)
const clickAccountItem = (item) => {
  currentAccount.value = item
  showAccountDialog.value = false
  
};

const open = ()=>{
  safeword.value = ''
  orderConfirmDialog.value = true
}
const close = ()=>{
  orderConfirmDialog.value = false
}

defineExpose({
  open,
  close
})

</script>

<style lang="less" scoped>
.dialog_account_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    .card_icon {
      background-color: var(--ex-bg-color2);
      width: 0.96rem;
      height: 0.96rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;

      >#img {
        width: 0.96rem !important;
        height: 0.96rem !important;
      }
    }

    .card {
      flex: 1;
      margin: 0 0.2rem 0 0.36rem;
      text-align: left;
      font-size: 0.24rem;
      color: var(--ex-text-color);
      font-weight: 500;
      line-height: 1;

      .code {
        font-size: 0.32rem;
        margin-bottom: 0.1rem;
        font-weight: 600;
      }
    }
}
</style>