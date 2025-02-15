<template>
  <div class="trade_order_list">
    <div class="trade_order_tabs">
      <span
        class="trade_order_tab mr-[0.12rem]"
        :class="activeTab == 0 ? 'actived' : ''"
        @click="changeActiveTab(0)"
        >{{ t('trade.trade_orders_current') }}</span
      >
      <span
        class="trade_order_tab"
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
.trade_order_list {
  padding: 0 0.32rem;
  .trade_order_tabs {
    height: 0.78rem;
    display: flex;
    margin-top:0.32rem;
    .trade_order_tab {
      font-size: 0.3rem;
      color: var(--ex-text-color2);
      background-color: var(--ex-bg-white2);
      height: 0.78rem;
      padding: 0 0.32rem;
      display: flex;
      align-items: center;
      border-radius: 0.6rem;
    }

    .actived {
      background-color: var(--ex-white);
      font-weight: 600;
      color: var(--ex-black);
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
