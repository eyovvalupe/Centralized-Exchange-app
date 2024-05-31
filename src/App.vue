<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
  </router-view>
  <BottomTabBar v-if="showBottom" />
</template>

<script setup>
import { onMounted, ref, defineAsyncComponent, computed } from "vue";
import store from "@/store/index";
// import { nanoid } from "nanoid";
import { useRoute } from "vue-router";

const route = useRoute();
const BottomTabBar = defineAsyncComponent(() =>
  import("@/components/BottomTabBar.vue")
);
console.error("---storage---");
console.error(store.state)

if (store.state.token) {
  store.dispatch("updateUserInfo");
}

const loading = ref(true);
const showBottom = computed(() => {
  return ["home", "user"].includes(route.name) && !loading.value;
});

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<style lang="less">
@import "./style/var.less";
@import "./style/vant.less";
@import "./style/index.less";
</style>
