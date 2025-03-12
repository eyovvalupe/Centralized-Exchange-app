<!-- 资产页 -->
<template>
  <div class="page page_finance">
    <!-- 头部 -->
    <HeaderTabs
      v-model:active="activeTab"
      :tabs="[
        t('copy.title'),
        t('finance.defi_borrow'),
        t('finance.portfolio_title'),
        t('IPO'),
      ]"
      @change="changeActiveTab(activeTab, true)"
    />
    <!-- <Tabs :type="'sub-order'" v-model:active="activeTab" @change="changeActiveTab(activeTab, true)">
      <Tab :name="0" :title="t('copy.title')"></Tab>
      <Tab :name="1" :title="t('finance.defi_borrow')"></Tab>
      <Tab :name="2" :title="t('finance.portfolio_title')"></Tab>
      <Tab :name="3" :title="t('IPO')"></Tab>
    </Tabs> -->

    <Swipe
      v-if="pageLoaded"
      :autoplay="0"
      :initial-swipe="initialSwipe"
      :show-indicators="false"
      :touchable="true"
      :loop="false"
      :duration="300"
      ref="swipe"
      @change="swipeChange"
    >
      <SwipeItem>
        <div
          style="height: calc(var(--vh) * 100 - 1rem); padding-bottom: 1.4rem"
        >
          <Follow :from="'finance'" />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div
          style="height: calc(var(--vh) * 100 - 1rem); padding-bottom: 1.4rem"
        >
          <Pledge />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div
          style="height: calc(var(--vh) * 100 - 1rem); padding-bottom: 1.4rem"
        >
          <Stake />
        </div>
      </SwipeItem>
      <SwipeItem>
        <div
          style="height: calc(var(--vh) * 100 - 1rem); padding-bottom: 1.4rem"
        >
          <IPO ref="ipoRef" />
        </div>
      </SwipeItem>
    </Swipe>
  </div>
</template>

<script setup>
  import { Swipe, SwipeItem, Tabs, Tab } from 'vant';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import HeaderTabs from '@/components/HeaderTabs.vue';
  import { useI18n } from 'vue-i18n';
  import Stake from './Stake.vue';
  import Pledge from './Pledge.vue';
  import Follow from '../Home/Follow/Index.vue';
  import IPO from '../Market/IPO.vue';

  const { t } = useI18n();

  const route = useRoute();

  const activeTab = ref(
    route.query.activeTab
      ? Number(route.query.activeTab)
      : Number(localStorage.getItem('financeActiveTab')) || 0,
  );
  console.log(route.query.activeTab);
  const initialSwipe = ref(activeTab.value);
  const loadedTab = ref([activeTab.value]);
  const swipe = ref(null);
  const ipoRef = ref();

  const changeActiveTab = (val, slideSwipe = false) => {
    // console.log(val)
    let normalizedVal = val;
    // Normalize the value for circular navigation
    if (val >= 4) normalizedVal = 0;
    if (val < 0) normalizedVal = 3;

    activeTab.value = normalizedVal;
    if (loadedTab.value.indexOf(normalizedVal) == -1) {
      loadedTab.value.push(normalizedVal);
    }
    localStorage.setItem('financeActiveTab', normalizedVal);
    if (slideSwipe && swipe.value) {
      swipe.value.swipeTo(normalizedVal);
    }
  };
  const swipeChange = (val) => {
    changeActiveTab(val);
    if (val == 3) ipoRef.value.init();
  };

  const pageLoaded = ref(false);
  onMounted(() => {
    setTimeout(() => {
      pageLoaded.value = true;
    }, 300);
  });
</script>
<style lang="less">
  .page_finance {
    height: calc(var(--vh) * 100);
    overflow: hidden;
  }
</style>
