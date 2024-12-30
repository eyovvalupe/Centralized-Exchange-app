<template>
  <div
    class="cash_order_list w-full h-[2.3rem] border-[0.02rem] border-color rounded-[0.32rem] flex flex-col overflow-hidden">
    <div
      class="w-full h-[0.68rem] bg-color2 border-b-[0.02rem] border-b-color px-[0.32rem] flex items-center justify-between">
      <span class="text-[0.28rem] text-color2">23452345234</span>
      <span class="text-[0.28rem] text-primary">待付款</span>
    </div>
    <div class="w-full h-[1.62rem] px-[0.32rem] py-[0.2rem] flex flex-col justify-between">
      <div class="flex h-[0.5rem] items-center">
        <span class="text-[0.32rem] text-up font-semibold">买入</span>
        <span class="text-[0.32rem] text-color font-semibold">&nbsp;USDT&nbsp;</span>
        <div class="USDT_icon relative top-[-0.02rem]">
          <img :src="getStaticImgUrl(`/static/img/crypto/USDT.svg`)" alt="">
        </div>
      </div>
      <div>
        <div class="flex justify-between">
          <span class="text-[0.24rem] text-color2">价格 34 INR</span>
          <div>
            <span class="text-[0.36rem] text-color font-semibold">+6789</span>
            <span class="text-[0.24rem] text-color">&nbsp;INR</span>
          </div>
        </div>
      </div>
      <div class="text-[0.24rem] text-color2">数量 1000 USDT</div>
    </div>
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
</script>
<style lang="less">
.cash_order_list {}
</style>
