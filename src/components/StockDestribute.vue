<!-- 股票 -->
<template>
  <div class="total_box">
    <div class="total_title flex flex-row justify-between items-center">
      <span class="text-[0.32rem] font-bold leading-[0.32rem] text-color">{{
        t('market.market_stock_description_title')
      }}</span>
      <div>
        <span class="text-[0.28rem] text-up mr-[0.28rem]">{{ t('market.market_stock_description_des1') }}：{{ up
          }}</span>
        <span class="text-[0.28rem] text-down">{{ t('market.market_stock_description_des2') }}：{{ down }}</span>
      </div>
    </div>
    <div class="table_box justify-center" v-if="overviewLoading && !count">
      <Loading :loading="overviewLoading" :type="'spinner'" />
    </div>
    <div class="table_box justify-end" v-if="!overviewLoading || count">
      <div class="table_list">
        <div class="table_item" v-for="(key, i) in keySoft" :key="key">
          <div class="table_item_num" :class="[
            i == 5 ? 'item_center' : i < 5 ? 'item_green' : 'item_red',
          ]">
            {{ overview[key] }}
          </div>
          <div class="table_item_bar" :style="{
            height: getHeight(key) + 'rem',
            borderTopLeftRadius: `${getHeight(key) > 0.48
                ? 0.24
                : getHeight(key) > 0.15
                  ? getHeight(key)
                  : 0.15
              }rem`,
            borderTopRightRadius: `${getHeight(key) > 0.48
                ? 0.24
                : getHeight(key) > 0.15
                  ? getHeight(key)
                  : 0.15
              }rem`,
            backgroundColor: bgColors[i],
          }"></div>
          <div class="table_item_name text-color3 flex flex-row justify-center align-items-center"
            :class="{ item_green: i == 0, item_red: i == 10 }">
            {{ overviewTitleMap[key] }}
          </div>
        </div>
      </div>
      <div class="table_tabs flex flex-row justify-between">
        <div class="bg-success w-[3.04rem] h-[0.2rem]"></div>
        <div class="bg-info w-[0.48rem]"></div>
        <div class="bg-error w-[3.04rem] h-[0.2rem]"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { _marketOverview } from "@/api/api";
import store from "@/store";
import Loading from "@/components/Loaidng.vue";
import LoadingMore from "@/components/LoadingMore.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const loading = ref(false);
const finish = ref(false);
const page = ref(0);
const up = ref(0);
const down = ref(0);

const showAS = ref(false);
const currAs = ref("");
const actionsMap = ref([]);
const actions = computed(() => {
  return actionsMap.value.map((item) => {
    return {
      name: item,
      value: item,
      className: currAs.value == item ? "action-sheet-active" : "",
    };
  });
});

// 获取总览数据
const count = ref(0);
const keySoft = ref([5, 4, 3, 2, 1, 0, "-1", "-2", "-3", "-4", "-5"]);
const bgColors = ref([
  "var(--ex-up-color)",
  "var(--ex-up-color)",
  "var(--ex-up-color)",
  "var(--ex-up-color)",
  "var(--ex-up-color)",
  "var(--ex-info-color)",
  "var(--ex-down-color)",
  "var(--ex-down-color)",
  "var(--ex-down-color)",
  "var(--ex-down-color)",
  "var(--ex-down-color)",
]);
const overview = ref({
  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 0,
  0: 0,
  "-1": 0,
  "-2": 0,
  "-3": 0,
  "-4": 0,
  "-5": 0,
});
try {
  const d = JSON.parse(
    sessionStorage.getItem("overview_data_" + store.state.marketCurrent) || "{}"
  );
  count.value = d.count || 0;
  for (let key in overview.value) {
    overview.value[key] = d[key] || 0;
  }
} catch { }
const overviewTitleMap = ref({
  5: t('market.market_stock_description_long_end'),
  4: ">7%",
  3: "7~5％",
  2: "5~2％",
  1: "2~0％",
  0: t('market.market_stock_description_center'),
  "-1": "0~2％",
  "-2": "2~5％",
  "-3": "5~7％",
  "-4": "7％<",
  "-5": t('market.market_stock_description_short_end'),
});
// 获取柱状图高度
const getHeight = (key) => {
  let max = 0;
  for (let k in overview.value) {
    if (overview.value[k] > max) max = overview.value[k];
  }
  if (max == 0) return 0;
  return (overview.value[key] * 3) / max; // 最高的3rem
};
const overviewLoading = ref(false);
const getOverviewData = () => {
  if (!store.state.marketCurrent) {
    return;
  }
  const market = store.state.marketCurrent;
  if (sessionStorage.getItem("overview_data_" + market)) {
    const d = JSON.parse(sessionStorage.getItem("overview_data_" + market));
    count.value = d.count || 0;
    for (let key in overview.value) {
      overview.value[key] = d[key] || 0;
    }
    setTimeout(() => {
      getUpNum();
      getDownNum();
    }, 0);
  } else {
    overviewLoading.value = true;
  }

  _marketOverview({
    market: market,
  })
    .then((res) => {
      if (!res.data) return;
      sessionStorage.setItem(
        "overview_data_" + market,
        JSON.stringify(res.data)
      );
      if (market != store.state.marketCurrent) return;
      count.value = res.data.count || 0;
      for (let key in overview.value) {
        overview.value[key] = res.data[key] || 0;
      }
      setTimeout(() => {
        getUpNum();
        getDownNum();
      }, 0);
    })
    .finally(() => {
      overviewLoading.value = false;
    });
};

const initData = () => {
  getOverviewData();
};

watch(
  () => store.state.marketCurrent,
  () => {
    initData();
  }
);
onMounted(() => {
  initData();
});

const getUpNum = () => {
  up.value = 0;
  const arr = [1, 2, 3, 4, 5];
  arr.forEach((i) => {
    up.value = up.value + overview.value[i];
  });
};

const getDownNum = () => {
  down.value = 0;
  const arr = ["-1", "-2", "-3", "-4", "-5"];
  arr.forEach((i) => {
    down.value = down.value + overview.value[i];
  });
};
</script>

<style lang="less" scoped>
.total_box {
  padding: 0.4rem 0.32rem;
  position: relative;
  background: var(--ex-bg-color2);
  border-radius: 0.32rem;
  margin-top: 0.2rem;

  .total_title {
    color: var(--ex-text-color3);
    font-size: 0.28rem;
    margin-bottom: 0.4rem;
  }

  .table_box {
    height: 3.88rem;
    display: flex;
    flex-direction: column;
  }

  .table_list {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    .table_item {
      width: 7%;
      color: var(--ex-info-color);
      font-size: 0.18rem;
      text-align: center;

      .item_red {
        color: var(--ex-down-color);
      }

      .item_center {
        color: var(--ex-info-color);
      }

      .item_green {
        color: var(--ex-up-color);
      }

      .table_item_num {
        font-size: 0.22rem;
        line-height: 0.308rem;
      }

      .table_item_bar {
        min-height: 0.15rem;
        background-color: var(--ex-info-color);
        transition: all ease-in 0.3s;
      }

      .table_item_name {
        font-size: 0.22rem;
        line-height: 0.308rem;
        height: 0.36rem;
        align-items: center;
      }
    }
  }

  .table_tabs {
    height: 0.2rem;
    display: flex;
    align-items: stretch;
    border-radius: 0.1rem;
    overflow: hidden;
  }
}
</style>
