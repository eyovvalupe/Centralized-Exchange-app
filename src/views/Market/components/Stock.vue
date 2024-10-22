<!-- 股票 -->
<template>
  <div class="market_stock">
    <StockCountry />
    <StockDestribute />
    <StockChase />
    <div class="stock_hot">
      <StockHot />
    </div>
    <div class="stock_sort">
      <StockSortList />
    </div>
  </div>
</template>

<script setup>
import StockCountry from "@/components/StockCountry.vue";
import StockDestribute from "@/components/StockDestribute.vue";
import StockSortList from "@/components/StockSortList.vue";
import StockHot from "@/components/StockHot.vue";
import StockChase from "@/components/StockChase.vue";
import { _marketOverview } from '@/api/api'
import { ref } from 'vue'

const data = ref([]);

_marketOverview({
    market: 'us'
})
.then(res => console.log('market overview data: ==========》 ', res.data))

</script>

<style lang="less" scoped>
.market_stock {
  .stock_hot {
    position: relative;
    top: -0.3rem;
  }

  .stock_sort {
    position: relative;
    top: -0.7rem;
  }
}
</style>
