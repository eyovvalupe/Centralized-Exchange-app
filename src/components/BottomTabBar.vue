<!-- 底部导航 -->
<template>
  <div class="max-width bottom_nav2"
    :style="{ backgroundImage: `url(${getStaticImgUrl('/static/bottombar2/bg.png')})` }">
    <div class="nav_box">
      <div class="bottom_nav_item" @touchstart="handleClick(navs[0], $event)" @click="handleClick(navs[0])"
        :class="[checkActive(navs[0]) ? 'bottom_nav_active' : '']">
        <div class="bn_con">
          <div class="bottom_nav_icon">
            <img v-if="!checkActive(navs[0])" :src="getStaticImgUrl(navs[0].icon)" alt="">
            <img v-if="checkActive(navs[0])" :src="getStaticImgUrl(navs[0].icon2)" alt="">
          </div>
          <div class="bottom_nav_name">
            {{ navs[0].name }}
          </div>
        </div>
      </div>
      <div class="bottom_nav_item" @touchstart="handleClick(navs[1], $event)" @click="handleClick(navs[1])"
        style="align-items: flex-end;" :class="[checkActive(navs[1]) ? 'bottom_nav_active' : '']">
        <div class="bn_con">
          <div class="bottom_nav_icon">
            <img v-if="!checkActive(navs[1])" :src="getStaticImgUrl(navs[1].icon)" alt="">
            <img v-if="checkActive(navs[1])" :src="getStaticImgUrl(navs[1].icon2)" alt="">
          </div>
          <div class="bottom_nav_name">
            {{ navs[1].name }}
          </div>

          <div v-if="store.state.c2cUnreadTotal > 0" class="nav_num">
            {{ store.state.c2cUnreadTotal }}
          </div>
        </div>
      </div>
    </div>
    <div class="nav_curr">
      <div class="curr" @touchstart="handleClick(navs[2], $event)" @click="handleClick(navs[2])">
        <div class="curr_icon">
          <img :src="getStaticImgUrl('/static/bottombar2/curr.svg')" alt="">
        </div>
      </div>
    </div>
    <div class="nav_box">
      <div class="bottom_nav_item" @touchstart="handleClick(navs[3], $event)" @click="handleClick(navs[3])"
        style="align-items: flex-start;" :class="[checkActive(navs[3]) ? 'bottom_nav_active' : '']">
        <div class="bn_con">
          <div class="bottom_nav_icon">
            <img v-if="!checkActive(navs[3])" :src="getStaticImgUrl(navs[3].icon)" alt="">
            <img v-if="checkActive(navs[3])" :src="getStaticImgUrl(navs[3].icon2)" alt="">
          </div>
          <div class="bottom_nav_name">
            {{ navs[3].name }}
          </div>
        </div>
      </div>
      <div class="bottom_nav_item" @touchstart="handleClick(navs[4], $event)" @click="handleClick(navs[4])"
        :class="[checkActive(navs[4]) ? 'bottom_nav_active' : '']">
        <div class="bn_con">
          <div class="bottom_nav_icon">
            <img v-if="!checkActive(navs[4])" :src="getStaticImgUrl(navs[4].icon)" alt="">
            <img v-if="checkActive(navs[4])" :src="getStaticImgUrl(navs[4].icon2)" alt="">
          </div>
          <div class="bottom_nav_name">
            {{ navs[4].name }}
          </div>

          <div v-if="storeChat.state.messageNum > 0" class="nav_num">
            {{ storeChat.state.messageNum }}
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
.bottom_nav2 {
  background-size: 100% 100%;
  display: flex;
  position: fixed;
  overflow: hidden;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;

  .nav_curr {
    width: 2.4rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 0.16rem;

    .curr {
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: var(--ex-text-color3);

      .curr_icon {
        width: 0.64rem;
        height: 0.64rem
      }
    }
  }

  .nav_box {
    flex: 1;
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding-top: 0.68rem;

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