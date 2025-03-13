<template>
  <div class="stock_order_list">
    <div class="stock_order_tabs">
      <span
        class="stock_order_tab mr-[0.6rem]"
        :class="activeTab == 0 ? 'actived' : ''"
        @click="changeActiveTab(0)"
        >{{ t('assets.order_current_position') }}</span
      >
      <span
        class="stock_order_tab"
        :class="activeTab == 1 ? 'actived' : ''"
        @click="changeActiveTab(1)"
        >{{ t('assets.order_history') }}</span
      >
    </div>
    <div
      class="tab"
      v-if="activeTab == 0"
      :class="
        from == 'trade'
          ? 'h-[11.8rem] overflow-auto'
          : from == 'order'
          ? 'h-[12rem] pb-[1.2rem] overflow-auto'
          : ''
      "
    >
      <Positions />
    </div>
    <div
      class="tab"
      v-if="activeTab == 1"
      :class="
        from == 'trade'
          ? 'h-[11.8rem] overflow-auto'
          : from == 'order'
          ? 'h-[12rem] pb-[1.2rem] overflow-auto'
          : ''
      "
    >
      <Inquire ref="InquireRef" scrollDom="#assets_order_center_body" />
    </div>
  </div>
</template>
<script setup>
  import Inquire from '@/views/Trade2/components/Inquire.vue';
  import Positions from '@/views/Trade2/components/Positions.vue';
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  const props = defineProps({
    from: {
      type: String,
      default: '',
    },
  });

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
  .stock_order_list {
    .stock_order_tabs {
      width: 100%;
      height: 0.52rem;
      border-bottom: 0.02rem solid var(--ex-bg-white2);

      .stock_order_tab {
        font-size: 0.32rem;
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
