<template>
  <div class="relative overflow-hidden w-[6.86rem] h-[2.42rem] pt-[0.16rem] pl-[0.24rem] top-[-0.5rem]">
    <div class="absolute top-[0.02rem] left-[0.01rem] z-[-1]" style="width: 2.38rem;height: 1.02rem;">
      <img :src="getStaticImgUrl(`/static/icons/close.svg`)" alt="">
    </div>
    <div class="absolute top-[0] left-[0] z-[-1]" style="width: 6.86rem;height: 2.42rem;">
      <img :src="getStaticImgUrl(`/static/icons/wallet_bg11.svg`)" alt="">
    </div>
    <div class="absolute top-[0.05rem] right-[0] z-[-1]" style="width: 2.24rem;height: 2.34rem;">
      <img :src="getStaticImgUrl(`/static/icons/wallet_bg12.svg`)" alt="">
    </div>
    <span class="text-[0.32rem] text-[#fff]">合约账户</span>
    <div class="flex flex-col w-[2.52rem] h-[1.16rem] z-[3] mt-[0.4rem] ml-[0.12rem]">
      <div class="flex">
        <span class="text-[0.24rem] text-[#666d80] mb-[0.24rem] mr-[0.1rem]">合约资产(USDT)</span>
        <div @click.stop="toggleShow" style="width: 0.4rem;height: 0.4rem;">
          <img v-if="showInfo" :src="getStaticImgUrl(`/static/icons/eye_open_white.svg`)" alt="">
          <img v-else :src="getStaticImgUrl(`/static/icons/eye_close_white.svg`)" alt="">
        </div>
      </div>
      {{ console.log("=====>", amount) }}
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
