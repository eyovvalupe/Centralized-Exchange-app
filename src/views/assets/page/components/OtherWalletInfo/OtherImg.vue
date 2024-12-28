<template>
  <div class="absolute top-[0.05rem] right-[0] z-[-1]">
    <div style="width:2.94rem;height:2.42rem">
      <img :src="getStaticImgUrl('/static/icons/default.svg')" alt="">
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
</script>
