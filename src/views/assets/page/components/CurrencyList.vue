<template>
  <div v-if="list.length" v-for="(item, i) in list" class="currency_list">
    <div v-if="type == 'cash'"
      class="w-[6.86rem] h-[2.36rem] rounded-[0.32rem] bg-[#f5f7fc] border-[0.02rem] border-[#eff3f8] overflow-hidden relative mb-[0.2rem]"
      @click="click(item)">
      <div class="w-[6.86rem] h-[1.4rem] rounded-t-[0.32rem] bg-[#fff] absolute bottom-[0] flex items-center">
        <div class="w-full h-[0.8rem] relative flex">
          <div class="w-1/2 h-full flex flex-col items-center justify-between">
            <div class="text-[0.28rem] text-[#666d80]">{{ t('assets.wallet_available_sim') }}</div>
            <div class="text-[0.32rem] text-[#061023] font-semibold">
              {{ item.amount }}
            </div>
          </div>
          <div class="w-1/2 h-full flex flex-col items-center justify-between">
            <div class="text-[0.28rem] text-[#666d80]">{{ t('assets.wallet_blocked_sim') }}</div>
            <div class="text-[0.32rem] text-[#061023] font-semibold">
              {{ 0 }}
            </div>
          </div>
        </div>
      </div>
      <div class="w-full ml-[16px] mt-[16px] flex items-center">
        <div class="w-[0.52rem] h-[0.52rem] rounded-[13px] bg-[#fff] flex justify-center items-center mr-[0.2rem]">
          <div v-if="!fiat.includes(item.name)" style="width:0.4rem;height: 0.39rem;">
            <img :src="getStaticImgUrl(`/static/img/crypto/${item.name}.png`)" alt="">
          </div>
          <div v-else>
            <div v-if="item.name == 'INR'">
              <IndiaIcon />
            </div>
            <div v-if="item.name == 'USD'">
              <USIcon />
            </div>
          </div>
        </div>
        <div class="text-[15px] text-[#061023]">{{ item.name }}</div>
      </div>
    </div>
    <div v-else class="w-full h-[1.04rem] flex items-center rounded-[0.32rem] bg-[#f5f7fc] mb-[0.12rem] justify-between"
      @click="click(item)">
      <div class="w-full ml-[0.32rem] flex items-center">
        <div class="w-[0.52rem] h-[0.52rem] rounded-[13px] bg-[#fff] flex justify-center items-center mr-[0.2rem]">
          <div v-if="!fiat.includes(item.name)" style="width:0.4rem;height: 0.39rem;">
            <img :src="getStaticImgUrl(`/static/img/crypto/${item.name}.png`)" alt="">
          </div>
          <div v-else>
            <div v-if="item.name == 'INR'">
              <IndiaIcon />
            </div>
            <div v-if="item.name == 'USD'">
              <USIcon />
            </div>
          </div>
        </div>
        <div class="text-[15px] text-[#061023]">{{ item.name }}</div>
      </div>
      <div class="mr-[0.32rem] text-[0.32rem] font-semibold">{{ item.amount }}</div>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
import { fiat } from "@/utils/dataMap";
import IndiaIcon from "../icons/IndiaIcon.vue";
import USIcon from "../icons/USIcon.vue";

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
<style lang="less">
.currency_list {}
</style>
