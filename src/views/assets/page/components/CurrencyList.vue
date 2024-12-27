<template>
  <div v-if="list.length" v-for="(item, i) in list" class="currency_list">
    <div v-if="type == 'cash'"
      class="w-[6.86rem] h-[2.36rem] rounded-[0.32rem] bg-color2 border-[0.02rem] border-color overflow-hidden relative mb-[0.2rem]"
      @click="click(item)">
      <div class="w-[6.86rem] h-[1.4rem] rounded-t-[0.32rem] bg-color absolute bottom-[0] flex items-center">
        <div class="w-full h-[0.8rem] relative flex">
          <div class="w-1/2 h-full flex flex-col items-center justify-between">
            <div class="text-[0.28rem] text-color2">{{ t('assets.wallet_available_sim') }}</div>
            <div class="text-[0.32rem] text-color font-semibold">
              {{ item.amount }}
            </div>
          </div>
          <div class="w-1/2 h-full flex flex-col items-center justify-between">
            <div class="text-[0.28rem] text-color2">{{ t('assets.wallet_blocked_sim') }}</div>
            <div class="text-[0.32rem] text-color font-semibold">
              {{ 0 }}
            </div>
          </div>
        </div>
      </div>
      <div class="px-[0.32rem] mt-[0.28rem] h-[0.52rem] flex items-center">
        <div class="crypto_icon w-[0.52rem] h-[0.52rem] rounded-[13px] flex justify-center items-center mr-[0.2rem]">
          <div class="size-[0.4rem]">
            <img :src="getStaticImgUrl(`/static/img/crypto/${item.name}.png`)" class=" rounded-full" alt="">
          </div>
        </div>
        <div class="text-[15px] text-color">{{ item.name }}</div>
      </div>
    </div>
    <div v-else class="w-full h-[1.04rem] flex items-center rounded-[0.32rem] bg-color2 mb-[0.12rem] justify-between"
      @click="click(item)">
      <div class="ml-[0.32rem] flex items-center">
        <div class="crypto_icon w-[0.52rem] h-[0.52rem] rounded-[13px] flex justify-center items-center mr-[0.2rem]">
          <div class="size-[0.4rem]">
            <img :src="getStaticImgUrl(`/static/img/crypto/${item.name}.png`)" alt="">
          </div>
        </div>
        <div class="text-[15px] text-color">{{ item.name }}</div>
      </div>
      <div class="mr-[0.32rem] text-[0.32rem] font-semibold">{{ item.amount }}</div>
    </div>
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { useI18n } from "vue-i18n";
import { fiat } from "@/utils/dataMap";

const emits = defineEmits(["click"]);
const props = defineProps({
  list: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    default: ''
  }
});
const { t } = useI18n();


const click = (val) => {
  emits("click", val);
};
</script>
<style lang="less" scoped>
.crypto_icon {
  background-color: #fff;
}
</style>
