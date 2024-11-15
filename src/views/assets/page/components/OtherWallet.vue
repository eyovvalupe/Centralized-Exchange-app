<template>
  <div
    class="relative overflow-hidden w-[6.86rem] h-[3.04rem] pt-[0.16rem] pl-[0.24rem] mt-[0.32rem] mb-[0.32rem] rounded-[0.32rem]"
    style="box-shadow: 0px 4px 20px 0px #0610231a"
  >
    <OtherWalletBtn />
    <OtherWalletInfoContainer />
    <OtherImg />
    <span class="text-[0.32rem] text-[#fff]">{{ name }}账户</span>
    <div
      class="flex flex-col w-[2.52rem] h-[1.16rem] z-[3] mt-[0.4rem] ml-[0.12rem]"
    >
      <div class="flex">
        <span class="text-[0.24rem] text-[#666d80] mb-[0.24rem] mr-[0.1rem]"
          >{{ name }}资产(USDT)</span
        >
        <div @click.stop="toggleShow" v-if="showInfo">
          <ShowEye />
        </div>
        <div @click.stop="toggleShow" v-if="!showInfo">
          <HiddenEye />
        </div>
      </div>
      <span class="text-[0.52rem] text-[#061023] font-semibold">{{
        showInfo ? balance.toLocaleString() : "********"
      }}</span>
    </div>
  </div>
</template>
<script setup>
import HiddenEye from "./HiddenEye.vue";
import OtherImg from "./OtherWalletInfo/OtherImg.vue";
import OtherWalletBtn from "./OtherWalletInfo/OtherWalletBtn.vue";
import OtherWalletInfoContainer from "./OtherWalletInfo/OtherWalletInfoContainer.vue";
import ShowEye from "./ShowEye.vue";
import { ref } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  balance: {
    type: Number,
    default: 10000,
  },
});

const showInfo = ref(false);

const toggleShow = () => {
  showInfo.value = !showInfo.value;
};
</script>
