<!-- ipo相关 -->
<template>
  <Tabs animated class="ipo-block" type="custom-card" @change="ipoOnChange" v-model:active="ipoActive" :swipeable="false" shrink>
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
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const { t } = useI18n();
const IPOStockRef = ref();
const IPORef = ref();
const route = useRoute()

const ipoActive = ref(route.query.active ? Number(route.query.active) : 0);
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

watch(() => route.query.active, (val) => {
  if (val != ipoActive.value) {
    ipoOnChange(Number(val))
  }
})

onMounted(() => {
  ipoOnChange(ipoActive.value);
});
</script>

<style lang="less" scoped>
.ipo-block {
  &:deep(.van-tabs__wrap) {
    margin: 0 0.4rem;
  }
}
</style>
