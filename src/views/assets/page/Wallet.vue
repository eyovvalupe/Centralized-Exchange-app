<template>
  <div class="wallet_container">
    <Tabs v-model:active="activeTab" type="custom-card" :swipeable="false" animated shrink
      @change="(e) => changeActiveTab(e)">
      <Tab :title="t('assets.wallet_header_cash')" name="0">
        <DefaultWallet :name="t('assets.wallet_cash_balance')" type="cash" />
        <Btns />
        <Cash @click="(val) => click(val)" />
      </Tab>
      <Tab :title="t('assets.wallet_header_stock')" name="1">
        <DefaultWallet :name="t('assets.wallet_stock_balance')" type="stock" />
        <Btns />
        <StockMyWallet @click="(val) => click(val)" />
      </Tab>
      <Tab :title="t('assets.wallet_header_contract')" name="2">
        <DefaultWallet :name="t('assets.wallet_contract_balance')" type="futures" />
        <Btns />
        <CryptoWallet @click="(val) => click(val)" />
      </Tab>
    </Tabs>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from "vue";
import DefaultWallet from "./components/DefaultWallet.vue";
import Btns from "./components/Btns.vue";
import Cash from "./Cash.vue";
import store from "@/store";
import StockMyWallet from "./StockWallet.vue";
import CryptoWallet from "./CryptoWallet.vue";
import HeaderTabs from "@/components/HeaderTabs.vue";
import { useI18n } from "vue-i18n";
import { Tabs, Tab } from "vant";

const emits = defineEmits(['click'])

const { t } = useI18n();
const currSelectedWallet = computed(() => store.state.currSelectedWallet);
const activeTab = ref(currSelectedWallet.value);
console.log(currSelectedWallet.value)

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
  currSelectedWallet,
  (val) => {
    if (currSelectedWallet.value != activeTab.value) {
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

<style lang="less" scoped>
.wallet_container {
  width: 7.5rem;

  :deep(> .van-tabs > .van-tabs__wrap) {
    margin: 0 0.4rem 0.32rem 0.4rem;
  }

}
</style>
