<template>
  <div class="crypto_order_list">
    <div class="crypto_order_tabs">
      <span
        class="crypto_order_tab mr-[0.6rem]"
        :class="activeTab == 0 ? 'actived' : ''"
        @click="changeActiveTab(0)"
        >{{ t('trade.trade_orders_current') }}</span
      >
      <span
        class="crypto_order_tab"
        :class="activeTab == 1 ? 'actived' : ''"
        @click="changeActiveTab(1)"
        >{{ t('trade.trade_order_history') }}</span
      >
    </div>
    <div class="tab" v-if="activeTab == 0">
      <Positions :type="'constract'" />
    </div>
    <div class="tab" v-if="activeTab == 1">
      <Inquire ref="InquireRef" :type="'constract'" scrollDom="#assets_order_center_body" />
    </div>
  </div>
</template>
<script setup>
import Positions from "@/views/Trade2/spot/Positions.vue";
import Inquire from "@/views/Trade2/spot/Inquire.vue";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const InquireRef = ref();
const activeTab = ref(0);
const changeActiveTab = (val) => {
  activeTab.value = val;
  if (val == 1) {
    setTimeout(() => {
      InquireRef.value && InquireRef.value.init();
    }, 0);
  }
};
</script>
<style lang="less">
.crypto_order_list {
  .crypto_order_tabs {
    width: 100%;
    height: 0.52rem;
    border-bottom: 0.02rem solid var(--ex-border-color);

    .crypto_order_tab {
      font-size: 0.24rem;
      color: var(--ex-text-color2);
    }

    .actived {
      font-size: 0.32rem;
      font-weight: 600;
      color: var(--ex-text-color);
    }
  }

  .tab {
    .positions {
      padding: 0;
    }
    .inquire {
      padding: 0;
    }
  }
}
</style>
