<!-- 安全 -->
<template>
  <div class="page page-safety">
    <Top :title="t('safety.page_title')" />

    <div class="navs">
      <div class="nav mask-btn" @click="checkGG('password')">
        <div class="nav_icon">
          <div class="change_login_pw">
            <img v-lazy="getStaticImgUrl('/static/img/user/password.svg')" alt="">
          </div>
        </div>
        <div class="nav_title">{{ $t("safety.change_login_pw") }}</div>
        <Icon name="arrow" />
      </div>
      <div class="nav mask-btn" @click="checkGG('fund')">
        <div class="nav_icon">
          <div class="change_trade_pw">
            <img v-lazy="getStaticImgUrl('/static/img/user/password_trade.svg')" alt="">
          </div>
        </div>
        <div class="nav_title">{{ $t("safety.change_trade_pw") }}</div>
        <Icon name="arrow" />
      </div>
      <div class="nav mask-btn" @click="goGG">
        <div class="nav_icon">
          <div class="google_verify">
            <img v-lazy="getStaticImgUrl('/static/img/user/google_sm.svg')" alt="">
          </div>
        </div>
        <div class="nav_title">{{ $t("safety.bind_google_auth") }}</div>
        <div class="nav_tip">
          <span class="text-error" style=" font-size: 0.3rem" v-if="!userInfo.googlebind">{{
            $t("safety.google_status_not")
            }}</span>
          <span class="text-success" style=" font-size: 0.3rem" v-if="userInfo.googlebind">{{
            $t("safety.google_status_ok")
            }}</span>
        </div>
        <Icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import { Icon, showConfirmDialog } from "vant";
import store from "@/store";
import { computed } from "vue";
import router from "@/router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userInfo = computed(() => store.state.userInfo || {});

const jump = (name) => {
  router.push({
    name,
  });
};

const goGG = () => {
  if (userInfo.value.googlebind) {
    // 已绑定
    jump("googleCode");
  } else {
    jump("google");
  }
};

const checkGG = async (name) => {
  // if (!userInfo.value.googlebind) {
  //   return showConfirmDialog({
  //     title: t('safety.bind_google_auth'),
  //     message: t('safety.no_google_dialog_con'),
  //     theme: 'round-button'
  //   }).then(() => {
  //     jump("google");
  //   });
  // }
  jump(name);
};

// 预加载页面
store.commit("setPageLoading", true);
const loadingList = [
  import("@/views/User/LoginPassword.vue"),
  import("@/views/User/Google/Google.vue"),
];
Promise.all(loadingList).finally(() => {
  store.commit("setPageLoading", false);
});
</script>

<style lang="less" scoped>
.page-safety {
  padding-top: 1.2rem;

  .navs {
    padding: 0.32rem 0.48rem 0 0.32rem;

    .nav {
      display: flex;
      padding: 0 0.32rem;
      align-items: center;
      height: 1.04rem;
      border-radius: 0.32rem;
      background-color: var(--ex-bg-color6);
      color: var(--ex-text-color);
      font-size: 0.3rem;
      overflow: hidden;
      margin-bottom: 0.2rem;

      .nav_icon {
        width: 0.48rem;
        height: 0.48rem;

        .change_login_pw {
          width: 0.48rem;
          height: 0.48rem;
          background-size: cover;
          background-repeat: none;
        }

        .change_trade_pw {
          width: 0.48rem;
          height: 0.48rem;
          background-size: cover;
          background-repeat: none;
        }

        .google_verify {
          width: 0.48rem;
          height: 0.48rem;
          background-size: cover;
          background-repeat: none;
        }
      }

      .nav_title {
        margin: 0 0.3rem;
        color: var(--ex-text-color);
        font-weight: 400;
        flex: 1;
      }

      .nav_tip {
        margin-right: 0.28rem;
        font-size: 0.24rem;
        font-weight: 500;
      }
    }
  }
}
</style>
