<!-- 注册成功 -->
<template>
  <div class="page page_register_success">
    <!-- 返回和语言 -->
    <Top :title="t('google_auth.page_title')">
      <template #right>
        <div class="w-[0.6rem] h-[0.6rem]" @click="jump('chat')">
          <img :src="getStaticImgUrl('/static/img/user/server.svg')" alt="server" />
        </div>
      </template>
    </Top>
    <div class="icon">
      <img :src="getStaticImgUrl('/static/img/user/success.svg')" alt="√" />
    </div>
    <div class="title">{{ $t("google_auth.google_result_title") }}</div>
    <div class="description">{{ $t("google_auth.google_result_con") }}</div>

    <Button round color="var(--ex-primary-color)" class="submit ripple-btn" type="primary" @click="goBack"
      :style="'font-size: 0.32rem; margin-bottom: 0.6rem'"><span style="color: var(--ex-white);">{{
        $t("google_auth.google_result_btn")
      }}</span></Button>
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
    background-color: var(--ex-bg-color);

    .top_back_container {
      .arrow_icon {
        width: 20px;
        height: 20px;
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
    margin-bottom: 0.26rem;
  }

  .description {
    font-size: 0.24rem;
    line-height: 0.336rem;
    color: var(--ex-text-color3);
    margin-bottom: 0.9rem;
  }

  .submit {
    width: 3.6rem;
    height: 0.9rem;
    font-weight: 400 !important;
  }

}
</style>
