<!-- 注册成功 -->
<template>
  <div class="page page_register_success">
    <Top :title="t('register.guest_account')"> </Top>
    <div class="icon">
      <img v-lazy="getStaticImgUrl('/static/img/user/success.svg')" alt="√" />
    </div>
    <div class="title">{{ $t("register.success_sign_up") }}</div>
    <div class="text-[0.24rem] leading-[0.34rem] text-color3">
      {{ t('register.already_get_virtual') }}
    </div>
    <div class="text-[0.36rem] leading-[0.54rem] text-primary mb-[0.6rem]">
      {{ userInfo.amount ? userInfo.amount : 0 }}&nbsp;<span
        class="text-[0.24rem] text-color leading-[0.34rem]">USDT</span>
    </div>

    <div class="w-full flex justify-between">
      <div
        class="w-[3.23rem] h-[1.12rem] border-[0.02rem] border-primary rounded-[1.6rem] flex justify-center items-center text-[0.36rem] text-primary ripple-primary"
        @click="() => router.replace({ name: 'transfer' })">
        {{ t('trade.stock_opening_btn_transfer') }}
      </div>
      <div
        class="w-[3.23rem] h-[1.12rem] bg-primary rounded-[1.6rem] flex justify-center items-center text-[0.36rem] text-white ripple-btn"
        @click="() => router.replace({name: 'tradeInfo'})">
        {{ t('trade.stock_opening_btn_trade') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Button, Icon } from "vant";
import router from "@/router";
import { useRoute } from "vue-router";
import Top from "@/components/Top.vue";
import { useI18n } from "vue-i18n";
import store from "@/store";
import { computed } from "vue";

const { t } = useI18n();

const route = useRoute();

const userInfo = computed(() => store.state.guestUserInfo || {});
const next = () => {
  router.replace({
    name: "google",
    query: {
      from: "register",
    },
  });
};
const back = () => {
  router.replace({
    name: "user",
  });
};
const goBack = () => {
  if (route.query.reurl) {
    router.replace({
      name: route.query.reurl,
      query: {
        redata: route.query.redata,
      },
    });
  } else {
    router.back();
  }
};

//跳转到语言设置页
const goLang = () => {
  //   emits("closeDialog");
  router.push({ name: "language" });
};

const goChat = () => {
  router.push({ name: "chat" });
};
</script>

<style lang="less" scoped>
.page_register_success {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 0 0.32rem;

  .top_icon_container {
    position: fixed;
    width: 7.5rem;
    justify-content: space-between;
    padding: 0 0.32rem;
    height: 1.12rem;
    display: flex;
    align-items: center;
    top: 0;
    background-color: var(--ex-bg-color);

    .top_back_container {
      .arrow_icon {
        width: 0.4rem;
        height: 0.4rem;
        clip-path: path("M13.4 2L5 10.4L13.4 18.8");
        background-color: var(--ex-text-color);
      }
    }

    .server_icon {
      width: 0.72rem;
      height: 0.72rem;
      border-width: 0.02rem;
      border-radius: 0.36rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-color: var(--ex-border-color);
      margin-right: 0.12rem;

      .chat_icon {
        width: 0.432rem;
        height: 0.432rem;
      }
    }

  }

  .icon {
    width: 2.22rem;
    height: 1.78rem;
    margin-top: 2.64rem;
    margin-bottom: 0.36rem;
  }

  .title {
    color: var(--ex-text-color);
    font-weight: 400;
    font-size: 0.3rem;
    line-height: 0.42rem;
    margin-bottom: 0.2rem;
  }

  .submit {
    width: 100%;
    margin-bottom: 0.6rem;
  }

}
</style>
