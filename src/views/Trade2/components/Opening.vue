<!-- 开仓 -->
<template>
  <div class="opening">
    <!-- Tabs -->
    <div class="open_tab_box">
      <div class="type_tabs">
        <div @click="activeType = 1" class="type_tab tab_ani" :class="{ active_type_tab: activeType == 1 }">
          <span class="type_tab_text">{{ t('trade.stock_open_long_tab') }}</span>
        </div>
        <div @click="activeType = 2" class="type_tab tab_ani" :class="{ active_type_tab: activeType == 2 }">
          <span class="type_tab_text">{{ t('trade.stock_open_short_tab') }}</span>
        </div>
      </div>

      <Tabs key="form" class="van-tabs--sub" animated @change="(e) => (activeTab = e)" v-model="activeTab" :swipeable="false"
        :color="'var(--ex-primary-color)'" shrink>
        <Tab :title="t('trade.stock_market_price')" name="0">
          <OpeningForm :tradeType="props.tradeType" @showNavDialog="showNavDialog" @success="onSuccess"
            v-if="activeTab == 0" ref="OpeningForm0Ref" :key="0" :activeTab="activeTab" :activeType="activeType" />
        </Tab>
        <Tab :title="t('trade.stock_limit_price')" name="1">
          <OpeningForm :tradeType="props.tradeType" @showNavDialog="showNavDialog" @success="onSuccess"
            v-if="activeTab == 1" ref="OpeningForm1Ref" :key="1" :activeTab="activeTab" :activeType="activeType" />
        </Tab>
        <Tab :title="t('trade.stock_take_stop')" name="2">
          <OpeningForm :tradeType="props.tradeType" @showNavDialog="showNavDialog" @success="onSuccess"
            v-if="activeTab == 2" ref="OpeningForm2Ref" :key="2" :activeTab="activeTab" :activeType="activeType" />
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Tab, Tabs, ActionSheet } from "vant";
import { _search, _basic, _stocksPara, _stocksBuy } from "@/api/api";
import { useRoute } from "vue-router";
import OpeningForm from "./OpeningForm.vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  tradeType: {
    type: [String, Number],
    default: ''
  }
})

const { t } = useI18n();
const emits = defineEmits(["showNavDialog", "success"]);
const showNavDialog = () => {
  emits("showNavDialog");
};

const route = useRoute();
const OpeningForm0Ref = ref();
const OpeningForm1Ref = ref();
const OpeningForm2Ref = ref();

const activeType = ref(1); // 1-买涨 2-买跌
// url参数处理
if (route.query.symbol) {
  activeType.value = route.query.type || 1;
}
const activeTab = ref(0); // 0-市价 1-限价 2-止盈止损


// 选择某个股票
const choose = (item) => {
  OpeningForm0Ref.value && OpeningForm0Ref.value.choose(item);
  OpeningForm1Ref.value && OpeningForm1Ref.value.choose(item);
  OpeningForm2Ref.value && OpeningForm2Ref.value.choose(item);
};

const onSuccess = () => {
  emits("success");
};

defineExpose({
  choose,
});
</script>

<style lang="less" scoped>
.opening {
  padding: 0.32rem 0;

  .open_tab_box {
    padding: 0 0.4rem;

    .van-tabs--sub {
      width: 100%;
    }

    .type_tabs {
      height: 0.96rem;
      display: flex;
      align-items: center;
      z-index: 99;
      border-radius: 1rem;
      background-color: var(--ex-bg-color3);
      padding: 0 0.1rem;

      .type_tab {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ex-text-color2);
        font-size: 0.3rem;

      }

      .type_tab_text {
        position: relative;
        z-index: 1;
      }

      .active_type_tab {
        color: var(--ex-text-color--bg-primary);
        position: relative;
        height: 0.8rem;
        background-color: var(--ex-primary-color);
        border-radius: 1rem;

        &:nth-child(2) {
          background-color: var(--ex-down-color);
        }
      }
    }

  }
}
</style>
