<template>
  <div class="mb-[0.32rem]">
    <div class="flex justify-between items-center mb-[0.2rem]">
      <div class="font-bold text-[0.32rem]">优选</div>
      <div class="flex items-center gap-1">
        <div
          class="bg-[#014CFA] w-[0.12rem] h-[0.06rem] rounded-[0.2rem]"
        ></div>
        <div
          class="bg-[#cad7f333] w-[0.12rem] h-[0.06rem] rounded-[0.2rem]"
        ></div>
      </div>
    </div>
    <div class="flex justify-between">
      <div
        class="w-[2.22rem] h-[1.48rem] p-[0.16rem] rounded-[0.32rem] bg-[#F5F7FC]"
      >
        <div class="font-medium text-[0.28rem] mb-[0.1rem] text-center">
          {{ marketCountryStockList[0].symbol }}
        </div>
        <div class="flex justify-between mb-[0.1rem]">
          <div class="text-[0.24rem] font-bold">{{ marketCountryStockList[0].price }}</div>
          <div class="text-[0.22rem]">{{ marketCountryStockList[0].ratio > 0 ? "+" : ""
            }}{{
              ((marketCountryStockList[0].ratio || 0) * 100).toFixed(2)
            }}%</div>
        </div>
        <SparkLine
              :points="marketCountryStockList[0].points"
              :ratio="marketCountryStockList[0].ratio"
              :style="'width:2.2rem; height: 0.5rem'"
            />
      </div>
      <div
        class="w-[2.22rem] h-[1.48rem] p-[0.16rem] rounded-[0.32rem] bg-[#F5F7FC]"
      >
        <div class="font-medium text-[0.28rem] text-[#061023] mb-[0.1rem]">
          NAHARCAP...
        </div>
        <div class="flex justify-between text-[#E53E00] mb-[0.1rem]">
          <div class="text-[0.24rem] font-bold">465.4</div>
          <div class="text-[0.22rem]">+1.7%</div>
        </div>
      </div>
      <div
        class="w-[2.22rem] h-[1.48rem] p-[0.16rem] rounded-[0.32rem] bg-[#F5F7FC]"
      >
        <div class="font-medium text-[0.28rem] text-[#061023] mb-[0.1rem]">
          NAHARCAP...
        </div>
        <div class="flex justify-between text-[#18B762] mb-[0.1rem]">
          <div class="text-[0.24rem] font-bold">465.4</div>
          <div class="text-[0.22rem]">+1.7%</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import store from "@/store";
import { onMounted } from "vue";
import SparkLine from '@/components/SparkLine.vue';

const marketCountryStockList = computed(
  () => store.state.marketCountryStockList || []
);

onMounted(() => {
  console.log(marketCountryStockList.value);
});
</script>
<style lang="less"></style>
