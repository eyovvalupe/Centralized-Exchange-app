<!-- 注册成功 -->
<template>
  <div class="page page_register_success">
    <!-- 返回和语言 -->
    <Top>
      <template #right>
        <div class="flex gap-1">
          <div class="language_icon_container" @click="goLang">
            <div class="language_icon">
              <img :src="getStaticImgUrl('/static/img/user/lang.svg')" alt="">
            </div>
          </div>
        </div>
      </template>
    </Top>

    <div class="icon">
      <img :src="getStaticImgUrl('/static/img/user/success.svg')" alt="√" />
    </div>
    <div class="title">{{ t('forget_pw.success') }}</div>

    <Button round color="var(--ex-primary-color)" class="submit" type="primary" @click="next">
      <span class="text-black text-[0.32rem] !font-normal">{{ t('forget_pw.back') }}</span></Button>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Button, Icon } from "vant";
import router from "@/router";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import Top from "@/components/Top.vue";

const { t } = useI18n()
const route = useRoute();

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
  //   emits("closeDialog");
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

    .language_icon_container {
      width: 0.72rem;
      height: 0.72rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-width: 0.02rem;
      border-color: var(--ex-border-color);
      border-radius: 0.36rem;

      .language_icon {
        width: 0.432rem;
        height: 0.432rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }

  .icon {
    width: 2.22rem;
    height: 1.756rem;
    margin-top: 1.7rem;
    margin-bottom: 0.32rem;
  }

  .title {
    color: var(--ex-text-color);
    font-weight: 400;
    font-size: 0.3rem;
    line-height: 0.42rem;
    margin-bottom: 0.68rem;
  }

  .submit {
    width: 3.6rem;
    height: 0.9rem;
  }

}
</style>
