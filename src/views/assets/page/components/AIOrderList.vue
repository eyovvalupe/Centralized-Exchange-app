<template>
  <div class="ai_order_list">
    <div class="ai_order_tabs">
      <span
        class="ai_order_tab mr-[0.6rem]"
        :class="activeTab == 0 ? 'actived' : ''"
        @click="changeActiveTab(0)"
        >{{ t("assets.order_current_position") }}</span
      >
      <span
        class="ai_order_tab"
        :class="activeTab == 1 ? 'actived' : ''"
        @click="changeActiveTab(1)"
        >{{ t("assets.order_history") }}</span
      >
    </div>
    <div class="tab" v-if="activeTab == 0">
      <Positions />
    </div>
    <div class="tab" v-if="activeTab == 1">
      <Inquire ref="InquireRef" />
    </div>
  </div>
</template>
<script setup>
import Inquire from "@/views/Trade2/ai/Inquire.vue";
import Positions from "@/views/Trade2/ai/Positions.vue";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const activeTab = ref(0);
const InquireRef = ref();
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
.ai_order_list {
  .ai_order_tabs {
    width: 100%;
    height: 0.52rem;
    border-bottom: 0.02rem solid var(--ex-border-color);

    .ai_order_tab {
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
