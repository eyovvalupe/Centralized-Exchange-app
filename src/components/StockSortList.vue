<!-- 股票 -->
<template>
  <div class="market_stock_list">
    <!-- Tabs -->
    <Tabs class="tabs" @change="changeTab" v-model:active="active" :swipeable="false" animated shrink>
      <Tab :title="t('market.market_stock_hot')" name="volume">
        <div class="px-[0.4rem]">
          <StockTableForList :loading="loading" :list="marketVolumeList" />
          <LoadingMore :classN="'stock_soft_morevolume'" class="active_more"
            :loading="!!(marketVolumeList.length && loading)" :finish="finish"
            v-if="((finish && marketVolumeList.length) || !finish)" />
        </div>
      </Tab>
      <Tab :title="t('market.market_stock_chase_long_sort')" name="up">
        <div class="px-[0.4rem]">
          <StockTableForList :loading="loading" :list="marketUpList" />
          <LoadingMore :classN="'stock_soft_moreup'" class="active_more" :loading="!!(marketUpList.length && loading)"
            :finish="finish" v-if="((finish && marketUpList.length) || !finish)" />
        </div>
      </Tab>
      <Tab :title="t('market.market_stock_chase_short_sort')" name="down">
        <div class="px-[0.4rem]">
          <StockTableForList :key="'up'" :loading="loading" :list="marketDownList" />

          <LoadingMore :classN="'stock_soft_moredown'" class="active_more"
            :loading="!!(marketDownList.length && loading)" :finish="finish"
            v-if="((finish && marketDownList.length) || !finish)" />
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import StockTableForList from "@/components/StockTableForList.vue";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { _sort } from "@/api/api";
import store from "@/store";
import LoadingMore from "@/components/LoadingMore.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const loading = ref(false);
const finish = ref(false);
const page = ref(0);

// tabs
const active = ref("volume");
const changeTab = (key) => {
  page.value = 0;
  loading.value = false;
  finish.value = false;
  // 加载更多元素
  switch (key) {
    case "volume":
      getData(
        marketVolumeList,
        "setMarketVolumeList",
        "volume",
        "marketVolumeList"
      );
      break;
    case "up":
      getData(marketUpList, "setMarketUpList", "up", "marketUpList");
      break;
    case "down":
      getData(marketDownList, "setMarketDownList", "down", "marketDownList");
      break;
  }
  target = document.querySelector(".stock_soft_more" + key);
};

// 获取列表数据
const marketVolumeList = computed(() => store.state.marketVolumeList || []); // 活跃列表
const marketUpList = computed(() => store.state.marketUpList || []); // 涨幅列表
const marketDownList = computed(() => store.state.marketDownList || []); // 跌幅列表
const subs = () => {
  store.commit("setMarketWatchKeysByPage");
  // 订阅 ws
  store.dispatch("subList", {});
};
const getData = (list, key, query, listKey) => {
  if (loading.value || finish.value || !store.state.marketCurrent) return;
  loading.value = true;
  page.value++;
  let arr = JSON.parse(JSON.stringify(list.value));
  if (page.value == 1) {
    arr = [];
    store.commit(key, []);
  }

  const saveActive = active.value;
  _sort({
    orderby: query,
    page: page.value,
    market: store.state.marketCurrent,
  })
    .then((res) => {
      if (res.code == 200) {
        if (saveActive != active.value) return;
        if (!res.data.length) {
          finish.value = true;
        }
        res.data = res.data.map((item) => {
          item.ratio = undefined; // 弃用接口里的该字段
          return item;
        });
        const rs = res.data.map((item) => {
          const target = list.value.find((a) => a.symbol == item.symbol);
          if (target) {
            item = {
              ...target,
              ...item,
              ratio: target.ratio,
            };
          }
          item.type = 'stock'
          return item;
        });
        arr.push(...rs);
        store.commit(key, arr || []);
        subs();
        setTimeout(() => {
          scrollHandler();
        }, 500);
      }
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false;
      }, 300);
    });
};

// 滚动监听
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
let target = null;
const scrollHandler = () => {
  if (!target) return;
  const rect = target.getBoundingClientRect();
  if (rect && rect.top <= totalHeight) {
    // 加载更多
    switch (active.value) {
      case 'volume':
        getData(
          marketVolumeList,
          "setMarketVolumeList",
          "volume",
          "marketVolumeList"
        );
        break;
      case 'up':
        getData(marketUpList, "setMarketUpList", "up", "marketUpList");
        break;
      case 'down':
        getData(marketDownList, "setMarketDownList", "down", "marketDownList");
        break;
    }
  }
};
watch(
  () => store.state.marketCurrent,
  () => {
    changeTab(active.value);
  }
);
onMounted(() => {
  changeTab(active.value);
  setTimeout(() => {
    try {
      document.querySelector(".stock_tab_scroller").addEventListener("scroll", scrollHandler);
      target = document.querySelector(".stock_soft_more" + active.value);
    } catch { }
  }, 500);
});
onBeforeUnmount(() => {
  try {
    document
      .querySelector(".stock_tab_scroller")
      .removeEventListener("scroll", scrollHandler);
  } catch { }
});
</script>

<style lang="less" scoped>
.market_stock_list {
  :deep(.van-tabs) {
    .van-tabs__wrap {
      margin: 0 0 0.12rem 0 !important;
      height: 1rem !important;

      .van-tabs__nav {
        padding: 0 0.32rem;
        position: relative;

        &::after {
          content: "";
          background-color: var(--ex-bg-color3);
          height: 1px;
          position: absolute;
          bottom: 0;
          width: 100%;
          left: 0;
        }

        .van-tab {
          padding-left: 0px;
          padding-right: 0.76rem;
          font-size: 0.32rem;
          color: var(--ex-text-color3);
        }

        .van-tab--active {
          font-size: 0.36rem !important;
          font-weight: 600 !important;
          color: var(--ex-primary-color) !important;
        }

        .van-tabs__line {
          bottom: 1px;
          display: none;
          margin-left: -0.4rem;
          width: 0.8rem;
          height: 0.06rem;
          border-radius: 0.2rem;
        }
      }
    }
  }
}
</style>
