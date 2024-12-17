<!-- 首页 -->
<template>
  <Loaidng v-if="!homePage" :loading="!homePage" />
  <homePage v-else />
</template>

<script setup>
import { ref } from 'vue'
import { HOME_MODE } from "@/config.js"
import Loaidng from "@/components/Loaidng.vue"

const homePage = ref(null)
if (HOME_MODE == 1) { // 首页模板1
  import("@/views/Home/Homes/Home1.vue").then((module) => {
    homePage.value = module.default
  })
}
</script>