<template>
  <Popup round v-model:show="orderConfirmDialog" position="bottom" closeable teleport="body">
    <div class="van-popup-custom-title">
      {{ t('market.market_buy_confirm_coin') }}
    </div>

    <div class="px-[0.32rem] pt-[0.52rem]">
      <div class="flex justify-between items-center px-[0.32rem] border-solid border-[1px] h-[1.2rem] box-border rounded-[0.32rem]">
        <template v-if="offset == 'buy'">
          <div class="text-[0.32rem] font-bold text-[#061023]">{{ t('market.market_buy_will_pay') }}</div>
          <div class="flex items-center">
            <strong class="text-[#014CFA] text-[0.48rem]">{{ money }}</strong>
            <span class="text-[0.28rem] text-[#061023] ml-[0.1rem] relative top-[0.04rem]">{{ payCurrency }}</span>
          </div>
        </template>
        <template v-else>
          <div class="text-[0.32rem] font-bold text-[#061023]">{{ t('market.market_buy_will_sell') }}</div>
          <div class="flex items-center">
            <strong class="text-[#014CFA] text-[0.48rem]">{{ volume }}</strong>
            <span class="text-[0.28rem] text-[#061023] ml-[0.1rem] relative top-[0.04rem]">{{ currency }}</span>
          </div>
        </template>
      </div>
      <div class="mt-[0.2rem] flex justify-between items-center px-[0.32rem] border-solid border-[1px] h-[1.2rem] box-border rounded-[0.32rem]">
        <div class="text-[0.32rem] font-bold text-[#061023]">{{ t('market.market_buy_will_receive') }}</div>
        <div class="flex items-center" v-if="offset == 'buy'">
          <strong class="text-[#014CFA] text-[0.48rem]">{{ volume }}</strong>
          <span class="text-[0.28rem] text-[#061023] ml-[0.1rem] relative top-[0.04rem]">{{ currency }}</span>
        </div>
        <div class="flex items-center" v-else>
          <strong class="text-[#014CFA] text-[0.48rem]">{{ money }}</strong>
          <span class="text-[0.28rem] text-[#061023] ml-[0.1rem] relative top-[0.04rem]">{{ payCurrency }}</span>
        </div>
      </div>
      <div class="mt-[0.2rem] pt-[0.4rem] px-[0.32rem] border-solid border-[1px]  box-border rounded-[0.32rem]" v-if="offset == 'sell'">
        <div class="text-[0.32rem] font-bold text-[#061023]">收款账户</div>
        <div  class="dialog_account_item py-[0.32rem]">
          <div class="card_icon">
            <img v-if="currentAccount.channel === 'crypto'" class="rounded-50"
              :src="getStaticImgUrl(`/static/img/crypto/${currentAccount.symbol?.toUpperCase()}.png`)" alt="currency" />
            <img v-else class="!size-[0.68rem]" :src="getStaticImgUrl('/static/img/user/card_type_b.png')" alt="img" />
          </div>
          <div class="card">
            <div class="code">{{ _hiddenAccount(currentAccount.bankCardNumber || currentAccount.address) }}</div>
            <div class="text-[#666D80]">{{ currentAccount.symbol ? `${currentAccount.symbol}-${currentAccount.network}` : `${currentAccount.bankName}` }} <span v-if="currentAccount.accountName">| {{ currentAccount.accountName }}</span></div>
          </div>
          
        </div>
      </div>


      <FormItem size="large" :title="t('trade.stock_opening_trade_pw')" input-type="password" v-model="safeword" />
      <div class="pt-[0.6rem] pb-[0.32rem]">
        <Button size="large" round :loading="loading" @click="submit" color="#014CFA">{{ t('trade.stock_opening_confirm') }}</Button>
      </div>
    </div>
    
  </Popup>
</template>

<script setup>

import {ref} from 'vue'
import { Popup,Button,showToast } from 'vant'
import FormItem from '@/components/Form/FormItem.vue';
import { useI18n } from 'vue-i18n';
import { getStaticImgUrl } from "@/utils/index.js"
import { _hiddenAccount } from '@/utils/index'
const { t } = useI18n();
const orderConfirmDialog = ref(false)
const safeword = ref('')

defineProps({
  volume:[String,Number],
  money:[String,Number],
  currency:String,
  payCurrency:String,
  offset:String,
  loading:Boolean,
  currentAccount:{
    type:Object,
    default(){
      return {}
    }
  }
})

const emit = defineEmits(['submit'])

const submit = ()=>{
  if(!safeword.value){
    return showToast(t("assets.safety_trade_no_password"));
  }
  emit("submit",safeword.value)
  
}

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
      background-color: #f5f7fc;
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
      color: #061023;
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