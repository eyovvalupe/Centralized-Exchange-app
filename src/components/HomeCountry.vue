<!-- 股票 -->
<template>
  <div style="width: 5.8rem; height: 2.18rem">
    <div class="market_stock_block">
      <Tabs
        type="custom-card"
        v-model:active="active"
        :swipeable="false"
        animated
        :color="'#014CFA'"
        shrink
        @change="onChange"
      >
        <Tab title="美股" name="0">
          <div class="stock_tab-body">
            <Loading :loading="pageLoading" />
            <HomeStockDescription
              v-if="marketStockUsDataList.length"
              :list="marketStockUsDataList"
              :region="'us'"
              :data="usData"
              :loading="pageLoading"
              :active="active"
            />
          </div>
        </Tab>
        <Tab title="印度" name="1">
          <div class="stock_tab-body">
            <Loading :loading="pageLoading" />
            <HomeStockDescription
              v-if="marketStockIndiaDataList.length"
              :list="marketStockIndiaDataList"
              :region="'india'"
              :data="indiaData"
              :loading="pageLoading"
              :active="active"
            />
          </div>
        </Tab>
        <Tab title="日本" name="2">
          <div class="stock_tab-body">
            <Loading :loading="pageLoading" />
            <HomeStockDescription
              v-if="marketStockJapanDataList.length"
              :list="marketStockJapanDataList"
              :region="'japan'"
              :data="japanData"
              :loading="pageLoading"
              :active="active"
            />
          </div>
        </Tab>
        <Tab title="韩国" name="3">
          <div class="stock_tab-body">
            <Loading :loading="pageLoading" />
            <HomeStockDescription
              v-if="marketStockKoreaDataList.length"
              :list="marketStockKoreaDataList"
              :region="'korea'"
              :data="koreaData"
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

const active = ref(sessionStorage.getItem("trade_stock_tab") || 0);
const currentData = computed(() => store.state.currentRecommendData);
const checkStockList = computed(() => store.state.marketVolumeList);
const usData = computed(() => store.state.marketStockUsData);
const indiaData = computed(() => store.state.marketStockIndiaData);
const japanData = computed(() => store.state.marketStockJapanData);
const koreaData = computed(() => store.state.marketStockKoreaData);

const onChange = async (val) => {
  active.value = val;
  sessionStorage.setItem("trade_stock_tab", val);
  getData(region[val]);
};

const pageLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    pageLoading.value = false;
    setTimeout(() => {
      getData(region[active.value]);
    }, 300);
  }, 300);
});

const region = {
  0: "us",
  1: "india",
  2: "japan",
  3: "korea",
};

const marketStockUsDataList = computed(
  () => store.state.marketStockUsDataList || []
);
const marketStockIndiaDataList = computed(
  () => store.state.marketStockIndiaDataList || []
);
const marketStockJapanDataList = computed(
  () => store.state.marketStockJapanDataList || []
);
const marketStockKoreaDataList = computed(
  () => store.state.marketStockKoreaDataList || []
);

const subs = (arr) => {
  store.commit(
    "setMarketWatchKeys",
    arr.map((item) => item.symbol || "")
  );
  store.dispatch("subList", {});
};
const loaded = []
const getData = (region) => {
  pageLoading.value = true;
  if (region == "us" && marketStockUsDataList.value.length > 0) {
    pageLoading.value = false;
    store.commit("setMarketCountryStockList", marketStockUsDataList);
  }
  if (region == "india" && marketStockIndiaDataList.value.length > 0) {
    pageLoading.value = false;
    store.commit("setMarketCountryStockList", marketStockIndiaDataList);
  }
  if (region == "japan" && marketStockJapanDataList.value.length > 0) {
    pageLoading.value = false;
    store.commit("setMarketCountryStockList", marketStockJapanDataList);
  }
  if (region == "korea" && marketStockKoreaDataList.value.length > 0) {
    pageLoading.value = false;
    store.commit("setMarketCountryStockList", marketStockKoreaDataList);
  }

  if(loaded.indexOf(region) > -1){
    //已更新过一遍，不再静默刷新
    pageLoading.value = false;
    return
  }

  
  _recommend({
    market: region,
    type: "index",
  })
    .then((res) => {
      loaded.push(region)
      const data = {
        region,
        currentts: formatDate(new Date(res.data.currentts)),
        closets: formatDate(new Date(res.data.closets)),
        updated: formatDate(new Date()),
        stock: res.data.index,
      };
      if (region == "us") {
        store.commit("setMarketStockUsData", data);
        const usArr = res.data.index.map((item) => {
          const target = marketStockUsDataList.value.find(
            (a) => a.symbol == item.symbol
          );
          return target || item;
        });
        store.commit("setMarketStockUsDataList", usArr);
      }
      if (region == "india") {
        store.commit("setMarketStockIndiaData", data);
        const indiaArr = res.data.index.map((item) => {
          const target = marketStockIndiaDataList.value.find(
            (a) => a.symbol == item.symbol
          );
          return target || item;
        });
        store.commit("setMarketStockIndiaDataList", indiaArr);
      }
      if (region == "japan") {
        store.commit("setMarketStockJapanData", data);
        const japanArr = res.data.index.map((item) => {
          const target = marketStockJapanDataList.value.find(
            (a) => a.symbol == item.symbol
          );
          return target || item;
        });
        store.commit("setMarketStockJapanDataList", japanArr);
      }
      if (region == "korea") {
        store.commit("setMarketStockKoreaData", data);
        const koreaArr = res.data.index.map((item) => {
          const target = marketStockKoreaDataList.value.find(
            (a) => a.symbol == item.symbol
          );
          return target || item;
        });
        store.commit("setMarketStockKoreaDataList", koreaArr);
      }

      setTimeout(() => {
        subs([
          ...marketStockUsDataList.value,
          ...marketStockIndiaDataList.value,
          ...marketStockJapanDataList.value,
          ...marketStockKoreaDataList.value,
        ]);
      }, 300);

      if (region == "us") {
        store.commit("setMarketStockUsData", data);
      } else if (region == "india") {
        store.commit("setMarketStockIndiaData", data);
      } else if (region == "japan") {
        store.commit("setMarketStockJapanData", data);
      } else {
        store.commit("setMarketStockKoreaData", data);
      }
    })
    .catch((err) => console.error(err))
    .finally(() => {
      pageLoading.value = false;
    });
};

function formatDate(date) {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${month}/${day} ${hours}:${minutes}:${seconds}`;
}
</script>

<style lang="less" scoped>
.market_stock_block {
  margin: 0;
  padding: 0 0.106rem;
  height: 2.18rem;

  :deep(.van-tabs__nav) {
    width: 100%;
  }
  
  .stock_tab-body{
    width: 5.58rem;
  }

  .van-tabs {
    margin: 0;

    :deep(.van-tabs__wrap) {
      height: 0.68rem;

      .van-tabs__nav {
        position: relative;
        width: 4.4rem;
        display: flex;
        justify-content: space-between;
        border-radius: 0;
        background: none;
        font-size: 0.28rem;
        line-height: 0.32rem;

        .van-tab {
          flex: 1;
          max-width: 1rem;
          height: 0.52rem;
          text-align: center;
          padding: 0;
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
