<!-- 开仓 -->
<template>
  <div class="opening">
    <div class="type_tabs" v-if="props.from != 'trade'">
      <div :style="{backgroundImage: `url(${activeType == 1 ? getStaticImgUrl('/static/img/trade/up2.svg') : getStaticImgUrl('/static/img/trade/up1.svg')})`}" @click="activeType = 1" class="type_tab tab_ani" :class="{ active_type_tab: activeType == 1 }">
        {{ t("trade.stock_open_long_tab") }}
      </div>
      <div :style="{backgroundImage: `url(${activeType == 2 ? getStaticImgUrl('/static/img/trade/down2.svg') : getStaticImgUrl('/static/img/trade/down1.svg')})`}" @click="activeType = 2" class="type_tab tab_ani" :class="{ active_type_tab: activeType == 2 }">
        {{ t("trade.stock_open_short_tab") }}
      </div>
    </div>

    <!-- Tabs -->
    <div class="open_tab_box" :class="{'trade-dialog': props.from == 'trade'}">
      <Tabs animated key="form" type="line-card" @change="(e) => (activeTab = e)" v-model="activeTab" :swipeable="false"
        :color="'var(--ex-primary-color)'" shrink>
        <Tab :title="t('trade.stock_market_price')" name="0">
          <OpeningForm :tradeType="props.tradeType" :mode="props.mode" @showNavDialog="showNavDialog"
            v-if="activeTab == 0" ref="OpeningForm0Ref" :key="0" :activeTab="activeTab" :activeType="activeType"
            @success="emits('success')" />
        </Tab>
        <Tab :title="t('trade.stock_limit_price')" name="1">
          <OpeningForm :tradeType="props.tradeType" :mode="props.mode" @showNavDialog="showNavDialog"
            v-if="activeTab == 1" ref="OpeningForm1Ref" :key="1" :activeTab="activeTab" :activeType="activeType"
            @success="emits('success')" />
        </Tab>
        <Tab :title="t('trade.stock_take_stop')" name="2">
          <OpeningForm :tradeType="props.tradeType" :mode="props.mode" @showNavDialog="showNavDialog"
            v-if="activeTab == 2" ref="OpeningForm2Ref" :key="2" :activeTab="activeTab" :activeType="activeType"
            @success="emits('success')" />
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Tab, Tabs } from "vant";
import { _search, _basic, _stocksPara, _stocksBuy } from "@/api/api";
import { useRoute } from "vue-router";
import OpeningForm from "./OpeningForm.vue";
import { useI18n } from "vue-i18n";
import { getStaticImgUrl } from "@/utils/index.js"

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  mode: { // constract-加密货币 foreign-外汇 commodities-大宗交易
    type: String,
    default: 'constract'
  },
  tradeType: {
    type: [String, Number],
    default: ''
  },
  from: ''
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
const choose = (item, key) => {
  if (key) {
    activeType.value = 1
  } else {
    activeType.value = 2
  }
  OpeningForm0Ref.value && OpeningForm0Ref.value.choose(item);
  OpeningForm1Ref.value && OpeningForm1Ref.value.choose(item);
  OpeningForm2Ref.value && OpeningForm2Ref.value.choose(item);
};

defineExpose({
  choose,
});
</script>

<style lang="less" scoped>
.opening {
  padding: 0.32rem 0;
  position: relative;

  .open_tab_box {
    border-radius: 0 0 0.32rem 0.32rem;
  }

  .type_tabs {
    display: flex;
    align-items: center;
    height: 0.8rem;
    z-index: 99;
    position: absolute;
    left: 0;

    .type_tab {
      width: 1.36rem;
      height: 0.68rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ex-text-color2);
      font-size: 0.3rem;
      background-size: 100% 100%;
    }

    .active_type_tab {
      color: var(--ex-white);
    }
  }


  :deep(.van-tabs--line-card) {
    .van-tabs__wrap {
      padding-left: 2.6rem;
      .van-tabs__nav {
        display: flex;
        justify-content:space-between;
      }
    }
  }

  .trade-dialog {
    :deep(.van-tabs--line-card) {
    .van-tabs__wrap {
      padding: 0 0.6rem;
    }
  }
  }
}
</style>
