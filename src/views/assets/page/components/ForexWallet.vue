<template>
  <div class="relative overflow-hidden w-[6.86rem] h-[2.42rem] pt-[0.16rem] pl-[0.24rem] top-[-0.75rem]">
    <div class="absolute top-[0.02rem] left-[0.01rem] z-[-1]" style="width: 2.38rem;height: 1.02rem;">
      <img :src="getStaticImgUrl(`/static/icons/wallet_bg9.svg`)" alt="">
    </div>
    <div class="absolute top-[0] left-[0] z-[-1]" style="width: 6.86rem;height: 2.42rem;">
      <img :src="getStaticImgUrl(`/static/icons/wallet_bg8.svg`)" alt="">
    </div>
    <div class="absolute top-[0.05rem] right-[0] z-[-1]" style="width: 2.01rem;height: 2.26rem;">
      <img :src="getStaticImgUrl(`/static/icons/forex.svg`)" alt="">
    </div>
    <span class="text-[0.32rem] text-[#fff]">外汇账户</span>
    <div class="flex flex-col w-[2.52rem] h-[1.16rem] z-[3] mt-[0.4rem] ml-[0.12rem]">
      <div class="flex">
        <span class="text-[0.24rem] text-[#666d80] mb-[0.24rem] mr-[0.1rem]">外汇资产(USDT)</span>
        <div @click.stop="toggleShow" style="width: 0.4rem;height: 0.4rem;">
          <img v-if="showInfo" :src="getStaticImgUrl(`/static/icons/eye_open_white.svg`)" alt="">
          <img v-else :src="getStaticImgUrl(`/static/icons/eye_close_white.svg`)" alt="">
        </div>
      </div>
      <span class="text-[0.52rem] text-[#061023] font-semibold">{{ showInfo ? parseFloat(amount).toLocaleString() :
        '********' }}</span>
    </div>
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { ref } from "vue";

const showInfo = ref(false);

const toggleShow = () => {
  showInfo.value = !showInfo.value;
};
const props = defineProps({
  amount: {
    type: Number,
    default: 0
  }
})
</script>
