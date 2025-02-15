<template>
  <div class="order_container">
    <div>
      <div
        class="order_tabs"
        @touchstart.stop=""
        @touchmove.stop=""
        @touchend.stop=""
      >
        <HeaderTabs
          type="line"
          v-model:active="activeTab"
          :tabs="[
            t('common.spot'),
            t('assets.order_title_contract'),
            t('common.option'),
            t('finance.defi_borrow'),
            t('finance.portfolio_title'),
          ]"
          @change="changeActiveTab(activeTab)"
        />
      </div>
      <div id="assets_order_center_body" ref="orderCenterRef">
        <div class="tab" v-if="activeTab == 0">
          <TradeOrderList  />
        </div>

        <div class="tab" v-if="activeTab == 1">
          <CryptoOrderList  />
        </div>

        <div class="tab" v-if="activeTab == 2">
          <AIOrderList />
        </div>

        <div class="tab" v-if="activeTab == 3">
          <PledgeOrder />
        </div>

        <div class="tab" v-if="activeTab == 4">
          <Order />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import HeaderTabs from "@/components/HeaderTabs.vue";
import TradeOrderList from "./components/TradeOrderList.vue";
import CryptoOrderList from "./components/CryptoOrderList.vue";
import Order from "@/views/Finance/components/Order.vue";
import PledgeOrder from "@/views/Finance/components/PledgeOrder.vue";
import { useI18n } from "vue-i18n";
import AIOrderList from './components/AIOrderList.vue'

const { t } = useI18n();
const activeTab = ref(0);
const changeActiveTab = (val) => {
  activeTab.value = val;
};

const orderCenterRef = ref(null);
const scrollData = useScroll(orderCenterRef, {
  throttle: 200,
  onScroll: () => { },
});
provide("scrollData", scrollData);


</script>
<style lang="less">
#assets_order_center_body{
  overflow-y: auto;
  height: calc(var(--vh) * 100 - 2.52rem);
  padding-bottom: 1rem
}
</style>
