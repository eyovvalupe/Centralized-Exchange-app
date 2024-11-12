<template>
  <div class="w-[7.5rem] h-[4.01rem] relative">
    <div class="absolute top-[0] left-[0rem] z-[-1]">
      <BackgroundImage />
    </div>
    <slot />
  </div>
</template>
<script setup>
import BackgroundImage from "./BackgroundImage.vue";
</script>
