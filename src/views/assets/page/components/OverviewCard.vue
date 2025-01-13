<template>
  <div class="assets_bg_box">
    <div class="w-full h-full absolute top-[0] left-[0rem] z-[-1] assets_bg">
      <img v-lazy="getStaticImgUrl(`/static/img/assets/overview_bg.svg`)" alt="">
    </div>
    <!-- <div class="absolute top-[-0.3rem] right-[0.3rem]">
      <img v-lazy="getStaticImgUrl(`/static/img/assets/wallet.svg`)" alt="">
    </div> -->
    <slot />
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
</script>
<style scoped>
.assets_bg_box {
  width: 100%;
  height: 5.8rem;
  position: relative;
  margin-bottom: 0.4rem;
}
.assets_bg{
  width: 100%;
  height: 100%;
}
</style>