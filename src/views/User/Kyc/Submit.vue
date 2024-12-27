<!-- 认证成功 -->
<template>
  <div class="page page-kyc-Submit">
    <Top :title="t('kyc.page_title')">
      <template #right>
        <div @click="jump('chat')"
          class="w-[0.72rem] h-[0.72rem] rounded-[50%] border-color border-[0.02rem] flex items-center justify-center">
          <div class="w-[0.4rem] h-[0.4rem]">
            <img :src="getStaticImgUrl('/static/img/user/serverB.svg')" alt="server" />
          </div>
        </div>
      </template>
    </Top>
    <div class="icon">
      <img :src="getStaticImgUrl('/static/img/user/success.svg')" alt="√" />
    </div>
    <div class="title">{{ $t("kyc.final_title") }}</div>
    <div class="text-[0.24rem] text-color3 text-center -mt-[0.9rem] mb-[0.8rem]">
      {{ $t("kyc.final_description") }}
    </div>
    <Button round color="var(--ex-primary-color)" @click="
      router.replace({
        name: 'kyc',
      })
      " class="w-full text-[0.3rem]" type="primary"
      :style="'height: 1.12rem; font-size: 0.3rem; margin-bottom: 0.6rem'">{{ $t("kyc.final_ok") }}</Button>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import { ref } from "vue";
import router from "@/router";
import { Button } from "vant";
import { useI18n } from "vue-i18n";

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
</script>

<style lang="less" scoped>
.page-kyc-Submit {
  padding: 0.32rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon {
    width: 5.4rem;
    height: 5.4rem;
    margin-top: 1.7rem;
  }

  .title {
    position: relative;
    top: -1.2rem;
    color: var(--ex-text-color);
    font-weight: 400;
    font-size: 0.3rem;
    line-height: 0.42rem;
  }
}
</style>
