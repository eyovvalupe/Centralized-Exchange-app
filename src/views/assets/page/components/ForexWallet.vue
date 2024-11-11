<template>
  <div
    class="relative overflow-hidden w-[6.86rem] h-[2.42rem] pt-[0.16rem] pl-[0.24rem] top-[-0.75rem]"
  >
    <ForexWalletBtn />
    <ForexWalletInfoContainer />
    <ForexImg />
    <span class="text-[0.32rem] text-[#fff]">外汇账户</span>
    <div
      class="flex flex-col w-[2.52rem] h-[1.16rem] z-[3] mt-[0.4rem] ml-[0.12rem]"
    >
      <div class="flex">
        <span class="text-[0.24rem] text-[#666d80] mb-[0.24rem] mr-[0.1rem]"
          >外汇资产(USDT)</span
        >
        <div @click.stop="toggleShow" v-if="showInfo">
          <ShowEye />
        </div>
        <div @click.stop="toggleShow" v-if="!showInfo">
          <HiddenEye />
        </div>
      </div>
      <span class="text-[0.52rem] text-[#061023] font-semibold">{{ showInfo ? '10,000.00' : '********' }}</span>
    </div>
  </div>
</template>
<script setup>
import ForexImg from "./ForexWalletInfo/ForexImg.vue";
import ForexWalletBtn from "./ForexWalletInfo/ForexWalletBtn.vue";
import ForexWalletInfoContainer from "./ForexWalletInfo/ForexWalletInfoContainer.vue";
import HiddenEye from "./HiddenEye.vue";
import ShowEye from "./ShowEye.vue";
import { ref } from "vue";

const showInfo = ref(false);

const toggleShow = () => {
  showInfo.value = !showInfo.value;
};
</script>
