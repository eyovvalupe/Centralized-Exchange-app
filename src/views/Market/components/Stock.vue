<!-- 股票 -->
<template>
  <div class="market_stock" v-if="!loading">
    <StockCountry />
    <StockDestribute />
    <StockChase />
    <!-- <div class="stock_hot">
      <StockHot />
    </div> -->
    <div class="pt-[0.5rem]">
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

import { ref, onMounted } from 'vue';

const loading = ref(true)
onMounted(() => loading.value = false)

</script>

<style lang="less" scoped>

</style>
