<template>
  <div
    class="flex w-full h-[2.18rem] border-[0.02rem] border-[#EFF3F8] bg-[#F5F7FC] rounded-[0.32rem] mb-[0.32rem]"
  >
    <div
      class="flex flex-col items-center justify-center bg-white border-[0.02rem] rounded-[0.32rem] border-[#EFF3F8] w-[1.04rem]"
    >
      <div class="text-[0.28rem] text-[#061023] mb-[0.2rem]">今日</div>
      <div class="text-[0.28rem] text-[#061023] mb-[0.2rem]">指数</div>
      <div class="text[0.24rem] text-[#666D80]">{{ formatDate(new Date) }}</div>
    </div>
    <HomeCountry />
  </div>
</template>
<script setup>
import HomeCountry from '@/components/HomeCountry.vue'

function formatDate(date) {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${month}/${day}`;
}
</script>
<style lang="less"></style>
