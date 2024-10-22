<!-- 自选 -->
<template>
  <div>
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
  stockList.value = arr;
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
  background-color: green;
  padding: 0.32rem 0.32rem;
  border-radius: 0.452rem;

  .item_block {
    margin-bottom: 0.471rem;

    .item_block_title {
      font-size: 0.36rem;
      font-weight: 600;
      line-height: 0.36rem;
      margin-bottom: 0.36rem;

      .checked_icon_blue {
        width: 0.4rem;
        height: 0.4rem;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><rect width="20" height="20" rx="6" fill="%23014CFA"/><path d="M8.52645 13.3945C8.34635 13.3895 8.17542 13.3219 8.04962 13.2059L5.20301 10.6602C5.07277 10.5388 5 10.3767 5 10.208C5 10.0394 5.07277 9.87731 5.20301 9.7559C5.2686 9.69655 5.3466 9.64945 5.43253 9.61731C5.51845 9.58517 5.6106 9.56862 5.70367 9.56862C5.79674 9.56862 5.88889 9.58517 5.97481 9.61731C6.06074 9.64945 6.13874 9.69655 6.20433 9.7559L8.52645 11.8559L14.4581 7.18875C14.5229 7.12901 14.6004 7.08153 14.686 7.04912C14.7716 7.0167 14.8635 7 14.9564 7C15.0492 7 15.1412 7.0167 15.2267 7.04912C15.3123 7.08153 15.3898 7.12901 15.4547 7.18875C15.5207 7.2477 15.5731 7.31781 15.6088 7.39504C15.6446 7.47227 15.663 7.5551 15.663 7.63875C15.663 7.7224 15.6446 7.80523 15.6088 7.88246C15.5731 7.95969 15.5207 8.0298 15.4547 8.08875L9.02712 13.2059C8.89458 13.3258 8.71453 13.3937 8.52645 13.3945Z" fill="white"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
      }
      .unchecked_icon {
        width: 0.4rem;
        height: 0.4rem;
        background-color: transparent;
        border: 1px solid #d0d8e2;
        border-radius: 0.11rem;
      }
    }
  }
}
</style>
