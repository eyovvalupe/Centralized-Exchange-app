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
            t('assets.order_title_buy'),
            t('assets.order_title_stock'),
            t('assets.order_title_contract'),
            t('assets.order_title_bot'),
            t('assets.order_title_ipo'),
          ]"
          @change="changeActiveTab(activeTab)"
        />
      </div>

      <div class="tab" v-if="activeTab == 0">
        <List :from="'orderCenter'" />
      </div>

      <div class="tab" v-if="activeTab == 1">
        <StockOrderList />
      </div>

      <div class="tab" v-if="activeTab == 2">
        <CryptoOrderList />
      </div>

      <div class="tab" v-if="activeTab == 3">
        <AIOrderList />
      </div>

      <div class="tab" v-if="activeTab == 4">
        <IPOStock ref="IPOStockRef" :from="'assets'" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import HeaderTabs from "@/components/HeaderTabs.vue";
import CashOrderList from "./components/CashOrderList.vue";
import StockOrderList from "./components/StockOrderList.vue";
import CryptoOrderList from "./components/CryptoOrderList.vue";
import IPOStock from "@/views/Trade2/pages/IPOStock.vue";
import AIOrderList from "./components/AIOrderList.vue";
import List from "@/views/Market/buyCoin/List.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const activeTab = ref(0);
const IPOStockRef = ref();
const changeActiveTab = (val) => {
  activeTab.value = val;
  if (val == 4) {
    setTimeout(() => {
      IPOStockRef.value && IPOStockRef.value.init();
    }, 0);
  }
};
</script>
<style lang="less">
.order_container {
  width: 100%;
  padding: 0.32rem;

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
