<!-- 认证成功 -->
<template>
  <div class="page page-kyc-Submit">
    <Top :title="t('kyc.page_title')">
      <template #right>
        <div class="w-[0.6rem] h-[0.6rem]" @click="jump('chat')">
          <img v-lazy="getStaticImgUrl('/static/img/user/server.svg')" alt="server" />
        </div>
      </template>
    </Top>
    <!-- 表单模式头部 -->
    <div class="steps">
      <div class="bg-[var(--ex-none)] w-[0.68rem] h-[0.68rem] rounded-[50%] flex items-center justify-center">
        <div class="bg-primary w-[0.56rem] h-[0.56rem] rounded-[50%] flex items-center justify-center">
          <div class="w-[0.48rem] h-[0.48rem]">
            <img v-lazy="getStaticImgUrl('/static/img/user/right_black.svg')" alt="">
          </div>
        </div>
      </div>
      <div class="w-[3.04rem] h-[0.16rem] bg-color2"></div>
      <div class="bg-[var(--ex-none)] w-[0.68rem] h-[0.68rem] rounded-[50%] flex items-center justify-center">
        <div class="bg-primary w-[0.56rem] h-[0.56rem] rounded-[50%] flex items-center justify-center">
          <div class="w-[0.48rem] h-[0.48rem]">
            <img v-lazy="getStaticImgUrl('/static/img/user/right_black.svg')" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="icon">
      <img v-lazy="getStaticImgUrl('/static/img/user/success.svg')" alt="√" />
    </div>
    <div class="title">{{ $t("kyc.final_title") }}</div>
    <div class="text-[0.24rem] text-color3 text-center mt-[0.26rem] mb-[0.8rem]">
      {{ $t("kyc.final_description") }}
    </div>
    <Button round color="var(--ex-primary-color)" @click="
      router.replace({
        name: 'kyc',
      })
      " class="w-[3.6rem] text-[0.3rem] w-[3.6rem] ripple-btn" type="primary"
      :style="'height: 0.9rem; font-size: 0.3rem; margin-bottom: 0.6rem'"><span style="color: var(--ex-white);">{{
        $t("kyc.final_ok") }}</span></Button>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import { ref } from "vue";
import router from "@/router";
import { Button } from "vant";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();
const jump = (name, query) => {
  router.push({
    name,
    query,
  });
};
const kycInfo = ref({});
try {
  kycInfo.value = JSON.parse(localStorage.getItem("kycInfo"));
} catch { }

const route = useRoute();
const from = ref(route.query.from); // 'register'-表示从注册来
console.error('???-->', route)
</script>

<style lang="less" scoped>
.page-kyc-Submit {
  padding: 0.32rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .steps {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.2rem;
  }
  .icon {
    width: 2rem;
    height: 2rem;
    margin-top: 1rem;
  }

  .title {
    position: relative;
    color: var(--ex-text-color);
    font-weight: 400;
    font-size: 0.3rem;
    line-height: 0.42rem;
  }
}
</style>
