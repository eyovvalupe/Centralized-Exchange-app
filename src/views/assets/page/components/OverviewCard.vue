<template>
  <div class="assets_bg_box">
    <div class="absolute top-[0] left-[0rem] z-[-1] assets_bg">
      <img :src="getStaticImgUrl(`/static/icons/wallet_bg16.svg`)" alt="">
    </div>
    <slot />
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
</script>
<style scoped>
.assets_bg_box {
  width: 7.5rem;
  height: 4.01rem;
  position: relative;
}
.assets_bg{
  width: 100%;
  height: 100%;
}
</style>