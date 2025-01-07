<!-- 操作成功 -->
<template>
  <div class="page page_success">
    <div class="icon">
      <img :src="getStaticImgUrl('/static/img/user/success.svg')" alt="√" />
    </div>
    <div class="title">{{ $t("safety.success_title") }}</div>

    <Button @click="router.back()" round color="var(--ex-primary-color)" class="submit" type="primary">
      <span style="color: var(--ex-white);">{{ $t("safety.success_btn")
        }}</span></Button>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Button } from "vant";
import router from "@/router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style lang="less" scoped>
.page_success {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 0 0.32rem;

  .icon {
    width: 2.8rem;
    height: 2.8rem;
  }

  .title {
    margin: 1.12rem 0 1.68rem 0;
    color: var(--ex-text-color);
    font-size: 0.36rem;
    line-height: 0.56rem;
  }

  .submit {
    width: 100%;
    height: 1rem;
    font-size: 0.32rem;
  }
}
</style>
