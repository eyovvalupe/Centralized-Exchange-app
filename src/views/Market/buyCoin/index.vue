<!-- 买币 -->
<template>
  <div class="page-buycoin">
    <Tabs
      v-if="!pageLoading"
      v-model:active="active"
      type="custom-card"
      :swipeable="false"
      animated
      shrink
      @change="(e) => onChange(e)"
    >
      <Tab :title="t('market.market_buy_title1')" name="0">
        <Faster />
      </Tab>
      <Tab :title="t('market.market_buy_title2')" name="1">
        <Self ref="selfRef" />
      </Tab>
      <Tab :title="t('market.market_buy_title3')" name="2">
        <List ref="listRef" />
        <template #title>
          <div class="tab_item">
            <span>{{ t("market.market_buy_title3") }}</span>
            <div v-if="store.state.c2cUnreadTotal > 0" class="nav_num">
              {{ store.state.c2cUnreadTotal }}
            </div>
          </div>
        </template>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
export default { name: "Buycoin" };
</script>

<script setup>
/* eslint-disable */
import { Tab, Tabs } from "vant";
import { ref, onMounted, onUnmounted, defineExpose } from "vue";
import { useSocket } from "@/utils/ws";
import Faster from "./Faster.vue";
import List from "./List.vue";
import Self from "./Self.vue";
import store from "@/store";
import { useBuyCoinState } from "./state";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
/* eslint-enable */
const scrollData = inject("scrollData");
const positionValue = ref("relative");
// 订阅
const buycoinScrollTop1 = useSessionStorage("buycoinScrollTop1");
const buycoinScrollTop2 = useSessionStorage("buycoinScrollTop2");
const { active, selfRef, listRef, onChange } = useBuyCoinState();

const pageLoading = ref(true);

watch(
  () => scrollData.y.value,
  (val, oldVal) => {
    if (val > 100) {
      if (val > oldVal) {
        // 向下滚动
        positionValue.value = "relative";
      } else {
        // 向上滚动
        positionValue.value = "sticky";
      }
    } else {
      positionValue.value = "relative";
    }
    switch (active.value) {
      case "1":
        buycoinScrollTop1.value = val;
        break;
      case "2":
        buycoinScrollTop2.value = val;
        break;
    }
  }
);

const handleMounted = () => {
  console.error("onMounted");
  setTimeout(() => {
    pageLoading.value = false;
  }, 300);
};
onMounted(() => {
  handleMounted();
});
onUnmounted(() => {
  buycoinScrollTop1.value = null;
  buycoinScrollTop2.value = null;
});

defineExpose({
  handleMounted,
});
</script>

<style lang="less" scoped>
.page-buycoin {
  width: 7.5rem;
  :deep( > .van-tabs > .van-tabs__wrap){
    margin: 0 0.4rem 0.32rem 0.4rem;
  }
  
}
</style>
