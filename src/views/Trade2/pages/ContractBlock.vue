<!-- 合约 -->
<template>
  <div class="stock_block">
    <Tabs type="custom-line" v-model:active="active" :swipeable="false" :color="'var(--ex-primary-color)'" shrink
      @change="onChange">
      <Tab :title="t('trade.stock_open')" name="0">
        <div class="stock_tab-body">
          <Opening :tradeType="props.activeTab" :mode="props.mode" :type="'constract'" v-if="loadTab.indexOf('0') > -1"
            @showNavDialog="showNavDialog" @success="openSuccess" ref="OpeningRef" />
        </div>
      </Tab>
      <Tab :title="t('trade.stock_position')" name="1">
        <div class="stock_tab-body">
          <Positions :type="'constract'" v-if="loadTab.indexOf('1') > -1" />
        </div>
      </Tab>
      <Tab :title="t('trade.trade_order_history')" name="2">
        <div class="stock_tab-body">
          <Inquire :type="'constract'" v-if="loadTab.indexOf('2') > -1" ref="InquireRef" />
        </div>
      </Tab>
    </Tabs>


  </div>
</template>

<script setup>

import { Tab, Tabs } from "vant";
import { ref, onMounted, nextTick } from "vue";
import Opening from "../contract/Opening.vue";
import Positions from "../contract/Positions.vue";
import Inquire from "../contract/Inquire.vue";
import eventBus from "@/utils/eventBus";
import { useI18n } from "vue-i18n";

const props = defineProps({
  mode: { // constract-加密货币 foreign-外汇 commodities-大宗交易
    type: String,
    default: 'constract'
  },
  activeTab: {
    type: [String, Number],
    default: ''
  }
})

const { t } = useI18n();
const emits = defineEmits(["showNavDialog"]);
const showNavDialog = () => {
  emits("showNavDialog", "contract");
};


const loadTab = ref([]);
const active = ref(sessionStorage.getItem("trade_contract_tab") || "0");
const InquireRef = ref();
const onChange = async (val) => {
  active.value = val;
  if (loadTab.value.indexOf(val) == -1) {
    loadTab.value.push(val);
  }
  sessionStorage.setItem("trade_contract_tab", val);

  if (val == 2) {
    nextTick(() => {
      InquireRef.value && InquireRef.value.init();
    });
  }
};

const OpeningRef = ref();

// 选择某个合约
const choose = (item) => {
  if (active.value == '0') {
    OpeningRef.value && OpeningRef.value.choose(item);
  } else {
    onChange("0");
    nextTick(() => {
      OpeningRef.value && OpeningRef.value.choose(item);
    })
  }
};
const openSuccess = () => {
  //开仓成功，切换到持仓
  onChange("1");
};

onChange(active.value)

const handleMounted = () => {
  loadTab.value = []
  setTimeout(() => {
    onChange(active.value);
  }, 300);
};
onMounted(() => {

  eventBus.on("contractTradeBodyScrollToBottom", () => {
    if (active.value == "2") {
      // 加载更多
      InquireRef.value && InquireRef.value.getList();
    }
  });
});
onUnmounted(() => {
  eventBus.off("contractTradeBodyScrollToBottom");
});

defineExpose({
  choose,
  handleMounted,
});
</script>

<style lang="less" scoped>
.stock_block {
  position: relative;
  padding: 0 0 0.32rem 0;

  :deep(.van-tabs__nav) {
    padding: 0 0.12rem;
  }

  .stock_tab-body {
    padding: 0 0.32rem;
  }
}
</style>
