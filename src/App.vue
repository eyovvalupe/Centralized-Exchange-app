<template>
  <router-view v-slot="{ Component }">
    <Loading v-show="pageLoading" size="48"
      style="position: fixed;top:30%;left:50%;transform: translateX(-50%) translateY(-50%);" :loading="pageLoading" />
    <div class="app_scroll" v-show="!pageLoading">
      <transition :name="transitionName">
        <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
      </transition>
      <keep-alive>
        <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
      </keep-alive>
    </div>
  </router-view>

  <BottomTabBar v-if="showBottom" />

  <DateBottom v-if="showDateBottom" />

  <Popup
    v-model:show="showOpenPositionBottom"
    position="bottom"
    closeable
    :style="{height: popupHeight}"
    :class="['detail-popup', { keypadding: keyborader }]"
    @close="closePopup"
    v-if="showOpenPositionBottom"
  >
    <component :is="popupComponent" />
  </Popup>

</template>

<script setup>
import { defineAsyncComponent, computed } from "vue";
import store from "@/store/index";
// import { nanoid } from "nanoid";
import { Popup } from 'vant';
import Loading from "@/components/Loaidng.vue";
import DateBottom from '@/views/trade/DateBottom.vue'
import { useRoute } from "vue-router";

const BottomTabBar = defineAsyncComponent(() =>
  import("@/components/BottomTabBar.vue")
);
console.error("---storage---");
console.error(store.state)

// 引入主题
// const theme = computed(() => store.state.theme || '')

// if (theme.value) {
//   import(`@/style/theme/${theme.value}.less`)
// }

//弹窗组件
const showOpenPositionBottom = computed(() => store.state.showOpenPositionBottom)
const popupHeight = computed(() => store.state.popupHeight)
const popupComponent = computed(() => store.state.popupComponent)
const keyborader = computed(() => store.state.keyborader)
const closePopup = ()=>{
  store.dispatch('closePopup')
}


const token = computed(() => store.state.token)
if (token.value) { // 更新用户信息
  store.dispatch('updateUserInfo')
}

const fullWindow = computed(() => store.state.fullscreen) // 全屏状态
store.commit('setFullscreen', false)

// 路由监听
const route = useRoute();
const routeName = computed(() => route.name)
const showBottom = computed(() => {
  return ["home", "user", "trade", "market", "market_info", "financial_info", "trading_rules"].includes(route.name) && !pageLoading.value && !fullWindow.value;
});

const showDateBottom = computed(() => {
  return ["date"].includes(route.name);
});


// 预加载 tab 页面
const pageLoading = computed(() => store.state.pageLoading)
store.commit('setPageLoading', true)
Promise.all([
  import('@/views/Home/Home.vue'),
  import('@/views/Market/Market.vue'),
  import('@/views/User/User.vue'),
  import('@/views/trade/trade.vue'),
]).finally(() => {
  store.commit('setPageLoading', false)
  setTimeout(() => {
    boundFunc()
  }, 500)
})

const boundFunc = () => {
  const reboundPage = ['user', 'trade', 'date']
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
}

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
.slide-bottom-leave-active,
.opacity-enter-active,
.opacity-leave-active {
  transition: all ease 0.3s;
}

.slide-right-enter-from {
  // transform: translateX(0);
  opacity: 0;
}

.slide-right-enter-to {
  transform: translateX(-100%);
}

.slide-right-leave-from {
  // transform: translateX(0);
}

.slide-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-bottom-enter-from {
  // transform: translateY(0);
  opacity: 0;
}

.slide-bottom-enter-to {
  transform: translateY(-100%);
}

.slide-bottom-leave-from {
  // transform: translateY(0);
}

.slide-bottom-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-left-enter-from {
  transform: translateX(-200%);
  opacity: 0;
}

.slide-left-enter-to {
  transform: translateX(-100%);
}

.slide-left-leave-from {
  // transform: translateX(0);
}

.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-top-enter-from {
  transform: translateY(-200%);
  opacity: 0
}

.slide-top-enter-to {
  transform: translateY(-100%);
}

.slide-top-leave-from {
  transform: translateY(0);
}

.slide-top-leave-to {
  transform: translateY(100%);
  opacity: 0;
}



.opacity-enter-from {
  opacity: 0;
}

.opacity-enter-to {
  opacity: 1;
}

.opacity-leave-from {
  opacity: 1;
}

.opacity-leave-to {
  opacity: 0;
}

.date-bottom {
  width: 100%;
  height: 71px;
  background-color: #f7f7f7;
  position: fixed;
  bottom: 0;
}
</style>
