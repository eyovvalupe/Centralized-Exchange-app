<!-- 自选 -->
<template>
  <div class="stock_hot">
    <div class="recommend_block">
      <div class="item_block" v-if="marketVolumeList.length">
        <div class="item_block_title flex justify-between">
          <div>热门股</div>
          <div class="re_render" @click.stop="update"></div>
        </div>
        <StockRecommendList
          :loading="recommendLoading"
          :list="marketVolumeList"
          :show-len="4"
        />
      </div>
    </div>
  </div>
</template>

<script setup>

// import StockTable from "@/components/StockTable.vue";
import StockRecommendList from "@/components/StockRecommendList.vue";
import store from "@/store";
import { computed, ref, watch } from "vue";
import { _sort } from "@/api/api";
const recommendLoading = ref(false)

const marketVolumeList = computed(() => store.state.marketVolumeList || []); // 活跃列表

const subs = (listKey, key) => {
  // 订阅ws
  store.commit("setMarketWatchKeysByPage")
  store.dispatch("subList", {
  });
};

const getData = (list, key, query, listKey) => {
  if (!store.state.marketCurrent) return;
  const market = store.state.marketCurrent
  let arr = []
  _sort({
    orderby: query,
    page: 1,
    market:market
  })
    .then((res) => {
      if (res.code == 200) {
        if(store.state.marketCurrent != market){
          return
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
          subs(listKey, key);
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
}
watch(()=>store.state.marketCurrent,()=>{
  update()
})

if(!marketVolumeList.value.length){
  recommendLoading.value = true;
}
getData(
  marketVolumeList,
  "setMarketVolumeList",
  "volume",
  "marketVolumeList"
);
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
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M11.25 4.87489V2.24989L10.3939 3.10601C9.91589 2.38181 9.26575 1.78747 8.50169 1.37622C7.73762 0.96496 6.88347 0.74963 6.01576 0.749512C3.11626 0.749512 0.765381 3.10001 0.765381 5.99989C0.765381 8.89976 3.11626 11.2503 6.01576 11.2503C7.06067 11.2505 8.08189 10.9389 8.94873 10.3554C9.81558 9.77198 10.4886 8.94315 10.8818 7.97501C10.9267 7.86447 10.9258 7.74061 10.8794 7.63069C10.833 7.52077 10.7448 7.43379 10.6343 7.38889C10.5795 7.36665 10.5209 7.35542 10.4619 7.35582C10.4028 7.35623 10.3444 7.36826 10.2899 7.39125C10.18 7.43766 10.093 7.52584 10.0481 7.63639C9.72223 8.43857 9.16445 9.1253 8.44613 9.60874C7.72781 10.0922 6.88161 10.3504 6.01576 10.3503C3.61313 10.3503 1.66538 8.40251 1.66538 5.99989C1.66538 3.59726 3.61313 1.64951 6.01576 1.64951C7.56788 1.64951 8.96813 2.47076 9.74251 3.75701L8.62501 4.87489H11.25Z" fill="%23014CFA"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}
</style>
