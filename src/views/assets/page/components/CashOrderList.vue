<template>
  <div
    class="cash_order_list w-full h-[2.3rem] border-[0.02rem] border-[#eff3f8] rounded-[0.32rem] flex flex-col overflow-hidden">
    <div
      class="w-full h-[0.68rem] bg-[#f5f7fc] border-b-[0.02rem] border-b-[#eff3f8] px-[0.32rem] flex items-center justify-between">
      <span class="text-[0.28rem] text-[#666666]">23452345234</span>
      <span class="text-[0.28rem] text-[#014cfa]">待付款</span>
      <!-- #014cfa #18b762 #8f92a1 -->
    </div>
    <div class="w-full h-[1.62rem] px-[0.32rem] py-[0.2rem] flex flex-col justify-between">
      <div class="flex h-[0.5rem] items-center">
        <span class="text-[0.32rem] text-[#18b762] font-semibold">买入</span>
        <!-- #18b762 #e8503a -->
        <span class="text-[0.32rem] text-[#061023] font-semibold">&nbsp;USDT&nbsp;</span>
        <div class="USDT_icon relative top-[-0.02rem]">
          <img :src="getStaticImgUrl(`/static/img/crypto/USDT.png`)" alt="">
        </div>
      </div>
      <div>
        <div class="flex justify-between">
          <span class="text-[0.24rem] text-[#666d80]">价格 34 INR</span>
          <div>
            <span class="text-[0.36rem] text-[#061023] font-semibold">+6789</span>
            <span class="text-[0.24rem] text-[#121826]">&nbsp;INR</span>
          </div>
        </div>
      </div>
      <div class="text-[0.24rem] text-[#666d80]">数量 1000 USDT</div>
    </div>
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
</script>
<style lang="less">
.cash_order_list {}
</style>
