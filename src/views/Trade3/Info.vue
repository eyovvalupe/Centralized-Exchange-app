<!-- 资产页 -->
<template>
  <div class="page page_finance">
    <!-- 头部 -->
    <HeaderTabs
      :from="'finance'"
      :type="'custom-line'"
      v-model:active="activeTab"
      :tabs="[
        t('股票'),
        t('币币'),
        t('加密货币合约'),
        t('交易机器人'),
      ]"
      @change="changeActiveTab(activeTab, true)"
    />

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
        a
        </div>
      </SwipeItem>
      <SwipeItem>
        <div
          style="height: calc(var(--vh) * 100 - 1rem); padding-bottom: 1.4rem"
        >
        s
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
          style="height: calc(var(--vh) * 100 - 0.5rem); padding-bottom: 1.4rem"
        >
        a
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

  const { t } = useI18n();

  const route = useRoute();

  const activeTab = ref(
    route.query.activeTab
      ? Number(route.query.activeTab)
      : Number(localStorage.getItem('financeActiveTab')) || 0,
  );
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
