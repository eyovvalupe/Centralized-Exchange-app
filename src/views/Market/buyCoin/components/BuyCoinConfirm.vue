<template>
  <BottomPopup :title="t('market.market_buy_confirm_coin')" v-model:show="orderConfirmDialog" closeable>
    
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
      <div class="mt-[0.2rem] pt-[0.3rem] p-[0.12rem] rounded-[0.32rem] bg-color3"
        v-if="offset == 'sell'">
        <div class="flex items-center justify-between px-[0.2rem] h-[0.36rem]">
          <div class="text-[0.32rem] font-bold text-color">
            收款账户
          </div>
          <span class="text-primary" @click="showAccountDialog = true;" v-if="currentAccount.channel">{{
            t('withdraw.change')
          }}</span>
        </div>

        <div 
          class="dialog_account_item  mt-[0.32rem] mx-[0.2rem] mb-[0.2rem] px-[0.28rem] bg-color3 rounded-[0.32rem] h-[2.16rem]" :style="{backgroundImage:`url(${getStaticImgUrl('/static/img/bank/card_bg.svg')})`}" v-if="currentAccount.channel">
          <div>
            <div class="right-[0.24rem] top-[0.24rem] absolute text-[0.28rem] text-color2" v-if="currentAccount.accountName">户主姓名：{{ currentAccount.accountName }}</div>
            <div class="flex items-center">
              <div class="card_icon">
                <img v-if="currentAccount.channel === 'crypto'" class="rounded-50"
                  :src="getStaticImgUrl(`/static/img/crypto/${currentAccount.symbol?.toUpperCase()}.svg`)" alt="currency" />
                <img v-else class="!size-[0.44rem]" :src="getStaticImgUrl('/static/img/bank/card_icon.svg')" alt="img" />
              </div>
              <div class="text-color text-[0.32rem]">{{ currentAccount.symbol ? `${currentAccount.symbol}-${currentAccount.network}` : `${currentAccount.bankName}` }}</div>
              
            </div>
            <div class="card">
              <div class="code">{{ _hiddenAccount(currentAccount.bankCardNumber || currentAccount.address) }}</div>
              
            </div>
          </div>
        </div>
        
        <div class="dialog_account_item h-[1.4rem] mt-[0.32rem] bg-color rounded-[0.32rem]" v-else>
          <div class="flex w-full flex-col items-center justify-center text-primary" @click="showAccountDialog = true;">
            <div
              class="mb-1 size-[0.48rem]">
              <img :src="getStaticImgUrl('/static/img/common/add.svg')" />
            </div>
            <span class="text-12 leading-22">{{ t('market.market_buy_fast_account_add') }}</span>
          </div>
        </div>
      </div>

      <FormItem size="large" class="mt-[0.4rem]" :placeholder="t('trade.stock_opening_trade_pw')" input-type="password"
        v-model="safeword" />
      <div class="pt-[0.6rem] pb-[0.32rem]">
        <Button size="large" round :loading="loading" @click="submit" type="primary">{{ t('trade.stock_opening_confirm')
          }}</Button>
      </div>
    </div>

  </BottomPopup>

  <AccountSelectionPopUp v-model:show="showAccountDialog" :bank="currentAccount" currency-type="bank"
    @on-add-collection="clickAccountItem" />

</template>

<script setup>

import { ref } from 'vue'
import { Popup, Button, showToast } from 'vant'
import FormItem from '@/components/Form/FormItem.vue';
import { useI18n } from 'vue-i18n';
import { getStaticImgUrl } from "@/utils/index.js"
import { _hiddenAccount } from '@/utils/index'
import BottomPopup from '@/components/BottomPopup.vue';
import AccountSelectionPopUp from "./AccountSelectionPopUp.vue";

const { t } = useI18n();
const orderConfirmDialog = ref(false)
const safeword = ref('')

const props = defineProps({
  volume: [String, Number],
  money: [String, Number],
  currency: String,
  payCurrency: String,
  offset: String,
  loading: Boolean
})

const currentAccount = ref({})

const emit = defineEmits(['submit', ''])

const submit = () => {
  if (props.offset == 'sell' && !currentAccount.value.id) {
    return showToast("请选择收款账户");
  }
  if (!safeword.value) {
    return showToast(t("assets.safety_trade_no_password"));
  }
  emit("submit", {
    account_id: currentAccount.value.id,
    safeword: safeword.value
  })

}

const showAccountDialog = ref(false)
const clickAccountItem = (item) => {
  currentAccount.value = item
  showAccountDialog.value = false

};

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
      margin-top:0.32rem;

      .code {
        font-size: 0.4rem;
        font-weight: 600;
        color:var(--ex-text-color);
      }
    }
}
</style>