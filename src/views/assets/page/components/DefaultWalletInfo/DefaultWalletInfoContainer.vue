<template>
  <div class="rounded-[0.32rem] wallet_bg_box">
    <div class="wallet_bg">
      <img :src="getStaticImgUrl('/static/img/assets/wallet_bg.svg')" alt="">
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
</script>

<style lang="css" scoped>
.wallet_bg_box{
  width: 100%;
  position: absolute;
  left:0;
  top:0;
  z-index: -1;
}
.wallet_bg {
  width:6.7rem;
  height:4rem;
  margin: 0 auto;
}
</style>