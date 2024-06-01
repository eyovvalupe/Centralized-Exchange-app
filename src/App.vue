<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName">
      <keep-alive v-if="$route.meta.keepAlive">
        <component :is="Component" :key="$route.name" />
      </keep-alive>
      <component :is="Component" :key="$route.name" v-else />
    </transition>
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

// if (store.state.token) {
//   store.dispatch("updateUserInfo");
// }

const loading = ref(true);
const showBottom = computed(() => {
  return ["home", "user"].includes(route.name) && !loading.value;
});

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 500);
});

const transitionName = computed(() => store.state.transitionName || '')
</script>

<style lang="less">
@import "./style/var.less";
@import "./style/vant.less";
@import "./style/index.less";

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active,
.slide-top-enter-active,
.slide-top-leave-active,
.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: all ease 0.2s;
}

.slide-right-enter-from {
  transform: translateX(0);
}

.slide-right-enter-to {
  transform: translateX(-100%);
}

.slide-right-leave-from {
  transform: translateX(0);
}

.slide-right-leave-to {
  transform: translateX(-100%);
}

.slide-bottom-enter-from {
  transform: translateY(0);
}

.slide-bottom-enter-to {
  transform: translateY(-100%);
}

.slide-bottom-leave-from {
  transform: translateY(0);
}

.slide-bottom-leave-to {
  transform: translateY(-100%);
}

.slide-left-enter-from {
  transform: translateX(-200%);
}

.slide-left-enter-to {
  transform: translateX(-100%);
}

.slide-left-leave-from {
  transform: translateX(0);
}

.slide-left-leave-to {
  transform: translateX(100%);
}

.slide-top-enter-from {
  transform: translateY(-200%);
}

.slide-top-enter-to {
  transform: translateY(-100%);
}

.slide-top-leave-from {
  transform: translateY(0);
}

.slide-top-leave-to {
  transform: translateY(100%);
}
</style>
