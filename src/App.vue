<template>
  <router-view v-slot="{ Component }">
    <div v-show="pageLoading" class="full_page_loading">
      <!-- 首页骨架屏 -->
       <Skeleton v-if="routeName == 'home'" style="padding-top: 0.4rem;flex-direction: column;opacity: 0.5;" animate>
        <template #template>
          <div :style="{ display: 'flex', width: '100%' }">
            <SkeletonAvatar />
            <div style="flex: 1;"></div>
            <SkeletonAvatar />
            <SkeletonAvatar style="margin-right: 0;" />
          </div>
          <div style="margin-top: 0.32rem;">
            <SkeletonImage style="width: 100%;border-radius: 0.32rem;height: 3.48rem;" />
          </div>
          <div style="margin-top: 0.32rem;">
            <SkeletonTitle style="height: 0.48rem;" :title-width="'100%'" />
          </div>
          <div style="overflow: hidden;margin-top: 0.32rem;white-space: nowrap;">
            <SkeletonImage style="display:inline-flex;width: 4.6rem;border-radius: 0.32rem;height: 4.92rem;" />
            <SkeletonImage style="display:inline-flex;width: 4.6rem;border-radius: 0.32rem;height: 4.92rem;margin-left: 0.32rem;" />
          </div>
          <div style="margin-top: 0.32rem;">
            <SkeletonImage style="width: 100%;border-radius: 0.32rem;height: 2.54rem;" />
          </div>
          <div style="margin-top: 0.32rem;">
            <SkeletonTitle style="height: 0.48rem;" :title-width="'100%'" />
          </div>
        </template>
       </Skeleton>
       <Loading style="position: absolute;top: 50%;left: 50%;transform: translateX(-50) translateY(-50%);" v-else :type="'circular'" :size="44" color="var(--ex-primary-color)" />
    </div>
    <div v-show="!pageLoading" class="app_scroll wow_scroll">

      <transition :name="transitionName">
        <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name" />
      </transition>
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name" />
      </keep-alive>
    </div>
  </router-view>

  <BottomTabBar v-if="showBottom" />
  <!-- 登录弹窗 -->
  <LoginDialog />

  <SuccessToast :showModal="true" v-if="showSuccessToast" />
</template>

<script setup>
import { computed, watch, onMounted } from "vue";
import { Skeleton, SkeletonTitle, SkeletonAvatar, SkeletonParagraph, SkeletonImage, Loading } from "vant";
import { useRoute } from "vue-router";
import { getStaticImgUrl } from "@/utils/index.js"
import store from "@/store/index";
import { serviceChat } from "@/utils/serviceChat";
import LoginDialog from "./views/Public/LoginDialog.vue";
import SuccessToast from "./views/User/Account/SuccessToast.vue";
import BottomTabBar from "@/components/BottomTabBar.vue"
import 'wow.js/css/libs/animate.css';  // 引入动画库样式

const showSuccessToast = computed(() => store.state.showSuccessToast);

const token = computed(() => store.state.token);
if (token.value) {
  // 更新用户信息
  store.dispatch("updateUserInfo");
  store.dispatch("updateAssets");
  store.dispatch("updateWallet");
  store.dispatch("updateMyFollowList");
  store.dispatch("updateMyCopyData");
}
store.dispatch("updateCurrency"); // 获取币种等配置信息
store.dispatch("updateNotifiList")

const fullWindow = computed(() => store.state.fullscreen); // 全屏状态
store.commit("setFullscreen", false);

// 路由监听
const route = useRoute();
const routeName = computed(() => route.name);
const showBottom = computed(() => {
  return (
    [
      "home",
      "user",
      "trade",
      "market",
      "financial_info",
      "trading_rules",
      "assets",
      "transfer",
      "finance",
    ].includes(route.name) && !fullWindow.value
  );
});

// 预加载 tab 页面
const pageLoading = computed(() => store.state.pageLoading);
store.commit("setPageLoading", true);
Promise.all([
  import("@/views/Home/Home.vue"),
  import("@/views/Market/Market.vue"),
  import("@/views/User/NewUser.vue"),
  import("@/views/Trade2/trade.vue"),
  import("@/views/assets/Assets.vue"),
]).finally(() => {
  store.commit("setPageLoading", false);
});
setTimeout(() => {
  // 最多5s
  store.commit("setPageLoading", false);
}, 50000);

const transitionName = computed(() => store.state.transitionName || "");
watch(
  token,
  () => {
    serviceChat.initc2c();
    serviceChat.destroyNum();
    serviceChat.initNum();
  },
  { immediate: true }
);

onMounted(() => {


  // 这里处理点击效果
  document.body.addEventListener('touchstart', function (e) {
    // 判断触摸目标是否是按钮  水波纹效果 
    const button = e.target.closest('.ripple-btn') || e.target.closest('.ripple-primary');
    if (button) {
      // 创建水波纹元素
      const ripple = document.createElement('span');
      if (!ripple) return
      ripple.classList.add('ripple');
      // 获取按钮的尺寸和位置
      const buttonRect = button.getBoundingClientRect();
      const size = Math.max(buttonRect.width, buttonRect.height); // 水波纹的尺寸取按钮的最大边长
      // 获取触摸位置
      const touch = e.touches[0];
      const x = touch.clientX - buttonRect.left - size / 2; // 水波纹的起始位置
      const y = touch.clientY - buttonRect.top - size / 2;
      // 设置水波纹的位置和大小
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      // 将水波纹元素添加到按钮中
      button.appendChild(ripple);
      // 动画结束后移除水波纹元素
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
      return
    }
    // 判断触摸目标是否是按钮  蒙版效果
    const button2 = e.target.closest('.mask-btn');
    if (button2) {
      const ripple = document.createElement('span');
      if (!ripple) return
      ripple.classList.add('ripple');
      button2.appendChild(ripple);
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
      return
    }
  }, { passive: false });

  // 这里处理100vh的问题
  !(function (n, e) {
    function setViewHeight() {
      var windowVH = e.innerHeight / 100
      n.documentElement.style.setProperty('--vh', windowVH + 'px')
    }
    var i = 'orientationchange' in window ? 'orientationchange' : 'resize'
    n.addEventListener('DOMContentLoaded', setViewHeight)
    e.addEventListener(i, setViewHeight)
  })(document, window)

  // 这里处理vant样式里引入图片的问题
  const style = document.createElement('style');
  style.innerHTML = `
      .slider_box .van-slider .van-slider__button {
        background-image: url(${getStaticImgUrl('/static/img/user/right.svg')});
      }

      .register_accounr_dialog .search-svg-icon {
        background-image: url(${getStaticImgUrl('/static/img/common/search.svg')});
      }

      .page_bank .icon_ok {
        background-image: url(${getStaticImgUrl('/static/img/app/success.svg')});
      }

      .page_withdraw .card_box {
        background-image: url(${getStaticImgUrl('/static/img/assets/withdraw_wallet_bg.svg')});
        background-size: cover;
      }

      .withdraw_accounr_dialog .card_box {
        background-image: url(${getStaticImgUrl('/static/img/assets/withdraw_wallet_bg.svg')});
        background-size: cover;
      }
        
      .list_page {
        background-image: url(${getStaticImgUrl('/static/img/assets/withdraw_wallet_bg.svg')});
        background-size: cover;
      }

      .invite_banner1 {
        background-image: url(${getStaticImgUrl('/static/img/user/achievement.svg')});
        background-size: cover;
      }
    `;
  document.head.appendChild(style);
})

// slideBtn.map(item => {
//   item.add('ripple-primary')
// })
</script>

<style lang="less">
@import "./style/theme/blackgreen2.less";
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
  transition: all ease-in 0.2s;
}

.slide-right-enter-from {
  transform: translateX(60%);
  opacity: 0;
}

.slide-right-enter-to {
  transform: translateX(0);
}

.slide-right-leave-from {
  transform: translateX(0);
}

.slide-right-leave-to {
  transform: translateX(-60%);
  opacity: 0;
}

.slide-bottom-enter-from {
  transform: translateY(60%);
  opacity: 0;
}

.slide-bottom-enter-to {
  transform: translateY(0);
}

.slide-bottom-leave-from {
  transform: translateY(0);
}

.slide-bottom-leave-to {
  transform: translateY(-60%);
  opacity: 0;
}

.slide-left-enter-from {
  transform: translateX(-60%);
  opacity: 0;
}

.slide-left-enter-to {
  transform: translateX(0);
}

.slide-left-leave-from {
  transform: translateX(0);
}

.slide-left-leave-to {
  transform: translateX(60%);
  opacity: 0;
}

.slide-top-enter-from {
  transform: translateY(-60%);
  opacity: 0;
}

.slide-top-enter-to {
  transform: translateY(0);
}

.slide-top-leave-from {
  transform: translateY(0);
}

.slide-top-leave-to {
  transform: translateY(60%);
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

.full_page_loading {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  // left: 50%;
  // top: 40%;
  // transform: translateX(-50%) translateY(-50%);
}
</style>
