<!-- 个人中心 -->
<template>
  <div class="page page_user">
    <!-- 标题 -->
    <!-- <div class="title">用户</div> -->
    <div class="flex items-center justify-between h-[0.98rem] mt-[0.28rem] mb-[0.2rem]">
      <div v-if="token" class="flex items-center justify-center -ml-[0.08rem] gap-[0.16rem]">
        <div class="default-avatar">
          <img :src="getStaticImgUrl('/static/icons/avatar.svg')" alt="">
        </div>
        <div>
          <div class="text-color text-[0.32rem] mb-[0.1rem]">
            {{ userInfo.username || "--" }}
          </div>
          <div class="text-color2 text-[0.28rem]">
            ID:{{ userInfo.uid || "--" }}
          </div>
        </div>
      </div>
      <div v-else class="flex items-center -ml-[0.08rem] gap-[0.16rem]" @click="store.commit('setIsLoginOpen', true)">
        <div class="default-avatar">
          <img :src="getStaticImgUrl('/static/icons/avatar.svg')" alt="">
        </div>
        <div class="text-[0.32rem]">{{ $t("user_page.login_out") }}</div>
      </div>
      <div class="flex items-center justify-center gap-[0.16rem]">
        <div @click="jump('chat', false)"
          class="w-[0.72rem] h-[0.72rem] rounded-[50%] border-color border-[0.02rem] flex items-center justify-center">
          <div class="w-[0.4rem] h-[0.4rem]">
            <img :src="getStaticImgUrl('/static/img/user/serverB.svg')" alt="server" />
          </div>
        </div>
        <div
          class="w-[0.72rem] h-[0.72rem] rounded-[50%] border-color border-[0.02rem] flex items-center justify-center">
          <div class="setting-icon">
            <img :src="getStaticImgUrl('/static/icons/setting.svg')" alt="server" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center bg-color2 rounded-[0.32rem] w-full h-[1.22rem] mb-[0.2rem]">
      <div class="w-1/3 text-center">
        <div class="font-bold text-color text-[0.32rem] mb-[0.12rem]">
          0
        </div>
        <div class="text-[0.24rem] text-color3">{{ $t("user_page.recommended_user") }}</div>
      </div>
      <div class="w-1/3 text-center">
        <div class="font-bold text-color text-[0.32rem] mb-[0.12rem]">
          0
        </div>
        <div class="text-[0.24rem] text-color3">{{ $t("user_page.social_user") }}</div>
      </div>
      <div class="w-1/3 text-center">
        <div class="font-bold text-color text-[0.32rem] mb-[0.12rem]">
          0
        </div>
        <div class="text-[0.24rem] text-color3">{{ $t("user_page.recommend_bonus") }}</div>
      </div>
    </div>
    <div class="rounded-[0.32rem] h-[1.6rem] overflow-hidden">
      <!-- @click=" token ? jump('register', false, { guest: 1 }) : jump('kyc') -->
      <Carousel :autoplay="3000" :wrap-around="true" :mouseDrag="true" v-model="currentSlide" class="relative">
        <Slide v-for="(slide, index) in slides" :key="index">
          <img :src="slide" class="w-full rounded-[0.36rem]" alt="img" />
          <div class="absolute left-0 ml-[0.32rem]">
            <div class="text-white text-[0.3rem] font-bold mb-[0.2rem]">
              {{ $t("user_page.ad_head") }}
            </div>
            <div class="text-white text-[0.24rem]">{{ $t("user_page.ad_con1") }}，{{ $t("user_page.ad_con2") }}</div>
          </div>
        </Slide>
      </Carousel>
      <div class="flex gap-[0.05rem] justify-center relative -mt-[0.2rem]">
        <div class="w-[0.2rem] h-[0.06rem] rounded-[1rem] bg-color" :class="[currentSlide == 0 ? '' : 'opacity-50']">
        </div>
        <div class="w-[0.2rem] h-[0.06rem] rounded-[1rem] bg-color" :class="[currentSlide == 1 ? '' : 'opacity-50']">
        </div>
      </div>
    </div>
    <div class="flex items-center w-full mb-[0.84rem] mt-[0.4rem] justify-between px-[0.18rem]">
      <div @click="jump('account', true)" class="text-center flex flex-col items-center justify-center relative">
        <div class="w-[0.8rem] h-[0.8rem] rounded-[0.32rem] bg-primary opacity-10 mb-[0.2rem]"></div>
        <div class="absolute w-[0.48rem] h-[0.48rem] opacity-100 top-0 mt-[0.16rem]">
          <img class="" :src="getStaticImgUrl('/static/img/user/payment.svg')" />
        </div>
        <div class="absolute min-w-[1.4rem] text-color text-[0.28rem] text-center top-[0.96rem]">{{
          $t("user_page.receive_payment") }}</div>
      </div>
      <div @click="jump('kyc', true)" class="text-center flex flex-col items-center justify-center relative">
        <div class="w-[0.8rem] h-[0.8rem] rounded-[0.32rem] bg-primary opacity-10 mb-[0.2rem]"></div>
        <div class="absolute w-[0.55rem] h-[0.6rem] opacity-100 top-0 mt-[0.1rem]">
          <img class="" :src="getStaticImgUrl('/static/img/user/id_card.svg')" />
        </div>
        <div v-if="token"
          class="absolute px-[0.05rem] top-0 ml-[1rem] mt-[0.03rem] pt-[0.03rem] text-white text-[0.22rem] h-[0.32rem] rounded-[0.12rem] flex items-center justify-center"
          :class="[
            userInfo.kycl2 == 0
              ? 'bg-status0'
              : `${userInfo.kycl2 == 1 ? 'bg-status1' : 'bg-status2'}`,
          ]">
          <span style="width: max-content;" v-if="userInfo.kycl2 == 0">{{ $t("user_page.not_verified") }}</span>
          <span style="width: max-content;" v-else-if="userInfo.kycl2 == 1">{{ $t("user_page.pending_verified")
            }}</span>
          <span style="width: max-content;" v-else>{{ $t("user_page.already_verified") }}</span>
        </div>
        <div class="absolute min-w-[1.4rem] text-color text-[0.28rem] text-center top-[0.96rem]">{{
          $t("user_page.verify_identity") }}</div>
      </div>
      <div @click="jump('googleCode', true)" class="text-center flex flex-col items-center justify-center relative">
        <div class="w-[0.8rem] h-[0.8rem] rounded-[0.32rem] bg-primary opacity-10 mb-[0.2rem]"></div>
        <div class="absolute w-[0.48rem] h-[0.48rem] opacity-100 top-0 mt-[0.16rem]">
          <img class="" :src="getStaticImgUrl('/static/img/user/google.svg')" />
        </div>
        <div v-if="token"
          class="absolute min-w-[0.76rem] px-[0.05rem] top-0 ml-[1rem] mt-[0.03rem] pt-[0.03rem] text-white text-[0.22rem] h-[0.32rem] rounded-[0.12rem] flex items-center justify-center"
          :class="[userInfo.googlebind == 0 ? 'bg-status0' : 'bg-status2']">
          <span v-if="userInfo.googlebind == 0">{{ $t("user_page.not_set") }}</span>
          <span v-else>{{ $t("user_page.already_set") }}</span>
        </div>
        <div class="absolute min-w-[1.4rem] text-color text-[0.28rem] text-center top-[0.96rem]">{{
          $t("user_page.google_verification") }}</div>
      </div>
      <div @click="jump('inviteFriends', true)" class="text-center flex flex-col items-center justify-center relative">
        <div class="w-[0.8rem] h-[0.8rem] rounded-[0.32rem] bg-primary opacity-10 mb-[0.2rem]"></div>
        <div class="absolute w-[0.48rem] h-[0.48rem] opacity-100 top-0 mt-[0.16rem]">
          <img class="" :src="getStaticImgUrl('/static/img/user/friend.svg')" />
        </div>
        <div class="absolute min-w-[1.4rem] text-color text-[0.28rem] text-center top-[0.96rem]">{{
          $t("user_page.recommend_friend") }}</div>
      </div>
    </div>

    <div class="navs">
      <div class="nav" @click="jump('language')">
        <div class="language-icon mr-[0.16rem]">
          <img :src="getStaticImgUrl('/static/icons/lang_icon.svg')" alt="">
        </div>
        <div class="content">
          <div class="title">{{ $t("user_page.set_language") }}</div>
        </div>
        <div class="lang">
          <div style="width: 0.57rem; height: 0.57rem; padding: 0.01rem;" class="mr-[0.1rem]">
            <div style="width: 0.52rem;height: 0.52rem;">
              <img :src="getStaticImgUrl(`/static/icons/${Object.keys(language).length ? language.icon : defaultLang.icon}.svg`)" alt="">
            </div>
          </div>
          <span class="font-1">{{ Object.keys(language).length ? language.name : defaultLang.name }}</span>
        </div>
        <Icon class="nav_more" size="0.32rem" name="arrow" />
      </div>
      <div class="nav" @click="jump('safety', true)">
        <div class="verify-icon mr-[0.16rem]">
          <img :src="getStaticImgUrl('/static/icons/verify.svg')" alt="">
        </div>
        <div class="content">
          <div class="title">{{ $t("user_page.security") }}</div>
        </div>
        <div v-if="token" class="gg">
          <span v-if="!userInfo.googlebind" style="color: #ff3b30">{{ $t("user_page.not_set_google_yet") }}</span>
          <span v-if="userInfo.googlebind" style="color: #18b762">{{ $t("user_page.already_set_google") }}</span>
        </div>
        <Icon class="nav_more" size="0.32rem" name="arrow" />
      </div>
      <div class="nav" @click="jump('about')">
        <div class="info-icon mr-[0.16rem]">
          <img :src="getStaticImgUrl('/static/icons/warning.svg')" alt="">
        </div>
        <div class="content">
          <div class="title">{{ $t("user_page.about") }}</div>
        </div>
        <Icon class="nav_more" size="0.32rem" name="arrow" />
      </div>
    </div>

    <!-- 退出登录 -->
    <div v-if="token" class="loginout" @click="loginout">{{ $t("user_page.logout") }}</div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { computed, watch, ref } from "vue";
import { Icon, showConfirmDialog } from "vant";
import router from "@/router";
import store from "@/store";
import storeChat from "@/store/chat";
import { _logout } from "@/api/api";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { useI18n } from "vue-i18n";
import { _langMap } from "@/utils/dataMap";

const { t, locale } = useI18n();

const messageNum = computed(() => storeChat.state.messageNum);
const token = computed(() => store.state.token);
const userInfo = computed(() => store.state.userInfo || {});
const language = computed(() => store.state.language || {});
const slides = [getStaticImgUrl("/static/img/user/userid.webp"), getStaticImgUrl("/static/img/user/userid.webp")];
const currentSlide = ref(0);
// const getFirstCharacter = (username) => {
//   return username ? username.charAt(0) : "-";
// };

const defaultLang = _langMap.reduce((acc, cur) => {
  if (cur.val == locale.value) acc = cur
  return acc
}, {})

const loginout = () => {
  if (token.value) {
    showConfirmDialog({
      title: t("user_page.logout"),
      message: t("user_page.message_box_con"),
      cancelButtonText: t('user_page.message_box_cancel'),
      confirmButtonText: t('user_page.message_box_confirm'),

      confirmButtonColor: "var(--ex-primary-color)",
      cancelButtonColor: "#323233",
    })
      .then(() => {
        _logout();
        setTimeout(() => {
          store.dispatch("reset");
          store.commit("setIsLoginOpen", true);
          // router.push({
          //     name: 'login'
          // })
        }, 200);
      })
      .catch(() => { });
  }
};

const jump = (name, needLogin, query) => {
  if (needLogin && !token.value) {
    store.commit("setIsLoginOpen", true);
    return;
  }
  if (name == "googleCode") {
    if (token.value && !userInfo.value.googlebind) {
      router.push({
        name: "google",
        query,
      });
    } else if (token.value && userInfo.value.googlebind) {
      router.push({
        name: "googleCode",
        query,
      });
    }
  } else {
    router.push({
      name,
      query,
    });
  }
};

// 预加载页面
store.commit("setPageLoading", true);
const loadingList = [import("@/views/Public/Language.vue")];
if (!token.value) {
  loadingList.push(import("@/views/Public/Login.vue"));
}
Promise.all(loadingList).finally(() => {
  store.commit("setPageLoading", false);
});

// 延迟加载
if (token.value) {
  setTimeout(() => {
    store.commit("setPageLoading", false);
    Promise.all([
      import("@/views/User/Safety.vue"),
      import("@/views/User/Account/Account.vue"),
      import("@/views/User/Kyc/Index.vue"),
    ]);
  }, 1000);
}
</script>

<style lang="less" scoped>
.page_user {
  padding: 0 0.32rem 2rem 0.32rem;
  position: relative;
  height: 100%;
  overflow-y: auto;

  .title {
    height: 1.12rem;
    color: var(--el-text-color);
    font-size: 0.5rem;
    font-weight: 600;
    line-height: 1.12rem;
  }

  .loginout {
    width: 100%;
    height: 1.04rem;
    border-radius: 0.32rem;
    background-color: var(--ex-bg-color2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ex-text-color2);
  }

  .navs {
    margin-bottom: 0.8rem;

    .nav {
      display: flex;
      align-items: center;
      height: 1.04rem;
      color: var(--ex-text-color);
      font-size: 0.3rem;
      overflow: hidden;
      background-color: var(--ex-bg-color2);
      border-radius: 0.32rem;
      padding-inline: 0.32rem;
      margin-bottom: 0.2rem;

      .icon {
        margin-right: 0.16rem;
        width: 0.64rem;
        height: 0.64rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        >img {
          width: 0.48rem !important;
          height: 0.48rem !important;
        }
      }

      .content {
        flex: 1;
        font-weight: 400;
        overflow: hidden;

        .title {
          color: var(--ex-text-color);
          font-size: 0.3rem;
          font-weight: 400;
        }

        .info {
          font-size: 0.24rem;
          color: #c2c2c2;
          margin-top: 0.2rem;
        }
      }

      .nav_more {
        margin-left: 0.12rem;
        color: var(--ex-text-color2);
        font-size: 0.32rem;
      }

      .cards {
        width: 1.36rem;
        height: 0.52rem;
      }

      .gg {
        font-weight: 500;
        font-size: 0.3rem;
      }

      .lang {
        display: flex;
        align-items: center;
        font-weight: 500;
        color: var(--ex-text-color);

        // .lang_icon {
        //   width: 0.52rem;
        //   height: 0.52rem;
        //   margin-right: 0.16rem;
        // }
        .font-1 {
          font-size: 0.3rem;
        }
      }
    }
  }
}

.default-avatar {
  width: 0.98rem;
  height: 0.98rem;
  background-size: contain;
  background-repeat: no-repeat;
}

.setting-icon {
  width: 0.48rem;
  height: 0.48rem;
  background-size: contain;
  background-repeat: no-repeat;
}



.language-icon {
  width: 0.48rem;
  height: 0.48rem;
  background-size: contain;
  background-repeat: no-repeat;
}

.verify-icon {
  width: 0.48rem;
  height: 0.48rem;
  background-size: contain;
  background-repeat: no-repeat;
}

.info-icon {
  width: 0.48rem;
  height: 0.48rem;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
