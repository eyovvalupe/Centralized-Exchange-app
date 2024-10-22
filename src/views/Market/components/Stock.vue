<!-- 股票 -->
<template>
  <div class="market_stock">
    <StockCountry />
    <StockDestribute />
    <StockHot />
    <StockSortList />
  </div>
</template>

<script setup>
import StockCountry from '@/components/StockCountry.vue';
import StockDestribute from '@/components/StockDestribute.vue';
import StockSortList from '@/components/StockSortList.vue';
import StockHot from '@/components/StockHot.vue';

</script>

