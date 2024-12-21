<template>
  <div class="w-[7.5rem] h-[4.01rem] relative">
    <div class="absolute top-[0] left-[0rem] z-[-1]" style="width: 7.5rem;height: 4.01rem;">
      <img :src="getStaticImgUrl(`/static/icons/wallet_bg16.svg`)" alt="">
    </div>
    <slot />
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
</script>
