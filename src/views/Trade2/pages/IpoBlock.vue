<!-- ipo相关 -->
<template>
  <Tabs
    class="tabs"
    @change="ipoOnChange"
    v-model:active="ipoActive"
    :swipeable="false"
    type="oval-card"
    shrink
  >
    <Tab :title="'IPO'" class="optional">
      <IPO v-if="ipoActive == 0" :type="'trade'" ref="IPORef" />
    </Tab>
    <Tab :title="t('trade.ipo_title')">
      <IPOStock v-if="ipoActive == 1" ref="IPOStockRef" />
    </Tab>
  </Tabs>
</template>

<script setup>
import IPO from "../../Market/components/IPO.vue";
import IPOStock from "./IPOStock.vue";
import { Tab, Tabs } from "vant";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const IPOStockRef = ref();
const IPORef = ref();

const ipoActive = ref(0);
const ipoOnChange = (val) => {
  ipoActive.value = val;
  setTimeout(() => {
    switch (val) {
      case 0:
        IPORef.value && IPORef.value.init();
        break;
      case 1:
        IPOStockRef.value && IPOStockRef.value.init();
        break;
    }
  }, 500);
};

onMounted(() => {
  ipoOnChange(ipoActive.value);
});
</script>

<style lang="less" scoped>
.tabs :deep(> .van-tabs__wrap) {
  padding: 0.16rem 0.32rem 0 0.32rem;
}
</style>
