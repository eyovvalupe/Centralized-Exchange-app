<template>
  <div class="absolute top-[0] left-[0] z-[-1] rounded-[0.32rem]">
    <div style="width:6.86rem;height:3.04rem">
      <img :src="getStaticImgUrl('/static/icons/wallet_bg.svg')" alt="">
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
</script>
