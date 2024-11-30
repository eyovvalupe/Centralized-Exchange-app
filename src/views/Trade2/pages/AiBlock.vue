<!-- ai -->
<template>
  <div class="ai-block">
    <Tabs
      v-if="!pageLoading"
      type="round-card"
      v-model:active="active"
      :swipeable="false"
      animated
      :color="'#014CFA'"
      shrink
      @change="onChange"
    >
      <Tab :title="t('trade.stock_open')" name="0">
        <div class="ai-block-content" style="padding-top: 0.4rem">
          <Opening
            @showNavDialog="showNavDialog"
            mode="page"
            ref="OpeningRef"
            @back="showModel = false"
            @success="onChange('1')"
          />
          <!-- <Ai @clickItems="clickItem"></Ai> -->
        </div>
      </Tab>
      <Tab :title="t('trade.stock_position')" name="1">
        <div class="ai-block-content">
          <Positions />
        </div>
      </Tab>
      <Tab :title="t('trade.ai_opening_order')" name="2">
        <Inquire ref="InquireRef" />
      </Tab>
    </Tabs>
    <div style="height: 50vh" v-else></div>

    <!-- 下单弹窗 -->
    <Popup
      teleport="body"
      v-model:show="showModel"
      position="right"
      style="width: 100%; height: 100%"
    >
      <Opening
        @showNavDialog="showNavDialog"
        ref="OpeningRef"
        @back="showModel = false"
      />
    </Popup>
  </div>
</template>

<script setup>
import { Tab, Tabs, Popup } from "vant";
import { ref, onMounted, computed, defineExpose, watch } from "vue";
import Opening from "../ai/Opening.vue";
import Positions from "../ai/Positions.vue";
import Inquire from "../ai/Inquire.vue";
import store from "@/store";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();

const OpeningRef = ref();
const showModel = ref(false);

watch(
  () => route.query.symbol,
  () => {
    if (route.query.symbol) {
      OpeningRef.value && OpeningRef.value.init();
    }
  }
);

const emits = defineEmits(["showNavDialog"]);
const showNavDialog = () => {
  emits("showNavDialog", "ai");
};

const active = ref(sessionStorage.getItem("trade_ai_tab") || "0");
const InquireRef = ref();
const onChange = async (val) => {
  active.value = val;
  sessionStorage.setItem("trade_ai_tab", val);

  if (val == 2) {
    InquireRef.value && InquireRef.value.init();
  }
};

const pageLoading = ref(true);
const handleMounted = () => {
  active.value = "0";
  setTimeout(() => {
    pageLoading.value = false;
  }, 300);
};
onMounted(() => {
  handleMounted();
});

defineExpose({
  handleMounted,
});
</script>

<style lang="less" scoped>
.ai-block {
  padding: 0.24rem 0.32rem 0.32rem;

  .ai-block-content {
    width: calc(100% - 1px);
    .ai-block-title {
      padding: 0 0.32rem;
      font-weight: 600;
    }
  }

  .tabs {
    :deep(.van-tabs__nav) {
      padding-left: 0.32rem;
    }

    :deep(.van-tabs__nav) {
      position: relative;

      &::after {
        content: "";
        width: 100%;
        height: 1px;
        background-color: #3b82f6;
        position: absolute;
        bottom: 16px;
        left: 0;
        opacity: 0.3;
      }
    }
  }
}

.type_tabs {
  width: 3.5rem;
  height: 0.68rem;
  display: flex;
  align-items: center;
  z-index: 99;
  margin-top: 0.32rem;
  border: 1px solid #d0d8e2;
  border-radius: 0.6rem;

  .type_tab {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666d80;
    font-size: 0.3rem;
  }

  .type_tab_text {
    position: relative;
    z-index: 1;
  }

  .active_type_tab {
    color: #fff;
    position: relative;

    &::after {
      content: "";
      width: calc(100% + 1px);
      height: calc(100% + 1px);
      background-color: #014cfa;
      position: absolute;
      left: 0;
      top: -1px;
      border-radius: 0.6rem;
    }
  }

  .type_tab:first-child.active_type_tab {
    left: -1px;
  }

  .type_tab:last-child.active_type_tab {
    right: -1px;
  }
}
</style>
