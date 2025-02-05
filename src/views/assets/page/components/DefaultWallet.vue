<template>
  <div class="relative w-full pt-[0.6rem] mb-[0.5rem] rounded-[0.32rem]">
    <div class="flex flex-col  z-[3] px-[0.4rem] mb-[0.4rem]">
      <div class="flex">
        <span class="text-[0.3rem] text-color2 mb-[0.24rem] mr-[0.1rem]" style="width: max-content">{{ name
          }}</span><span class="flex items-end text-[0.24rem] text-color2 mb-[0.24rem] mr-[0.1rem]"
          style="width: max-content">(USDT)</span>
        <div @click.stop="toggleShow" style="width: 0.4rem;height: 0.4rem;">
          <img v-if="showInfo" v-lazy="getStaticImgUrl(`/static/img/common/open_eye.svg`)" alt="">
          <img v-else v-lazy="getStaticImgUrl(`/static/img/common/close_eye.svg`)" alt="">
        </div>
      </div>
      <span class="text-[0.52rem] font-semibold text-color h-[0.52rem]" :class="showInfo ? '' : 'pt-[0.1rem]'">{{
        showInfo
          ? type == "cash"
            ? parseFloat(assets.money).toLocaleString()
            : type == "futures"
              ? parseFloat(assets.futures).toLocaleString()
              : type == "stock"
                ? parseFloat(assets.stock).toLocaleString()
                : "--"
          : "********"
      }}</span>
    </div>
    <div class="flex w-full gap-[0.32rem] px-[0.4rem] justify-between">
      <div
        class="flex-1 h-[1.12rem] rounded-[0.32rem] bg-color3 flex flex-col justify-between items-center py-[0.2rem] wallet_money_item">
        <div class="text-[0.28rem] text-color2">{{ type == 'cash' ? t('assets.wallet_available') : type == 'stock' ?
          t('assets.wallet_stock_value') : t('assets.wallet_contract_value') }}</div>
        <div class="text-[0.3rem] text-color font-semibold pt-[0.25rem]">
          {{
            showInfo
              ? type == "cash"
                ? assets.money
                : type == "futures"
                  ? assets.futures
                  : type == "stock"
                    ? assets.stock
                    : "--"
              : "********"
          }}
        </div>
      </div>
      <!-- <div
        class="flex-1 h-[1.12rem] rounded-[0.32rem] bg-color3 flex flex-col justify-between items-center py-[0.2rem] wallet_money_item">
        <div class="text-[0.28rem] text-color2">{{ type == 'cash' ? t('assets.wallet_blocked') :
          t('assets.wallet_order_value') }}</div>
        <div class="text-[0.3rem] text-color font-semibold pt-[0.25rem]">
          {{ showInfo ? type == 'cash' ? '0' : assets.order_value : "********" }}
        </div>
      </div> -->
    </div>
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

