<template>
  <div class="relative w-[6.86rem] h-[3.04rem] pt-[0.16rem] mt-[0.32rem] mb-[0.32rem] rounded-[0.32rem]">
    <DefaultWalletInfoContainer />
    <!-- <span class="text-[0.32rem] text-color--bg-primary">{{ name }}</span> -->
    <div class="flex flex-col px-[0.4rem] h-[1.16rem] z-[3] mt-[0.64rem] ml-[0.12rem] mb-[0.4rem]">
      <div class="flex">
        <span class="text-[0.3rem] text-color2 mb-[0.24rem] mr-[0.1rem]" style="width: max-content">{{ name
          }}</span><span class="flex items-end text-[0.24rem] text-color2 mb-[0.24rem] mr-[0.1rem]"
          style="width: max-content">(USDT)</span>
        <div @click.stop="toggleShow" style="width: 0.4rem;height: 0.4rem;">
          <img v-if="showInfo" :src="getStaticImgUrl(`/static/img/common/open_eye.svg`)" alt="">
          <img v-else :src="getStaticImgUrl(`/static/img/common/close_eye.svg`)" alt="">
        </div>
      </div>
      <span class="text-[0.52rem] text-color font-semibold">{{
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
    <div class="flex w-full px-[0.28rem] justify-between">
      <div
        class="w-[3rem] h-[1.12rem] rounded-[0.32rem] bg-color flex flex-col justify-between items-center py-[0.2rem] wallet_money_item">
        <div class="text-[0.28rem] text-color2">{{ type == 'cash' ? t('assets.wallet_available') : type == 'stock' ?
          t('assets.wallet_stock_value') : t('assets.wallet_contract_value') }}</div>
        <div class="text-[0.3rem] text-color font-semibold">
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
      <div
        class="w-[3rem] h-[1.12rem] rounded-[0.32rem] bg-color flex flex-col justify-between items-center py-[0.2rem] wallet_money_item">
        <div class="text-[0.28rem] text-color2">{{ type == 'cash' ? t('assets.wallet_blocked') :
          t('assets.wallet_order_value') }}</div>
        <div class="text-[0.3rem] text-color font-semibold">
          {{ showInfo ? type == 'cash' ? '0' : assets.order_value : "********" }}
        </div>
      </div>
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

<style lang="less" scoped>
.wallet_money_item {
  box-shadow: 0px 4px 20px 0px rgb(var(--ex-text-color-rgb) / 0.1);
}
</style>