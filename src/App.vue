<template>
  <router-view v-slot="{ Component }">
    <div v-show="pageLoading" class="full_page_loading">
      <!-- 首页骨架屏 -->
      <Skeleton class="max-width home-skeleton" v-if="routeName == 'home'"
        style="padding: 0.08rem 0.32rem 0 0.32rem;flex-direction: column;opacity: 0.5;" animate>
        <template #template>
          <div :style="{ display: 'flex', width: '100%' }">
            <div style="flex: 1;"></div>
            <SkeletonAvatar class="avatar" />
            <SkeletonAvatar class="avatar" />
            <SkeletonAvatar class="avatar" />
            <SkeletonAvatar class="avatar" style="margin-right: 0;" />
          </div>
          <div class="box top">
            <div>安全 | 便捷 | 严格</div>
            <div class="title"><span style="color: #F19009;">千万用户都在用的</span><br />交易所</div>
            <div>体验无限可能</div>
          </div>
          <div v-if="!token" class="login-btn">登录/注册</div>
          <div v-else style="height: 1.2rem;"></div>

          <div class="box dirs">
            <div class="dir-b " :style="{ backgroundImage: `url(${getStaticImgUrl('/static/home2/dir-b-bg2.png')})` }">
              <div class="dir-b-box">
                <div class="dir-b-icon">
                  <img v-lazy="getStaticImgUrl('/static/home2/dir-ai.svg')" alt="">
                </div>
                <div>{{ t('trade.left_bot') }}</div>
              </div>
            </div>
            <div class="dir-b " :style="{ backgroundImage: `url(${getStaticImgUrl('/static/home2/dir-b-bg1.png')})` }">
              <div class="dir-b-box">
                <div class="dir-b-icon">
                  <img v-lazy="getStaticImgUrl('/static/home2/dir-follow.svg')" alt="">
                </div>
                <div>{{ t('copy.title') }}</div>
              </div>
            </div>
            <div class="dir-s ">
              <div class="dir-s-icon">
                <img v-lazy="getStaticImgUrl('/static/home2/dir-s-1.svg')" alt="">
              </div>
              <div>{{ t('common.spot') }}</div>
            </div>
            <div class="dir-s ">
              <div class="dir-s-icon">
                <img v-lazy="getStaticImgUrl('/static/home2/dir-s-2.svg')" alt="">
              </div>
              <div>{{ t('common.crypto') }}</div>
            </div>
            <div class="dir-s ">
              <div class="dir-s-icon">
                <img v-lazy="getStaticImgUrl('/static/home2/dir-s-3.svg')" alt="">
              </div>
              <div>{{ t('finance.defi_borrow') }}</div>
            </div>
            <div class="dir-s ">
              <div class="dir-s-icon">
                <img v-lazy="getStaticImgUrl('/static/home2/dir-s-4.svg')" alt="">
              </div>
              <div class="mx-[0.1rem]">{{ t('finance.portfolio_title') }}</div>
            </div>
          </div>

          <!-- 轮播 -->
          <div class="box banners-box">
            <div class="left-banner">
            </div>
            <div>
              <div class="right-banner">
              </div>
              <div class="right-banner" style="margin-top: 0.24rem;height: 2.36rem;">
              </div>
            </div>
          </div>

        </template>
      </Skeleton>
      <Loading style="position: absolute;top: 50%;left: 50%;transform: translateX(-50%) translateY(-50%);" v-else
        :type="'circular'" :size="44" color="var(--ex-primary-color)" />
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
import { useI18n } from "vue-i18n";
import 'wow.js/css/libs/animate.css';  // 引入动画库样式

const { t } = useI18n();
const showSuccessToast = computed(() => store.state.showSuccessToast);

const token = computed(() => store.state.token);
if (token.value) {
  // 更新用户信息
  store.dispatch("updateUserInfo");
  store.dispatch("updateAssets");
  store.dispatch("updateWallet");
  store.dispatch("updateMyFollowList");
  store.dispatch("updateMyCopyData");
  store.dispatch("updateNotifiJoinList");
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
      "tradeInfo",
    ].includes(route.name) && !fullWindow.value
  );
});

// 预加载 tab 页面
const pageLoading = computed(() => store.state.pageLoading);
store.commit("setPageLoading", true);
Promise.all([
  import("@/views/Home/Home.vue"),
  import("@/views/Trade3/Index.vue"),
  import("@/views/Trade3/Info.vue"),
  import("@/views/Finance/Index.vue"),
  import("@/views/assets/Assets.vue"),
]).finally(() => {
  setTimeout(() => {
    store.commit("setPageLoading", false);
  }, 100)
});
setTimeout(() => {
  // 最多5s
  store.commit("setPageLoading", false);
}, 50000);

const transitionName = computed(() => store.state.transitionName || "");
console.log(transitionName.value)
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

    const button3 = e.target.closest('.mask-btn-stock');
    if (button3) {
      const ripple = document.createElement('span');
      if (!ripple) return
      ripple.classList.add('ripple');
      button3.appendChild(ripple);
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
      return
    }

    const button4 = e.target.closest('.ripple-info');
    if (button4) {
      const scaleElemnt = button4.querySelector('.active_animation')
      scaleElemnt.classList.add('scale-animation');
      scaleElemnt.addEventListener('animationend', () => {
        scaleElemnt.classList.remove('scale-animation');
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

  .home-skeleton {
    margin: 0 auto;

    .avatar {
      width: 0.72rem;
      height: 0.72rem;
      margin-right: 0;
      margin-left: 0.12rem;
    }

    .top {
      font-size: 0.4rem;
      font-weight: 400;
      margin: 1.44rem 0 0 0;

      .title {
        font-size: 0.8rem;
        font-style: normal;
        font-weight: 900;
        line-height: 1rem;
        margin: 0.34rem 0;
      }
    }

    .login-btn {
      width: 6.7rem;
      height: 1rem;
      border-radius: 1.2rem;
      background-color: var(--ex-primary-color);
      color: var(--ex-white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.36rem;
      font-style: normal;
      font-weight: 600;
      margin: 0.8rem auto 0 auto;
    }

    .dirs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      margin-top: 1.2rem;

      .dir-b {
        width: 3.38rem;
        height: 2.16rem;
        border-radius: 0.32rem;
        margin-bottom: 0.12rem;
        background-color: var(--ex-bg-white2);
        background-size: 100% 100%;
        padding: 0.24rem;

        .dir-b-box {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-size: 0.32rem;
          color: var(--ex-white);

          .dir-b-icon {
            width: 0.48rem;
            height: 0.48rem;
            margin-right: 0.16rem;
          }
        }
      }

      .dir-s {
        width: 1.64rem;
        height: 1.54rem;
        border-radius: 0.32rem;
        background-color: var(--ex-bg-color3);
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 0.24rem;
        color: var(--ex-white);
        text-align: center;

        .dir-s-icon {
          width: 0.6rem;
          height: 0.6rem;
          margin-bottom: 0.12rem;
        }
      }
    }

    .banners-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.4rem;


      .left-banner {
        width: 3.28rem;
        height: 5.34rem;
        border-radius: 0.4rem;
        background-color: var(--ex-bg-color3);

      }

      .right-banner {
        width: 3.28rem;
        height: 2.76rem;
        border-radius: 0.3rem;
        background-color: var(--ex-bg-color3);

      }
    }
  }
}
</style>
