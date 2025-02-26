<!-- 首页 -->
<template>
  <div v-if="!homePage" style="border-top: 1px solid rgba(0,0,0,0)">
    <Loaidng :loading="!homePage" />
  </div>
  <homePage v-else />
</template>

<script setup>
import { shallowRef } from 'vue'
import { HOME_MODE } from "@/config.js"
import Loaidng from "@/components/Loaidng.vue"
import homePage from "@/views/Home/Homes/Home1.vue"

// const homePage = shallowRef(null)
// if (HOME_MODE == 2) {
//   import("@/views/Home/Homes/Home2.vue").then((module) => {
//     homePage.value = module.default
//   })
// }
</script>