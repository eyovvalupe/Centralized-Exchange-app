<!-- 底部导航 -->
<template>
  <div class="max-width bottom_nav2" >
    <div class="nav_box">
      <div class="bottom_nav_item" v-for="(nav) in navs" :key="nav.route" @touchstart="handleClick(nav, $event)" @click="handleClick(nav)"
        :class="[checkActive(nav) ? 'bottom_nav_active' : '']">
        <div class="bn_con">
          <div class="bottom_nav_icon">
            <img v-if="!checkActive(nav)" :src="getStaticImgUrl(nav.icon)">
            <img v-if="checkActive(nav)" :src="getStaticImgUrl(nav.icon2)">
          </div>
          <div class="bottom_nav_name">
            {{ nav.name }}
          </div>
          <div v-if="store.state.c2cUnreadTotal > 0 && item.route == 'market'" class="nav_num">
            {{ store.state.c2cUnreadTotal }}
          </div>
        </div>
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

  { name: t("home.trade"), route: "trade", icon: "/static/img/bottom/jiaoyi1.svg", icon2: "/static/img/bottom/jiaoyi2.svg" },
  {
    name: t('home.finance'),
    route: "finance",
    children: ["market_info", "financial_info", "trading_rules"],
    icon: "/static/img/bottom/licai1.svg",
    icon2: "/static/img/bottom/licai2.svg",
  },
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
.bottom_nav2 {
  background-color:var(--ex-bg-color3);
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
  &::before{
    content: '';
    width: 100%;
    height: 1px;
    background-color: var(--ex-border-color);
    position: absolute;
    left:0;
    top:0;
  }
  .nav_box {
    flex: 1;
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding-top: 0.14rem;

    .bottom_nav_item {
      flex: 1;
      justify-content: space-between;
      width: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;

      .bn_con {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--ex-text-color3);
        font-size: 0.24rem;
        position: relative;

        .bottom_nav_icon {
          width: 0.56rem;
          height: 0.56rem;
          margin-bottom: 0.08rem;
        }

        .nav_num {
          width: 0.32rem;
          height: 0.32rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ff3b30;
          font-size: 0.2rem;
          color: #fff;
          font-weight: 400;
          border-radius: 50%;
          position: absolute;
          top: 0.26rem;
          right: 0.3rem;
        }

      }
    }

    .bottom_nav_active {
      .bn_con {
        color: var(--ex-primary-color);
      }

    }
  }
}
</style>