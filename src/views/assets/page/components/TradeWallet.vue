<template>
  <div class="relative overflow-hidden w-[6.86rem] h-[2.42rem] pt-[0.16rem] pl-[0.24rem] top-[-1rem]">
    <div class="absolute top-[0.02rem] left-[0.01rem] z-[-1]">
      <img :src="getStaticImgUrl(`/static/icons/wallet_bg3.svg`)" alt="" style="width: 2.38rem;height: 1.02rem;">
    </div>
    <TradeWalletInfoContainer />
    <div class="absolute top-[0] left-[0] z-[-1]" style="width: 6.86rem;height: 2.42rem;">
      <img :src="getStaticImgUrl(`/static/icons/wallet_bg2.svg`)" alt="">
    </div>

    <div class="absolute top-[0.15rem] right-[0] z-[2]" style="width: 1.84rem;height: 2.24rem;">
      <img :src="getStaticImgUrl(`/static/icons/wallet_bg4.svg`)" alt="">
    </div>
    <span class="text-[0.32rem] bg-primary-text-color">大宗商品</span>
    <div class="flex flex-col h-[1.16rem] z-[3] mt-[0.4rem] ml-[0.12rem]">
      <div class="flex">
        <span class="text-[0.24rem] text-color2 mb-[0.24rem] mr-[0.1rem]">大宗商品资产(USDT)</span>
        <div @click.stop="toggleShow" style="width: 0.4rem;height: 0.4rem;">
          <img v-if="showInfo" :src="getStaticImgUrl(`/static/img/common/open_eye.svg`)" alt="">
          <img v-else :src="getStaticImgUrl(`/static/img/common/close_eye.svg`)" alt="">
        </div>
      </div>
      <span class="text-[0.52rem] text-color font-semibold">{{ showInfo ? parseFloat(amount).toLocaleString() :
        '********' }}</span>
    </div>
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { ref } from 'vue';

const showInfo = ref(false);

const toggleShow = () => {
  showInfo.value = !showInfo.value;
}
const props = defineProps({
  amount: {
    type: Number,
    default: 0
  }
})
</script>
