<template>
<!-- 余额提示 -->
<BottomPopup  v-model:show="showAmountDialog" :title="$t('trade.ai_opening_pop_title')" @closed="close()" closeable >


      <!-- 内容 -->
      <div
        class="bg-color3 rounded-[0.4rem] px-[0.12rem] pb-[0.12rem]"
        style="text-align:center;border-radius:0.32rem;line-height:0.4rem;overflow:hidden;position:relative;margin:0.32rem 0.4rem 0 0.4rem;">
        <div class="text-color h-[0.84rem] flex items-center justify-center text-[0.32rem]">
          {{ account }}</div>
        <div class="flex items-center justify-center flex-col bg-color p-[0.2rem] rounded-[0.4rem]">
          <div class="flex items-center justify-center mb-[0.2rem]">
            <div v-if="currency" class="size-[0.4rem]">
              <img :src="getStaticImgUrl(`/static/img/crypto/${currency.toUpperCase()}.svg`)" />
            </div>

            <span class="text-[0.3rem] ml-[0.12rem] text-color">{{ currency }}</span>
          </div>
          <div class=" leading-[0.54rem] text-[0.48rem] font-[600] text-primary">{{ amount }}</div>
        </div>
      </div>

      <!--  按钮 -->

      <div
        class="flex items-center justify-between text-[0.28rem] gap-[0.4rem] flex-wrap"
        style="padding: 0.6rem 0.4rem 0.76rem 0.4rem;">
        <div @click="router.push({ name: 'topUpCrypto' });close();"
          class="h-[1.12rem] flex items-center justify-center font-[600] text-[0.36rem]"
          style="width:calc(50% - 0.2rem);border-radius: 0.64rem;background-color: var(--ex-white);color: var(--ex-text-color--bg-light);">
          {{ $t('market.market_buy_fast_noti_cancel') }}</div>
          <div  class="h-[1.12rem] flex items-center justify-center font-[600] text-[0.36rem]" @click="router.push({ name: 'transfer' });close();"
          style="width:calc(50% - 0.2rem);border-radius: 0.64rem; color: var(--ex-text-color--bg-primary);background-color: var(--ex-primary-color);">
          {{ $t('market.market_buy_fast_noti_confirm') }}</div>
      </div>

  </BottomPopup>
</template>

<script setup>
import { Popup } from "vant";
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import { watch } from "vue";
import BottomPopup from "./BottomPopup.vue";
const props = defineProps({
    show:Boolean,
    currency:String,
    account:String,
    amount:[Number,String]
})
const emits = defineEmits(['update:show'])
const showAmountDialog = ref(props.show)

const close = ()=>{
    emits('update:show',false)
}
watch(()=>props.show,(v)=>{
    showAmountDialog.value = v
})
</script>