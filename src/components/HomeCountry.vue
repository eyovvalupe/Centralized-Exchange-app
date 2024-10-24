<!-- 股票 -->
<template>
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
            v-if="marketCountryStockList.length"
            :list="marketCountryStockList"
            :region="'us'"
            :data="usData"
            :loading="pageLoading"
            :active="active"
            @update="update('us')"
          />
        </div>
      </Tab>
      <Tab title="印度" name="1">
        <div class="stock_tab-body">
          <Loading :loading="pageLoading" />
          <HomeStockDescription
            v-if="marketCountryStockList.length"
            :list="marketCountryStockList"
            :region="'india'"
            :data="indiaData"
            :loading="pageLoading"
            :active="active"
            @update="update('india')"
          />
        </div>
      </Tab>
      <Tab title="日本" name="2">
        <div class="stock_tab-body">
          <Loading :loading="pageLoading" />
          <HomeStockDescription
            v-if="marketCountryStockList.length"
            :list="marketCountryStockList"
            :region="'japan'"
            :data="japanData"
            :loading="pageLoading"
            :active="active"
            @update="update('japan')"
          />
        </div>
      </Tab>
      <Tab title="韩国" name="3">
        <div class="stock_tab-body">
          <Loading :loading="pageLoading" />
          <HomeStockDescription
            v-if="marketCountryStockList.length"
            :list="marketCountryStockList"
            :region="'korea'"
            :data="koreaData"
            :loading="pageLoading"
            :active="active"
            @update="update('korea')"
          />
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { _recommend } from "@/api/api";
import store from "@/store";
import Loading from "@/components/Loaidng.vue";
import HomeStockDescription from "@/components/HomeStockDescription";

const active = ref(sessionStorage.getItem("trade_stock_tab") || 0);
const usData = computed(() => store.state.marketStockUsData);
const indiaData = computed(() => store.state.marketStockIndiaData);
const japanData = computed(() => store.state.marketStockJapanData);
const koreaData = computed(() => store.state.marketStockKoreaData);

const onChange = async (val) => {
  active.value = val;
  sessionStorage.setItem("trade_stock_tab", val);
  if (region[val] == "us") {
    getData(region[val]);
  }
  if (region[val] == "japan") {
    getData(region[val]);
  }
  if (region[val] == "korea") {
    getData(region[val]);
  }
};
const update = (region) => {
  store.commit("setMarketCountryStockList", []);
  getData(region);
};
const pageLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    pageLoading.value = false;
    setTimeout(() => {
      getData("us");
      getData("japan");
      getData("korea");
    }, 300);
  }, 300);
});

const region = {
  0: "us",
  // 1: "india",
  1: "japan",
  2: "korea",
};
const marketCountryStockList = computed(
  () => store.state.marketCountryStockList || []
);
const marketDownList = computed(() => store.state.marketDownList || []);
const marketUpList = computed(() => store.state.marketUpList || []);
const marketVolumeList = computed(() => store.state.markVolumeList || []);
const subs = (arr) => {
  store.commit(
    "setMarketWatchKeys",
    arr.map((item) => item.symbol || "")
  );
  store.dispatch("subList", {});
};
const getData = (region) => {
  if (marketCountryStockList.value.length > 0) {
    pageLoading.value = false;
    return;
  }
  pageLoading.value = true;
  _recommend({
    market: region,
    type: "index",
  })
    .then((res) => {
      const data = {
        region,
        stock: res.data.index,
      };
      store.commit("setCurrentRecommenData", data);

      const arr = res.data.index.map((item) => {
        const target = marketCountryStockList.value.find(
          (a) => a.symbol == item.symbol
        );
        return target || item;
      });
      store.commit("setMarketCountryStockList", arr);
      setTimeout(() => {
        subs([
          ...arr,
          ...marketDownList.value,
          ...marketUpList.value,
          ...marketVolumeList.value,
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
</script>

<style lang="less" scoped>
.market_stock_block {
  margin: 0;
  padding: 0 0.106rem;
  height: 2.18rem;

  :deep(.van-tabs__nav) {
    width: 100%;
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
