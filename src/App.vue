<template>
  <router-view v-slot="{ Component }">
    <div class="app_scroll">
      <transition :name="transitionName">
        <keep-alive v-if="$route.meta.keepAlive">
          <component :is="Component" :key="$route.name" />
        </keep-alive>
        <component :is="Component" :key="$route.name" v-else />
      </transition>
    </div>
  </router-view>

  <BottomTabBar v-if="showBottom" />
</template>

<script setup>
import { onMounted, ref, defineAsyncComponent, computed } from "vue";
import store from "@/store/index";
// import { nanoid } from "nanoid";
import { useRoute } from "vue-router";

const loading = ref(true); // 控制全局组件加载
const BottomTabBar = defineAsyncComponent(() =>
  import("@/components/BottomTabBar.vue")
);
console.error("---storage---");
console.error(store.state)

// 引入主题
const theme = computed(() => store.state.theme || '')
console.log(theme.value)
if (theme.value) {
  import(`@/style/theme/${theme.value}.less`)
}

// 路由监听
const route = useRoute();
const routeName = computed(() => route.name)
const showBottom = computed(() => {
  return ["home", "user", 'trade'].includes(route.name) && !loading.value;
});



onMounted(() => {
  setTimeout(() => {
    loading.value = false;

    const reboundPage = ['user']
    // 回弹效果
    let startY = 0
    const maxMove = 200
    const body = document.querySelector('#app')
    const app = document.querySelector('.app_scroll')
    body.addEventListener('touchstart', e => {
      if (!reboundPage.includes(routeName.value)) return
      startY = e.changedTouches[0].clientY
    })
    body.addEventListener('touchmove', e => {
      if (!reboundPage.includes(routeName.value)) return
      const y = e.changedTouches[0].clientY - startY <= maxMove ? e.changedTouches[0].clientY - startY : maxMove
      app.style.transition = "none"
      app.style.transform = `translateY(${0.3 * y}px)`
    })
    body.addEventListener("touchend", e => {
      const y = e.changedTouches[0].clientY - startY
      app.style.transition = "transform .6s"
      app.style.transform = `translateY(0px)`
    })
  }, 300);
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
