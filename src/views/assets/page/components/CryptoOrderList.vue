<template>
  <div class="crypto_order_list">
    <div class="crypto_order_tabs">
      <span class="crypto_order_tab mr-[0.12rem]" :class="activeTab == 0 ? 'actived' : ''"
        @click="changeActiveTab(0)">{{ t('assets.order_current_position') }}</span>
      <span class="crypto_order_tab" :class="activeTab == 1 ? 'actived' : ''" @click="changeActiveTab(1)">{{
        t('assets.order_history') }}</span>
    </div>
    <div class="tab" v-if="activeTab == 0">
      <Positions />
    </div>
    <div class="tab" v-if="activeTab == 1">
      <Inquire ref="InquireRef" scrollDom="#assets_order_center_body" />
    </div>
  </div>
</template>
<script setup>
import Inquire from "@/views/Trade2/contract/Inquire.vue";
import Positions from "@/views/Trade2/contract/Positions.vue";
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
  padding: 0 0.32rem;

  .crypto_order_tabs {
    height: 0.78rem;
    display: flex;
    margin-top: 0.32rem;

    .crypto_order_tab {
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
