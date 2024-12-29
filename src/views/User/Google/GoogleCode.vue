<!-- 注册成功 -->
<template>
  <div class="page page_register_success">
    <!-- 返回和语言 -->
    <Top :title="t('google_auth.page_title')">
      <template #right>
        <div @click="jump('chat')"
          class="w-[0.72rem] h-[0.72rem] rounded-[50%] border-color border-[0.02rem] flex items-center justify-center">
          <div class="w-[0.4rem] h-[0.4rem]">
            <img :src="getStaticImgUrl('/static/img/user/server.svg')" alt="server" />
          </div>
        </div>
      </template>
    </Top>
    <div class="icon">
      <img :src="getStaticImgUrl('/static/img/user/success.svg')" alt="√" />
    </div>
    <div class="title">{{ $t("google_auth.google_result_title") }}</div>
    <div class="description">{{ $t("google_auth.google_result_con") }}</div>

    <Button round color="#014CFA" class="submit" type="primary" @click="goBack"
      :style="'height: 1.12rem; font-size: 0.3rem; margin-bottom: 0.6rem'">{{ $t("google_auth.google_result_btn")
      }}</Button>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Button, Icon } from "vant";
import router from "@/router";
import { useRoute } from "vue-router";
import Top from "@/components/Top.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
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

const jump = (name, query) => {
  router.push({
    name,
    query,
  });
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
    margin-top: 1.7rem;
  }

  .title {
    position: relative;
    top: -1.2rem;
    color: #061023;
    font-weight: 400;
    font-size: 0.3rem;
    line-height: 0.42rem;
  }

  .description {
    position: relative;
    top: -1rem;
    font-size: 0.24rem;
    line-height: 0.336rem;
    color: #8f92a1;
  }

  .submit {
    width: 4.5rem;
  }

}
</style>
