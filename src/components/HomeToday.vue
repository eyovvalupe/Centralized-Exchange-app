<template>
  <div
    class="flex w-full h-[2.18rem] border-[0.02rem] border-color bg-color2 rounded-[0.32rem] mb-[0.32rem]"
  >
    <div
      class="flex flex-col items-center justify-center bg-color border-[0.02rem] rounded-[0.32rem] border-color w-[1.04rem]"
    >
      <div class="text-[0.28rem] text-color mb-[0.2rem]">{{$t("home.today")}}</div>
      <div class="text-[0.28rem] text-color mb-[0.2rem]">{{$t("home.index")}}</div>
      <div class="text[0.24rem] text-color2">{{ formatDate(new Date) }}</div>
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
