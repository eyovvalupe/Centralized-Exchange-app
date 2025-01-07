<!-- 股票 -->
<template>
  <div class="market_stock_block flex items-center justify-center" v-if="marketLoading">
    <Loading :loading="marketLoading" />
  </div>
  <div class="market_stock_block" :class="{ 'market_stock_block--hide-nav': marketList.length <= 1 }" v-else>
    <Tabs @touchstart.stop @touchmove.stop @touchup.stop type="custom-scroll-card" v-model:active="active"
      :swipeable="false" animated :color="'var(--ex-primary-color)'" shrink @change="onChange">
      <Tab :title="marketItem.market == 'us'
          ? t('market.market_stock_country_us')
          : marketItem.market == 'japan'
            ? t('market.market_stock_country_japan')
            : marketItem.market == 'india'
              ? t('market.market_stock_country_india')
              : marketItem.market == 'korea'
                ? t('market.market_stock_country_korea')
                : marketItem.market == 'germany'
                  ? t('market.market_stock_country_germany')
                  : marketItem.market == 'uk'
                    ? t('market.market_stock_country_uk')
                    : marketItem.market == 'singapore'
                      ? t('market.market_stock_country_singapore')
                      : marketItem.market == 'hongkong'
                        ? t('market.market_stock_country_hongkong')
                        : marketItem.market == 'malaysia'
                          ? t('market.market_stock_country_malaysia')
                          : ''
        " :name="marketItem.market" v-for="marketItem in marketList" :key="marketItem.market">
        <div class="stock_tab-body">
          <StockDescription v-if="marketStockIndexList[marketItem.market].length"
            :list="marketStockIndexList[marketItem.market]" :region="marketItem.market"
            :data="marketStockData[marketItem.market]" :loading="pageLoading" :active="active"
            @update="update(marketItem.market)" />
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { _recommend, _marketGet } from "@/api/api";
import store from "@/store";
import Loading from "@/components/Loaidng.vue";
import StockDescription from "@/components/StockDescription.vue";
import { getData, getMarket } from "@/utils/stock";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const active = ref("");

const marketList = ref([]);
const marketLoading = ref(true);
const pageLoading = ref(true);

const onChange = async (region) => {
  active.value = region;
  store.commit("setMarketCurrent", region);
  getData(region, pageLoading);
};

const update = (region) => {
  getData(region, pageLoading);
};

const initTab = (_data) => {
  let stockTab = store.state.marketCurrent || "";
  let hasTab = false;
  _data.map((item) => {
    if (stockTab && item.market == stockTab) {
      hasTab = true;
    }
  });
  if (!hasTab && _data[0]) {
    stockTab = _data[0].market;
  }
  active.value = stockTab;
  store.commit("setMarketCurrent", stockTab);
  marketList.value = _data;
  marketLoading.value = false;
};
onMounted(() => {
  if (sessionStorage.marketListData) {
    initTab(JSON.parse(sessionStorage.marketListData));
    getData(active.value, pageLoading);
  } else {
    getMarket().then((_data) => {
      initTab(_data);
      getData(active.value, pageLoading);
    });
  }
});

const marketStockData = computed(() => {
  return {
    us: store.state.marketStockUsData,
    india: store.state.marketStockIndiaData,
    japan: store.state.marketStockJapanData,
    korea: store.state.marketStockKoreaData,
    germany: store.state.marketStockGermanyData,
    uk: store.state.marketStockUkData,
    singapore: store.state.marketStockSingaporeData,
    hongkong: store.state.marketStockHongkongData,
    malaysia: store.state.marketStockMalaysiaData,
  };
});

const marketStockIndexList = computed(() => {
  return {
    us: store.state.marketStockUsIndexList,
    india: store.state.marketStockIndiaIndexList,
    japan: store.state.marketStockJapanIndexList,
    korea: store.state.marketStockKoreaIndexList,
    germany: store.state.marketStockGermanyIndexList,
    uk: store.state.marketStockUkIndexList,
    singapore: store.state.marketStockSingaporeIndexList,
    hongkong: store.state.marketStockHongkongIndexList,
    malaysia: store.state.marketStockMalaysiaIndexList,
  };
});
</script>

<style lang="less" scoped>
.market_stock_block {

  .van-tabs {
    :deep(> .van-tabs__content) {
      background-color: var(--ex-bg-white2);
      border-radius: 0.4rem;
      margin-top: 0.32rem;
    }

    :deep(.van-tabs__wrap) {
      margin: 0 0.32rem !important;
    }
  }
}

.market_stock_block--hide-nav {
  height: 3.5rem;

  :deep(.van-tabs__wrap) {
    display: none;
  }
}
</style>
