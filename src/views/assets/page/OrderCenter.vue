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
            // t('assets.order_title_buy'),
            t('assets.order_title_contract'),
            t('copy.title'),
            t('finance.defi_borrow'),
            t('finance.portfolio_title'),
          ]"
          @change="changeActiveTab(activeTab)"
        />
      </div>

      <!-- <div class="tab" v-if="activeTab == 0">
        <List :from="'orderCenter'" />
      </div> -->

      <div class="tab" v-if="activeTab == 0">
        <CryptoOrderList  />
      </div>

      <div class="tab" v-if="activeTab == 1">
        <!-- <CryptoOrderList  /> -->
      </div>

      <div class="tab" v-if="activeTab == 2">
        <PledgeOrder />
      </div>

      <div class="tab" v-if="activeTab == 3">
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

const { t } = useI18n();
const activeTab = ref(0);
const IPOStockRef = ref();
const changeActiveTab = (val) => {
  activeTab.value = val;
  if (val == 3) {
    setTimeout(() => {
      IPOStockRef.value && IPOStockRef.value.init();
    }, 0);
  }
};
</script>
<style lang="less">
.order_container {
  width: 100%;
  padding: 0.6rem 0.32rem 0 0.32rem;

  .order_tabs {
    padding-bottom: 0.4rem;
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
