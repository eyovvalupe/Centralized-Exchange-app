<!-- 个人中心 -->
<template>
  <div class="page page_user relative">
    <!-- 标题 -->
    <!-- <div class="title">用户</div> -->
    <div class="flex flex-col mt-[0.2rem] mb-[0.32rem] px-[0.32rem]">
      <div class="w-full flex justify-end gap-[0.16rem]">
        <div class="w-[0.6rem] h-[0.6rem]" @click="jump('chat')">
          <img :src="getStaticImgUrl('/static/img/user/server.svg')" alt="server" />
        </div>
        <div class="w-[0.6rem] h-[0.6rem]">
          <img :src="getStaticImgUrl('/static/img/user/setting.svg')" alt="server" />
        </div>
        <div class="w-[0.6rem] h-[0.6rem]" @click="jump('notification')">
          <img :src="getStaticImgUrl('/static/img/common/notice.svg')" alt="server" />
        </div>
      </div>
      <div v-if="token" class="flex items-center -ml-[0.08rem] gap-[0.16rem]">
        <div class="default-avatar">
          <img :src="getStaticImgUrl('/static/img/user/avatar2.svg')" alt="">
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
          <img :src="getStaticImgUrl('/static/img/user/avatar1.svg')" alt="">
        </div>
        <div class="text-[0.32rem]">{{ $t("user_page.login_out") }}</div>
      </div>
    </div>
    <div class="flex justify-between rounded-[0.32rem] w-full mb-[0.6rem] px-[1.16rem]">
      <div class="text-center flex justify-center relative">
        <div class="font-bold text-color text-[0.32rem] mb-[0.12rem]">
          0
        </div>
        <div class="text-[0.24rem] text-color3 absolute w-max text-center top-[0.4rem]">{{
          $t("user_page.recommended_user") }}</div>
      </div>
      <div class="text-center flex justify-center relative">
        <div class="font-bold text-color text-[0.32rem] mb-[0.12rem]">
          0
        </div>
        <div class="text-[0.24rem] text-color3 absolute w-max text-center top-[0.4rem]">{{ $t("user_page.social_user")
          }}</div>
      </div>
      <div class="text-center flex justify-center relative">
        <div class="font-bold text-color text-[0.32rem] mb-[0.12rem]">
          0
        </div>
        <div class="text-[0.24rem] text-color3 absolute w-max text-center top-[0.4rem]">{{
          $t("user_page.recommend_bonus") }}</div>
      </div>
    </div>
    <div class="h-[1.6rem] relative">
      <div class="absolute w-full top-[0.69rem]">
        <img :src="getStaticImgUrl('/static/img/user/user_page_bg.svg')" alt="">
      </div>
      <div class="w-[6rem] mx-auto rounded-tl-[0.36rem] rounded-tr-[0.36rem] overflow-hidden">
        <Carousel :autoplay="3000" :wrap-around="true" :mouseDrag="true" v-model="currentSlide" class="relative">
          <Slide v-for="(slide, index) in token ? slides2 : slides1" :key="index">
            <img :src="slide" class="w-full bg-color5 rounded-tr-[0.32rem] rounded-tl-[0.32rem]" alt="img" />
            <div v-if="token" class="absolute left-0 px-[0.32rem] w-full flex justify-between items-center">
              <div class="flex flex-col">
                <div class="text-primary text-[0.3rem] font-bold mb-[0.2rem]">
                  {{ $t("user_page.ad_head") }}
                </div>
                <div class="text-white text-[0.24rem]">{{ $t("user_page.ad_con1") }}，{{ $t("user_page.ad_con2") }}</div>
              </div>
              <div
                class="text-primary text-[0.28rem] w-max h-[0.6rem] flex items-center justify-center bg-color rounded-[1rem] px-[0.2rem]">
                {{ t('user_page.get_demo_coin') }}
              </div>
            </div>
            <div v-else class="absolute left-0 px-[0.32rem] w-full flex justify-between items-center">
              <div class="flex flex-col">
                <div class="text-white text-[0.28rem] font-bold mb-[0.2rem]">
                  {{ $t("user_page.ad_head1") }}
                </div>
                <div class="text-primary text-[0.32rem] font-semibold">{{ $t("user_page.ad_con3") }}</div>
              </div>
            </div>
          </Slide>
        </Carousel>
      </div>
      <div class="flex gap-[0.05rem] justify-center relative -mt-[0.2rem]">
        <div class="w-[0.2rem] h-[0.06rem] rounded-[1rem] bg-white" :class="[currentSlide == 0 ? '' : 'opacity-50']">
        </div>
        <div class="w-[0.2rem] h-[0.06rem] rounded-[1rem] bg-white" :class="[currentSlide == 1 ? '' : 'opacity-50']">
        </div>
      </div>
    </div>
    <div class="flex items-center w-full mb-[0.84rem] mt-[0.4rem] justify-between px-[0.6rem]">
      <div @click="jump('account', true)" class="text-center flex flex-col items-center justify-center relative">
        <div class="w-[0.8rem] h-[0.8rem] rounded-[0.32rem] bg-white mb-[0.2rem]"></div>
        <div class="absolute w-[0.48rem] h-[0.48rem] opacity-100 top-0 mt-[0.16rem]">
          <img class="" :src="getStaticImgUrl('/static/img/user/payment.svg')" />
        </div>
        <div class="absolute min-w-[1.4rem] text-color text-[0.28rem] text-center top-[0.96rem]">{{
          $t("user_page.receive_payment") }}</div>
      </div>
      <div @click="jump('kyc', true)" class="text-center flex flex-col items-center justify-center relative">
        <div class="w-[0.8rem] h-[0.8rem] rounded-[0.32rem] bg-white mb-[0.2rem]"></div>
        <div class="absolute w-[0.55rem] h-[0.6rem] opacity-100 top-0 mt-[0.1rem]">
          <img class="" :src="getStaticImgUrl('/static/img/user/id_card.svg')" />
        </div>
        <div v-if="token"
          class="absolute px-[0.05rem] top-0 ml-[1rem] mt-[0.03rem] pt-[0.03rem] text-black text-[0.22rem] h-[0.32rem] rounded-[0.12rem] flex items-center justify-center"
          :class="[
            userInfo.kycl2 == 0
              ? 'bg-error'
              : `${userInfo.kycl2 == 1 ? 'bg-wait' : 'bg-success'}`,
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
        <div class="w-[0.8rem] h-[0.8rem] rounded-[0.32rem] bg-white mb-[0.2rem]"></div>
        <div class="absolute w-[0.48rem] h-[0.48rem] opacity-100 top-0 mt-[0.16rem]">
          <img class="" :src="getStaticImgUrl('/static/img/user/google.svg')" />
        </div>
        <div v-if="token"
          class="absolute min-w-[0.76rem] px-[0.05rem] top-0 ml-[1rem] mt-[0.03rem] pt-[0.03rem] text-black text-[0.22rem] h-[0.32rem] rounded-[0.12rem] flex items-center justify-center"
          :class="[userInfo.googlebind == 0 ? 'bg-error' : 'bg-success']">
          <span v-if="userInfo.googlebind == 0">{{ $t("user_page.not_set") }}</span>
          <span v-else>{{ $t("user_page.already_set") }}</span>
        </div>
        <div class="absolute min-w-[1.4rem] text-color text-[0.28rem] text-center top-[0.96rem]">{{
          $t("user_page.google_verification") }}</div>
      </div>
      <div @click="jump('inviteFriends', true)" class="text-center flex flex-col items-center justify-center relative">
        <div class="w-[0.8rem] h-[0.8rem] rounded-[0.32rem] bg-white mb-[0.2rem]"></div>
        <div class="absolute w-[0.48rem] h-[0.48rem] opacity-100 top-0 mt-[0.16rem]">
          <img class="" :src="getStaticImgUrl('/static/img/user/friend.svg')" />
        </div>
        <div class="absolute min-w-[1.4rem] text-color text-[0.28rem] text-center top-[0.96rem]">{{
          $t("user_page.recommend_friend") }}</div>
      </div>
    </div>

    <div class="navs px-[0.32rem] relative">
      <div class="nav" @click="jump('language')">
        <div class="language-icon mr-[0.16rem]">
          <img :src="getStaticImgUrl('/static/img/user/lang_icon.svg')" alt="">
        </div>
        <div class="content">
          <div class="title">{{ $t("user_page.set_language") }}</div>
        </div>
        <div class="lang">
          <div style="width: 0.57rem; height: 0.57rem; padding: 0.01rem;" class="mr-[0.1rem]">
            <div style="width: 0.52rem;height: 0.52rem;">
              <img
                :src="getStaticImgUrl(`/static/img/user/${Object.keys(language).length ? language.icon : defaultLang.icon}.svg`)"
                alt="">
            </div>
          </div>
          <span class="font-1">{{ Object.keys(language).length ? language.name : defaultLang.name }}</span>
        </div>
        <Icon class="nav_more" size="0.32rem" name="arrow" />
      </div>
      <div class="nav" @click="jump('safety', true)">
        <div class="verify-icon mr-[0.16rem]">
          <img :src="getStaticImgUrl('/static/img/user/verify.svg')" alt="">
        </div>
        <div class="content">
          <div class="title">{{ $t("user_page.security") }}</div>
        </div>
        <div v-if="token" class="gg">
          <span v-if="!userInfo.googlebind" class="text-error">{{ $t("user_page.not_set_google_yet") }}</span>
          <span v-if="userInfo.googlebind" class="text-success">{{ $t("user_page.already_set_google") }}</span>
        </div>
        <Icon class="nav_more" size="0.32rem" name="arrow" />
      </div>
      <div class="nav" @click="jump('about')">
        <div class="info-icon mr-[0.16rem]">
          <img :src="getStaticImgUrl('/static/img/user/about.svg')" alt="">
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
const slides1 = [getStaticImgUrl("/static/img/user/user_carousel.svg"), getStaticImgUrl("/static/img/user/user_carousel.svg")];
const slides2 = [getStaticImgUrl("/static/img/user/user_carousel1.svg"), getStaticImgUrl("/static/img/user/user_carousel1.svg")];
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
      cancelButtonColor: "var(--ex-text-color2)",
      theme: 'round-button'
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
  // padding: 0 0.32rem 2rem 0.32rem;
  position: relative;
  height: 100%;
  overflow-y: auto;

  .title {
    height: 1.12rem;
    color: var(--ex-text-color);
    font-size: 0.5rem;
    font-weight: 600;
    line-height: 1.12rem;
  }

  .loginout {
    height: 1.04rem;
    border-radius: 0.32rem;
    background-color: var(--ex-bg-color2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ex-text-color2);
    margin: 0 0.32rem;
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
          color: var(--ex-text-color4);
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
