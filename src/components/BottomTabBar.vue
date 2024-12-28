<!-- 底部导航 -->
<template>
  <div class="max-width bottom_nav">
    <div v-for="(item, i) in navs" :key="i" class="bottom_nav_item"
      :class="[checkActive(item) ? 'bottom_nav_active' : '']" @touchstart="handleClick(item, $event)"
      @click="handleClick(item)">
      <div class="bottom_nav_icon">
        <img v-if="!checkActive(item)" :src="getStaticImgUrl(item.icon)" alt="">
        <img v-if="checkActive(item)" :src="getStaticImgUrl(item.icon2)" alt="">
      </div>

      <div class="bottom_nav_name">
        {{ item.name }}
      </div>

      <!-- c2c角标 -->
      <div v-if="item.route == 'market' && store.state.c2cUnreadTotal > 0" class="bg-unread-msg bg-unread-msg-text-color">
        {{ store.state.c2cUnreadTotal }}
      </div>
      <!-- 角标 -->
      <div v-if="item.route == 'user' && storeChat.state.messageNum > 0" class="bg-unread-msg bg-unread-msg-text-color">
        {{ storeChat.state.messageNum }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
// import { _playVoice } from "@/utils/voice"
import eventBus from "@/utils/eventBus";

import store from "@/store";
import storeChat from "@/store/chat";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const activeRoute = computed(() => route.name);
const token = computed(() => store.state.token);

const navs = ref([
  { name: t("home.homepage"), route: "home", icon: "/static/img/bottom/shouye1.svg", icon2: "/static/img/bottom/shouye2.svg" },
  {
    name: t("home.market"),
    route: "market",
    children: ["market_info", "financial_info", "trading_rules"],
    icon: "/static/img/bottom/shichang1.svg",
    icon2: "/static/img/bottom/shichang2.svg",
  },
  { name: t("home.trade"), route: "trade", icon: "/static/img/bottom/jiaoyi1.svg", icon2: "/static/img/bottom/jiaoyi2.svg" },
  {
    name: t("home.assets"),
    route: "assets",
    children: ["transfer"],
    icon: "/static/img/bottom/zichan1.svg",
    icon2: "/static/img/bottom/zichan2.svg",
    needLogin: true,
  },
  {
    name: t("home.user"),
    route: "user",
    children: ["account"],
    icon: "/static/img/bottom/yonghu1.svg",
    icon2: "/static/img/bottom/yonghu2.svg",
  },
]);

const touchLoading = ref(false);
const handleClick = (item, e) => {
  if (!item.route) return;
  if (touchLoading.value) return;
  touchLoading.value = true;
  setTimeout(() => {
    touchLoading.value = false;
  }, 300);
  // _playVoice()
  if (item.needLogin && !token.value) {
    // return router.push({
    //     name: 'login',
    //     query: {
    //         reurl: route.name
    //     }
    // })
    eventBus.on("loginSuccess", () => {
      // 登录成功后继续跳转
      router.push({
        name: item.route,
      });
    });
    eventBus.on("loginFail", () => {
      // 关闭弹窗后移除监听
      eventBus.off("loginSuccess");
      eventBus.off("loginFail");
    });
    store.commit("setIsLoginOpen", true);
    return;
  }
  store.commit("setBottomTabBarValue", item.route);
  router.push({
    name: item.route,
  });
  if (item.route == "assets") {
    store.dispatch("updateAssets");
  }
};

const checkActive = (item) => {
  if (
    activeRoute.value == item.route ||
    (item.children && item.children.includes(activeRoute.value))
  )
    return true;
  return false;
};
</script>

<style scoped lang="less">
.bottom_nav {
  border-top: 1px solid var(--ex-border-color);
  background-color: var(--ex-bg-color);
  display: flex;
  position: fixed;
  overflow: hidden;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.4rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;

  .bottom_nav_item {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--ex-text-color2);
    position: relative;

    .bottom_nav_name {
      font-size: 0.24rem;
      line-height: 0.32rem;
      margin-top: 0.1rem;
    }

    .bottom_nav_icon {
      width: 0.48rem;
      height: 0.48rem;
      font-size: 0.48rem;
      object-fit: contain;
    }

    .nav_num {
      width: 0.32rem;
      height: 0.32rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.2rem;
      font-weight: 400;
      border-radius: 50%;
      position: absolute;
      top: 0.26rem;
      right: 0.3rem;
    }
  }

  .bottom_nav_active {
    color: var(--ex-primary-color);
  }
}
</style>
