<!-- 股票 -->
<template>
  <div style="width: 5.8rem; height: 2.18rem">
    <div class="market_stock_block" v-if="marketList.length">
      <Tabs
        v-model:active="active"
        :swipeable="false"
        :color="'#014CFA'"
        shrink
        @change="onChange"
      >
        <Tab
          style="min-width: 2rem"
          :title="
            marketItem.market == 'us'
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
          "
          :name="marketItem.market"
          v-for="marketItem in marketList"
          :key="marketItem.market"
        >
          <div class="stock_tab-body">
            <Loading
              :loading="pageLoading"
              v-if="pageLoading"
              style="margin: 0.3rem 0 0"
            />
            <HomeStockDescription
              v-else-if="marketStockIndexList[marketItem.market].length"
              :list="marketStockIndexList[marketItem.market]"
              :region="marketItem.market"
              :data="marketStockData[marketItem.market]"
              :loading="pageLoading"
              :active="active"
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { _recommend } from "@/api/api";
import store from "@/store";
import Loading from "@/components/Loaidng.vue";
import LoadingMore from "@/components/LoadingMore.vue";
import HomeStockDescription from "@/components/HomeStockDescription.vue";
import { getData, getMarket } from "@/utils/stock";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const active = ref(store.state.marketCurrent);
const marketLoading = ref(true);
const marketList = ref([]);

const pageLoading = ref(true);

const onChange = async (region) => {
  active.value = region;
  store.commit("setMarketCurrent", region);
  getData(region, pageLoading);
};

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
</script>

<style lang="less" scoped>
.market_stock_block {
  margin: 0;
  padding: 0 0.106rem;
  height: 2.18rem;

  :deep(.van-tabs__nav) {
    width: 100%;
    display: flex;
  }

  .stock_tab-body {
    width: 5.58rem;
  }

  .van-tabs {
    margin: 0;

    :deep(.van-tabs__line) {
      display: none;
    }
    :deep(.van-tabs__wrap) {
      height: 0.68rem;

      .van-tabs__nav {
        position: relative;
        width: 5.2rem;
        display: flex;
        justify-content: space-between;
        border-radius: 0;
        background: none;
        font-size: 0.28rem;
        line-height: 0.32rem;

        .van-tab {
          flex: 1 0 auto;
          height: 0.52rem;
          width: 1rem;
          margin-right: 0.12rem;
          text-align: center;
          padding: 0 0.22rem;
          font-size: 0.32rem;
          line-height: 0.5rem;
          border-bottom-left-radius: 0.2rem;
          border-bottom-right-radius: 0.2rem;
          background-color: white;

          .van-tab__text {
            font-size: 0.28rem;
            line-height: 0.32rem;
            font-weight: 400;
          }
        }

        .van-tab--active {
          top: 0;
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-bottom-left-radius: 0.2rem;
          border-bottom-right-radius: 0.2rem;
          background-color: #014cfa;

          .van-tab__text {
            color: white;
            font-size: 0.28rem;
            line-height: 0.32rem;
            font-weight: 400;
          }
        }
      }
    }
  }
}
</style>
