<template>
  <div class="wallet_container">
    <div class="flex flex-col items-center" v-if="currSelectedWallet == -1">
      <div @click="changeActiveTab(0)">
        <CashWallet :amount="assets.money" />
      </div>
      <div @click="changeActiveTab(1)">
        <StockWallet :amount="assets.stock" />
      </div>
      <div @click="changeActiveTab(2)">
        <ContractWallet :amount="assets.futures" />
      </div>
      <div @click="changeActiveTab(3)">
        <ForexWallet :amount="assets.forex" />
      </div>
      <div @click="changeActiveTab(4)">
        <TradeWallet :amount="assets.blocktrade" />
      </div>
    </div>
    <div v-if="currSelectedWallet != -1">
      <div @touchstart.stop="" @touchmove.stop="" @touchend.stop="">
        <HeaderTabs
          type="card"
          v-model:active="activeTab"
          :tabs="[
            t('assets.wallet_header_cash'),
            t('assets.wallet_header_stock'),
            t('assets.wallet_header_contract'),
          ]"
          @change="changeActiveTab(activeTab)"
        />
      </div>

      <div class="tab" v-if="currSelectedWallet == 0">
        <div class="mb-[0.8rem]">
          <DefaultWallet :name="t('assets.wallet_cash_balance')" type="cash" :balance="assets.money" />
        </div>
        <Btns />
        <Cash />
      </div>

      <div class="tab" v-if="currSelectedWallet == 1">
        <OtherWallet
          :name="t('assets.wallet_header_stock')"
          :type="t('assets.wallet_stock_balance')"
          :balance="assets.stock"
          @toggleShow="(val) => toggleShow(val)"
        />
        <div class="flex justify-between px-[0.28rem] relative top-[-1rem]">
          <div
            class="w-[2.98rem] h-[1.12rem] rounded-[0.32rem] bg-[#fff] pt-[0.2rem] flex flex-col items-center"
            style="box-shadow: 0px 4px 20px 0px #0610231a"
          >
            <span
              class="text-[0.28rem] text-[#666d80]"
              :class="showData ? 'pb-[0.16rem]' : 'pb-[0.2rem]'"
              >{{ t('assets.wallet_stock_value') }}</span
            >
            <span class="text-[0.3rem] text-[#061023] font-semibold">{{
              showData ? parseFloat(assets.stock).toLocaleString() : "********"
            }}</span>
          </div>
          <div
            class="w-[2.98rem] h-[1.12rem] rounded-[0.32rem] bg-[#fff] pt-[0.2rem] flex flex-col items-center"
            style="box-shadow: 0px 4px 20px 0px #0610231a"
          >
            <span
              class="text-[0.28rem] text-[#666d80]"
              :class="showData ? 'pb-[0.16rem]' : 'pb-[0.2rem]'"
              >{{ t('assets.wallet_order_value') }}</span
            >
            <span class="text-[0.3rem] text-[#061023] font-semibold">{{
              showData
                ? parseFloat(assets.order_value).toLocaleString()
                : "********"
            }}</span>
          </div>
        </div>
        <StockMyWallet />
      </div>

      <div class="tab" v-if="currSelectedWallet == 2">
        <OtherWallet
          :name="t('assets.wallet_header_contract')"
          :type="t('assets.wallet_contract_balance')"
          :balance="assets.futures"
          @toggleShow="(val) => toggleShow(val)"
        />
        <div class="flex justify-between px-[0.28rem] relative top-[-1rem]">
          <div
            class="w-[2.98rem] h-[1.12rem] rounded-[0.32rem] bg-[#fff] pt-[0.2rem] flex flex-col items-center"
            style="box-shadow: 0px 4px 20px 0px #0610231a"
          >
            <span
              class="text-[0.28rem] text-[#666d80]"
              :class="showData ? 'pb-[0.16rem]' : 'pb-[0.2rem]'"
              >{{ t('assets.wallet_contract_value') }}</span
            >
            <span class="text-[0.3rem] text-[#061023] font-semibold">{{
              showData
                ? parseFloat(assets.futures).toLocaleString()
                : "********"
            }}</span>
          </div>
          <div
            class="w-[2.98rem] h-[1.12rem] rounded-[0.32rem] bg-[#fff] pt-[0.2rem] flex flex-col items-center"
            style="box-shadow: 0px 4px 20px 0px #0610231a"
          >
            <span
              class="text-[0.28rem] text-[#666d80]"
              :class="showData ? 'pb-[0.16rem]' : 'pb-[0.2rem]'"
              >{{ t('assets.wallet_order_value') }}</span
            >
            <span class="text-[0.3rem] text-[#061023] font-semibold">{{
              showData
                ? parseFloat(assets.order_value).toLocaleString()
                : "********"
            }}</span>
          </div>
        </div>
        <CryptoWallet />
      </div>

      <!-- <div class="tab" v-if="currSelectedWallet == 3">
        <DefaultWallet :name="t('assets.wallet_header_forex')" :type="t('assets.wallet_forex_value')" :balance="assets.forex" />
        <Btns />
        <ForexMyWallet />
      </div>

      <div class="tab" v-if="currSelectedWallet == 4">
      </div> -->
    </div>

    <!-- <div>
      <Contract />
      <AI />
      <IPO />
      <Stock />
    </div> -->
  </div>
</template>
<script setup>
import CashWallet from "./components/CashWallet.vue";
import StockWallet from "./components/StockWallet.vue";
import ContractWallet from "./components/ContractWallet.vue";
import ForexWallet from "./components/ForexWallet.vue";
import TradeWallet from "./components/TradeWallet.vue";
import { ref, onMounted, computed, watch } from "vue";
import DefaultWallet from "./components/DefaultWallet.vue";
import Btns from "./components/Btns.vue";
import Cash from "./Cash.vue";
import OtherWallet from "./components/OtherWallet.vue";
import store from "@/store";
import StockMyWallet from "./StockWallet.vue";
import CryptoWallet from "./CryptoWallet.vue";
import ForexMyWallet from "./ForexWallet.vue";
import HeaderTabs from "@/components/HeaderTabs.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const activeTab = ref(store.state.currSelectedWallet);
const changeActiveTab = (val) => {
  showData.value = false;
  activeTab.value = val;
  store.commit("setCurrSelectedWallet", val);
  store.dispatch("updateWallet",val);
  store.dispatch("updateAssets");
};
// 刷新总资产
const assets = computed(() => store.state.assets || {});
const token = computed(() => store.state.token || "");
const currSelectedWallet = computed(() => store.state.currSelectedWallet);
const showData = ref(false);
const toggleShow = (val) => {
  showData.value = val;
};

const getAssets = () => {
  if (!token.value) return;
  store.dispatch("updateAssets");
  store.dispatch("updateWallet");
};

const refresh = () => {
  getAssets();
};

defineExpose({
  refresh,
});

watch(
  () => store.state.currSelectedWallet,
  (val) => {
    if (store.state.currSelectedWallet != activeTab.value) {
      changeActiveTab(val);
    }
  }
);
const jump = (name, check = false, query) => {
  router.push({
    name,
    query,
  });
};
onMounted(() => {
  store.dispatch('updateAssets');
  store.dispatch('updateWallet');
})
</script>
<style lang="less">
.wallet_container {
  width: 100%;
  padding: 0.32rem;

  .tab {
    .btns {
      padding: 0;
    }

    .tabs {
      padding: 0 !important;
    }
  }
}
</style>
