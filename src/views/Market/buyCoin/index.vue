<!-- 买币 -->
<template>
  <div class="page-buycoin">
    <Tabs
      v-if="!pageLoading"
      v-model:active="active"
      type="custom-card-stake"
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
        <div style="height:calc(var(--vh) * 100 - 3.24rem); overflow-y:auto;">
          <List />
        </div>
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
import { ref, onMounted, onUnmounted } from "vue";
import Faster from "./Faster.vue";
import List from "./List.vue";
import Self from "./Self.vue";
import store from "@/store";
import { useBuyCoinState } from "./state";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// 订阅
const { active, selfRef, listRef, onChange } = useBuyCoinState();

const pageLoading = ref(true);

const handleMounted = () => {
  console.error("onMounted");
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
.page-buycoin {
  width: 7.5rem;
  padding-top: 0.24rem;
}
</style>
