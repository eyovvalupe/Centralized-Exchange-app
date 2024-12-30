<template>
<!-- 余额提示 -->
<Popup round v-model:show="showAmountDialog" @closed="close()" closeable teleport="body">
    <div style="width: 6.4rem">

      <!-- 标题 -->
      <div
        style="text-align: center;font-size: 0.32rem;height:1rem;display: flex;align-items: center;justify-content: center;border:1px solid var(--ex-border-color);">{{$t('trade.ai_opening_pop_title')}}</div>

      <!-- 内容 -->
      <div
        style="display:flex;align-items:center;justify-content:center;text-align:center;background:var(--ex-bg-color2);border:1px solid var(--ex-border-color);border-radius:0.32rem;line-height:0.4rem;margin-top:0.32rem;overflow:hidden;position:relative;margin:0.32rem 0.4rem;">
        <div
          style="color:var(--ex-text-color);font-size:0.28rem;font-weight:400;padding:0 0.32rem;height:1.4rem;background-color:var(--ex-bg-color);display:flex;align-items:center;justify-content:center;">
          {{ account }}</div>
        <div style="display:flex;align-items:center;justify-content:center;flex-direction: column;flex:1">
          <div style="display:flex;align-items:center;justify-content:center;margin-bottom:0.08rem">
            <div v-if="currency" style="width:0.32rem;height:0.32rem;display:flex;position:relative;top:-0.02rem">
              <img :src="getStaticImgUrl(`/static/img/crypto/${currency.toUpperCase()}.svg`)" />
            </div>

            <span style="font-size:0.28rem;margin-left:0.12rem;color:var(--ex-text-color);font-weight:400">{{ currency }}</span>
          </div>
          <b style="font-size:0.4rem;color:var(--ex-primary-color);font-weight:bold">{{ amount }}</b>
        </div>
      </div>

      <!--  按钮 -->
      <div
        style="display: flex;align-items: center;justify-content: space-between;padding: 0 0.4rem;font-size: 0.28rem;margin: 0.64rem 0 0.4rem 0">
        <div @click="router.push({ name: 'transfer' });close();"
          style="height: 0.8rem;width:48%;display: flex;align-items: center;justify-content: center;border-radius: 0.64rem;border: 1px solid var(--ex-primary-color);color: var(--ex-primary-color)">
          {{ $t('market.market_buy_fast_noti_confirm') }}</div>
        <div @click="router.push({ name: 'topUpCrypto' });close();"
          style="height: 0.8rem;width:48%;display: flex;align-items: center;justify-content: center;border-radius: 0.64rem;background-color: var(--ex-primary-color);color: var(--ex-bg-primary-text-color);">
          {{ $t('market.market_buy_fast_noti_cancel') }}</div>
      </div>
    </div>

  </Popup>
</template>

<script setup>
import { Popup } from "vant";
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import { watch } from "vue";
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