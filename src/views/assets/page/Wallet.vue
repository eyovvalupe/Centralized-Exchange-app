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
        <HeaderTabs type="card" v-model:active="activeTab" :tabs="[
          t('assets.wallet_header_cash'),
          t('assets.wallet_header_stock'),
          t('assets.wallet_header_contract'),
        ]" @change="changeActiveTab(activeTab)" />
      </div>

      <div class="tab" v-if="currSelectedWallet == 0">
        <div class="mb-[0.8rem]">
          <DefaultWallet :name="t('assets.wallet_cash_balance')" type="cash" />
        </div>
        <Btns />
        <Cash @click="(val) => click(val)" />
      </div>

      <div class="tab" v-if="currSelectedWallet == 1">
        <div class="mb-[0.8rem]">
          <DefaultWallet :name="t('assets.wallet_stock_balance')" type="stock" />
        </div>
        <Btns />
        <StockMyWallet @click="(val) => click(val)" />
      </div>

      <div class="tab" v-if="currSelectedWallet == 2">
        <div class="mb-[0.8rem]">
          <DefaultWallet :name="t('assets.wallet_contract_balance')" type="futures" />
        </div>
        <Btns />
        <CryptoWallet @click="(val) => click(val)" />
      </div>
    </div>
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

const emits = defineEmits(['click'])

const { t } = useI18n();
const activeTab = ref(store.state.currSelectedWallet);
const changeActiveTab = (val) => {
  showData.value = false;
  activeTab.value = val;
  store.commit("setCurrSelectedWallet", val);
  store.dispatch("updateWallet", val);
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

const click = (val) => {
  emits('click', val)
}

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
