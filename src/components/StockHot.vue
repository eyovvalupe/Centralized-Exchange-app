<!-- 自选 -->
<template>
  <div class="stock_hot">
    <div class="recommend_block">
      <div class="item_block" v-if="marketVolumeList.length">
        <div class="item_block_title flex justify-between">
          <div>{{ t('market.market_stock_hot') }}</div>
          <div class="re_render" @click.stop="update">
            <img :src="getStaticImgUrl('/static/icons/refresh.svg')" alt="">
          </div>
        </div>
        <StockRecommendList :loading="recommendLoading" :list="marketVolumeList" :show-len="4" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
// import StockTable from "@/components/StockTable.vue";
import StockRecommendList from "@/components/StockRecommendList.vue";
import store from "@/store";
import { computed, ref, watch } from "vue";
import { _sort } from "@/api/api";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const recommendLoading = ref(false);

const marketVolumeList = computed(() => store.state.marketVolumeList || []); // 活跃列表

const subs = () => {
  // 订阅ws
  store.commit("setMarketWatchKeysByPage");
  store.dispatch("subList", {});
};

const getData = (list, key, query, listKey) => {
  if (!store.state.marketCurrent) return;
  const market = store.state.marketCurrent;
  let arr = [];
  _sort({
    orderby: query,
    page: 1,
    market: market,
  })
    .then((res) => {
      if (res.code == 200) {
        if (store.state.marketCurrent != market) {
          return;
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
          return item;
        });
        arr.push(...rs);
        store.commit(key, arr || []);
        setTimeout(() => {
          subs();
        }, 100);
      }
    })
    .finally(() => {
      recommendLoading.value = false;
    });
};
const update = () => {
  recommendLoading.value = true;
  getData(
    marketVolumeList,
    "setMarketVolumeList",
    "volume",
    "marketVolumeList"
  );
};
watch(
  () => store.state.marketCurrent,
  () => {
    update();
  }
);

if (!marketVolumeList.value.length) {
  recommendLoading.value = true;
}
getData(marketVolumeList, "setMarketVolumeList", "volume", "marketVolumeList");
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

      .re_render {
        width: 0.32rem;
        height: 0.32rem;
        margin-left: 0.12rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}
</style>
