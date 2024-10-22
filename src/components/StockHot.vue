<!-- 自选 -->
<template>
  <div class="stock_hot">
    <Loaidng
      v-if="
        !marketSrockRecommendList.length &&
        !marketContractRecommendList.length &&
        recommendLoading
      "
      :loading="recommendLoading"
      :type="'spinner'"
    />
    <NoData
      v-if="
        !marketSrockRecommendList.length &&
        !marketContractRecommendList.length &&
        !loading &&
        !recommendLoading
      "
    />

    <div class="recommend_block">
      <div class="item_block" v-if="marketSrockRecommendList.length">
        <div class="item_block_title flex justify-between">
          <div>热门股</div>
        </div>
        <StockRecommendList
          :key="'stock'"
          :keyStr="'stock'"
          :loading="recommendLoading"
          @change="changeStockList"
          @init="init"
          :list="marketSrockRecommendList"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Loaidng from "@/components/Loaidng.vue";
import NoData from "@/components/NoData.vue";
// import StockTable from "@/components/StockTable.vue";
import StockRecommendList from "@/components/StockRecommendList.vue";
import OptionCategory from "@/components/OptionCategory.vue";
import router from "@/router";
import store from "@/store";
import { computed, onMounted, ref, watch } from "vue";
import { _watchlistDefault } from "@/api/api";
import {
  showLoadingToast,
  closeToast,
  showToast,
  Tabs,
  Tab,
  Button,
} from "vant";
import { useSocket } from "@/utils/ws";
const { startSocket } = useSocket();

const watchList = computed(() => store.state.marketWatchList || []);
const active = ref(0);

const token = computed(() => store.state.token || "");
const loading = ref(true);

const init = () => {
  loading.value = false;
  // 打开推荐列表
  openRecommendList();
};

// 推荐列表
const marketType = computed(() => store.getters.getMarketType);
const marketSrockRecommendList = computed(
  () => store.state.marketSrockRecommendList || []
);
const recommendLoading = ref(false);
const openRecommendList = () => {
  recommendLoading.value = true;
  _watchlistDefault()
    .then((res) => {
      if (res.code == 200) {
        // 股票

        if (res.data?.stock) {
          const arr = res.data.stock.map((item) => {
            const target = marketSrockRecommendList.value.find(
              (a) => a.symbol == item.symbol
            );
            return target || item;
          });
          store.commit("setMarketSrockRecommendList", arr || []);
          setTimeout(() => {
            store.dispatch("subList", {
              commitKey: "setMarketSrockRecommendList",
              listKey: "marketSrockRecommendList",
            });
          }, 500);
        }
      }
    })
    .finally(() => {
      recommendLoading.value = false;
    });
};
// 推荐股票选择
const stockList = ref([]);
const changeStockList = (arr) => {
  console.log("emit ==========> ", arr)
};

// 添加自选
const addLoading = ref(false);

defineExpose({
  init,
});

// 移除收藏
const removeLoading = ref(false);

const jump = (name) => {
  router.push({
    name,
  });
};
</script>

<style lang="less" scoped>
  .recommend_block {
    padding: 0.32rem 0.32rem;

    .item_block {
      .item_block_title {
        font-size: 0.32rem;
        font-weight: 600;
        line-height: 0.36rem;
        margin-bottom: 0.36rem;
      }
    }
  }
</style>
