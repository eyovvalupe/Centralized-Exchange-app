<!-- ai -->
<template>
  <div class="ai-block">
    <Tabs type="round-card" v-model:active="active" :swipeable="false" :color="'#014CFA'" shrink
      @change="onChange">
      <Tab :title="t('trade.stock_open')" name="0">
        <div class="ai-block-content" style="padding-top: 0.4rem">
          <Opening :tradeType="props.activeTab" @showNavDialog="showNavDialog" mode="page" ref="OpeningRef"
            @back="showModel = false"  v-if="loadTab.indexOf('0') > -1" />
        </div>
      </Tab>
      <Tab :title="t('trade.stock_position')" name="1">
        <div class="ai-block-content">
          <Positions  v-if="loadTab.indexOf('1') > -1" />
        </div>
      </Tab>
      <Tab :title="t('trade.ai_opening_order')" name="2">
        <Inquire ref="InquireRef"  v-if="loadTab.indexOf('2') > -1" />
      </Tab>
    </Tabs>

  </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, onMounted, computed, defineExpose, watch, nextTick } from "vue";
import Opening from "../ai/Opening.vue";
import Positions from "../ai/Positions.vue";
import Inquire from "../ai/Inquire.vue";
import store from "@/store";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();

const OpeningRef = ref();
const showModel = ref(true);

const props = defineProps({
  activeTab: {
    type: [String, Number],
    default: ''
  }
})

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

const loadTab = ref([]);
const active = ref(sessionStorage.getItem("trade_ai_tab") || "0");
const InquireRef = ref();
const onChange = async (val) => {
  if (loadTab.value.indexOf(val) == -1) {
      loadTab.value.push(val)
  }
  active.value = val;
  sessionStorage.setItem("trade_ai_tab", val);

  if (val == 2) {
    InquireRef.value && InquireRef.value.init();
  }
};

// 选择某个合约
const choose = (item) => {
  if(active.value == '0'){
    OpeningRef.value && OpeningRef.value.choose(item);
  }else{
    onChange('0')
    nextTick(()=>{
      OpeningRef.value && OpeningRef.value.choose(item);
    })
  }
};

onChange(active.value)

const handleMounted = () => {
  loadTab.value = []
  setTimeout(() => {
    onChange(active.value)
  }, 300);
};


defineExpose({
  handleMounted,
  choose
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
