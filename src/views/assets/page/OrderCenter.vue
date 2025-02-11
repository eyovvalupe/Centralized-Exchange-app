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
          type="card"
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

      <div class="tab" v-if="activeTab == 0">
      </div>

      <div class="tab" v-if="activeTab == 1">
        <div class="h-[0.32rem]"></div>
        <CryptoOrderList  />
      </div>

      <div class="tab" v-if="activeTab == 2">
        <div class="h-[0.32rem]"></div>
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
</template>
<script setup>
import { ref } from "vue";
import HeaderTabs from "@/components/HeaderTabs.vue";
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
</script>
<style lang="less">
.order_container {
  width: 100%;
  padding: 0.32rem 0.32rem 0 0.32rem;

  .order_tabs {
  }

  .tab {
    .page_ipo_stock {
      padding: 0;
    }

    .btns {
      padding: 0;
    }

    .tabs {
      padding: 0 !important;
    }
  }
}
</style>
