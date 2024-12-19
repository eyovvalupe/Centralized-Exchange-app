<!-- 注册成功 -->
<template>
  <div class="page page_register_success">
    <!-- 返回和语言 -->
    <!-- <div class="top_icon_container">
        <div class="top_back_container text-[0.48rem]" @click="goBack">
          <Icon name="arrow-left" />
        </div>
  
      </div> -->
    <Top :title="t('register.guest_account')"> </Top>
    <div class="icon">
      <img :src="getStaticImgUrl('/static/img/user/success.svg')" alt="√" />
    </div>
    <div class="title">{{ $t("register.success_sign_up") }}</div>
    <div class="text-[0.24rem] leading-[0.34rem] text-[#8f92a1] relative top-[-1rem]">
      {{ t('register.already_get_virtual') }}
    </div>
    <div class="text-[0.36rem] leading-[0.54rem] text-[#014cfa] relative top-[-0.9rem]">
      {{ userInfo.amount ? userInfo.amount : 0 }}&nbsp;<span
        class="text-[0.24rem] text-[#061023] leading-[0.34rem]">USDT</span>
    </div>

    <!-- <Button
        round
        color="#014CFA"
        class="submit"
        type="primary"
        @click="next"
        :style="'height: 1.12rem; font-size: 0.3rem; margin-bottom: 0.6rem'"
        >{{ $t("register.success_btn") }}</Button
      >
      <div @click="back">
        <span style="color: #014cfa; font-size: 0.32rem; line-height: 0.448rem"
          >{{ $t('register.success_finish') }}</span
        >
      </div> -->
    <div class="w-full flex justify-between relative top-[-0.4rem]">
      <div
        class="w-[3.23rem] h-[1.12rem] border-[0.02rem] border-[#014cfa] rounded-[1.6rem] flex justify-center items-center text-[0.36rem] text-[#014cfa]"
        @click="() => router.replace({ name: 'transfer' })">
        {{ t('trade.stock_opening_btn_transfer') }}
      </div>
      <div
        class="w-[3.23rem] h-[1.12rem] bg-[#014cfa] rounded-[1.6rem] flex justify-center items-center text-[0.36rem] text-[#fff]"
        @click="() => router.back()">
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

const userInfo = computed(() => store.state.userInfo || {});
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
    background-color: #fff;

    .top_back_container {
      .arrow_icon {
        width: 20px;
        height: 20px;
        clip-path: path("M13.4 2L5 10.4L13.4 18.8");
        background-color: #061023;
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
      border-color: #edf2f7;
      margin-right: 0.12rem;

      .chat_icon {
        width: 0.432rem;
        height: 0.432rem;
      }
    }

  }

  .icon {
    width: 5.4rem;
    height: 5.4rem;
    margin-top: 1.56rem;
  }

  .title {
    position: relative;
    top: -1.2rem;
    color: #333333;
    font-weight: 400;
    font-size: 0.3rem;
    line-height: 0.42rem;
  }

  .submit {
    width: 100%;
    margin-bottom: 0.6rem;
  }

}
</style>
