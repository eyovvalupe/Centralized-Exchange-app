<template>
  <div class=" bg-contain bg-no-repeat bg-center w-[6.86rem] h-[2.58rem] mt-[0.26rem] flex flex-col justify-center items-center mx-auto mb-[0.4rem] bg-color3 rounded-[0.32rem]" :style="{backgroundImage:'url('+getStaticImgUrl('/static/img/assets/wallet_bg2.svg')+')'}">
    
      <div class="flex mb-[0.4rem]">
        <span class="text-[0.32rem] text-color2 mr-[0.1rem]">{{ name
          }}(USDT)</span>
        <div @click.stop="toggleShow" class="size-[0.4rem]">
          <img v-if="showInfo" v-lazy="getStaticImgUrl(`/static/img/common/open_eye.svg`)" alt="">
          <img v-else v-lazy="getStaticImgUrl(`/static/img/common/close_eye.svg`)" alt="">
        </div>
      </div>
      <div class="text-[0.48rem] font-semibold text-color leading-[0.66rem]">{{
        showInfo
          ? type == "cash"
            ? parseFloat(assets.money).toLocaleString()
            : type == "futures"
              ? parseFloat(assets.futures).toLocaleString()
              : type == "stock"
                ? parseFloat(assets.stock).toLocaleString()
                : "--"
          : "********"
      }}</div>
   
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import DefaultWalletInfoContainer from "./DefaultWalletInfo/DefaultWalletInfoContainer.vue";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import store from "@/store";

const { t } = useI18n();
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  balance: {
    type: Number,
    default: 10000,
  },
  type: {
    type: String,
    default: "",
  },
});

const assets = computed(() => store.state.assets || {});

const showInfo = ref(false);

const toggleShow = () => {
  showInfo.value = !showInfo.value;
};
</script>

