<template>
  <div class="relative overflow-hidden w-[6.86rem] h-[2.42rem] pt-[0.16rem] pl-[0.24rem]">
    <CashWalletBtn />
    <WalletInfoContainer />
    <CashImg />
    <span class="text-[0.32rem] text-[#fff]">现金账户</span>
    <div class="flex flex-col h-[1.16rem] z-[3] mt-[0.4rem] ml-[0.12rem]">
      <div class="flex">
        <span class="text-[0.24rem] text-[#666d80] mb-[0.24rem] mr-[0.1rem]">现金账户(USDT)</span>
        <div @click.stop="toggleShow" v-if="showInfo">
          <ShowEye />
        </div>
        <div @click.stop="toggleShow" v-if="!showInfo">
          <HiddenEye />
        </div>
      </div>
      <span class="text-[0.52rem] text-[#061023] font-semibold">{{ showInfo ? parseFloat(amount).toLocaleString() :
        '********' }}</span>
    </div>
  </div>
</template>
<script setup>
import CashImg from "./CashWalletInfo/CashImg.vue";
import CashWalletBtn from "./CashWalletInfo/CashWalletBtn.vue";
import WalletInfoContainer from "./CashWalletInfo/WalletInfoContainer.vue";
import HiddenEye from "./HiddenEye.vue";
import ShowEye from "./ShowEye.vue";
import { ref } from 'vue';

const props = defineProps({
  amount: {
    type: Number,
    default: 0
  }
})
const showInfo = ref(false);

const toggleShow = () => {
  showInfo.value = !showInfo.value;
}
</script>
