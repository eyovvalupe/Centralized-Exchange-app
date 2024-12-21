<template>
  <div class="relative overflow-hidden w-[6.86rem] h-[2.42rem] pt-[0.16rem] pl-[0.24rem] top-[-0.5rem]">
    <ContractWalletBtn />
    <ContractWalletInfoContainer />
    <ContractImg />
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
import ContractImg from "./ContractWalletInfo/ContractImg.vue";
import ContractWalletBtn from "./ContractWalletInfo/ContractWalletBtn.vue";
import ContractWalletInfoContainer from "./ContractWalletInfo/ContractWalletInfoContainer.vue";
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
