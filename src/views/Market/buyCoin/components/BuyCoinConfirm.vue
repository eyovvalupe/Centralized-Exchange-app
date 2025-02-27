<template>
  <BottomPopup :title="t('market.market_buy_confirm_coin')" v-model:show="orderConfirmDialog" closeable>

    <div class="px-[0.32rem] pt-[0.52rem]">

      <div class="p-[0.32rem] bg-white1 rounded-[0.32rem]">
        <div class="flex items-center font-[600]">
          <CryptoIcon class="size-[0.52rem] rounded-50 mr-[0.12rem]" :name="currency.toUpperCase()" />
          {{ offset == 'buy' ? t('market.market_buy_list_buy') : t('market.market_buy_list_sell') }}{{ currency }}
        </div>
        <div class="pt-[0.24rem] flex items-center justify-between text-color">
          <span class="text-[0.32rem]">{{ t('market.market_buy_list_price') }}</span>
          <span class=" leading-[0.48rem]">
            <strong class="text-[0.48rem]">{{ price }}</strong>
            <span class="text-[0.28rem] ml-[0.12rem]">{{ payCurrency }}</span>
          </span>
        </div>
      </div>
      <div class="flex justify-between mt-[0.2rem] items-center px-[0.32rem] h-[1.2rem] bg-white1 rounded-[0.32rem]">
        <template v-if="offset == 'buy'">
          <div class="text-[0.32rem] text-color">{{ t('market.market_buy_will_pay') }}</div>
          <div class="flex items-center">
            <strong class="text-color text-[0.48rem]">{{ money }}</strong>
            <span class="text-[0.28rem] text-color ml-[0.1rem] relative top-[0.04rem]">{{ payCurrency }}</span>
          </div>
        </template>
        <template v-else>
          <div class="text-[0.32rem] text-color">{{ t('market.market_buy_will_sell') }}</div>
          <div class="flex items-center">
            <strong class="text-color text-[0.48rem]">{{ volume }}</strong>
            <span class="text-[0.28rem] text-color ml-[0.1rem] relative top-[0.04rem]">{{ currency }}</span>
          </div>
        </template>
      </div>
      <div class="mt-[0.2rem] flex justify-between items-center px-[0.32rem] h-[1.2rem] bg-white1 rounded-[0.32rem]">
        <div class="text-[0.32rem] text-color">{{ t('market.market_buy_will_receive') }}</div>
        <div class="flex items-center" v-if="offset == 'buy'">
          <strong class="text-color text-[0.48rem]">{{ volume }}</strong>
          <span class="text-[0.28rem] text-color ml-[0.1rem] relative top-[0.04rem]">{{ currency }}</span>
        </div>
        <div class="flex items-center" v-else>
          <strong class="text-color text-[0.48rem]">{{ money }}</strong>
          <span class="text-[0.28rem] text-color ml-[0.1rem] relative top-[0.04rem]">{{ payCurrency }}</span>
        </div>
      </div>
      <div class="mt-[0.2rem] pt-[0.3rem] p-[0.12rem] rounded-[0.32rem] bg-white1" v-if="offset == 'sell'">
        <div class="flex items-center justify-between px-[0.2rem] h-[0.36rem]">
          <div class="text-[0.32rem] text-color3">
            收款账户
          </div>
          
        </div>

        <div
          class="dialog_account_item  mt-[0.32rem] mx-[0.2rem] mb-[0.2rem] px-[0.28rem] bg-white1 rounded-[0.32rem] h-[2.16rem]"
          :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/bank/card_bg.svg')})` }"
          v-if="currentAccount.channel">
          <div>
            <div class="right-[0.24rem] top-[0.24rem] absolute text-[0.28rem] text-color2"
              v-if="currentAccount.accountName">
              户主姓名：{{ currentAccount.accountName }}</div>
            <div class="flex items-center">
              <div class="card_icon">
                <CryptoIcon v-if="currentAccount.channel === 'crypto'" class="rounded-50" :name="currentAccount.symbol?.toUpperCase()" />
                <img v-else class="!size-[0.44rem]" v-lazy="getStaticImgUrl('/static/img/bank/card_icon.svg')"
                  alt="img" />
              </div>
              <div class="text-color text-[0.32rem]">{{ currentAccount.symbol ?
                `${currentAccount.symbol}-${currentAccount.network}` : `${currentAccount.bankName}` }}</div>

            </div>
            <div class="card">
              <div class="code">{{ _hiddenAccount(currentAccount.bankCardNumber || currentAccount.address) }}</div>

            </div>
          </div>
        </div>
      
      </div>
    </div>
    <div class="bg-white2 mt-[0.4rem] h-[1px]"></div>

    <div class="px-[0.32rem]">
      <div class="pt-[0.4rem] text-[0.32rem] pb-[0.24rem]">{{t('trade.stock_opening_trade_pw')}}</div>
      <FormItem size="large"  :placeholder="t('trade.stock_opening_trade_pw')" input-type="password"
        v-model="safeword" />
      <div class="pt-[0.4rem] pb-[0.7rem]">
        <Button class="ripple-btn" size="large" round :loading="loading" @click="submit" type="primary">
          <span style="color: var(--ex-white);">{{ t('trade.stock_opening_confirm')
            }}</span></Button>
      </div>
    </div>
   

  </BottomPopup>


</template>

<script setup>

import { ref } from 'vue'
import { Popup, Button, showToast } from 'vant'
import FormItem from '@/components/Form/FormItem.vue';
import { useI18n } from 'vue-i18n';
import { getStaticImgUrl } from "@/utils/index.js"
import { _hiddenAccount } from '@/utils/index'
import BottomPopup from '@/components/BottomPopup.vue';

const { t } = useI18n();
const orderConfirmDialog = ref(false)
const safeword = ref('')

const props = defineProps({
  currentAccount:{
    type:Object,
    default:()=>{}
  },
  volume: [String, Number],
  money: [String, Number],
  currency: String,
  payCurrency: String,
  offset: String,
  loading: Boolean,
  price: [String, Number],
})

const emit = defineEmits(['submit', ''])

const submit = () => {
 
  if (!safeword.value) {
    return showToast(t("assets.safety_trade_no_password"));
  }
  emit("submit", {
    safeword: safeword.value
  })

}


const open = () => {
  safeword.value = ''
  orderConfirmDialog.value = true
}
const close = () => {
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
    background-color: var(--ex-white);
    width: 0.68rem;
    height: 0.68rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.16rem;
  }

  .card {
    margin-top: 0.32rem;

    .code {
      font-size: 0.4rem;
      font-weight: 600;
      color: var(--ex-text-color);
    }
  }
}
</style>