<template>
  <div class="relative w-[6.86rem] h-[3.04rem] pt-[0.16rem] pl-[0.24rem] mt-[0.32rem] mb-[0.32rem] rounded-[0.32rem]">
    <div class="absolute top-[0.02rem] left-[0.01rem] z-[-1]" style="width: 2.38rem;height: 1.02rem;">
      <img :src="getStaticImgUrl(`/static/icons/wallet_bg5.svg`)" alt="">
    </div>
    <div class="absolute top-[0] left-[0] z-[-1] rounded-[0.36rem]"
      style="box-shadow: 0px 4px 20px 0px #0610231a;width: 6.86rem;height: 3.04rem;">
      <img :src="getStaticImgUrl(`/static/icons/wallet_bg7.svg`)" alt="">
    </div>
    <OtherImg />
    <span class="text-[0.32rem] bg-primary-text-color">{{ name }}</span>
    <div class="flex flex-col px-[0.1rem] h-[1.16rem] z-[3] mt-[0.4rem] ml-[0.12rem]">
      <div class="flex">
        <span class="text-[0.3rem] text-color2 mb-[0.24rem] mr-[0.1rem]" style="width: max-content">{{ type
          }}</span><span class="flex items-end text-[0.24rem] text-color2 mb-[0.24rem] mr-[0.1rem]"
          style="width: max-content">(USDT)</span>
        <div @click.stop="toggleShow" style="width: 0.4rem;height: 0.4rem;">
          <img v-if="showInfo" :src="getStaticImgUrl(`/static/icons/eye_open_white.svg`)" alt="">
          <img v-else :src="getStaticImgUrl(`/static/icons/eye_close_white.svg`)" alt="">
        </div>
      </div>
      <span class="text-[0.52rem] text-color font-semibold">{{
        showInfo ? balance.toLocaleString() : "********"
      }}</span>
    </div>
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import OtherImg from "./OtherWalletInfo/OtherImg.vue";
import { ref, watch } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
  balance: {
    type: Number,
    default: 10000,
  },
});

const emits = defineEmits(["toggleShow"]);

const showInfo = ref(false);

const toggleShow = () => {
  showInfo.value = !showInfo.value;
  emits("toggleShow", showInfo.value);
};
</script>
